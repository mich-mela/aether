/**
 * AETHER Persistent Navigation (Sidebar, Sticky Topbar, Mobile Drawer & Bottom Bar)
 */

import { escapeHtml, formatUtcTime, getInitials, refreshIcons } from './helpers.js';
import { applyTheme, getPref, setPref } from './storage.js';
import { getUserNotifications } from './progress-db.js';

const NAV_GROUPS = [
  {
    label: 'Command',
    items: [
      { route: 'dashboard', label: 'Mission Control', icon: 'layout-dashboard' },
      { route: 'solar-system', label: '3D Solar System', icon: 'orbit' },
      { route: 'planets', label: 'Planet Explorer', icon: 'globe-2' },
      { route: 'missions', label: 'Space Missions', icon: 'rocket' },
      { route: 'satellites', label: 'Satellite Tracker', icon: 'satellite' },
      { route: 'simulator', label: 'Space Simulator', icon: 'atom' },
      { route: 'deep-space', label: 'Deep Space', icon: 'sparkles' }
    ]
  },
  {
    label: 'Academy & Archive',
    items: [
      { route: 'academy', label: 'Space Academy', icon: 'graduation-cap' },
      { route: 'learning-paths', label: 'Learning Paths', icon: 'map' },
      { route: 'timeline', label: 'Space Timeline', icon: 'history' },
      { route: 'gallery', label: 'Space Gallery', icon: 'image' },
      { route: 'search', label: 'Global Search', icon: 'search' }
    ]
  },
  {
    label: 'Personal',
    items: [
      { route: 'favorites', label: 'Favorites & Activity', icon: 'bookmark' },
      { route: 'notifications', label: 'Notifications', icon: 'bell', badgeId: 'nav-notif-badge' },
      { route: 'profile', label: 'User Profile', icon: 'user' },
      { route: 'about', label: 'About the Creator', icon: 'info' },
      { route: 'settings', label: 'Settings', icon: 'settings' }
    ]
  }
];

let utcTimerId = null;

export function closeMobileSidebar() {
  document.getElementById('app-shell')?.classList.remove('mobile-sidebar-open');
}

