/**
 * AETHER Settings — Appearance, Accessibility, API Key, Password Change, JSON Backup/Restore & Data Management
 */

import { applyReducedMotion, applyTheme, getAllPrefs, resetAllPrefs, setPref } from './storage.js';
import { changeUserPassword, deleteUserAccount } from './users-db.js';
import { exportUserBackup, importUserBackup, triggerJsonDownload } from './backup.js';
import { clearEntireDatabase } from './db.js';
import { validateConfirmPassword, validatePassword } from './validation.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { confirmDialog, showToast } from './components.js';

export function renderSettingsView(container, state, { onLogout, onRefreshNav }) {
  const prefs = getAllPrefs();

  container.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <div class="page-eyebrow">System &amp; Local Storage Control</div>
          <h1>Settings</h1>
          <p class="page-subtitle">Configure appearance, accessibility, NASA API preferences, password security, and IndexedDB JSON backup/restore.</p>
        </div>
      </div>

      <div class="grid-2 mb-6">
        <!-- Appearance & Accessibility -->
        <section class="card">
          <h2 class="card-title mb-4">Appearance &amp; Accessibility</h2>

          <div class="form-group">
            <label class="form-label" for="set-theme">Color Theme</label>
            <select id="set-theme" class="form-select">
              <option value="dark" ${prefs.theme === 'dark' ? 'selected' : ''}>Dark Mode (Default)</option>
              <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>Light Mode</option>
              <option value="system" ${prefs.theme === 'system' ? 'selected' : ''}>System Preference</option>
            </select>
          </div>

          <div class="switch-row">
            <div>
              <strong class="text-sm">Reduced Motion</strong>
              <p class="text-xs text-muted" style="margin:0;">Minimize interface transitions and animations.</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="set-reduced-motion" ${prefs.reducedMotion ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="switch-row">
            <div>
              <strong class="text-sm">Interface Sound Effects</strong>
              <p class="text-xs text-muted" style="margin:0;">Off by default.</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="set-sound" ${prefs.soundEnabled ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="switch-row">
            <div>
              <strong class="text-sm">Learning Reminders &amp; Notifications</strong>
              <p class="text-xs text-muted" style="margin:0;">Show achievement and milestone notifications.</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="set-notifs" ${prefs.notificationsEnabled ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="form-group mt-4">
            <label class="form-label" for="set-nasa-key">NASA Public API Key (Optional)</label>
            <div class="flex gap-2">
              <input type="text" id="set-nasa-key" class="form-control mono" value="${escapeHtml(prefs.nasaApiKey || 'DEMO_KEY')}" placeholder="DEMO_KEY" />
              <button type="button" class="btn btn-secondary btn-sm" id="save-nasa-key-btn">Save</button>
            </div>
            <div class="form-hint">Uses NASA's public <span class="mono">DEMO_KEY</span> by default. Request a free key at <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">api.nasa.gov</a>.</div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm mt-2" id="reset-prefs-btn">Reset UI Preferences</button>
        </section>

        <!-- Local Data Backup & Limitations -->
        <section class="card">
          <h2 class="card-title mb-4">Local Data Backup &amp; Restore</h2>
          <div class="alert-banner mb-4">
            <i data-lucide="database" style="width:18px;height:18px;flex-shrink:0;color:var(--accent-cyan);"></i>
            <div class="text-xs">
              <strong>Important Local Storage Limitations:</strong> All accounts, courses, quizzes, and favorites live locally inside this browser's <span class="mono">AETHER_DATABASE</span> (IndexedDB). Data is not synced across devices, clearing browser site data may delete it, and different browsers or localhost ports maintain separate databases. Export regular JSON backups below.
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mb-5">
            <button type="button" class="btn btn-primary btn-sm" id="export-backup-btn" ${!state.user ? 'disabled' : ''}>
              <i data-lucide="download" style="width:15px;height:15px;"></i> Export JSON Backup
            </button>
            <label class="btn btn-secondary btn-sm" style="cursor:${state.user ? 'pointer' : 'not-allowed'};opacity:${state.user ? '1' : '0.5'};">
              <i data-lucide="upload" style="width:15px;height:15px;"></i> Import JSON Backup
              <input type="file" id="import-backup-input" accept="application/json,.json" style="display:none;" ${!state.user ? 'disabled' : ''} />
            </label>
          </div>
          ${!state.user ? '<p class="text-xs text-muted mb-4">Sign in to export or import personal account backups.</p>' : ''}

          <h3 class="mb-2 text-rose" style="font-size:1rem;">Danger Zone</h3>
          <div class="flex flex-wrap gap-2">
            ${state.user ? '<button type="button" class="btn btn-danger btn-sm" id="delete-account-btn">Delete My Account</button>' : ''}
            <button type="button" class="btn btn-danger btn-sm" id="clear-db-btn">Clear Local Database</button>
          </div>
        </section>
      </div>

      ${state.user ? `
        <section class="card">
          <h2 class="card-title mb-4">Change Local Account Password</h2>
          <form id="change-pass-form" style="max-width:460px;">
            <div class="form-group">
              <label class="form-label" for="cp-current">Current Password</label>
              <input type="password" id="cp-current" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cp-new">New Password</label>
              <input type="password" id="cp-new" class="form-control" placeholder="Min 8 chars, letters + numbers" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cp-confirm">Confirm New Password</label>
              <input type="password" id="cp-confirm" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Update Password</button>
          </form>
        </section>
      ` : ''}
    </div>
  `;

  refreshIcons();

  container.querySelector('#set-theme').addEventListener('change', (e) => {
    setPref('theme', e.target.value);
    applyTheme(e.target.value);
    if (onRefreshNav) onRefreshNav();
    showToast(`Theme set to ${e.target.value}.`, 'success');
  });

  container.querySelector('#set-reduced-motion').addEventListener('change', (e) => {
    setPref('reducedMotion', e.target.checked);
    applyReducedMotion(e.target.checked);
    showToast(`Reduced motion ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
  });

  container.querySelector('#set-sound').addEventListener('change', (e) => {
    setPref('soundEnabled', e.target.checked);
    showToast(`Sound effects ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
  });

  container.querySelector('#set-notifs').addEventListener('change', (e) => {
    setPref('notificationsEnabled', e.target.checked);
    showToast('Notification preference updated.', 'info');
  });

  container.querySelector('#save-nasa-key-btn').addEventListener('click', () => {
    const val = container.querySelector('#set-nasa-key').value.trim() || 'DEMO_KEY';
    setPref('nasaApiKey', val);
    showToast('NASA API key preference saved.', 'success');
  });

  container.querySelector('#reset-prefs-btn').addEventListener('click', () => {
    resetAllPrefs();
    applyTheme('dark');
    applyReducedMotion(false);
    if (onRefreshNav) onRefreshNav();
    showToast('Application UI preferences reset to defaults.', 'success');
    renderSettingsView(container, state, { onLogout, onRefreshNav });
  });

  container.querySelector('#export-backup-btn')?.addEventListener('click', async () => {
    try {
      const payload = await exportUserBackup(state.user.id);
      const stamp = new Date().toISOString().slice(0, 10);
      triggerJsonDownload(payload, `aether-backup-${stamp}.json`);
      showToast('AETHER JSON backup exported.', 'success');
    } catch (err) {
      showToast(err.message || 'Backup export failed.', 'error');
    }
  });

  container.querySelector('#import-backup-input')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await importUserBackup(state.user.id, text);
      showToast(`Imported ${res.importedCount} records successfully.`, 'success');
      if (onRefreshNav) onRefreshNav();
    } catch (err) {
      showToast(err.message || 'Import failed. Please check the JSON file.', 'error');
    } finally {
      e.target.value = '';
    }
  });

  container.querySelector('#delete-account-btn')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'Delete Local Account?',
      message: 'This permanently deletes your local account, learning progress, quiz scores, bookmarks, and favorites from this browser’s IndexedDB. Export a JSON backup first if you want to keep your records.',
      confirmText: 'Delete Account',
      danger: true
    });
    if (!ok) return;
    await deleteUserAccount(state.user.id);
    showToast('Local account deleted.', 'info');
    onLogout();
  });

  container.querySelector('#clear-db-btn').addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'Clear Entire AETHER_DATABASE?',
      message: 'This wipes all local accounts and data stored in AETHER_DATABASE on this browser origin. This action cannot be undone.',
      confirmText: 'Clear Database',
      danger: true
    });
    if (!ok) return;
    await clearEntireDatabase();
    showToast('Local AETHER_DATABASE cleared.', 'info');
    onLogout();
  });

  container.querySelector('#change-pass-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cur = container.querySelector('#cp-current').value;
    const next = container.querySelector('#cp-new').value;
    const conf = container.querySelector('#cp-confirm').value;

    const pCheck = validatePassword(next);
    if (!pCheck.valid) { showToast(pCheck.message, 'error'); return; }
    const cCheck = validateConfirmPassword(next, conf);
    if (!cCheck.valid) { showToast(cCheck.message, 'error'); return; }

    try {
      await changeUserPassword(state.user.id, cur, next);
      e.target.reset();
      showToast('Password updated using PBKDF2-SHA256.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not update password.', 'error');
    }
  });
}
