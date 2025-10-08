let loadedPlugins = [];

/* Element(s?) */
const splashScreen = document.createElement('splashScreen');

/* Misc Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" }));
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Emmiter */
class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } };

function sendToast(text, duration=5000, gravity='bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); };

async function showSplashScreen() { splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;"; splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>'; document.body.appendChild(splashScreen); setTimeout(() => splashScreen.style.opacity = '1', 10);};
async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 1000); };

async function loadScript(url, label) { return fetch(url).then(response => response.text()).then(script => { loadedPlugins.push(label); eval(script); }); }
async function loadCss(url) { return new Promise((resolve) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url; link.onload = () => resolve(); document.head.appendChild(link); }); }

/* Main Functions */ 
function setupMain(){
    /* QuestionSpoof */
    (function () {
        const phrases = [ 
            "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
            "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
            "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
            "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
            "🪶 Lite mode @ KhanwareMinimal.js",
        ];

        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;

            const originalResponse = await originalFetch.apply(this, arguments);
            const clonedResponse = originalResponse.clone();

            try {
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);
                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                        itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada.", 1000);
                        return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                    }
                }
            } catch (e) { }
            return originalResponse;
        };
    })();

    /* VideoSpoof */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                        sendToast("🔓 Vídeo exploitado.", 1000)
                    }
                } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];

        khanwareDominates = true;

        (async () => { 
            while (khanwareDominates) {
                const selectorsToCheck = [...baseSelectors];

                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; }

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 Khanware Minimal injetado com sucesso!");

    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    await delay(500);

    hideSplashScreen();
    setupMain();

    console.clear();
});    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                        sendToast("🔓 Vídeo exploitado.", 1000)
                    }
                } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];
        
        khanwareDominates = true;
        
        (async () => { 
            while (khanwareDominates) {
                const selectorsToCheck = [...baseSelectors];
    
                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; }

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 Khanware Minimal injetado com sucesso!");
    
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(500);

    hideSplashScreen();
    setupMain();
    
    console.clear();
});    s.async = false;
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
   le && console.debug) console.debug('VideoSpoof error:', e);
                }
            }

            // MinuteFarm
            if (body && (input.url || '').includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) {
                        sendToast("🚫 Limitador de tempo bloqueado.", 1000);
                        return new Promise(function(resolve) { resolve(new Response(null, { status: 200 })); });
                    }
                } catch (e) {
                    if (console && console.debug) console.debug('MinuteFarm error:', e);
                }
            }

            return originalFetch.apply(this, [input, init]);
        }

        // AutoAnswer
        var baseSelectors = [
            '[data-testid="choice-icon__library-choice-icon"]',
            '[data-testid="exercise-check-answer"]',
            '[data-testid="exercise-next-question"]',
            '._1udzurba',
            '._awve9b',
            'button[data-testid="kaButton"]:not([disabled])',
            '.ExerciseController button[role="button"]',
            '[data-testid="radio-choice"]'
        ];

        var autoAnswerRunning = true;
        plppdo.on('domChanged', function() {
            if (!autoAnswerRunning) return;
            var clicked = false;
            for (var i = 0; i < baseSelectors.length; i++) {
                if (findAndClickBySelector(baseSelectors[i])) clicked = true;
            }
            var summaryElement = document.querySelector('.ExerciseController-summary, [class*="summary"]');
            if (summaryElement && summaryElement.innerText && summaryElement.innerText.includes("resumo")) {
                sendToast("🎉 Exercício concluído!", 3000);
                playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                autoAnswerRunning = false;
            }
            if (clicked && console && console.log) console.log('[HAKAI] AutoAnswer clicou algo.');
        });

        if (console && console.log) console.log('[HAKAI] SetupMain carregado!');
    }

    /* Inject Check */
    var khanRegex = /^https?:\/\/([a-z0-9-]+\.)?(pt\.)?khanacademy\.org/;
    if (!khanRegex.test(window.location.href)) {
        alert("❌ HAKAI Failed to Inject!\nVocê precisa executar HAKAI no site do Khan Academy!");
        window.location.href = "https://pt.khanacademy.org/";
    } else {
        showSplashScreen();

        // Carrega dependências com callbacks (sem Promise.all para simplicidade)
        var darkLoaded = false;
        var toastLoaded = false;
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin', function(success) {
            if (success && typeof DarkReader !== 'undefined') {
                try {
                    DarkReader.setFetchMethod(window.fetch);
                    DarkReader.enable();
                } catch (e) {
                    if (console && console.debug) console.debug('DarkReader falhou:', e);
                }
                darkLoaded = true;
            }
            checkAllLoaded();
        });
        loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', function() {}); // CSS não precisa callback
        loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin', function(success) {
            toastLoaded = success;
            checkAllLoaded();
        });

        function checkAllLoaded() {
            if (darkLoaded !== false && toastLoaded !== false) {  // Espera ambos
                sendToast("🪶 HAKAI Minimal injetado com sucesso!");
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
                delay(500, function() {
                    hideSplashScreen();
                    setupMain();
                });
            }
        }

        // Fallback se loads falharem (roda após 5s)
        setTimeout(function() {
            if (darkLoaded === false || toastLoaded === false) {
                if (console && console.error) console.error('[HAKAI] Dependências falharam, mas hacks ativados.');
                alert('[HAKAI] Dependências falharam, mas hacks ativados.');
                hideSplashScreen();
                setupMain();
            }
        }, 5000);
    }
})();
  console.log('[HAKAI] SetupMain carregado!');
    }

    /* Inject Check - SEM RETURN, só if/else */
    const khanRegex = /^https?:\/\/([a-z0-9-]+\.)?(pt\.)?khanacademy\.org/;
    if (!khanRegex.test(window.location.href)) {
        alert("❌ HAKAI Failed to Inject!\nVocê precisa executar HAKAI no site do Khan Academy!");
        window.location.href = "https://pt.khanacademy.org/";
    } else {
        showSplashScreen();

        Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').catch(() => false),
            loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css').catch(() => false),
            loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin').catch(() => false)
        ]).then(async () => {
            if (typeof DarkReader !== 'undefined') {
                try {
                    DarkReader.setFetchMethod(window.fetch);
                    DarkReader.enable();
                } catch (e) {
                    console.debug('DarkReader falhou:', e);
                }
            }
            sendToast("🪶 HAKAI Minimal injetado com sucesso!");
            playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
            await delay(500);
            hideSplashScreen();
            setupMain();
        }).catch(e => {
            console.error('[HAKAI] Erro no load:', e);
            alert('[HAKAI] Dependências falharam, mas hacks ativados.');
            hideSplashScreen();
            setupMain();
        });
    }
})();
        const script = await response.text();
        loadedPlugins.push(label);
        eval(script);
        return true;
    } catch (e) {
        console.error(`[HAKAI] Failed to load ${label}:`, e);
        return false;
    }
}
async function loadCss(url) {
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve(true);
        link.onerror = () => resolve(false);
        document.head.appendChild(link);
    });
}

