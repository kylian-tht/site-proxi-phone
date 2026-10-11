// Vérification complète du site (Chrome/Edge headless) — usage : node verify.js
// Contrôle sur 5 pages x 3 largeurs mobiles : images cassées, erreurs JS, débordement horizontal,
// ouverture du menu burger par un vrai clic sur l'icône, statut d'ouverture dynamique.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ROOT = path.resolve(__dirname, '../../../..');
const PAGES = ['index', 'services', 'accessoires', 'devis', 'contact'];
const WIDTHS = [375, 360, 320];
const PORT = 9450;
const BROWSER = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find(p => fs.existsSync(p));

(async () => {
  if (!BROWSER) return console.log('Aucun Chrome/Edge trouvé');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'proxi-verify-'));
  const proc = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${PORT}`, '--user-data-dir=' + profile]);
  let wsUrl;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const d = await new Promise((res, rej) => http.get(`http://127.0.0.1:${PORT}/json/version`, r => { let b = ''; r.on('data', c => b += c); r.on('end', () => res(b)); }).on('error', rej));
      wsUrl = JSON.parse(d).webSocketDebuggerUrl;
    } catch (e) {}
  }
  if (!wsUrl) { proc.kill(); return console.log('Navigateur injoignable'); }
  const br = new WebSocket(wsUrl); await new Promise(r => br.onopen = r);
  let id = 1;
  const call = (ws, method, params = {}) => new Promise(res => {
    const my = id++;
    const h = m => { const d = JSON.parse(m.data); if (d.id === my) { ws.removeEventListener('message', h); res(d.result); } };
    ws.addEventListener('message', h); ws.send(JSON.stringify({ id: my, method, params }));
  });
  const { targetId } = await call(br, 'Target.createTarget', { url: 'about:blank' });
  const pg = new WebSocket(`ws://127.0.0.1:${PORT}/devtools/page/${targetId}`); await new Promise(r => pg.onopen = r);
  const errors = [];
  pg.addEventListener('message', m => {
    const d = JSON.parse(m.data);
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  });
  await call(pg, 'Runtime.enable'); await call(pg, 'Page.enable');
  const ev = async (expr) => (await call(pg, 'Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let problems = 0;
  for (const w of WIDTHS) {
    await call(pg, 'Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 2, mobile: true });
    for (const f of PAGES) {
      errors.length = 0;
      await call(pg, 'Page.navigate', { url: 'file:///' + path.join(ROOT, f + '.html').replace(/\\/g, '/') });
      await sleep(700);
      // charge les images lazy puis revient en haut (scroll instantané)
      await ev(`(async()=>{document.documentElement.style.scrollBehavior='auto';const step=innerHeight*0.8;for(let y=0;y<=document.body.scrollHeight;y+=step){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}
        for(let i=0;i<30&&[...document.images].some(im=>!im.complete);i++)await new Promise(r=>setTimeout(r,200));
        window.scrollTo(0,0);})()`);
      await sleep(300);
      const info = await ev(`(() => {
        const broken=[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src'));
        const b=document.querySelector('.menu-toggle').getBoundingClientRect();
        return {broken, scrollW:document.documentElement.scrollWidth, x:b.x+b.width/2, y:b.y+b.height/2,
          status:(document.querySelector('.status-badge')||{}).textContent||''};
      })()`);
      for (const t of ['mousePressed', 'mouseReleased']) await call(pg, 'Input.dispatchMouseEvent', { type: t, x: info.x, y: info.y, button: 'left', clickCount: 1 });
      await sleep(300);
      const menuOpen = await ev(`document.querySelector('.nav-links').classList.contains('active')`);
      const ok = !info.broken.length && info.scrollW <= w && menuOpen && !errors.length && info.status && !/Calcul/.test(info.status);
      if (!ok) problems++;
      console.log(`${ok ? 'OK ' : 'KO '} ${w}px ${f}.html`, ok ? '' : JSON.stringify({ broken: info.broken, scrollW: info.scrollW, menuOpen, status: info.status, errors: [...errors] }));
    }
  }
  console.log(problems ? `\n${problems} problème(s)` : '\nTout est OK');
  br.close(); proc.kill();
  setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} process.exit(problems ? 1 : 0); }, 800);
})();
