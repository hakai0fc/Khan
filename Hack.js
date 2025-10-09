/* ===========================
   Khan/Hakai - Funcional Script
   =========================== */

/* Globals */
const loadedPlugins = [];
const splashScreen = document.createElement('div'); // usar div (tag válida)

/* head styles (font + scrollbar) */
document.head.appendChild(Object.assign(document.createElement("style"), {
  innerHTML: "@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');}"
}));
document.head.appendChild(Object.assign(document.createElement('style'), {
  innerHTML: "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"
}));

/* safe favicon setter */
function safeSetIcon(href) {
  try {
    const icon = document.querySelector("link[rel~='icon']") || document.createElement('link');
    icon.rel = 'icon';
    icon.href = href;
    if (!icon.parentElement) document.head.appendChild(icon);
  } catch (e) { console.warn('icone not set', e); }
}
safeSetIcon('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png');

/* Simple EventEmitter */
class EventEmitter {
  constructor(){ this.events = {}; }
  on(name, fn){ if (typeof name === 'string') name = [name]; name.forEach(n => { (this.events[n] = this.events[n] || []).push(fn); }); }
  off(name, fn){ if (typeof name === 'string') name = [name]; name.forEach(n => { if (this.events[n]) this.events[n] = this.events[n].filter(x => x !== fn); }); }
  emit(name, ...args){ (this.events[name] || []).forEach(fn => { try { fn(...args); } catch(e){console.error(e);} }); }
  once(name, fn){ const wrapper = (...a) => { fn(...a); this.off(name, wrapper); }; this.on(name, wrapper); }
}
const plppdo = new EventEmitter();

/* observe DOM changes */
new MutationObserver((mutationsList) => {
  for (const m of mutationsList) if (m.type === 'childList') plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

/* utilities */
const delay = ms => new Promise(r => setTimeout(r, ms));
const playAudio = url => { try { const a = new Audio(url); a.play().catch(()=>{}); } catch(e){}; };
const findAndClickBySelector = selector => {
  const el = document.querySelector(selector);
  if (el) {
    el.click();
    sendToast(`⭕ Pressionando ${selector}...`, 1000);
  }
};

/* loaders (script/css) */
function loadCss(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = (e) => reject(new Error('Falha ao carregar CSS: ' + url));
    document.head.appendChild(link);
  });
}
function loadScript(url, label) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.async = false;
    s.onload = () => { if (label) loadedPlugins.push(label); resolve(); };
    s.onerror = (err) => reject(new Error('Falha ao carregar ' + url + ' - ' + err));
    document.head.appendChild(s);
  });
}

