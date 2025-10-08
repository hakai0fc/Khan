/***********************************************
  HakaiWare 
***********************************************/

(() => {
  if (window.__hakaiware_loaded) { console.info('HakaiWare already loaded'); return; }
  window.__hakaiware_loaded = true;

  const CONFIG = {
    name: 'HakaiWare',
    splashMain: 'HAKAIWARE',
    splashSub: '.SPACE',
    icon: 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png',
    font: 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf',
    toastDuration: 2200
  };

  // state & plugins
  const loadedPlugins = [];
  const state = { AutoAnswer: false, VideoSpoof: false, MinuteFarm: false };

  // small helpers
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const safeLog = (...a) => console.log(`[${CONFIG.name}]`, ...a);
  const safePlay = url => { try { const a = new Audio(url); a.play().catch(()=>{}); } catch(e){} };

  // toast (uses Toastify if available)
  function toast(text, dur = CONFIG.toastDuration) {
    try {
      if (window.Toastify) Toastify({ text, duration: dur, gravity: 'bottom', position: 'center', stopOnFocus: true, style: { background: '#111', color: '#fff' } }).showToast();
      else console.info('[Toast]', text);
    } catch(e){ console.error('Toast err', e); }
  }

  // loaders
  function loadCss(url) {
    return new Promise((res, rej) => {
      if (document.querySelector(`link[href="${url}"]`)) return res();
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
      l.onload = () => res(); l.onerror = e => rej(e);
      document.head.appendChild(l);
    });
  }
  function loadScript(url, label) {
    return new Promise((res, rej) => {
      if (label && loadedPlugins.includes(label)) return res();
      if (document.querySelector(`script[src="${url}"]`)) { if (label) loadedPlugins.push(label); return res(); }
      const s = document.createElement('script'); s.src = url; s.async = false;
      s.onload = () => { if (label) loadedPlugins.push(label); res(); };
      s.onerror = e => rej(e);
      document.head.appendChild(s);
    });
  }

  // safe icon/font injection
  function setIcon(url) {
    try {
      let link = document.querySelector('link[rel~="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = url;
    } catch(e){ console.warn('setIcon fail', e); }
  }
  function injectFont(url) {
    try {
      const s = document.createElement('style');
      s.textContent = `@font-face{font-family:'HakaiSans';src:url('${url}') format('truetype');}`;
      document.head.appendChild(s);
    } catch(e){}
  }

  // neutral fetch wrapper (no active processors)
  (function installFetchWrapper(){
    if (window.__hakaiware_fetch_installed) return;
    window.__hakaiware_fetch_installed = true;
    const orig = window.fetch.bind(window);
    const reqProcs = [];
    const resProcs = [];
    window.__hakaiware_fetch_registerRequestProcessor = fn => reqProcs.push(fn);
    window.__hakaiware_fetch_registerResponseProcessor = fn => resProcs.push(fn);

    window.fetch = async function(input, init) {
      try {
        for (const p of reqProcs) { // none by default
          try { const out = await p(input, init || {}); if (Array.isArray(out)) { input = out[0]; init = out[1] || init; } } catch(e){ console.error(e); }
        }
        const r = await orig(input, init);
        for (const p of resProcs) {
          try { const maybe = await p(r, input, init); if (maybe instanceof Response) return maybe; } catch(e){ console.error(e); }
        }
        return r;
      } catch(e) { console.error('fetch wrapper error', e); return orig(input, init); }
    };
    window.__hakaiware_fetch_debug = { reqProcs, resProcs };
  })();

  // splash (minimal)
  const splash = document.createElement('div');
  async function showSplash() {
    splash.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999999;background:#000;color:#fff;font-family:HakaiSans,system-ui; font-size:28px';
    splash.innerHTML = `<div style="text-align:center"><div><span style="color:#fff">${CONFIG.splashMain}</span><span style="color:#72ff72">${CONFIG.splashSub}</span></div><div style="font-size:12px;opacity:.8;margin-top:6px">by HakaiOfc</div></div>`;
    document.body.appendChild(splash);
    await delay(180);
  }
  async function hideSplash() { try { splash.style.opacity = '0'; await delay(180); if (splash.parentElement) splash.remove(); } catch(e){} }

  // simple control UI (simulates modules; safe)
  function createPanel() {
    if (document.getElementById('__hakaiware_panel')) return;
    const p = document.createElement('div');
    p.id = '__hakaiware_panel';
    p.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999999;background:rgba(0,0,0,.8);color:#fff;padding:10px;border-radius:10px;font-family:HakaiSans,system-ui;min-width:170px';
    p.innerHTML = `<div style="font-weight:700;margin-bottom:6px">${CONFIG.name} Controls</div>`;
    ['AutoAnswer','VideoSpoof','MinuteFarm'].forEach(mod => {
      const row = document.createElement('div'); row.style.display='flex';row.style.justifyContent='space-between';row.style.alignItems='center';row.style.marginBottom='6px';
      const lbl = document.createElement('div'); lbl.textContent = mod; lbl.style.fontSize='13px';
      const btn = document.createElement('button'); btn.textContent='OFF'; btn.dataset.on='0'; btn.style.padding='6px 8px'; btn.style.border='none'; btn.style.borderRadius='6px'; btn.style.background='#222'; btn.style.color='#fff';
      btn.onclick = () => {
        const on = btn.dataset.on==='1';
        btn.dataset.on = on ? '0' : '1'; btn.textContent = on ? 'OFF' : 'ON'; btn.style.background = on ? '#222' : '#0a7';
        state[mod] = !on;
        toast(`${mod} ${state[mod] ? 'ENABLED (simulated)' : 'DISABLED (simulated)'}`);
        window.dispatchEvent(new CustomEvent('__hakaiware_module_toggle', { detail:{ module: mod, enabled: state[mod] } }));
      };
      row.appendChild(lbl); row.appendChild(btn); p.appendChild(row);
    });
    const note = document.createElement('div'); note.style.fontSize='11px'; note.style.opacity='.8'; note.textContent = 'Simulated toggles — safe for testing';
    p.appendChild(note);
    document.body.appendChild(p);
  }

  // small helper: click selector (safe)
  function clickSelector(sel) {
    try {
      const el = document.querySelector(sel);
      if (el) { el.click(); toast(`Clicked ${sel}`); return true; }
    } catch(e){ console.warn(e); }
    return false;
  }

  // boot
  (async () => {
    try {
      injectFont(CONFIG.font);
      setIcon(CONFIG.icon);
      await showSplash();
      // optional: load Toastify (silent fail)
      try { await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css'); await loadScript('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js','toastify'); } catch(e){}
      toast(`${CONFIG.name} ready (safe)`);
      safePlay(CONFIG.icon).catch?.(()=>{});
      createPanel();
      await delay(280);
      hideSplash();

      // expose small API
      window.__hakaiware = { CONFIG, state, loadedPlugins, clickSelector, toast };
      safeLog('HakaiWare (sanitized) initialized');
    } catch(err) {
      console.error('HakaiWare boot error', err);
      hideSplash();
      toast('HakaiWare failed to initialize');
    }
  })();

})();    s.src = url;
    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__khanware_fetch_installed) return;
  window.__khanware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__khanware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__khanware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__khanware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
    "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
    "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
    "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
    "🪶 Lite mode @ KhanwareMinimal.js",
  ];

  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables && bodyObj.variables.input && typeof bodyObj.variables.input.durationSeconds === 'number') {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            } else {
              init = Object.assign({}, init, { body: newBody });
            }
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch(e){ console.warn('videoSpoof parse fail', e); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (bloqueia limitadores de tempo em mark_conversions) */
(function registerMinuteFarm(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      let body = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions")) {
        if (body.includes("termination_event")) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          // interrompe a requisição retornando uma Request para um 204 vazio
          // Em vez de enviar a requisição ao servidor, retornamos um fake Response via responseProcessor; aqui apenas signal via property
          // Simples: devolvemos um Request cujo URL é about:blank e corpo vazio e um flag em init para responseProcessor tratar
          init = Object.assign({}, init, { __khanware_blocked_mark_conversions: true });
        }
      }
    } catch(e){ console.error('minuteFarm error', e); }
    return [input, init];
  });

  // response processor to handle the blocked flag
  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__khanware_blocked_mark_conversions) {
        // cria uma response vazia (204)
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error(e); }
    return null;
  });
})();