export async function renderNavigation(state, activeRoute = 'dashboard', onNavigate) {
  const shell = document.getElementById('app-shell');
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  const mobileNav = document.getElementById('mobile-bottom-nav');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (!sidebar || !topbar || !mobileNav) return;

  const collapsed = getPref('sidebarCollapsed', false);
  shell.classList.toggle('sidebar-collapsed', Boolean(collapsed));

  let unreadCount = 0;
  if (state.user) {
    try {
      const notifs = await getUserNotifications(state.user.id);
      unreadCount = notifs.filter((n) => !n.read).length;
    } catch {
      unreadCount = 0;
    }
  }

  // Sidebar Markup
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="#dashboard" class="brand-lockup">
        <span class="brand-mark"><i data-lucide="orbit"></i></span>
        <span class="brand-text">
          <span class="brand-name">AETHER</span>
          <span class="brand-tagline">Explore Beyond the Unknown</span>
        </span>
      </a>
      <button type="button" class="btn btn-icon sidebar-collapse-btn" id="toggle-sidebar-btn" aria-label="Toggle sidebar width">
        <i data-lucide="${collapsed ? 'panel-left-open' : 'panel-left-close'}"></i>
      </button>
    </div>

    <nav class="sidebar-nav" aria-label="Main Platform Sections">
      ${NAV_GROUPS.map((group) => `
        <div class="nav-section">
          <div class="nav-section-label">${escapeHtml(group.label)}</div>
          <ul class="nav-list">
            ${group.items.map((item) => {
              const isActive = activeRoute === item.route || (item.route === 'academy' && (activeRoute === 'lesson' || activeRoute === 'quiz'));
              const badge = item.badgeId && unreadCount > 0
                ? `<span class="nav-badge" id="${item.badgeId}">${unreadCount}</span>`
                : '';
              return `
                <li>
                  <a href="#${item.route}" class="nav-link ${isActive ? 'active' : ''}" data-nav-route="${item.route}" ${isActive ? 'aria-current="page"' : ''}>
                    <i data-lucide="${item.icon}"></i>
                    <span class="nav-label">${escapeHtml(item.label)}</span>
                    ${badge}
                  </a>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `).join('')}
    </nav>

    <div class="sidebar-footer">
      ${state.user ? `
        <a href="#profile" class="sidebar-user-card">
          <span class="avatar">${escapeHtml(getInitials(state.user.fullName))}</span>
          <span class="sidebar-user-meta" style="min-width:0;">
            <span class="font-semibold text-sm" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(state.user.fullName)}</span>
            <span class="text-xs text-muted" style="display:block;">${escapeHtml(state.user.profile?.level || 'Explorer')} • Local</span>
          </span>
        </a>
      ` : `
        <a href="#signin" class="btn btn-primary w-full">
          <i data-lucide="log-in" style="width:16px;height:16px;"></i>
          <span class="nav-label">Sign In / Join</span>
        </a>
      `}
    </div>
  `;

  // Topbar Markup
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  topbar.innerHTML = `
    <div class="topbar-left">
      <button type="button" class="btn btn-icon mobile-menu-btn" id="mobile-menu-btn" aria-label="Open navigation menu">
        <i data-lucide="menu"></i>
      </button>
      <form class="topbar-search" id="topbar-search-form" role="search">
        <i data-lucide="search" class="search-icon"></i>
        <input type="search" id="topbar-search-input" placeholder="Search planets, missions, courses..." aria-label="Global search" />
      </form>
    </div>

    <div class="topbar-actions">
      <div class="topbar-utc" title="Coordinated Universal Time">
        <span class="utc-dot" aria-hidden="true"></span>
        <span id="topbar-utc-clock">${formatUtcTime()}</span>
      </div>
      <button type="button" class="btn btn-icon" id="topbar-theme-btn" aria-label="Toggle dark or light theme" title="Switch theme">
        <i data-lucide="${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>
      </button>
      <a href="#notifications" class="btn btn-icon" aria-label="Notifications (${unreadCount} unread)" title="Notifications">
        <i data-lucide="bell"></i>
        ${unreadCount > 0 ? '<span class="icon-dot" aria-hidden="true"></span>' : ''}
      </a>
      ${state.user ? `
        <a href="#profile" class="avatar" title="${escapeHtml(state.user.fullName)}">${escapeHtml(getInitials(state.user.fullName))}</a>
      ` : `
        <a href="#signin" class="btn btn-primary btn-sm">Sign In</a>
      `}
    </div>
  `;

  // Mobile Bottom Navigation
  const bottomItems = [
    { route: 'dashboard', label: 'Control', icon: 'layout-dashboard' },
    { route: 'solar-system', label: '3D Solar', icon: 'orbit' },
    { route: 'academy', label: 'Academy', icon: 'graduation-cap' },
    { route: 'search', label: 'Search', icon: 'search' },
    { route: state.user ? 'profile' : 'signin', label: state.user ? 'Profile' : 'Sign In', icon: 'user' }
  ];
  mobileNav.innerHTML = bottomItems.map((item) => `
    <a href="#${item.route}" class="mobile-bottom-link ${activeRoute === item.route ? 'active' : ''}">
      <i data-lucide="${item.icon}" style="width:19px;height:19px;"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  // Bind Events
  sidebar.querySelector('#toggle-sidebar-btn')?.addEventListener('click', () => {
    const next = !shell.classList.contains('sidebar-collapsed');
    shell.classList.toggle('sidebar-collapsed', next);
    setPref('sidebarCollapsed', next);
    renderNavigation(state, activeRoute, onNavigate);
  });

  topbar.querySelector('#mobile-menu-btn')?.addEventListener('click', () => {
    shell.classList.toggle('mobile-sidebar-open');
  });

  backdrop.onclick = closeMobileSidebar;

  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileSidebar);
  });

  topbar.querySelector('#topbar-theme-btn')?.addEventListener('click', () => {
    const nowTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setPref('theme', nowTheme);
    applyTheme(nowTheme);
    renderNavigation(state, activeRoute, onNavigate);
  });

  topbar.querySelector('#topbar-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = topbar.querySelector('#topbar-search-input').value.trim();
    onNavigate(q ? `#search?q=${encodeURIComponent(q)}` : '#search');
  });

  // Live UTC Clock
  if (!utcTimerId) {
    utcTimerId = setInterval(() => {
      const el = document.getElementById('topbar-utc-clock');
      if (el) el.textContent = formatUtcTime();
      const dashUtc = document.getElementById('dashboard-utc-clock');
      if (dashUtc) dashUtc.textContent = formatUtcTime();
    }, 1000);
  }

  refreshIcons();
}