/* Main Functions */
function setupMain() {
    const phrases = [
        "🔥 Get good, get HAKAI!",
        "🤍 Made by @hakai0fc",
        "☄️ By Hakai0fc/Khan.",
        "🌟 Star the project on GitHub!",
        "🪶 Lite mode @ HakaiMinimal.js",
    ];

    // ÚNICA interceptação de fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input, init = {}) {
        let body = null;
        if (input instanceof Request) {
            body = await input.clone().text();
        } else if (init.body) {
            body = typeof init.body === 'string' ? init.body : new TextDecoder().decode(init.body);
        }

        // QuestionSpoof
        const args = arguments;
        if (body && body.includes('assessmentItem')) {
            try {
                const response = await originalFetch.apply(this, args);
                const clonedResponse = response.clone();
                const responseBody = await clonedResponse.text();
                let responseObj;
                try {
                    responseObj = JSON.parse(responseBody);
                } catch {} // Ignora parse errors
                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData;
                    try {
                        itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    } catch {}
                    if (itemData && itemData.question && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                        itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false }] } } };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada.", 1000);
                        return new Response(JSON.stringify(responseObj), { status: response.status, statusText: response.statusText, headers: response.headers });
                    }
                }
                return response;
            } catch (e) {
                console.debug('QuestionSpoof error:', e);
            }
        }

        // VideoSpoof
        if (body && body.includes('updateUser VideoProgress')) {
            try {
                let bodyObj = JSON.parse(body);
                if (bodyObj.variables && bodyObj.variables.input) {
                    const durationSeconds = bodyObj.variables.input.durationSeconds;
                    bodyObj.variables.input.secondsWatched = durationSeconds;
                    bodyObj.variables.input.lastSecondWatched = durationSeconds;
                    const newBody = JSON.stringify(bodyObj);
                    if (input instanceof Request) {
                        input = new Request(input, { body: newBody });
                    } else {
                        init.body = newBody;
                    }
                    sendToast("🔓 Vídeo exploitado.", 1000);
                }
            } catch (e) {
                console.debug('VideoSpoof error:', e);
            }
        }

        // MinuteFarm
        if (body && (input.url || '').includes("mark_conversions")) {
            try {
                if (body.includes("termination_event")) {
                    sendToast("🚫 Limitador de tempo bloqueado.", 1000);
                    return new Response(null, { status: 200 });
                }
            } catch (e) {
                console.debug('MinuteFarm error:', e);
            }
        }

        return originalFetch.apply(this, args);
    };

    // AutoAnswer
    const baseSelectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`,
        `button[data-testid="kaButton"]:not([disabled])`,
        `.ExerciseController button[role="button"]`,
        `[data-testid="radio-choice"]`
    ];

    let autoAnswerRunning = true;
    plppdo.on('domChanged', () => {
        if (!autoAnswerRunning) return;
        let clicked = false;
        for (const q of baseSelectors) {
            if (findAndClickBySelector(q)) clicked = true;
            const summaryElement = document.querySelector('.ExerciseController-summary, [class*="summary"]');
            if (summaryElement && summaryElement.innerText && summaryElement.innerText.includes("resumo")) {
                sendToast("🎉 Exercício concluído!", 3000);
                playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                autoAnswerRunning = false;
                break;
            }
        }
        if (clicked) console.log('[HAKAI] AutoAnswer clicou algo.');
    });

    console.log('[HAKAI] SetupMain carregado no mobile!');
}

/* Inject Check - SEM RETURN ILEGAL */
const khanRegex = /^https?:\/\/([a-z0-9-]+\.)?(pt\.)?khanacademy\.org/;
if (!khanRegex.test(window.location.href)) {
    alert("❌ HAKAI Failed to Inject!\nVocê precisa executar HAKAI no site do Khan Academy!");
    window.location.href = "https://pt.khanacademy.org/";
} else {
    // Só roda se for Khan
    showSplashScreen();

    // Carrega dependências com fallbacks
    Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').catch(() => false),
        loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css').catch(() => false),
        loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin').catch(() => false)
    ]).then(async () => {
        // DarkReader opcional
        if (typeof DarkReader !== 'undefined') {
            try {
                DarkReader.setFetchMethod(window.fetch);
                DarkReader.enable();
            } catch (e) {
                console.debug('DarkReader falhou no mobile:', e);
            }
        }
        sendToast("🪶 HAKAI Minimal injetado com sucesso!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        hideSplashScreen();
        setupMain();
    }).catch(e => {
        console.error('[HAKAI] Erro no load:', e);
        alert('[HAKAI] Erro no carregamento, mas hacks básicos ativados.');
        hideSplashScreen();
        setupMain(); // Roda hacks mesmo sem dependências
    });
}
        eval(script); // Use com cuidado; considere Function() para mais segurança
        return true;
    } catch (e) {
        console.error(`[HAKAI] Failed to load script ${label}:`, e);
        sendToast(`❌ Erro ao carregar ${label}`, 3000);
        return false;
    }
}
async function loadCss(url) {
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve(true);
        link.onerror = () => resolve(false);
        document.head.appendChild(link);
    });
}

/* Main Functions */
function setupMain() {
    const phrases = [
        "🔥 Get good, get HAKAI!",
        "🤍 Made by @hakai0fc",
        "☄️ By Hakai0fc/Khan.",
        "🌟 Star the project on GitHub!",
        "🪶 Lite mode @ HakaiMinimal.js",
    ];

    // ÚNICA interceptação de fetch - combina todos os hacks
    const originalFetch = window.fetch;
    window.fetch = async function(input, init = {}) {
        let body = null;
        if (input instanceof Request) {
            body = await input.clone().text();
        } else if (init.body) {
            body = typeof init.body === 'string' ? init.body : new TextDecoder().decode(init.body);
        }

        // QuestionSpoof
        if (body && body.includes('assessmentItem')) {
            try {
                const response = await originalFetch.apply(this, arguments);
                const clonedResponse = response.clone();
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);
                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                        itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false }] } } };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada.", 1000);
                        return new Response(JSON.stringify(responseObj), { status: response.status, statusText: response.statusText, headers: response.headers });
                    }
                }
                return response;
            } catch (e) {
                console.debug('QuestionSpoof error:', e);
            }
        }

        // VideoSpoof
        if (body && body.includes('"operationName":"updateUser VideoProgress"')) {
            try {
                let bodyObj = JSON.parse(body);
                if (bodyObj.variables && bodyObj.variables.input) {
                    const durationSeconds = bodyObj.variables.input.durationSeconds;
                    bodyObj.variables.input.secondsWatched = durationSeconds;
                    bodyObj.variables.input.lastSecondWatched = durationSeconds;
                    const newBody = JSON.stringify(bodyObj);
                    if (input instanceof Request) {
                        input = new Request(input, { body: newBody });
                    } else {
                        init.body = newBody;
                    }
                    sendToast("🔓 Vídeo exploitado.", 1000);
                }
            } catch (e) {
                console.debug('VideoSpoof error:', e);
            }
        }

        // MinuteFarm
        if (body && input.url.includes("mark_conversions")) {
            try {
                if (body.includes("termination_event")) {
                    sendToast("🚫 Limitador de tempo bloqueado.", 1000);
                    return new Response(null, { status: 200 }); // Bloqueia a request
                }
            } catch (e) {
                console.debug('MinuteFarm error:', e);
            }
        }

        // Chama o fetch original com as mods
        return originalFetch.apply(this, arguments);
    };

    // AutoAnswer - Loop melhorado (condicional, não infinito)
    const baseSelectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`,
        // Adicionei seletores mais genéricos/atualizados para Khan
        `button[data-testid="kaButton"]:not([disabled])`,
        `.ExerciseController button[role="button"]`,
        `[data-testid="radio-choice"]`
    ];

    let autoAnswerRunning = true;
    plppdo.on('domChanged', () => { // Usa o observer para rechecagem
        if (!autoAnswerRunning) return;
        let clickedSomething = false;
        for (const q of baseSelectors) {
            if (findAndClickBySelector(q)) {
                clickedSomething = true;
            }
            // Checa por "Mostrar resumo" (sucesso)
            const summaryElement = document.querySelector(q + "> div, .ExerciseController-summary");
            if (summaryElement && summaryElement.innerText.includes("Mostrar resumo")) {
                sendToast("🎉 Exercício concluído!", 3000);
                playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                autoAnswerRunning = false; // Para o loop após sucesso
                break;
            }
        }
        if (!clickedSomething) {
            // Se nada encontrado, delay maior para evitar spam
            setTimeout(() => {}, 2000);
        }
    });

    console.log('[HAKAI] SetupMain loaded. AutoAnswer monitoring DOM changes.');
}

/* Inject */
const khanRegex = /^https?:\/\/([a-z0-9-]+\.)?(pt\.)?khanacademy\.org/;
if (!khanRegex.test(window.location.href)) {
    alert("❌ HAKAI Failed to Inject!\nVocê precisa executar HAKAI no site do Khan Academy!");
    window.location.href = "https://pt.khanacademy.org/";
    return; // Sai cedo
}