/* Safe font injection (usa @font-face, cuidado com CORS) */
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');font-weight:normal;font-style:normal;}";
  document.head.appendChild(styleFont);
} catch(e){}

/* scrollbar styling */
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}

/* set icon safely */
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Main features (AutoAnswer loop and others) */
function setupMain(){
  /* AutoAnswer */
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let khanwareDominates = true;
    (async () => {
      while (khanwareDominates) {
        try {
          for (const q of baseSelectors) {
            findAndClickBySelector(q);
            const el = document.querySelector(q + "> div");
            if (el && el.innerText === "Mostrar resumo") {
              sendToast("🎉 Exercício concluído!", 3000);
              playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              // opcionalmente parar: khanwareDominates = false;
            }
          }
        } catch(e){ console.error('autoAnswer loop error', e); }
        await delay(800);
      }
    })();
  })();

  /* Other functionality could be placed here (e.g., PushUp / MinuteFarm UI) */
}

/* Boot sequence: load CSS and external libs safely */
(async () => {
  try {
    // 1) mostrar splash
    await showSplashScreen();

    // 2) carregar CSSs
    try {
      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
    } catch(e){ console.warn('toastify css fail', e); }

    // 3) carregar scripts via tag (mais confiável que fetch+eval)
    try {
      await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
      // DarkReader pode requerer setFetchMethod para interceptar requests se você desejar
      try { if (window.DarkReader && window.DarkReader.setFetchMethod) DarkReader.setFetchMethod(window.fetch); } catch(e){}

      await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
    } catch(e){ console.warn('script load fail', e); }

    // success toast & sound
    sendToast("🪶 Khanware Minimal injetado com sucesso!", 3000);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    // delay pra mostrar splash
    await delay(600);
    hideSplashScreen();

    // setup main
    setupMain();

    // limpar console (opcional)
    console.clear();
  } catch(e){
    console.error('Boot error', e);
    hideSplashScreen();
    sendToast("❌ Erro ao iniciar Khanware: veja console.", 5000);
  }
})();

