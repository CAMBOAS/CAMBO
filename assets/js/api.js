/**
 * HELEN LOAN — Central API helper
 * All requests go through /api/proxy (server.js locally, Vercel in production)
 * to avoid browser CORS block on direct fetch to Google Apps Script.
 */

(function () {
  'use strict';

  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbyEP1G_kQ29Vbt2Z-8YLW_KipwdWWITJHolkYy9lD8o4I8hXjhrXwcLhi7FAvm7jS-y4w/exec';

  function getBase() { return APPS_SCRIPT_URL; }

  async function get(params) {
    const qs  = new URLSearchParams(params).toString();
    const url = location.protocol !== 'file:'
      ? '/api/proxy?' + qs
      : APPS_SCRIPT_URL + '?' + qs + '&_=' + Date.now();
    const res  = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { ok: false, raw: text }; }
  }

  async function post(body) {
    const isFile = location.protocol === 'file:';
    const url = isFile ? APPS_SCRIPT_URL : '/api/proxy';

    if (isFile) {
      if (!navigator.onLine) {
        return { ok: false, message: 'គ្មានការតភ្ជាប់អ៊ីនធឺណិត — សូមពិនិត្យ Wifi/Data' };
      }
      /* Simple key-based actions: pass as named GET params so Apps Script
         can handle them in doGet without needing a body parser. */
      const _simpleActions = ['helen_loan_delete','helen_loan_recover','helen_loan_perm_delete','helen_infor_delete'];
      if (_simpleActions.indexOf(body.action) !== -1) {
        const qs = new URLSearchParams({ action: body.action, key: body.key || '', type: body.type || '', value: body.value || '', _: Date.now() }).toString();
        const gr = await fetch(APPS_SCRIPT_URL + '?' + qs, { redirect: 'follow' });
        const gt = await gr.text();
        try { return JSON.parse(gt); } catch (ex) { return { ok: false, message: 'Parse error' }; }
      }
      /* Complex actions (add/update/infor_add): pass full body as GET param */
      const qs   = 'body=' + encodeURIComponent(JSON.stringify(body)) + '&_=' + Date.now();
      const gres = await fetch(APPS_SCRIPT_URL + '?' + qs, { redirect: 'follow' });
      const gtxt = await gres.text();
      try { return JSON.parse(gtxt); } catch (ex) { return { ok: false, message: 'Parse error' }; }
    }

    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(body),
      redirect: 'follow',
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { ok: true }; }
  }

  window.CamboAPI = { get, post, getBase, APPS_SCRIPT_URL };
})();