showSplashScreen();

Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin'),
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
]).then(async (results) => {
    if (results[0]) { // DarkReader
        try {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable();
        } catch (e) {
            console.error('DarkReader init failed:', e);
        }
    }
    if (results[2]) { // Toastify
        sendToast("🪶 HAKAI Minimal injetado com sucesso!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    } else {
        console.log('[HAKAI] Toastify failed, using console fallback.');
    }
    await delay(500);
    hideSplashScreen();
    setupMain();
    // console.clear(); // Comentei para debug; descomente se quiser limpar
}).catch(e => {
    console.error('[HAKAI] Load error:', e);
    hideSplashScreen();
});
arkreader.min.js', 'darkReaderPlugin'),
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
]).then(async (results) => {
    if (results[0]) { // DarkReader
        try {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable();
        } catch (e) {
            console.error('DarkReader init failed:', e);
        }
    }
    if (results[2]) { // Toastify
        sendToast("🪶 HAKAI Minimal injetado com sucesso!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    } else {
        console.log('[HAKAI] Toastify failed, using console fallback.');
    }
    await delay(500);
    hideSplashScreen();
    setupMain();
    // console.clear(); // Comentei para debug; descomente se quiser limpar
}).catch(e => {
    console.error('[HAKAI] Load error:', e);
    hideSplashScreen();
});
            try {
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);
                if(responseObj?.data?.assessmentItem?.item?.itemData){
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if(itemData.question.content[0]===itemData.question.content[0].toUpperCase()){
                        itemData.answerArea = { calculator:false, chi2Table:false, periodicTable:false, tTable:false, zTable:false };
                        itemData.question.content = phrases[Math.floor(Math.random()*phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type:"radio", options:{ choices:[{content:"Resposta correta.",correct:true},{content:"Resposta incorreta.",correct:false}] } } };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada.",1000);
                        return new Response(JSON.stringify(responseObj),{status:originalResponse.status,statusText:originalResponse.statusText,headers:originalResponse.headers});
                    }
                }
            }catch(e){}
            return originalResponse;
        };
    })();

    /* VideoSpoof */
    (function(){
        const originalFetch = window.fetch;
        window.fetch = async function(input,init){
            let body;
            if(input instanceof Request) body = await input.clone().text();
            else if(init && init.body) body = init.body;

            if(body && body.includes('"operationName":"updateUserVideoProgress"')){
                try{
                    let bodyObj = JSON.parse(body);
                    if(bodyObj.variables && bodyObj.variables.input){
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if(input instanceof Request){ input = new Request(input,{body:body}); }
                        else init.body = body;
                        sendToast("🔓 Vídeo exploitado.",1000);
                    }
                }catch(e){ console.debug(e); }
            }
            return originalFetch.apply(this,arguments);
        };
    })();

    /* MinuteFarm */
    (function(){
        const originalFetch = window.fetch;
        window.fetch = async function(input,init={}){
            let body;
            if(input instanceof Request) body = await input.clone().text();
            else if(init.body) body = init.body;

            if(body && input.url.includes("mark_conversions")){
                try{ if(body.includes("termination_event")){ sendToast("🚫 Limitador de tempo bloqueado.",1000); return; } }catch(e){ console.debug(e); }
            }
            return originalFetch.apply(this,arguments);
        };
    })();

    /* AutoAnswer */
    (function(){
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`,
            `[data-testid="exercise-next-question"]`,
            `._1udzurba`,
            `._awve9b`
        ];

        let hakaiDominates = true;

        (async()=>{
            while(hakaiDominates){
                const selectorsToCheck = [...baseSelectors];
                for(const q of selectorsToCheck){
                    findAndClickBySelector(q);
                    if(document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText==="Mostrar resumo"){
                        sendToast("🎉 Exercício concluído!",3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}

/* Inject */
if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)){
    alert("❌ HAKAI Failed to Inject!\nVocê precisa executar HAKAI no site do Khan Academy!");
    window.location.href="https://pt.khanacademy.org/";
}

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js','darkReaderPlugin').then(()=>{
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
});
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css','toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js','toastifyPlugin').then(async()=>{
    sendToast("🪶 HAKAI Minimal injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
});=>{
      try { if (window.DarkReader && typeof DarkReader.setFetchMethod === 'function') DarkReader.setFetchMethod(window.fetch); if (window.DarkReader && typeof DarkReader.enable === 'function') DarkReader.enable(); } catch(e){ console.debug("DarkReader init failed:", e); }
    });

    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');

    sendToast("🪶 HAKAI injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    await delay  }

  async function showSplashScreen() {
    try {
      splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity .35s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";
      splashScreen.innerHTML = '<span style="color:white;">HAKAI</span><span style="color:#72ff72;">.Khan</span>';
      document.body.appendChild(splashScreen);
      setTimeout(()=> splashScreen.style.opacity = '1', 10);
    } catch(e){}
  }
  function hideSplashScreen() { try { splashScreen.style.opacity = '0'; setTimeout(()=>{ try{ splashScreen.remove(); }catch(e){} }, 350); } catch(e){} }

  async function loadScript(url, label) {
    try {
      const res = await fetch(url);
      const code = await res.text();
      loadedPlugins.push(label || url);
      // eslint-disable-next-line no-eval
      eval(code);
    } catch (e) {
      console.error("Erro loadScript:", url, e);
    }
  }
  function loadCss(url) {
    return new Promise(resolve => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url;
        link.onload = () => resolve(); link.onerror = () => resolve();
        document.head.appendChild(link);
      } catch (e) { resolve(); }
    });
  }

  /* Main (encadeado) */
  function setupMain() {
    /* QuestionSpoof */
    (function(){
      const phrases = [
        "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
        "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
        "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
        "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
        "🪶 Lite mode @ KhanwareMinimal.js"
      ];

      const originalFetch = window.fetch;
      window.fetch = async function(input, init){
        let body;
        try { if (input instanceof Request) body = await input.clone().text(); else if (init && init.body) body = init.body; } catch(e){}
        const originalResponse = await originalFetch.apply(this, arguments);
        let cloned;
        try { cloned = originalResponse.clone(); } catch(e){ return originalResponse; }
        try {
          const rb = await cloned.text();
          const responseObj = JSON.parse(rb);
          if (responseObj?.data?.assessmentItem?.item?.itemData) {
            let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
            if (itemData?.question?.content && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
              itemData.answerArea = { calculator:false, chi2Table:false, periodicTable:false, tTable:false, zTable:false };
              itemData.question.content = phrases[Math.floor(Math.random()*phrases.length)] + `[[☃ radio 1]]`;
              itemData.question.widgets = { "radio 1": { type:"radio", options:{ choices:[ { content:"Resposta correta.", correct:true }, { content:"Resposta incorreta.", correct:false } ] } } };
              responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
              sendToast("🔓 Questão exploitada.", 1000);
              return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
            }
          }
        } catch (e) { /* ignore parse errors */ }
        return originalResponse;
      };
    })();

    /* VideoSpoof */
    (function(){
      const originalFetch = window.fetch;
      window.fetch = async function(input, init){
        let body;
        try { if (input instanceof Request) body = await input.clone().text(); else if (init && init.body) body = init.body; } catch(e){}
        if (body && body.includes && body.includes('"operationName":"updateUserVideoProgress"')) {
          try {
            const bodyObj = JSON.parse(body);
            if (bodyObj?.variables?.input) {
              const durationSeconds = bodyObj.variables.input.durationSeconds;
              bodyObj.variables.input.secondsWatched = durationSeconds;
              bodyObj.variables.input.lastSecondWatched = durationSeconds;
              body = JSON.stringify(bodyObj);
              if (input instanceof Request) {
                try { input = new Request(input, { body }); } catch(e) {}
              } else {
                init = init || {}; init.body = body;
              }
              sendToast("🔓 Vídeo exploitado.", 1000);
            }
          } catch(e){ console.debug("VideoSpoof parse error:", e); }
        }
        return originalFetch.apply(this, arguments);
      };
    })();

    /* MinuteFarm */
    (function(){
      const originalFetch = window.fetch;
      window.fetch = async function(input, init = {}){
        let body;
        try { if (input instanceof Request) body = await input.clone().text(); else if (init && init.body) body = init.body; } catch(e){}
        const url = (input && input.url) ? input.url : "";
        if (body && url.includes && url.includes("mark_conversions")) {
          try { if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; } } catch(e){ console.debug("MinuteFarm error:", e); }
        }
        return originalFetch.apply(this, arguments);
      };
    })();

    /* AutoAnswer */
    (function(){
      const baseSelectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`
      ];
      let khanwareDominates = true;
      (async ()=>{
        while (khanwareDominates) {
          for (const q of baseSelectors) {
            try {
              findAndClickBySelector(q);
              const el = document.querySelector(q+"> div");
              if (el && el.innerText === "Mostrar resumo") {
                sendToast("🎉 Exercício concluído!", 3000);
                playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              }
            } catch(e){ console.debug("AutoAnswer loop error:", e); }
          }
          await delay(800);
        }
      })();
    })();
  } // end setupMain

  /* Inject check + bootstrap */
  try {
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
      alert("❌ Hack Failed to Inject!\n\nVocê precisa executar isso no site do Khan Academy! (https://pt.khanacademy.org/)");
      window.location.href = "https://pt.khanacademy.org/";
    }
  } catch(e){ console.debug("inject check failed:", e); }

  (async ()=>{
    showSplashScreen();

    // Load sequence same style as original (no breaking await chain)
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{
      try { if (window.DarkReader && typeof DarkReader.setFetchMethod === 'function') DarkReader.setFetchMethod(window.fetch); if (window.DarkReader && typeof DarkReader.enable === 'function') DarkReader.enable(); } catch(e){ console.debug("DarkReader init failed:", e); }
    });

    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');

    sendToast("🪶 Hack injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    await delay(500);
    try { setupMain(); } catch(e){ console.error("setupMain error:", e); }
    hideSplashScreen();
    console.clear();
  })();

})();        zIndex: 99999, fontFamily: 'sans-serif', fontSize: '13px', opacity: '0', transition: 'opacity .2s'
      });
      document.body.appendChild(t);
      requestAnimationFrame(() => t.style.opacity = '1');
      setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 200); }, duration);
    } catch (e) {
      try { console.log(`[Toast] ${text}`); } catch (er) {}
    }
  };

  async function showSplashScreen() {
    try {
      splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity 0.4s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";
      splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>';
      document.body.appendChild(splashScreen);
      setTimeout(() => splashScreen.style.opacity = '1', 10);
    } catch (e) { console.debug("showSplashScreen error:", e); }
  };
  async function hideSplashScreen() { try { splashScreen.style.opacity = '0'; setTimeout(() => { try { splashScreen.remove(); } catch(e){} }, 400); } catch(e){ } };

  async function loadScript(url, label) {
    try {
      const res = await fetch(url);
      const script = await res.text();
      loadedPlugins.push(label || url);
      // eslint-disable-next-line no-eval
      eval(script);
    } catch (e) {
      console.error("Erro ao carregar script:", url, e);
    }
  }
  async function loadCss(url) {
    return new Promise((resolve) => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
      } catch (e) { resolve(); }
    });
  }

  /* Main Functions */
  function setupMain() {
    /* QuestionSpoof */
    (function () {
      const phrases = [
        "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
        "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
        "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
        "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
        "🪶 Lite mode @ KhanwareMinimal.js",
      ];

      const originalFetch = window.fetch;

      window.fetch = async function (input, init) {
        let body;
        try {
          if (input instanceof Request) body = await input.clone().text();
          else if (init && init.body) body = init.body;
        } catch (e) { /* ignore */ }

        const originalResponse = await originalFetch.apply(this, arguments);
        let clonedResponse;
        try { clonedResponse = originalResponse.clone(); } catch (e) { return originalResponse; }

        try {
          const responseBody = await clonedResponse.text();
          let responseObj = JSON.parse(responseBody);
          if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
            let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
            if (itemData && itemData.question && itemData.question.content && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
              itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
              itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
              itemData.question.widgets = {
                "radio 1": {
                  type: "radio",
                  options: {
                    choices: [
                      { content: "Resposta correta.", correct: true },
                      { content: "Resposta incorreta.", correct: false }
                    ]
                  }
                }
              };
              responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
              sendToast("🔓 Questão exploitada.", 1000);
              return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
            }
          }
        } catch (e) { /* parse errors — ignore */ }

        return originalResponse;
      };
    })();

    /* VideoSpoof */
    (function () {
      const originalFetch = window.fetch;

      window.fetch = async function (input, init) {
        let body;
        try {
          if (input instanceof Request) body = await input.clone().text();
          else if (init && init.body) body = init.body;
        } catch (e) { /* ignore */ }

        if (body && body.includes && body.includes('"operationName":"updateUserVideoProgress"')) {
          try {
            let bodyObj = JSON.parse(body);
            if (bodyObj && bodyObj.variables && bodyObj.variables.input) {
              const durationSeconds = bodyObj.variables.input.durationSeconds;
              bodyObj.variables.input.secondsWatched = durationSeconds;
              bodyObj.variables.input.lastSecondWatched = durationSeconds;
              body = JSON.stringify(bodyObj);
              if (input instanceof Request) {
                try { input = new Request(input, { body: body }); } catch (e) { /* ignore */ }
              } else {
                init = init || {};
                init.body = body;
              }
              sendToast("🔓 Vídeo exploitado.", 1000);
            }
          } catch (e) { console.debug("VideoSpoof parse error:", e); }
        }

        return originalFetch.apply(this, arguments);
      };
    })();

    /* MinuteFarm */
    (function () {
      const originalFetch = window.fetch;

      window.fetch = async function (input, init = {}) {
        let body;
        try {
          if (input instanceof Request) body = await input.clone().text();
          else if (init && init.body) body = init.body;
        } catch (e) { /* ignore */ }

        const url = (input && input.url) ? input.url : "";

        if (body && url && url.includes("mark_conversions")) {
          try {
            if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
          } catch (e) { console.debug("MinuteFarm error:", e); }
        }
        return originalFetch.apply(this, arguments);
      };
    })();

    /* AutoAnswer */
    (function () {
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
          const selectorsToCheck = [...baseSelectors];

          for (const q of selectorsToCheck) {
            try {
              findAndClickBySelector(q);
              const el = document.querySelector(q + "> div");
              if (el && el.innerText === "Mostrar resumo") {
                sendToast("🎉 Exercício concluído!", 3000);
                playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
              }
            } catch (e) {
              console.debug("AutoAnswer loop error:", e);
            }
          }
          await delay(800);
        }
      })();
    })();
  } // end setupMain

  /* Inject */
  try {
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
      alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
      window.location.href = "https://pt.khanacademy.org/";
    }
  } catch (e) {
    console.debug("Inject check failed:", e);
  }

  (async () => {
    showSplashScreen();

    // load DarkReader, Toastify and then init
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(() => {
      try { if (window.DarkReader && typeof DarkReader.setFetchMethod === 'function') DarkReader.setFetchMethod(window.fetch); if (window.DarkReader && typeof DarkReader.enable === 'function') DarkReader.enable(); } catch (e) { console.debug("DarkReader init failed:", e); }
    });

    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

    // load Toastify JS (some pages block cross-site; this will fail gracefully)
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');

    sendToast("🪶 Khanware Minimal injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    await delay(500);
    try { setupMain(); } catch (e) { console.error("setupMain error:", e); }
    hideSplashScreen();
    console.clear();
  })();

})();                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) input = new Request(input, { body: body });
                        else init.body = body;
                        sendToast("🔓 Vídeo exploitado.", 1000);
                    }
                } catch (e) { console.error(e); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            let url = input.url || (input instanceof Request ? input.url : "");
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;

            if (body && url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) {
                        sendToast("🚫 Limitador de tempo bloqueado.", 1000);
                        return;
                    }
                } catch (e) { console.error(e); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
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
                for (const q of baseSelectors) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q + "> div")?.innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}                    let responseObj = JSON.parse(responseBody);
                    if (responseObj?.data?.assessmentItem?.item?.itemData) {
                        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                        if(itemData.question && itemData.question.content && itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[â˜ƒ radio 1]]`;
                            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
                            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                            sendToast("ðŸ”“ QuestÃ£o exploitada.", 1000);
                            return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                        }
                    }
                } catch (e) { /* ignore parse errors and return original response */ }
                return originalResponse;
            } catch(e){
                return originalFetch.apply(this, arguments);
            }
        };
    })();

    /* VideoSpoof */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            try {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init && init.body) body = init.body;
                if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                    try {
                        let bodyObj = JSON.parse(body);
                        if (bodyObj.variables && bodyObj.variables.input) {
                            const durationSeconds = bodyObj.variables.input.durationSeconds;
                            bodyObj.variables.input.secondsWatched = durationSeconds;
                            bodyObj.variables.input.lastSecondWatched = durationSeconds;
                            body = JSON.stringify(bodyObj);
                            if (input instanceof Request) { input = new Request(input, { body: body }); } 
                            else init.body = body; 
                            sendToast("ðŸ”“ VÃ­deo exploitado.", 1000)
                        }
                    } catch (e) { console.debug(`ðŸš¨ Error @ videoSpoof.js\n${e}`); }
                }
            } catch(e){}
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            try {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init.body) body = init.body;
                if (body && (typeof input === 'object' && input.url && input.url.includes("mark_conversions"))) {
                    try {
                        if (body.includes("termination_event")) { sendToast("ðŸš« Limitador de tempo bloqueado.", 1000); return; }
                    } catch (e) { console.debug(`ðŸš¨ Error @ minuteFarm.js\n${e}`); }
                }
            } catch(e){}
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
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
                const selectorsToCheck = [...baseSelectors];

                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("ðŸŽ‰ ExercÃ­cio concluÃ­do!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("âŒ HAKAI Failed to Inject!\n\nVocÃª precisa executar o HAKAI no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/"; 
}

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ 
    try { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); } catch(e){}
})
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("ðŸª¶ HAKAI Minimal injetado com sucesso!");

    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

    await delay(500);

    hideSplashScreen();
    setupMain();

    console.clear();
});                    if (responseObj?.data?.assessmentItem?.item?.itemData) {
                        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                        if(itemData.question && itemData.question.content && itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
                            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                            sendToast("🔓 Questão exploitada.", 1000);
                            return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                        }
                    }
                } catch (e) { /* ignore parse errors and return original response */ }
                return originalResponse;
            } catch(e){
                return originalFetch.apply(this, arguments);
            }
        };
    })();

    /* VideoSpoof */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            try {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init && init.body) body = init.body;
                if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                    try {
                        let bodyObj = JSON.parse(body);
                        if (bodyObj.variables && bodyObj.variables.input) {
                            const durationSeconds = bodyObj.variables.input.durationSeconds;
                            bodyObj.variables.input.secondsWatched = durationSeconds;
                            bodyObj.variables.input.lastSecondWatched = durationSeconds;
                            body = JSON.stringify(bodyObj);
                            if (input instanceof Request) { input = new Request(input, { body: body }); } 
                            else init.body = body; 
                            sendToast("🔓 Vídeo exploitado.", 1000)
                        }
                    } catch (e) { console.debug(`🚨 Error @ videoSpoof.js\n${e}`); }
                }
            } catch(e){}
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            try {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init.body) body = init.body;
                if (body && (typeof input === 'object' && input.url && input.url.includes("mark_conversions"))) {
                    try {
                        if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                    } catch (e) { console.debug(`🚨 Error @ minuteFarm.js\n${e}`); }
                }
            } catch(e){}
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
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
                const selectorsToCheck = [...baseSelectors];
    
                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("❌ HAKAI Failed to Inject!\n\nVocê precisa executar o HAKAI no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/"; 
}

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ 
    try { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); } catch(e){}
})
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 HAKAI Minimal injetado com sucesso!");
    
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(500);

    hideSplashScreen();
    setupMain();
    
    console.clear();
});    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                        sendToast("🔓 Vídeo exploitado.", 1000)
                    }
                } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];
        
        khanwareDominates = true;
        
        (async () => { 
            while (khanwareDominates) {
                const selectorsToCheck = [...baseSelectors];
    
                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(800);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; }

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 Khanware Minimal injetado com sucesso!");
    
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(500);

    hideSplashScreen();
    setupMain();
    
    console.clear();
}); bloqueado.",1000);
                return new Response(JSON.stringify({status:"blocked"}),{status:200});
            }
        } catch(e){ console.warn(e); }

        return originalFetch.apply(this,arguments);
    }
})();

/* AutoAnswer */
function setupMain(){
    const selectors=[
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`
    ];
    let running=true;
    (async function loop(){
        while(running){
            for(const s of selectors){
                findAndClickBySelector(s);
                const el=document.querySelector(s+"> div");
                if(el && el.innerText==="Mostrar resumo"){
                    sendToast("🎉 Exercício concluído!",3000);
                    playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                }
            }
            await delay(800);
        }
    })();
}

