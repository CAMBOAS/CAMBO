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
    const url = location.protocol !== 'file:'
      ? '/api/proxy'
      : APPS_SCRIPT_URL;
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
