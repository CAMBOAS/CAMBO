/* HELEN LOAN — Shared Layout (Sidebar + Topbar) */
(function () {
  'use strict';

  function getLang() { return localStorage.getItem('helen_lang') || 'kh'; }
  function setLang(l) { localStorage.setItem('helen_lang', l); }
  function t(kh, en) { return getLang() === 'en' ? en : kh; }

  function getPageMeta() {
    return {
      'index.html':     { title: t('Dashboard','Dashboard'),   subtitle: t('ការវិភាគ និងទិដ្ឋភាពទូទៅ','Analytics & overview') },
      'loan-list.html':    { title: t('បញ្ជីកម្ចី','Loan List'),     subtitle: t('តារាង និងការគ្រប់គ្រងអ្នកខ្ចីសរុប','Borrower list and full management') },
      'fb-id-finder.html': { title: t('FB ID Finder','FB ID Finder'), subtitle: t('បំប្លែង Facebook URL ទៅជា Numeric ID','Convert Facebook URL to Numeric ID') },
      'login.html':     { title: t('ចូលប្រើ','Login'),        subtitle: '' },
    };
  }

  const ic = {
    dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    loanlist: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logout:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    moon:     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sun:      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    globe:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    bell:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  };

  function getCurrentPage() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  /* Returns '../' when inside pages/ subfolder, '' when at root */
  function getBase() {
    const rootPages = ['index.html', 'login.html'];
    return rootPages.includes(getCurrentPage()) ? '' : '../';
  }

  function buildSidebar() {
    const cur  = getCurrentPage();
    const base = getBase();
    function link(page, icon, label, danger) {
      const pageName = page.split('/').pop();
      const active   = cur === pageName ? 'sb-active' : '';
      const cls      = danger ? 'sb-link sb-link-danger' : 'sb-link';
      const onclick  = danger ? ' onclick="event.preventDefault();handleLogout();"' : '';
      return `<li><a href="${base}${page}" class="${cls} ${active}" data-page="${pageName}" data-tooltip="${label}"${onclick}><span class="sb-icon">${icon}</span><span class="sb-label">${label}</span><span class="sb-active-dot"></span></a></li>`;
    }

    return `
      <div class="sb-head">
        <div class="sb-logo-wrap">
          <img class="sb-logo-img" src="${base}images/logo/LOGO.png" alt="HELEN LOAN" onerror="this.style.display='none'">
        </div>
        <div class="sb-brand-text">
          <div class="sb-brand-name">HELEN LOAN</div>
          <div class="sb-brand-sub">Loan Management</div>
        </div>
        <button class="sb-collapse-btn" id="sbToggleBtn" title="Toggle sidebar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <div class="sb-status-strip">
        <span class="sb-live-dot"></span>
        <span class="sb-live-txt">${t('ប្រព័ន្ធដំណើរការ','System Online')}</span>
      </div>

      <div class="sb-divider"></div>

      <nav class="sb-nav">
        <div class="sb-section-label">${t('ម៉ឺនុយចំបង','Main Menu')}</div>
        <ul class="sb-list">
          ${link('index.html', ic.dashboard, t('Dashboard','Dashboard'))}
          ${link('pages/loan-list.html', ic.loanlist, t('បញ្ជីកម្ចី','Loan List'))}
          ${link('pages/fb-id-finder.html', ic.facebook, t('FB ID Finder','FB ID Finder'))}
        </ul>
      </nav>

      <div class="sb-grow"></div>

      <div class="sb-footer">
        <button class="sb-ctrl-btn sb-link-danger" onclick="handleLogout()" title="${t('ចាកចេញ','Logout')}" style="width:100%;margin-bottom:6px;justify-content:flex-start">
          <span class="sb-theme-icon">${ic.logout}</span>
          <span class="sb-ctrl-label">${t('ចាកចេញ','Logout')}</span>
        </button>
        <div class="sb-ctrl-row">
          <button class="sb-ctrl-btn sb-theme-btn" id="sbThemeBtn" title="Toggle Theme">
            <span class="sb-theme-icon">${ic.moon}</span>
            <span class="sb-ctrl-label">${t('ម៉ូត','Theme')}</span>
          </button>
          <button class="sb-ctrl-btn sb-lang-btn" id="sbLangBtn" title="Language">
            <span class="sb-theme-icon">${ic.globe}</span>
            <span class="sb-ctrl-label" id="sbLangLabel">${getLang().toUpperCase()}</span>
          </button>
        </div>
        <div class="sb-user-card" id="sbUserRow">
          <div class="sb-user-avatar" id="sbUserAvatar">HL</div>
          <div class="sb-user-info">
            <div class="sb-user-name" id="sbUserName">HELEN LOAN</div>
            <div class="sb-user-role" id="sbUserRole">
              <span class="sb-online-dot"></span>
              Administrator
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildTopbar() {
    return `<button class="topbar-menu-btn" id="topbarMenuBtn" title="Menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>`;
  }

  function handleLogout() {
    location.href = getBase() + 'login.html';
  }
  window.handleLogout = handleLogout;

  function initSidebarToggle(sidebar) {
    var btn = document.getElementById('sbToggleBtn');
    var sb  = document.querySelector('.sidebar');
    var dashboard = document.querySelector('.dashboard');

    /* Restore collapsed state */
    var collapsed = localStorage.getItem('helen_sb_collapsed') === '1';
    if (collapsed && sb) { sb.classList.add('sb-collapsed'); document.body.classList.add('sb-collapsed'); }

    /* Toggle collapse on click */
    if (btn) btn.addEventListener('click', function() {
      if (!sb) return;
      var c = sb.classList.toggle('sb-collapsed');
      document.body.classList.toggle('sb-collapsed', c);
      localStorage.setItem('helen_sb_collapsed', c ? '1' : '0');
    });

    /* Mobile overlay close */
    var overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.addEventListener('click', function() {
      document.body.classList.remove('sidebar-open');
    });

    /* Mobile hamburger open */
    var menuBtn = document.getElementById('topbarMenuBtn');
    if (menuBtn) menuBtn.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-open');
    });
  }

  function initThemeBtn() {
    function applyTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
      var icon = document.querySelector('#sbThemeBtn .sb-theme-icon');
      var tBtn = document.getElementById('topbarThemeBtn');
      if (icon) icon.innerHTML = t === 'light' ? ic.moon : ic.sun;
      if (tBtn) tBtn.innerHTML = t === 'light' ? ic.moon : ic.sun;
    }
    var cur = localStorage.getItem('theme') || 'light';
    applyTheme(cur);
    var btn = document.getElementById('sbThemeBtn');
    if (btn) btn.addEventListener('click', function() {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  function initLangBtn() {
    var btn = document.getElementById('sbLangBtn');
    if (!btn) return;
    btn.addEventListener('click', function() {
      setLang(getLang() === 'kh' ? 'en' : 'kh');
      renderLayout(); /* rebuild sidebar + topbar without page reload */
    });
  }

  function renderLayout() {
    var sidebar = document.getElementById('sharedSidebar');
    var header  = document.getElementById('sharedHeader');
    if (sidebar) {
      sidebar.innerHTML = buildSidebar();
      /* Preserve collapsed state */
      if (localStorage.getItem('helen_sb_collapsed') === '1') {
        sidebar.classList.add('sb-collapsed');
        document.body.classList.add('sb-collapsed');
      }
    }
    /* Build topbar BEFORE initSidebarToggle so #topbarMenuBtn exists in DOM */
    if (header) header.innerHTML = buildTopbar();
    if (sidebar) {
      initSidebarToggle(sidebar);
      initThemeBtn();
      initLangBtn();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderLayout();
  });
})();