/* Inject check */
if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)){
    alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href="https://pt.khanacademy.org/";
}

/* Load plugins */
showSplashScreen();
loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js','darkReaderPlugin')
.then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js','toastifyPlugin')
.then(async ()=>{
    sendToast("🪶 Khanware Minimal injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
});    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      return () => { try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch(e){} };
    } catch(e){
      return () => {};
    }
  }

  const playAudio = (url) => { createAudioPlayer(url)(); };

  const findAndClickBySelector = selector => {
    try {
      const el = document.querySelector(selector);
      if (el) { el.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); return true; }
    } catch (e) { _warn('findAndClick error', e); }
    return false;
  };

  // sendToast: tenta usar Toastify; se não tiver, usa console/alert fallback
  function sendToast(text, duration=5000, gravity='bottom') {
    try {
      if (typeof Toastify !== 'undefined') {
        Toastify({ text, duration, gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast();
      } else {
        // fallback não intrusivo
        console.log('[ToastFallback]', text);
      }
    } catch (e) {
      console.log('[ToastFallback]', text);
    }
  }

  /* ---------- Splash Screen ---------- */
  async function showSplashScreen() {
    await whenReady();
    try {
      splashScreen = document.createElement('div');
      splashScreen.id = 'khanwareSplash';
      splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";
      splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>';
      document.documentElement.appendChild(splashScreen);
      // allow paint
      requestAnimationFrame(() => { splashScreen.style.opacity = '1'; });
    } catch (e) { _warn('showSplashScreen failed', e); }
  }

  async function hideSplashScreen() {
    try {
      if (!splashScreen) return;
      splashScreen.style.opacity = '0';
      setTimeout(() => { try { splashScreen.remove(); } catch(e){} }, 600);
    } catch (e) { /* ignore */ }
  }

  /* ---------- Loader seguro para scripts e css ---------- */
  function loadCss(url){
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = (e) => reject(e);
        document.head.appendChild(link);
      } catch (e) { reject(e); }
    });
  }

  function loadScriptTag(url, opts = {}) {
    return new Promise((resolve, reject) => {
      try {
        const s = document.createElement('script');
        if (opts.type) s.type = opts.type;
        s.src = url;
        s.onload = () => { loadedPlugins.push(url); resolve(); };
        s.onerror = (e) => reject(e);
        (document.head || document.documentElement).appendChild(s);
      } catch (e) { reject(e); }
    });
  }

  /* ---------- FetchInterceptor (centraliza intervenções no fetch) ---------- */
  class FetchInterceptor {
    constructor(){
      this.requestHandlers = []; // handlers: async (input, init) => { return {input, init} or null }
      this.responseHandlers = []; // handlers: async (response, input, init) => { return Response or null }
      this._install();
    }
    registerRequest(fn){ this.requestHandlers.push(fn); }
    registerResponse(fn){ this.responseHandlers.push(fn); }
    _install(){
      if (this._installed) return;
      const originalFetch = window.fetch.bind(window);
      const self = this;
      window.fetch = async function(input, init){
        try {
          // Normalize input/init
          let normInput = input;
          let normInit = init || {};

          // If Request object passed, clone it to read body and allow rewriting by handlers
          if (normInput instanceof Request) {
            // create copies
            const tempReq = normInput.clone();
            const bodyText = await (tempReq.text().catch(()=>null));
            normInit = Object.assign({}, normInit, {
              method: tempReq.method,
              headers: tempReq.headers,
              body: bodyText ? bodyText : normInit.body
            });
            normInput = tempReq.url;
          }

          // Run request handlers sequentially
          for (const h of self.requestHandlers) {
            try {
              const out = await h(normInput, normInit) || {};
              if (out.input) normInput = out.input;
              if (out.init) normInit = out.init;
            } catch (e) {
              _warn('request handler error', e);
            }
          }

          // perform actual fetch
          const response = await originalFetch(normInput, normInit);

          // Clone response for handlers
          for (const rh of self.responseHandlers) {
            try {
              const maybe = await rh(response.clone(), normInput, normInit);
              if (maybe instanceof Response) {
                // If handler returned a Response, use it
                return maybe;
              }
            } catch (e) {
              _warn('response handler error', e);
            }
          }

          return response;
        } catch (e) {
          _err('fetch interceptor error', e);
          // fallback to original fetch
          return originalFetch(input, init);
        }
      };
      this._installed = true;
      _log('FetchInterceptor installed');
    }
  }
  const fetchInterceptor = new FetchInterceptor();

  /* ---------- Main modules (registram handlers no interceptor) ---------- */
  function registerQuestionSpoof(){
    const phrases = [ 
      "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
      "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
      "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
      "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
      "🪶 Lite mode @ KhanwareMinimal.js",
    ];

    // response handler: modifica respostas de questões
    fetchInterceptor.registerResponse(async (resp, input, init) => {
      try {
        // tentamos só para respostas com JSON
        const ct = resp.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return null;
        const text = await resp.text();
        let obj;
        try { obj = JSON.parse(text); } catch (e) { return null; }
        if (obj?.data?.assessmentItem?.item?.itemData) {
          let itemData;
          try { itemData = JSON.parse(obj.data.assessmentItem.item.itemData); } catch (e) { return null; }
          // Verifica conteúdo e aplica spoof (mesma lógica original, porém mais defensiva)
          if (Array.isArray(itemData.question?.content) && typeof itemData.question.content[0] === 'string') {
            // regra original: se todo upperCase?
            try {
              const first = itemData.question.content[0];
              if (first && first === first.toUpperCase()) {
                itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
                itemData.question.content = (phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`);
                itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
                obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                const newBody = JSON.stringify(obj);
                sendToast("🔓 Questão exploitada.", 1000);
                // build new response and copy headers/status
                const headers = new Headers(resp.headers);
                return new Response(newBody, { status: resp.status, statusText: resp.statusText, headers });
              }
            } catch (e) { /* ignore */ }
          }
        }
      } catch (e) { _warn('questionSpoof error', e); }
      return null;
    });
    _log('QuestionSpoof registered');
  }

  function registerVideoSpoof(){
    // request handler: intercepta requests que atualizam progresso de vídeo e modifica body
    fetchInterceptor.registerRequest(async (input, init) => {
      try {
        // init.body pode ser objeto/string
        let body = init && init.body ? init.body : null;
        if (!body && typeof input === 'string' && input.includes('graphql')) {
          // nada a fazer
          return null;
        }
        if (body && typeof body === 'string' && body.includes('"operationName":"updateUserVideoProgress"')) {
          try {
            const parsed = JSON.parse(body);
            if (parsed?.variables?.input) {
              const duration = parsed.variables.input.durationSeconds;
              parsed.variables.input.secondsWatched = duration;
              parsed.variables.input.lastSecondWatched = duration;
              const newBody = JSON.stringify(parsed);
              init = Object.assign({}, init, { body: newBody });
              sendToast("🔓 Vídeo exploitado.", 1000);
              return { input, init };
            }
          } catch (e) { _warn('videoSpoof parse error', e); }
        }
      } catch (e) { _warn('videoSpoof error', e); }
      return null;
    });
    _log('VideoSpoof registered');
  }

  function registerMinuteFarm(){
    // request handler: bloqueia "termination_event" em mark_conversions
    fetchInterceptor.registerRequest(async (input, init) => {
      try {
        const urlStr = (typeof input === 'string') ? input : (input && input.url) || '';
        let body = init && init.body ? init.body : null;
        if (body && typeof body !== 'string') {
          try { body = JSON.stringify(body); } catch(e) {}
        }
        if (urlStr.includes('mark_conversions') && body && body.includes('termination_event')) {
          sendToast("🚫 Limitador de tempo bloqueado.", 1000);
          // retorna um fake response by throwing or by short-circuit fetch with a rejected promise
          // melhor: retornar a mesma requisição mas com body modificado para remover termination_event
          const newBody = body.replace(/termination_event/g, ''); // tentativa simples de remoção
          init = Object.assign({}, init, { body: newBody });
          return { input, init };
        }
      } catch (e) { _warn('minuteFarm error', e); }
      return null;
    });
    _log('MinuteFarm registered');
  }

  /* ---------- AutoAnswer: observa DOM e tenta clicar em elementos relevantes ---------- */
  function initAutoAnswer(){
    let running = true;
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    // throttle helper
    function throttle(fn, ms){
      let last = 0;
      return (...args) => {
        const now = Date.now();
        if (now - last > ms) { last = now; fn(...args); }
      };
    }

    const tryClickAll = () => {
      for (const sel of baseSelectors) {
        try {
          findAndClickBySelector(sel);
          const maybe = document.querySelector(sel + '> div');
          if (maybe && maybe.innerText === 'Mostrar resumo') {
            sendToast("🎉 Exercício concluído!", 3000);
            playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav');
          }
        } catch (e) {}
      }
    };

    // observe DOM changes and try clicking (throttled)
    const observer = new MutationObserver(throttle(() => {
      if (!running) return;
      tryClickAll();
    }, 700));

    const attach = () => {
      try {
        observer.observe(document.body, { childList: true, subtree: true });
      } catch (e) { _warn('AutoAnswer observer attach fail', e); }
    };

    if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach, { once: true });

    // também tenta periodicamente (fallback)
    const intervalId = setInterval(() => { if (!running) { clearInterval(intervalId); return; } tryClickAll(); }, 1200);

    _log('AutoAnswer initialized');
    return { stop: () => { running = false; try { observer.disconnect(); } catch(e){} clearInterval(intervalId); } };
  }

  /* ---------- Inicialização principal (carrega libs e ativa módulos) ---------- */
  async function setupMain() {
    try {
      await applyMiscStyles();
      await showSplashScreen();

      // Carregar CSS/JS externos de forma segura
      try {
        await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
      } catch (e) { _warn('Falha ao carregar Toastify CSS', e); }

      try {
        await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js'); // adiciona Toastify globalmente
      } catch (e) { _warn('Falha ao carregar Toastify', e); }

      try {
        await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');
        if (typeof DarkReader !== 'undefined' && DarkReader.setFetchMethod) {
          try { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); } catch (e) { _warn('DarkReader init fail', e); }
        }
      } catch (e) { _warn('Falha ao carregar DarkReader', e); }

      // Registra módulos no interceptor
      registerQuestionSpoof();
      registerVideoSpoof();
      registerMinuteFarm();

      // Inicia AutoAnswer
      const auto = initAutoAnswer();

      // Mensagens e som de sucesso
      sendToast("🪶 Khanware Minimal injetado com sucesso!", 3000);
      playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

      // Esconde splashScreen depois de curto período
      await delay(700);
      hideSplashScreen();

      _log('Setup completo');
    } catch (e) {
      _err('setupMain error', e);
      hideSplashScreen();
    }
  }

  /* ---------- Validação do domínio e injeção ---------- */
  (async () => {
    const urlOk = /^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href);
    if (!urlOk) {
      alert("❌ Khanware Failed to Inject!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
      try { window.location.href = "https://pt.khanacademy.org/"; } catch(e){}
      return;
    }

    // start
    try {
      await setupMain();
    } catch (e) {
      _err('injection failed', e);
    }
  })();

})();            "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
            "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
            "🪶 Lite mode @ KhanwareEnhanced.js",
        ];
        this.hookFetch();
    }
    hookFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
            const response = await originalFetch.apply(this, arguments);
            try {
                const cloned = response.clone();
                const body = await cloned.text();
                let obj = JSON.parse(body);
                if(obj?.data?.assessmentItem?.item?.itemData){
                    let itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    itemData.answerArea = { calculator:false, chi2Table:false, periodicTable:false, tTable:false, zTable:false };
                    itemData.question.content[0] = this.phrases[Math.floor(Math.random()*this.phrases.length)] + `[[☃ radio 1]]`;
                    itemData.question.widgets = { "radio 1": { type:"radio", options:{ choices:[ { content:"Resposta correta.", correct:true }, { content:"Resposta incorreta.", correct:false } ] } } };
                    obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    sendToast("🔓 Questão exploitada.", 1000);
                    return new Response(JSON.stringify(obj), { status: response.status, statusText: response.statusText, headers: response.headers });
                }
            } catch(e){}
            return response;
        };
    }
}

class VideoSpoof {
    constructor() { this.hookFetch(); }
    hookFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
            let body;
            if(input instanceof Request) body = await input.clone().text();
            else if(init && init.body) body = init.body;
            if(body && body.includes('"operationName":"updateUserVideoProgress"')){
                try{
                    const b = JSON.parse(body);
                    if(b.variables?.input){
                        const duration = b.variables.input.durationSeconds;
                        b.variables.input.secondsWatched = duration;
                        b.variables.input.lastSecondWatched = duration;
                        if(input instanceof Request) input = new Request(input, { body: JSON.stringify(b) });
                        else init.body = JSON.stringify(b);
                        sendToast("🔓 Vídeo exploitado.",1000);
                    }
                }catch(e){ console.error(e); }
            }
            return originalFetch.apply(this, arguments);
        };
    }
}

/* ----------------------------- AutoAnswer ----------------------------- */
class AutoAnswer {
    constructor(){
        this.baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`,
            `[data-testid="exercise-next-question"]`,
            `._1udzurba`,
            `._awve9b`
        ];
        this.active = true;
        this.start();
    }
    async start(){
        while(this.active){
            for(const sel of this.baseSelectors) findAndClick(sel);
            await delay(800);
        }
    }
}

/* ----------------------------- Main ----------------------------- */
async function main(){
    // Splash
    const splash = new SplashScreen();

    // Load plugins
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify');

    sendToast("🪶 Khanware Enhanced injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    splash.hide();

    // Initialize modules
    new QuestionSpoof();
    new VideoSpoof();
    new AutoAnswer();
}

if(/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)){
    main();
}else{
    alert("❌ Khanware Failed! Acesse: https://pt.khanacademy.org/");
    window.location.href = "https://pt.khanacademy.org/";
};
          sendToast('🔓 Questão exploitada.', 1000);
          return { responseText: JSON.stringify(obj) };
        }
      }
    }catch(e){ console.warn(DISPLAY_NAME,'questionSpoof',e); }
    return null;
  }
});