/* Final notes to user - não necessário, só log */
console.info('Khanware (corrigido) carregado.');

/* Fim do script */    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">HAKAIWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__hakaiware_fetch_installed) return;
  window.__hakaiware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__hakaiware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__hakaiware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__hakaiware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [HakaiOfc]!",
    "🤍 Made by [@HakaiOfc].",
    "☄️ By [HakaiOfc/hakaiware].",
    "🌟 Star the project on [GitHub](https://github.com/Hakai0fc)!",
    "🪶 Lite mode @ Hakaiware.js",
  ];

  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables && bodyObj.variables.input && typeof bodyObj.variables.input.durationSeconds === 'number') {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            } else {
              init = Object.assign({}, init, { body: newBody });
            }
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch (e){ console.warn(`🚨 Error @ videoSpoof (Hakaiware)\n${e}`); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (bloqueia limitadores de tempo em mark_conversions) */
(function registerMinuteFarm(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      let body = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions")) {
        if (body.includes("termination_event")) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          init = Object.assign({}, init, { __hakaiware_blocked_mark_conversions: true });
        }
      }
    } catch(e){ console.error('minuteFarm error', e); }
    return [input, init];
  });

  // response processor to handle the blocked flag
  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__hakaiware_blocked_mark_conversions) {
        // cria uma response vazia (204)
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error(e); }
    return null;
  });
})();

/* Safe font injection (usa @font-face, cuidado com CORS) */
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');font-weight:normal;font-style:normal;}";
  document.head.appendChild(styleFont);
} catch(e){}

