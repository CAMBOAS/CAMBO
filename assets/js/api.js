/**
 * HELEN LOAN — Central API helper
 * All requests go through /api/proxy (server.js locally, Vercel in production)
 * to avoid browser CORS block on direct fetch to Google Apps Script.
 */

(function () {
  'use strict';

  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzS6Jh30HgIDG2WVSWSui4k0tzJ4UkYagNM33ZHSazjdJMTsza22O4iot6BtA9p2sIGog/exec';

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
      /* file:// → CORS blocks reading any cross-origin response.
         Awaiting the opaque response only adds latency and causes
         intermittent failures (redirect quirks, network blips).
         Strategy: check navigator.onLine, then fire-and-forget.
         The request reaches Apps Script; we just can't read the reply. */
      if (!navigator.onLine) {
        return { ok: false, message: 'គ្មានការតភ្ជាប់អ៊ីនធឺណិត — សូមពិនិត្យ Wifi/Data' };
      }
      fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body:    JSON.stringify(body),
        mode:    'no-cors',
      }).catch(function() {}); // best-effort — silence any transient errors
      return { ok: true };
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