// The actual fetch wrapper
window.fetch = async function(input, init){
  try{
    const bodyText = await readRequestBody(input, init);

    // run request handlers
    for(const h of handlers){
      if (h.onRequest) {
        try{
          const res = await h.onRequest({ input, init, bodyText });
          if (!res) continue;
          if (res.shortCircuitResponse) return res.shortCircuitResponse;
          if (res.input) input = res.input;
          if (res.init) init = res.init;
        }catch(e){}
      }
    }

    const origResponse = await originalFetch(input, init);
    const responseText = await readResponseText(origResponse);

    // run response handlers in order, allow first to modify text
    let modifiedText = responseText;
    for(const h of handlers){
      if (h.onResponse) {
        try{
          const rres = await h.onResponse({ response: origResponse, responseText: modifiedText });
          if (!rres) continue;
          if (typeof rres.responseText === 'string') modifiedText = rres.responseText;
          if (rres.shortCircuitResponse) return rres.shortCircuitResponse;
        }catch(e){}
      }
    }

    if (modifiedText !== responseText && typeof modifiedText === 'string'){
      return new Response(modifiedText, { status: origResponse.status, statusText: origResponse.statusText, headers: origResponse.headers });
    }

    return origResponse;
  } catch(e){
    return originalFetch(input, init);
  }
};

})();