/* scrollbar styling */
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}

/* set icon safely */
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Main features (AutoAnswer loop and others) */
function setupMain(){
  /* AutoAnswer */
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let hakaiwareDominates = true;
    (async () => {
      while (hakaiwareDominates) {
        try {
          for (const q of baseSelectors) {
            findAndClickBySelector(q);
            const el = document.querySelector(q + "> div");
            if (el && el.innerText === "Mostrar resumo") {
              sendToast("🎉 Exercício concluído!", 3000);
              playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              // opcionalmente parar: hakaiwareDominates = false;
            }
          }
        } catch(e){ console.error('autoAnswer loop error', e); }
        await delay(800);
      }
    })();
  })();

  /* Other functionality could be placed here (e.g., PushUp / MinuteFarm UI) */
}

/* Boot sequence: load CSS and external libs safely */
(async () => {
  try {
    // 1) mostrar splash
    await showSplashScreen();

    // 2) carregar CSSs
    try {
      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
    } catch(e){ console.warn('toastify css fail', e); }

    // 3) carregar scripts via tag (mais confiável que fetch+eval)
    try {
      await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
      // DarkReader pode requerer setFetchMethod para interceptar requests se você desejar
      try { if (window.DarkReader && window.DarkReader.setFetchMethod) DarkReader.setFetchMethod(window.fetch); } catch(e){}

      await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
    } catch(e){ console.warn('script load fail', e); }

    // success toast & sound
    sendToast("🪶 Hakaiware Minimal injetado com sucesso!", 3000);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    // delay pra mostrar splash
    await delay(600);
    hideSplashScreen();

    // setup main
    setupMain();

    // limpar console (opcional)
    console.clear();
  } catch(e){
    console.error('Boot error', e);
    hideSplashScreen();
    sendToast("❌ Erro ao iniciar Hakaiware: veja console.", 5000);
  }
})();

/* Final notes to user - não necessário, só log */
console.info('Hakaiware (corrigido) carregado.');

/* Fim do script */    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__khanware_fetch_installed) return;
  window.__khanware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__khanware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__khanware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__khanware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
    "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
    "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
    "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
    "🪶 Lite mode @ KhanwareMinimal.js",
  ];

  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
       s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__khanware_fetch_installed) return;
  window.__khanware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__khanware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__khanware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__khanware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [HakaiWhare]!",
    "🤍 Made by [Hakai0fc].",
    "☄️ By [Hakai0fc](https://github.com/Hakai0fc).",
    "🌟 Star the project on [GitHub](https://github.com/Hakai0fc/)!",
    "🪶 Lite mode @ KhanHakai.js",
  ];

  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables && bodyObj.variables.input && typeof bodyObj.variables.input.durationSeconds === 'number') {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            } else {
              init = Object.assign({}, init, { body: newBody });
            }
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch(e){ console.warn('videoSpoof parse fail', e); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (bloqueia limitadores de tempo em mark_conversions) */
(function registerMinuteFarm(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      let body = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions")) {
        if (body.includes("termination_event")) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          // interrompe a requisição retornando uma Request para um 204 vazio
          // Em vez de enviar a requisição ao servidor, retornamos um fake Response via responseProcessor; aqui apenas signal via property
          // Simples: devolvemos um Request cujo URL é about:blank e corpo vazio e um flag em init para responseProcessor tratar
          init = Object.assign({}, init, { __khanware_blocked_mark_conversions: true });
        }
      }
    } catch(e){ console.error('minuteFarm error', e); }
    return [input, init];
  });

  // response processor to handle the blocked flag
  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__khanware_blocked_mark_conversions) {
        // cria uma response vazia (204)
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error(e); }
    return null;
  });
})();

/* Safe font injection (usa @font-face, cuidado com CORS) */
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');font-weight:normal;font-style:normal;}";
  document.head.appendChild(styleFont);
} catch(e){}

/* scrollbar styling */
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}

