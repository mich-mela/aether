/**
 * AETHER Reusable UI Component Builders (Toasts, Modals, Badges, States)
 */

import { escapeHtml, refreshIcons } from './helpers.js';

export function showToast(message, type = 'info', duration = 3600) {
  const region = document.getElementById('toast-region');
  if (!region) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} fade-in`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div style="flex:1;min-width:0;">${escapeHtml(message)}</div>
    <button type="button" class="btn-ghost" aria-label="Dismiss notification" style="padding:2px 6px;min-height:auto;">✕</button>
  `;

  const remove = () => {
    if (toast.parentNode) toast.remove();
  };

  toast.querySelector('button').addEventListener('click', remove);
  region.appendChild(toast);

  if (duration > 0) {
    setTimeout(remove, duration);
  }
}

let activeKeyHandler = null;

export function openModal({ title, contentHtml, footerHtml = '', size = 'md', onMount = null }) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  closeModal();

  root.innerHTML = `
    <div class="modal-dialog ${size === 'lg' ? 'modal-lg' : ''}" role="dialog" aria-modal="true" aria-labelledby="aether-modal-title">
      <div class="modal-header">
        <h3 id="aether-modal-title" style="margin:0;">${escapeHtml(title)}</h3>
        <button type="button" class="btn btn-icon" data-modal-close aria-label="Close modal">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">${contentHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;

  root.classList.add('open');
  root.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  refreshIcons();

  root.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  root.addEventListener('click', (e) => {
    if (e.target === root) closeModal();
  }, { once: true });

  activeKeyHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', activeKeyHandler);

  if (typeof onMount === 'function') {
    onMount(root);
  }
}

export function closeModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;
  root.classList.remove('open');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '';
  document.body.style.overflow = '';
  if (activeKeyHandler) {
    document.removeEventListener('keydown', activeKeyHandler);
    activeKeyHandler = null;
  }
}

export function confirmDialog({ title, message, confirmText = 'Confirm', danger = false }) {
  return new Promise((resolve) => {
    openModal({
      title,
      contentHtml: `<p>${escapeHtml(message)}</p>`,
      footerHtml: `
        <button type="button" class="btn btn-secondary" id="confirm-cancel-btn">Cancel</button>
        <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirm-ok-btn">${escapeHtml(confirmText)}</button>
      `,
      onMount: (root) => {
        root.querySelector('#confirm-cancel-btn').addEventListener('click', () => {
          closeModal();
          resolve(false);
        });
        root.querySelector('#confirm-ok-btn').addEventListener('click', () => {
          closeModal();
          resolve(true);
        });
      }
    });
  });
}

export function renderDataBadge(type = 'Historical', label = null) {
  const map = {
    Live: 'badge-live',
    Historical: 'badge-historical',
    Cached: 'badge-cached',
    Demonstration: 'badge-demo'
  };
  const cls = map[type] || 'badge-neutral';
  return `<span class="badge ${cls}" title="Data classification: ${escapeHtml(type)}">${escapeHtml(label || type)}</span>`;
}

export function renderEmptyState({ icon = 'telescope', title, description, actionHtml = '' }) {
  return `
    <div class="state-panel">
      <i data-lucide="${escapeHtml(icon)}" style="width:36px;height:36px;margin:0 auto;color:var(--accent-cyan);"></i>
      <h3>${escapeHtml(title)}</h3>
      <p class="text-muted" style="max-width:460px;margin:0 auto var(--space-4);">${escapeHtml(description)}</p>
      ${actionHtml}
    </div>
  `;
}

export function renderLoadingState(label = 'Loading scientific data...') {
  return `
    <div class="state-panel" aria-live="polite">
      <div class="spinner" style="margin:0 auto;"></div>
      <p class="text-muted mt-4">${escapeHtml(label)}</p>
    </div>
  `;
}