/* ---------- Auto-answer / Auto-click loop ---------- */ let autoRunning = true; (function startAutoActions(){ const baseSelectors = [ '[data-testid="choice-icon__library-choice-icon"]', '[data-testid="exercise-check-answer"]', '[data-testid="exercise-next-question"]', '._1udzurba', '._awve9b' ];

(async function loop(){
  while (autoRunning){
    for (const s of baseSelectors) {
      try{ findAndClick(s); }catch(e){}
    }
    // If summary button found, play success audio
    const summary = document.querySelector('[data-testid="exercise-summary"]') || document.querySelector('button[aria-label*="Mostrar resumo"]');
    if (summary && summary.innerText && /resumo|summary/i.test(summary.innerText)){
      sendToast('🎉 Exercício concluído!', 3000);
      playAudio(AUDIO_SUCCESS);
    }
    await delay(800);
  }
})();

// expose toggle
window.HakaiWare = window.HakaiWare || {};
window.HakaiWare.toggleAuto = () => { autoRunning = !autoRunning; sendToast('Auto actions: ' + (autoRunning ? 'ON' : 'OFF'), 1500); };

})();

/* ---------- Initialization flow ---------- */ (async function init(){ if (!/^https?://(?:[a-z0-9-]+.)?khanacademy.org/.test(window.location.href)){ alert('❌ ' + DISPLAY_NAME + ' — execute este script apenas em https://pt.khanacademy.org/'); window.location.href = 'https://pt.khanacademy.org/'; return; }

await showSplash();
await loadExternal();
await delay(400);
await hideSplash();
console.clear();
console.info(DISPLAY_NAME + ' ativo — use window.HakaiWare.toggleAuto() para ligar/desligar o auto-loop');

})();

})();