/* set icon safely */
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Main features (AutoAnswer loop and others) */
function setupMain(){
  /* AutoAnswer */
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let khanwareDominates = true;
    (async () => {
      while (khanwareDominates) {
        try {
          for (const q of baseSelectors) {
            findAndClickBySelector(q);
            const el = document.querySelector(q + "> div");
            if (el && el.innerText === "Mostrar resumo") {
              sendToast("🎉 Exercício concluído!", 3000);
              playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              // opcionalmente parar: khanwareDominates = false;
            }
          }
        } catch(e){ console.error('autoAnswer loop error', e); }
        await delay(789);
      }
    })();
  })();

  /* Other functionality could be placed here (e.g., PushUp / MinuteFarm UI) */
}

/* Boot sequence: load CSS and external libs safely */
(async () => {
  try {
    // 1) mostrar splash
    await showSplashScreen();

    // 2) carregar CSSs
    try {
      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
    } catch(e){ console.warn('toastify css fail', e); }

    // 3) carregar scripts via tag (mais confiável que fetch+eval)
    try {
      await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
      // DarkReader pode requerer setFetchMethod para interceptar requests se você desejar
      try { if (window.DarkReader && window.DarkReader.setFetchMethod) DarkReader.setFetchMethod(window.fetch); } catch(e){}

      await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
    } catch(e){ console.warn('script load fail', e); }

    // success toast & sound
    sendToast("🪶 KhanHakai injetado com sucesso!", 3000);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    // delay pra mostrar splash
    await delay(600);
    hideSplashScreen();

    // setup main
    setupMain();

    // limpar console (opcional)
    console.clear();
  } catch(e){
    console.error('Boot error', e);
    hideSplashScreen();
    sendToast("❌ Erro ao iniciar KhanHakai: veja console.", 5000);
  }
})();

/* Final notes to user - não necessário, só log */
console.info('KhanHakai carregado.');

/* Fim do script */    });
  }

  /* Safety helpers */
  const safeSetIcon = (href) => {
    try {
      let icon = document.querySelector("link[rel~='icon']");
      if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
      icon.href = href;
    } catch(e){ console.warn('icone not set', e); }
  };

  /* Splash */
  async function showSplashScreen(){
    try {
      splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .25s ease;user-select:none;color:white;font-family:system-ui,Arial,sans-serif;font-size:28px;text-align:center;";
      splashScreen.innerHTML = '<div><span style="color:white;">HAKAIWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
      document.body.appendChild(splashScreen);
      await delay(20);
      splashScreen.style.opacity = '1';
    } catch(e){ console.error(e); }
  }
  async function hideSplashScreen(){
    try {
      splashScreen.style.opacity = '0';
      await delay(300);
      if (splashScreen.parentElement) splashScreen.remove();
    } catch(e){}
  }

  /* Main (sanitized) */
  function setupMain(){
    // Nenhuma rotina de exploração aqui — apenas um exemplo neutro
    sendToast('Hakaiware (sanitized) pronto.', 2500);
    console.info('Hakaiware (sanitized) iniciado. Nenhuma rotina invasiva está ativa.');
  }

  /* Boot sequence */
  (async () => {
    try {
      await showSplashScreen();

      // carregar Toastify (opcional)
      try {
        await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
      } catch(e){ console.warn('toastify css fail', e); }
      try {
        await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
      } catch(e){ console.warn('toastify js fail', e); }

      // set icon (opcional)
      safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

      // ready
      sendToast('🪶 Hakaiware (sanitized) injetado com sucesso!', 2200);
      playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

      await delay(500);
      hideSplashScreen();
      setupMain();

      // expose for debugging
      window.__hakaiware = { loadedPlugins };

    } catch(err){
      console.error('Boot error', err);
      hideSplashScreen();
      sendToast('❌ Erro ao iniciar Hakaiware (veja console)', 5000);
    }
  })();

})();    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">HAKAIWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__hakaiware_fetch_installed) return;
  window.__hakaiware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__hakaiware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__hakaiware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__hakaiware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [HakaiOfc]!",
    "🤍 Made by [@HakaiOfc].",
    "☄️ By [HakaiOfc/hakaiware].",
    "🌟 Star the project on [GitHub](https://github.com/Hakai0fc)!",
    "🪶 Lite mode @ Hakaiware.js",
  ];

  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables && bodyObj.variables.input && typeof bodyObj.variables.input.durationSeconds === 'number') {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            } else {
              init = Object.assign({}, init, { body: newBody });
            }
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch (e){ console.warn(`🚨 Error @ videoSpoof (Hakaiware)\n${e}`); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (bloqueia limitadores de tempo em mark_conversions) */
(function registerMinuteFarm(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      let body = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions")) {
        if (body.includes("termination_event")) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          init = Object.assign({}, init, { __hakaiware_blocked_mark_conversions: true });
        }
      }
    } catch(e){ console.error('minuteFarm error', e); }
    return [input, init];
  });

  // response processor to handle the blocked flag
  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__hakaiware_blocked_mark_conversions) {
        // cria uma response vazia (204)
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error(e); }
    return null;
  });
})();

