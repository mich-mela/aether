/**
 * AETHER Official Sources & Professional Responsive Footer
 */

import { OFFICIAL_SOURCES } from './data-sources.js';
import { copyToClipboard, escapeHtml, refreshIcons } from './helpers.js';
import { showToast } from './components.js';

const CREATOR_EMAIL = 'michaelmelad49@gmail.com';

export function renderFooter() {
  const footer = document.getElementById('app-footer');
  if (!footer) return;

  const sourcesHtml = OFFICIAL_SOURCES.map((group) => `
    <div>
      <p class="text-xs font-semibold text-cyan mb-2" style="text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(group.group)}</p>
      <ul class="footer-links">
        ${group.links.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.name)}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <a href="#dashboard" class="brand-lockup mb-4">
            <span class="brand-mark"><i data-lucide="orbit"></i></span>
            <span class="brand-text">
              <span class="brand-name">AETHER</span>
              <span class="brand-tagline">Explore Beyond the Unknown.</span>
            </span>
          </a>
          <p class="text-sm text-muted">
            An interactive space exploration, 3D visualization, physics simulation, and astronomy learning platform engineered with HTML5, CSS3, Vanilla JavaScript, and local IndexedDB storage.
          </p>
          <div class="flex flex-wrap gap-2 mt-4">
            <a href="#solar-system" class="btn btn-secondary btn-sm">3D Solar System</a>
            <a href="#academy" class="btn btn-secondary btn-sm">Space Academy</a>
          </div>
        </div>

        <div>
          <h4 class="footer-heading">Explore</h4>
          <ul class="footer-links">
            <li><a href="#dashboard">Mission Control</a></li>
            <li><a href="#solar-system">3D Solar System</a></li>
            <li><a href="#planets">Planet Explorer</a></li>
            <li><a href="#missions">Space Missions</a></li>
            <li><a href="#satellites">Satellite Tracker</a></li>
            <li><a href="#simulator">Space Simulator</a></li>
            <li><a href="#deep-space">Deep Space</a></li>
            <li><a href="#academy">Space Academy</a></li>
            <li><a href="#learning-paths">Learning Paths</a></li>
            <li><a href="#timeline">Space Timeline</a></li>
            <li><a href="#gallery">Space Gallery</a></li>
            <li><a href="#about">About the Creator</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Official Sources &amp; Scientific References</h4>
          <div class="footer-sources-grid">
            ${sourcesHtml}
          </div>
        </div>

        <div>
          <h4 class="footer-heading">Contact the Creator</h4>
          <div class="card" style="padding:var(--space-4);">
            <p class="font-semibold" style="margin-bottom:2px;color:var(--text-primary);">MICHAEL MILAD SAMEER</p>
            <p class="text-xs text-cyan mb-3">Founder &amp; Creator of AETHER</p>
            <p class="text-sm mono mb-3" style="word-break:break-all;">
              <a href="mailto:${CREATOR_EMAIL}">${CREATOR_EMAIL}</a>
            </p>
            <div class="flex flex-wrap gap-2">
              <a href="mailto:${CREATOR_EMAIL}" class="btn btn-primary btn-sm">
                <i data-lucide="mail" style="width:14px;height:14px;"></i> Email
              </a>
              <button type="button" class="btn btn-secondary btn-sm" id="footer-copy-email-btn">
                <i data-lucide="copy" style="width:14px;height:14px;"></i> Copy Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          <strong>&copy; 2026 AETHER — Explore Beyond the Unknown.</strong><br />
          Designed &amp; Developed by Michael Milad Sameer.
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="#settings">Settings &amp; Backup</a>
          <a href="#profile">Local Account</a>
          <a href="#about">About Creator</a>
        </div>
      </div>

      <div class="footer-disclaimer">
        AETHER is an independent educational and exploration project. It is not an official NASA or ESA product and is not affiliated with or endorsed by NASA or ESA.
      </div>
    </div>
  `;

  const copyBtn = footer.querySelector('#footer-copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await copyToClipboard(CREATOR_EMAIL);
        showToast('Creator email copied to clipboard.', 'success');
      } catch {
        showToast(`Email: ${CREATOR_EMAIL}`, 'info');
      }
    });
  }

  refreshIcons();
}