dy : '');
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

/* Fim do script */    hideSplashScreen();
    setupMain();
    console.clear();
  });
/* safe icon/font */
function safeSetIcon(href){
  try {
    let icon = document.querySelector("link[rel~='icon']");
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = href;
  } catch(e){ /* ignore */ }
}
try {
  const styleFont = document.createElement('style');
  styleFont.innerHTML = "@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');}";
  document.head.appendChild(styleFont);
} catch(e){}
try {
  const styleScroll = document.createElement('style');
  styleScroll.innerHTML = "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }";
  document.head.appendChild(styleScroll);
} catch(e){}
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Splash */
async function showSplashScreen(){
  try {
    splashScreen.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;font-family:MuseoSans,system-ui;font-size:30px;z-index:999999;opacity:0;transition:opacity .3s;";
    splashScreen.innerHTML = '<div><span style="color:white;">HAKAI</span><span style="color:#72ff72;">.WARE</span></div>';
    document.body.appendChild(splashScreen); await delay(30); splashScreen.style.opacity = '1';
  } catch(e){ console.warn('[HakaiWare] splash show failed', e); }
}
async function hideSplashScreen(){ try { splashScreen.style.opacity='0'; await delay(300); if (splashScreen.parentElement) splashScreen.remove(); } catch(e){} }

/* Fetch wrapper único e extensível */
(function installFetchWrapper(){
  if (window.__hakaiware_fetch_installed) return;
  window.__hakaiware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];
  const responseProcessors = [];

  window.__hakaiware_fetch_registerRequestProcessor = fn => { if (typeof fn === 'function') requestProcessors.push(fn); };
  window.__hakaiware_fetch_registerResponseProcessor = fn => { if (typeof fn === 'function') responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length >= 1) { input = out[0]; init = out[1] || init; }
        } catch(e){ console.error('[HakaiWare] requestProcessor error', e); }
      }

      const resp = await originalFetch(input, init);
      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) return maybe;
        } catch(e){ console.error('[HakaiWare] responseProcessor error', e); }
      }
      return resp;
    } catch(e){
      console.error('[HakaiWare] fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  window.__hakaiware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* Register processors */

/* QuestionSpoof (response processor) */
(function registerQuestionSpoof(){
  const phrases = [
    "🔥 Get good, get [HakaiWare](https://github.com/)!",
    "🤍 Made by [HakaiWare].",
    "☄️ By [HakaiWare].",
    "🌟 Star the project on [GitHub]!"
  ];

  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return null;
      const text = await response.clone().text();
      let obj; try { obj = JSON.parse(text); } catch(e) { return null; }
      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          const first = itemData?.question?.content?.[0];
          if (typeof first === 'string' && first === first.toUpperCase()) {
            itemData.answerArea = { calculator:false, chi2Table:false, periodicTable:false, tTable:false, zTable:false };
            itemData.question.content = phrases[Math.floor(Math.random()*phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } };
            obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            return new Response(JSON.stringify(obj), { status: response.status, statusText: response.statusText, headers: response.headers });
          }
        } catch(e){ /* parse fail */ }
      }
    } catch(e){ console.error('[HakaiWare] QuestionSpoof', e); }
    return null;
  });
})();

/* VideoSpoof (request processor) */
(function registerVideoSpoof(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const bodyText = input instanceof Request ? await input.clone().text() : (init && init.body ? init.body : '');
      if (bodyText && bodyText.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(bodyText);
          if (bodyObj.variables?.input?.durationSeconds) {
            const d = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = d;
            bodyObj.variables.input.lastSecondWatched = d;
            const newBody = JSON.stringify(bodyObj);
            if (input instanceof Request) input = new Request(input, { body: newBody, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer });
            else init = Object.assign({}, init, { body: newBody });
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch(e){ console.warn('[HakaiWare] videoSpoof parse fail', e); }
      }
    } catch(e){ console.error('[HakaiWare] videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm (request + response processors) */
(function registerMinuteFarm(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = input && input.url ? input.url : (typeof input === 'string' ? input : '');
      const body = input instanceof Request ? await input.clone().text() : (init && init.body ? init.body : '');
      if (body && url.includes("mark_conversions") && body.includes("termination_event")) {
        sendToast("🚫 Limitador de tempo bloqueado.", 1000);
        init = Object.assign({}, init, { __hakaiware_blocked_mark_conversions: true });
      }
    } catch(e){ console.error('[HakaiWare] minuteFarm req error', e); }
    return [input, init];
  });

  window.__hakaiware_fetch_registerResponseProcessor(async (response, input, init) => {
    try {
      if (init && init.__hakaiware_blocked_mark_conversions) {
        return new Response('', { status: 204, statusText: 'No Content' });
      }
    } catch(e){ console.error('[HakaiWare] minuteFarm res error', e); }
    return null;
  });
})();

/* AutoAnswer loop (delay 785ms) */
function setupMain(){
  (function autoAnswer(){
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    let active = true;
    (async () => {
      while (active) {
        try {
          for (const s of baseSelectors) {
            await findAndClickBySelector(s, { retries: 2, retryDelay: 120 });
            const el = document.querySelector(s + '> div');
            if (el && el.innerText === 'Mostrar resumo') {
              sendToast("🎉 Exercício concluído!", 2500);
              playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav');
            }
          }
        } catch(e){ console.error('[HakaiWare] autoAnswer loop error', e); }
        await delay(785);
      }
    })();
  })();
}

/* Boot sequence */
(async () => {
  try {
    await showSplashScreen();
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css').catch(()=>{});
    await loadScriptTag('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').catch(()=>{});
    try { if (window.DarkReader?.setFetchMethod) window.DarkReader.setFetchMethod(window.fetch); } catch(e){}
    await loadScriptTag('https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js', 'toastifyPlugin').catch(()=>{});
    sendToast('🪶 HakaiWare injetado com sucesso!', 2500);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
  } catch(e){
    console.error('[HakaiWare] boot error', e);
    hideSplashScreen();
    sendToast('❌ Erro ao iniciar HakaiWare: veja console.', 5000);
  }
})(););
}