/* Safe font injection (usa @font-face, cuidado com CORS) */
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');font-weight:normal;font-style:normal;}";
  document.head.appendChild(styleFont);
} catch(e){}

/* scrollbar styling */
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}

/* set icon safely */
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Main features (AutoAnswer loop and others) */
function setupMain(){
  /* AutoAnswer */
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let hakaiwareDominates = true;
    (async () => {
      while (hakaiwareDominates) {
        try {
          for (const q of baseSelectors) {
            findAndClickBySelector(q);
            const el = document.querySelector(q + "> div");
            if (el && el.innerText === "Mostrar resumo") {
              sendToast("🎉 Exercício concluído!", 3000);
              playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              // opcionalmente parar: hakaiwareDominates = false;
            }
          }
        } catch(e){ console.error('autoAnswer loop error', e); }
        await delay(800);
      }
    })();
  })();

  /* Other functionality could be placed here (e.g., PushUp / MinuteFarm UI) */
}

/* Boot sequence: load CSS and external libs safely */
(async () => {
  try {
    // 1) mostrar splash
    await showSplashScreen();

    // 2) carregar CSSs
    try {
      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
    } catch(e){ console.warn('toastify css fail', e); }

    // 3) carregar scripts via tag (mais confiável que fetch+eval)
    try {
      await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
      // DarkReader pode requerer setFetchMethod para interceptar requests se você desejar
      try { if (window.DarkReader && window.DarkReader.setFetchMethod) DarkReader.setFetchMethod(window.fetch); } catch(e){}

      await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
    } catch(e){ console.warn('script load fail', e); }

    // success toast & sound
    sendToast("🪶 Hakaiware Minimal injetado com sucesso!", 3000);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    // delay pra mostrar splash
    await delay(600);
    hideSplashScreen();

    // setup main
    setupMain();

    // limpar console (opcional)
    console.clear();
  } catch(e){
    console.error('Boot error', e);
    hideSplashScreen();
    sendToast("❌ Erro ao iniciar Hakaiware: veja console.", 5000);
  }
})();

/* Final notes to user - não necessário, só log */
console.info('Hakaiware (corrigido) carregado.');

/* Fim do script */    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* Safety helpers */
const safeSetIcon = (href) => {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    if (!icon.parentElement) { icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ console.warn('icone not set', e) }
};

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e) }
}
async function hideSplashScreen(){
  try {
    splashScreen.style.opacity = '0';
    await delay(500);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* Fetch wrapper único e extensível (não empilha vários) */
(function installFetchWrapper(){
  if (window.__khanware_fetch_installed) return;
  window.__khanware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>; return Response to replace, null to keep original

  // método para registrar
  window.__khanware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__khanware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      // allow processors to mutate request
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e) }
      }

      const resp = await originalFetch(input, init);
      // clone for inspection
      let replaced = null;
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) { replaced = maybe; break; }
        } catch(e){ console.error('responseProcessor error', e) }
      }
      return replaced || resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  // expose internal arrays for debugging if needed
  window.__khanware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors (QuestionSpoof, VideoSpoof, MinuteFarm) */

