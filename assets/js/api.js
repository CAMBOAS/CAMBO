/**
 * HELEN LOAN — Central API helper
 * All requests go through /api/proxy (server.js locally, Vercel in production)
 * to avoid browser CORS block on direct fetch to Google Apps Script.
 */

(function () {
  'use strict';

  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzrKtkKz0ni5BCvZl2f-yWcMFw9-BPqfdp28Aom1nws-X9bOibOivHebPXh8WPMX0Ie/exec';

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
      /* file:// → Chrome blocks reading cross-origin CORS response.
         1. Check navigator.onLine (catches WiFi-off case immediately).
         2. await no-cors fetch + 15s timeout:
            - resolves (opaque) → network reached Apps Script → assume ok
            - throws TypeError   → real network failure (internet down, DNS fail)
            - throws timeout     → very slow / unreachable */
      if (!navigator.onLine) {
        return { ok: false, message: 'គ្មានការតភ្ជាប់អ៊ីនធឺណិត — សូមពិនិត្យ Wifi/Data' };
      }
      try {
        await Promise.race([
          fetch(url, {
            method:  'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body:    JSON.stringify(body),
            mode:    'no-cors',
          }),
          new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('timeout')); }, 15000); })
        ]);
        return { ok: true };
      } catch(e) {
        if (e.message === 'timeout') {
          return { ok: false, message: 'Request timeout — ការតភ្ជាប់យឺត សូម Try Again' };
        }
        return { ok: false, message: 'Network error — គ្មានអ៊ីនធឺណិត ឬ Server មានបញ្ហា' };
      }
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