async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) {
  return fetch(url)
    .then(response => response.text())
    .then(script => {
      loadedPlugins.push(label);
      eval(script);
    });
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

function setupMain() {
  // QuestionSpoof
  (function () {
    const phrases = [
      "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!",
      "🤍 Made by [@im.nix](https://e-z.bio/sounix).",
      "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).",
      "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!",
      "🪶 Lite mode @ KhanwareMinimal.js",
    ];

    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
      let body;
      if (input instanceof Request) body = await input.clone().text();
      else if (init && init.body) body = init.body;

      const originalResponse = await originalFetch.apply(this, arguments);
      const clonedResponse = originalResponse.clone();

      try {
        const responseBody = await clonedResponse.text();
        let responseObj = JSON.parse(responseBody);
        if (responseObj?.data?.assessmentItem?.item?.itemData) {
          let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
          if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
            itemData.answerArea = {
              "calculator": false,
              "chi2Table": false,
              "periodicTable": false,
              "tTable": false,
              "zTable": false
            };
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
            itemData.question.widgets = {
              "radio 1": {
                type: "radio",
                options: {
                  choices: [
                    { content: "Resposta correta.", correct: true },
                    { content: "Resposta incorreta.", correct: false }
                  ]
                }
              }
            };
            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("🔓 Questão exploitada.", 1000);
            return new Response(JSON.stringify(responseObj), {
              status: originalResponse.status,
              statusText: originalResponse.statusText,
              headers: originalResponse.headers
            });
          }
        }
      } catch (e) { }
      return originalResponse;
    };
  })();

  // VideoSpoof
  (function () {
    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
      let body;
      if (input instanceof Request) body = await input.clone().text();
      else if (init.body) body = init.body;
      if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          let bodyObj = JSON.parse(body);
          if (bodyObj.variables && bodyObj.variables.input) {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            body = JSON.stringify(bodyObj);
            if (input instanceof Request) {
              input = new Request(input, { body: body });
            } else init.body = body;
            sendToast("🔓 Vídeo exploitado.", 1000);
          }
        } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
      }
      return originalFetch.apply(this, arguments);
    };
  })();

  // MinuteFarm
  (function () {
    const originalFetch = window.fetch;

    window.fetch = async function (input, init = {}) {
      let body;
      if (input instanceof Request) body = await input.clone().text();
      else if (init.body) body = init.body;
      if (body && input.url.includes("mark_conversions")) {
        try {
          if (body.includes("termination_event")) {
            sendToast("🚫 Limitador de tempo bloqueado.", 1000);
            return;
          }
        } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
      }
      return originalFetch.apply(this, arguments);
    };
  })();

  // AutoAnswer
  (function () {
    const baseSelectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    khanwareDominates = true;

    (async () => {
      while (khanwareDominates) {
        const selectorsToCheck = [...baseSelectors];

        for (const q of selectorsToCheck) {
          findAndClickBySelector(q);
          if (document.querySelector(q + "> div") && document.querySelector(q + "> div").innerText === "Mostrar resumo") {
            sendToast("🎉 Exercício concluído!", 3000);
            playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
          }
        }
        await delay(785);
      }
    })();
  })();
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
  window.location.href = "https://pt.khanacademy.org/";
}

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/d0    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                        sendToast("🔓 Vídeo exploitado.", 1000)
                    }
                } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];
        
        khanwareDominates = true;
        
        (async () => { 
            while (khanwareDominates) {
                const selectorsToCheck = [...baseSelectors];
    
                for (const q of selectorsToCheck) {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div") && document.querySelector(q+"> div").innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(785);
            }
        })();
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; }

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 HaKaiWhare injetado com sucesso!");
    
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(500);

    hideSplashScreen();
    setupMain();
    
    console.clear();
});        ];
        const originalFetch = window.fetch;
        window.fetch = async function(input, init){
            const response = await originalFetch.apply(this,arguments);
            try{
                const clone = response.clone();
                const text = await clone.text();
                const obj = JSON.parse(text);
                if(obj?.data?.assessmentItem?.item?.itemData){
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    if(itemData.question.content[0]===itemData.question.content[0].toUpperCase()){
                        itemData.answerArea={calculator:false,chi2Table:false,periodicTable:false,tTable:false,zTable:false};
                        itemData.question.content=phrases[Math.floor(Math.random()*phrases.length)]+'[[☃ radio 1]]';
                        itemData.question.widgets={"radio 1":{type:"radio",options:{choices:[{content:"Resposta correta.",correct:true},{content:"Resposta incorreta.",correct:false}]}}};
                        obj.data.assessmentItem.item.itemData=JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada!",1000);
                        return new Response(JSON.stringify(obj),{status:response.status,statusText:response.statusText,headers:response.headers});
                    }
                }
            }catch(e){}
            return response;
        };
    })();

    /* VideoSpoof */
    (function(){
        const originalFetch = window.fetch;
        window.fetch = async function(input, init){
            let body;
            if(input instanceof Request) body=await input.clone().text();
            else if(init&&init.body) body=init.body;
            if(body && body.includes('"operationName":"updateUserVideoProgress"')){
                try{
                    let obj = JSON.parse(body);
                    if(obj.variables?.input){
                        const sec=obj.variables.input.durationSeconds;
                        obj.variables.input.secondsWatched=sec;
                        obj.variables.input.lastSecondWatched=sec;
                        body=JSON.stringify(obj);
                        if(input instanceof Request) input=new Request(input,{body:body}); else init.body=body;
                        sendToast("🔓 Vídeo exploitado!",1000);
                    }
                }catch(e){}
            }
            return originalFetch.apply(this,arguments);
        };
    })();

    /* MinuteFarm */
    (function(){
        const originalFetch = window.fetch;
        window.fetch = async function(input, init={}) {
            let body;
            if(input instanceof Request) body=await input.clone().text();
            else if(init.body) body=init.body;
            if(body && input.url?.includes("mark_conversions")){
                if(body.includes("termination_event")){ sendToast("🚫 Limitador de tempo bloqueado",1000); return; }
            }
            return originalFetch.apply(this,arguments);
        };
    })();

    /* AutoAnswer */
    (function(){
        const selectors=[`[data-testid="choice-icon__library-choice-icon"]`,`[data-testid="exercise-check-answer"]`,`[data-testid="exercise-next-question"]`,`._1udzurba`,`._awve9b`];
        let active=true;
        (async()=>{
            while(active){
                for(const s of selectors){
                    findAndClickBySelector(s);
                    const el=document.querySelector(s+"> div");
                    if(el && el.innerText==="Mostrar resumo"){
                        sendToast("🎉 Exercício concluído!",3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(785);
            }
        })();
    })();
}

/* Verificação de URL */
if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)){
    alert("❌ HakaiWare Failed!\nExecute no site do Khan Academy.");
    location.href="https://pt.khanacademy.org/";
}

/* Boot */
(async()=>{
    await showSplash();
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js','darkReader');
    if(window.DarkReader?.setFetchMethod) DarkReader.setFetchMethod(window.fetch);
    if(window.DarkReader?.enable) DarkReader.enable();
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js','toastify');
    sendToast("🪶 HakaiWare injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplash();
    setupMain();
    console.clear();
})();                }
            } catch (e) { }
            return response;
        };
    })();

    /* Video Spoof */
    (function () {
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
            let body; if (input instanceof Request) body = await input.clone().text(); else if (init?.body) body = init.body;
            if (body?.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let obj = JSON.parse(body);
                    if (obj.variables?.input) {
                        const dur = obj.variables.input.durationSeconds;
                        obj.variables.input.secondsWatched = dur;
                        obj.variables.input.lastSecondWatched = dur;
                        body = JSON.stringify(obj);
                        if (input instanceof Request) input = new Request(input, { body }); else init.body = body;
                        sendToast("🔓 Vídeo exploitado.", 1000);
                    }
                } catch(e) { console.debug(e) }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* Minute Farm */
    (function () {
        const originalFetch = window.fetch;
        window.fetch = async (input, init={}) => {
            let body; if (input instanceof Request) body = await input.clone().text(); else if (init?.body) body = init.body;
            if (body?.includes("mark_conversions") && body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* Auto Answer */
    (function () {
        const selectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`,
            `[data-testid="exercise-next-question"]`,
            `._1udzurba`,
            `._awve9b`
        ];
        let hakaiDominates = true;
        (async () => {
            while(hakaiDominates) {
                selectors.forEach(q => {
                    findAndClickBySelector(q);
                    if (document.querySelector(q+"> div")?.innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                });
                await delay(785);
            }
        })();
    })();
}

/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("❌ HakaiWare Failed to Inject!\nVocê precisa executar no site do Khan Academy!"); 
    window.location.href = "https://pt.khanacademy.org/"; 
}

showSplashScreen();
loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js','darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js').then(async () => {
    sendToast("🪶 HakaiWare injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
});        const phrases = [ 
            "🔥 Get good, get [HakaiWare](https://github.com/)!", 
            "🤍 Made by [HakaiWare].", 
            "☄️ By [HakaiWare].", 
            "🌟 Star the project on [GitHub]!"
        ];

        window.fetch = async function (input, init = {}) {
            let body;
            try { if (input instanceof Request) body = await input.clone().text(); else if (init.body) body = init.body; } catch(e){}

            // MinuteFarm: bloqueia mark_conversions
            try {
                const urlStr = (input && input.url) ? input.url : (typeof input==='string' ? input : '');
                if (body && urlStr.includes("mark_conversions") && body.includes("termination_event")) { 
                    sendToast("🚫 Limitador de tempo bloqueado.", 1000); 
                    return new Response(null, { status: 204, statusText: 'No Content' });
                }
            } catch(e){}

            // VideoSpoof
            try {
                if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables?.input) {
                        const d = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = d;
                        bodyObj.variables.input.lastSecondWatched = d;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body, method: input.method, headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer }); }
                        else init.body = body;
                        sendToast("🔓 Vídeo exploitado.", 1000);
                    }
                }
            } catch(e){}

            // Executa fetch original
            const originalResponse = await originalFetch(input, init);

            // QuestionSpoof
            try {
                const clonedResponse = originalResponse.clone();
                const responseBody = await clonedResponse.text();
                let obj;
                try { obj = JSON.parse(responseBody); } catch(e){ return originalResponse; }
                if (obj?.data?.assessmentItem?.item?.itemData) {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    const firstContent = itemData?.question?.content?.[0];
                    if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
                        itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false };
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type: "radio", options: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } };
                        obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("🔓 Questão exploitada.", 1000);
                        return new Response(JSON.stringify(obj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                    }
                }
            } catch(e){}

            return originalResponse;
        };
    })();

    /* AutoAnswer */
    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`,
            `._awve9b`
        ];
        
        let hakaiDominates = true;
        (async () => { 
            while (hakaiDominates) {
                for (const q of baseSelectors) {
                    findAndClickBySelector(q);
                    const el = document.querySelector(q+"> div");
                    if (el && el.innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
                await delay(785); // ajustado para 785ms
            }
        })();
    })();
}

/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("❌ HakaiWare Failed to Inject!\n\nVocê precisa executar o HakaiWare no site do Khan Academy! (https://pt.khanacademy.org/)"); 
    window.location.href = "https://pt.khanacademy.org/"; 
}

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
.then(()=>{ try{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); }catch(e){} });

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("🪶 HakaiWare injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
});
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
    "🔥 Get good, get [Khanware](https://github.com/Hakai0fc)!",
    "🤍 Made by [HakaiDevs.",
    "☄️ By [Hakai0fc](https://github.com/Hakai0fc).",
    "🌟 Star the project on [GitHub](https://github.com/Hakai0fc)!",
    "🪶 Lite mode @ HakaiWare.js",
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