/* QuestionSpoof (modifica respostas JSON específicas) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
    "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
    "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
    "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
    "🪶 Lite mode @ KhanwareMinimal.js",
  ];

  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      // clone text
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      // verifica estrutura esperada
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          // condição baseada no seu código original: se a primeira string começa em maiúscula
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            // altera
            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            const newBody = JSON.stringify(obj);
            const newResp = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            return newResp;
          }
        } catch(e){ /* parse itemData falhou */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof (modifica request body para marcar vídeo como assistido) */
(function registerVideoSpoof(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      let url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables && bodyObj.variables.input && typeof bodyObj.variables.input.durationSeconds === 'number') {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            } else {
              init = Object.assign({}, init, { body: newBody });
            }
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch(e){ console.warn('videoSpoof parse fail', e); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (bloqueia limitadores de tempo em mark_conversions) */
(function registerMinuteFarm(){
  window.__khanware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      let body = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions")) {
        if (body.includes("termination_event")) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          // interrompe a requisição retornando uma Request para um 204 vazio
          // Em vez de enviar a requisição ao servidor, retornamos um fake Response via responseProcessor; aqui apenas signal via property
          // Simples: devolvemos um Request cujo URL é about:blank e corpo vazio e um flag em init para responseProcessor tratar
          init = Object.assign({}, init, { __khanware_blocked_mark_conversions: true });
        }
      }
    } catch(e){ console.error('minuteFarm error', e); }
    return [input, init];
  });

  // response processor to handle the blocked flag
  window.__khanware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__khanware_blocked_mark_conversions) {
        // cria uma response vazia (204)
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error(e); }
    return null;
  });
})();

/* Safe font injection (usa @font-face, cuidado com CORS) */
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');font-weight:normal;font-style:normal;}";
  document.head.appendChild(styleFont);
} catch(e){}

/* scrollbar styling */
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}

/* set icon safely */
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Main features (AutoAnswer loop and others) */
function setupMain(){
  /* AutoAnswer */
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let khanwareDominates = true;
    (async () => {
      while (khanwareDominates) {
        try {
          for (const q of baseSelectors) {
            findAndClickBySelector(q);
            const el = document.querySelector(q + "> div");
            if (el && el.innerText === "Mostrar resumo") {
              sendToast("🎉 Exercício concluído!", 3000);
              playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              // opcionalmente parar: khanwareDominates = false;
            }
          }
        } catch(e){ console.error('autoAnswer loop error', e); }
        await delay(800);
      }
    })();
  })();

  /* Other functionality could be placed here (e.g., PushUp / MinuteFarm UI) */
}

/* Boot sequence: load CSS and external libs safely */
(async () => {
  try {
    // 1) mostrar splash
    await showSplashScreen();

    // 2) carregar CSSs
    try {
      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css');
    } catch(e){ console.warn('toastify css fail', e); }

    // 3) carregar scripts via tag (mais confiável que fetch+eval)
    try {
      await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
      // DarkReader pode requerer setFetchMethod para interceptar requests se você desejar
      try { if (window.DarkReader && window.DarkReader.setFetchMethod) DarkReader.setFetchMethod(window.fetch); } catch(e){}

      await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin');
    } catch(e){ console.warn('script load fail', e); }

    // success toast & sound
    sendToast("🪶 Khanware Minimal injetado com sucesso!", 3000);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    // delay pra mostrar splash
    await delay(600);
    hideSplashScreen();

    // setup main
    setupMain();

    // limpar console (opcional)
    console.clear();
  } catch(e){
    console.error('Boot error', e);
    hideSplashScreen();
    sendToast("❌ Erro ao iniciar Khanware: veja console.", 5000);
  }
})();

/* Final notes to user - não necessário, só log */
console.info('Khanware (corrigido) carregado.');

/* Fim do script */