/* toast helper — depende de Toastify (carregar antes de usar) */
function sendToast(text, duration = 5000, gravity = 'bottom') {
  try {
    if (typeof Toastify !== 'function') {
      console.warn('Toastify não carregado ainda.');
      return;
    }
    Toastify({ text, duration, gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast();
  } catch(e){ console.error(e); }
}

/* Splash screen */
async function showSplashScreen() {
  try {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity .3s ease;user-select:none;color:white;font-family:MuseoSans,system-ui,sans-serif;font-size:28px;text-align:center;";
    splashScreen.innerHTML = '<div><span style="color:white;">HAKAIWARE</span><span style="color:#72ff72;margin-left:6px">.SPACE</span></div>';
    document.body.appendChild(splashScreen);
    await delay(20);
    splashScreen.style.opacity = '1';
  } catch(e){ console.error(e); }
}
async function hideSplashScreen() {
  try {
    splashScreen.style.opacity = '0';
    await delay(350);
    if (splashScreen.parentElement) splashScreen.remove();
  } catch(e){}
}

/* =============
   Single fetch wrapper (extensível)
   ============= */
(function installFetchWrapper(){
  if (window.__hakaiware_fetch_installed) return;
  window.__hakaiware_fetch_installed = true;

  const originalFetch = window.fetch.bind(window);
  const requestProcessors = [];  // (input, init) => Promise<[input, init]> | [input, init]
  const responseProcessors = []; // (response, input, init) => Promise<Response|null>

  window.__hakaiware_fetch_registerRequestProcessor = fn => { requestProcessors.push(fn); };
  window.__hakaiware_fetch_registerResponseProcessor = fn => { responseProcessors.push(fn); };

  window.fetch = async function(input, init){
    try {
      for (const p of requestProcessors){
        try {
          const out = await p(input, init || {});
          if (out && Array.isArray(out) && out.length>=1) {
            input = out[0]; init = out[1] || init;
          }
        } catch(e){ console.error('requestProcessor error', e); }
      }

      const resp = await originalFetch(input, init);

      for (const p of responseProcessors){
        try {
          const maybe = await p(resp, input, init);
          if (maybe instanceof Response) return maybe;
        } catch(e){ console.error('responseProcessor error', e); }
      }

      return resp;
    } catch(e){
      console.error('fetch wrapper error', e);
      return originalFetch(input, init);
    }
  };

  window.__hakaiware_fetch_debug = { requestProcessors, responseProcessors };
})();

/* =====================
   Register processors
   ===================== */

/* QuestionSpoof — altera respostas JSON específicas */
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
      const text = await response.clone().text();
      let obj;
      try { obj = JSON.parse(text); } catch(e){ return null; }

      if (obj?.data?.assessmentItem?.item?.itemData) {
        try {
          const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
          const firstContent = itemData?.question?.content?.[0];
          if (typeof firstContent === 'string' && firstContent === firstContent.toUpperCase()) {
            itemData.answerArea = { calculator:false, chi2Table:false, periodicTable:false, tTable:false, zTable:false };
            itemData.question.content = phrases[Math.floor(Math.random()*phrases.length)] + `[[☃ radio 1]]`;
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
        } catch(e){ /* parse falhou -> ignore */ }
      }
    } catch(e){ console.error('QuestionSpoof error', e); }
    return null;
  });
})();

/* VideoSpoof — marca vídeos como concluídos via request body */
(function registerVideoSpoof(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
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
        } catch (e) { console.warn(`videoSpoof parse error: ${e}`); }
      }
    } catch(e){ console.error('videoSpoof error', e); }
    return [input, init];
  });
})();

/* MinuteFarm — bloqueia limitadores via mark_conversions */
(function registerMinuteFarm(){
  window.__hakaiware_fetch_registerRequestProcessor(async (input, init) => {
    try {
      const url = (input && input.url) ? input.url : (typeof input === 'string' ? input : '');
      const bodyText = (input instanceof Request) ? await input.clone().text() : (init && init.body ? init.body : null);
      if (bodyText && url.includes("mark_conversions")) {
        try {
          if (bodyText.includes("termination_event")) {
            sendToast("🚫 Limitador de tempo bloqueado.", 1000);
            // Option: block the request by returning a harmless Request/empty body.
            return [input, Object.assign({}, init, { body: "{}" })];
          }
        } catch (e) { console.warn('MinuteFarm parse error', e); }
      }
    } catch(e){ console.error(e); }
    return [input, init];
  });
})();

/* AutoAnswer (UI clicks automation) */
function setupMain() {
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
        const node = document.querySelector(q + "> div");
        if (node && node.innerText === "Mostrar resumo") {
          sendToast("🎉 Exercício concluído!", 3000);
          playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
        }
      }
      await delay(795);
    }
  })();

  // Expor toggle global se quiser parar futuramente:
  window.Khanware = window.Khanware || {};
  window.Khanware.stop = () => { khanwareDominates = false; sendToast("Khanware pausado."); };
}

/* ================
   Injection & boot
   ================ */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ HaKaiWare Failed to Injected!\n\nVocê precisa executar o HaKaiWare no site do Khan Academy! (https://pt.khanacademy.org/)");
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async () => {
    try {
      await showSplashScreen();

      // carregar recursos necessários
      await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').catch(()=>{console.warn('DarkReader failed');});
      if (typeof DarkReader === 'object') { try { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); } catch(e){console.warn(e);} }

      await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
      await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin'); // Toastify UMD

      sendToast("🪶 HaKaiWare injetado com sucesso!", 2500);
      playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
      await delay(500);
      hideSplashScreen();
      setupMain();
      console.clear();
    } catch (e) {
      console.error('Boot error', e);
      hideSplashScreen();
    }
  })();
    }
