/**
 * HELEN LOAN — Central API helper
 * All requests go through /api/proxy (server.js locally, Vercel in production)
 * to avoid browser CORS block on direct fetch to Google Apps Script.
 */

(function () {
  'use strict';

  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbyYJSj9PlDVTBeIJoQcRwKyenHH3RFJYPx_q_WPqaUjxyuwHvKxqH9d6AzWVqZw6ezbFg/exec';

  function getBase() { return APPS_SCRIPT_URL; }

  /* Attach stored credentials to every request */
  function _authParams() {
    try {
      var a = JSON.parse(localStorage.getItem('helenAuth') || 'null');
      if (a && a.u && a.p) return { u: a.u, p: a.p };
    } catch(e) {}
    return {};
  }
  function _authBody() {
    try {
      var a = JSON.parse(localStorage.getItem('helenAuth') || 'null');
      if (a && a.u && a.p) return { auth: { u: a.u, p: a.p } };
    } catch(e) {}
    return {};
  }

  async function get(params) {
    const qs  = new URLSearchParams(Object.assign({}, params, _authParams())).toString();
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
    /* Attach auth to every body (login action sends its own credentials, others need auth{u,p}) */
    const fullBody = Object.assign({}, _authBody(), body);

    if (isFile) {
      if (!navigator.onLine) {
        return { ok: false, message: 'គ្មានការតភ្ជាប់អ៊ីនធឺណិត — សូមពិនិត្យ Wifi/Data' };
      }
      /* Simple key-based actions: pass as named GET params (include auth) */
      const _simpleActions = ['helen_loan_delete','helen_loan_recover','helen_loan_perm_delete','helen_infor_delete'];
      if (_simpleActions.indexOf(body.action) !== -1) {
        const ap = _authParams();
        const qs = new URLSearchParams(Object.assign({ action: body.action, key: body.key || '', type: body.type || '', value: body.value || '', _: Date.now() }, ap)).toString();
        const gr = await fetch(APPS_SCRIPT_URL + '?' + qs, { redirect: 'follow' });
        const gt = await gr.text();
        try { return JSON.parse(gt); } catch (ex) { return { ok: false, message: 'Parse error' }; }
      }
      /* Complex actions: pass full body (with auth) as GET param */
      const qs   = 'body=' + encodeURIComponent(JSON.stringify(fullBody)) + '&_=' + Date.now();
      const gres = await fetch(APPS_SCRIPT_URL + '?' + qs, { redirect: 'follow' });
      const gtxt = await gres.text();
      try { return JSON.parse(gtxt); } catch (ex) { return { ok: false, message: 'Parse error' }; }
    }

    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(fullBody),
      redirect: 'follow',
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { ok: true }; }
  }

  window.CamboAPI = { get, post, getBase, APPS_SCRIPT_URL };
})();
