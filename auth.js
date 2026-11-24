/**
 * AETHER Local Authentication, Registration, Forgot Password & First-Time Onboarding
 * Strictly local IndexedDB + Web Crypto PBKDF2-SHA256 (no external backend).
 */

import { createAccount, loginAccount, updateUserProfile } from './users-db.js';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword
} from './validation.js';
import { escapeHtml, refreshIcons } from './helpers.js';
import { showToast } from './components.js';

const INTEREST_OPTIONS = [
  'Solar System',
  'Exoplanets',
  'Black Holes',
  'Space Missions',
  'Orbital Mechanics',
  'Nebulae & Galaxies',
  'Telescopes & Imaging',
  'Future Spaceflight'
];

function bindPasswordToggles(container) {
  container.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = container.querySelector(`#${btn.dataset.target}`);
      if (!input) return;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      btn.innerHTML = `<i data-lucide="${isHidden ? 'eye-off' : 'eye'}" style="width:17px;height:17px;"></i>`;
      refreshIcons();
    });
  });
}

export function renderWelcomeView(container, state) {
  container.innerHTML = `
    <div class="auth-hero-card fade-in">
      <div class="brand-mark" style="width:54px;height:54px;margin:0 auto var(--space-4);">
        <i data-lucide="orbit" style="width:28px;height:28px;"></i>
      </div>
      <div class="page-eyebrow">Digital Space Agency &amp; Astronomy Academy</div>
      <h1 style="margin-bottom:var(--space-3);">AETHER</h1>
      <p style="font-size:1.1rem;color:var(--text-primary);margin-bottom:var(--space-3);">Explore Beyond the Unknown.</p>
      <p class="text-muted" style="max-width:560px;margin:0 auto var(--space-6);">
        Explore our 3D Solar System, simulate Newtonian gravity and orbital mechanics, study 16 astronomy courses, and track your personal learning progress locally in IndexedDB—with zero cloud accounts required.
      </p>
      <div class="flex flex-wrap gap-3" style="justify-content:center;">
        ${state.user ? `
          <a href="#dashboard" class="btn btn-primary">Enter Mission Control</a>
        ` : `
          <a href="#signup" class="btn btn-primary">Create Local Account</a>
          <a href="#signin" class="btn btn-secondary">Sign In</a>
          <a href="#dashboard" class="btn btn-ghost">Explore as Guest</a>
        `}
      </div>
      <div class="alert-banner mt-6" style="text-align:left;">
        <i data-lucide="database" style="width:18px;height:18px;flex-shrink:0;color:var(--accent-cyan);"></i>
        <div>
          <strong>Local-First Educational Storage:</strong> Accounts, quizzes, bookmarks, and certificates are stored privately in your browser's <span class="mono">AETHER_DATABASE</span> (IndexedDB) using salted PBKDF2-SHA256 password hashing. You can export or restore your data anytime in Settings.
        </div>
      </div>
    </div>
  `;
  refreshIcons();
}

export function renderSignInView(container, { onAuthSuccess }) {
  container.innerHTML = `
    <div class="auth-container fade-in">
      <div class="card">
        <div class="page-eyebrow">Local Account Access</div>
        <h1 style="font-size:1.6rem;">Sign In to AETHER</h1>
        <p class="text-sm text-muted mb-6">Continue your astronomy courses, saved discoveries, and orbital simulations stored in this browser.</p>

        <form id="signin-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="signin-email">Email Address</label>
            <input type="email" id="signin-email" class="form-control" autocomplete="email" placeholder="explorer@example.com" required />
            <div class="form-error" id="signin-email-err"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signin-password">Password</label>
            <div class="input-password-wrap">
              <input type="password" id="signin-password" class="form-control" autocomplete="current-password" placeholder="Enter your password" required />
              <button type="button" class="password-toggle" data-target="signin-password" aria-label="Show password">
                <i data-lucide="eye" style="width:17px;height:17px;"></i>
              </button>
            </div>
            <div class="form-error" id="signin-password-err"></div>
          </div>

          <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <label class="flex items-center gap-2 text-sm text-secondary" style="cursor:pointer;">
              <input type="checkbox" id="signin-remember" checked />
              Remember local session
            </label>
            <a href="#forgot-password" class="text-sm">Forgot password?</a>
          </div>

          <div class="form-error mb-4" id="signin-form-err" role="alert"></div>

          <button type="submit" class="btn btn-primary w-full" id="signin-submit-btn">Sign In</button>
        </form>

        <p class="text-sm text-muted mt-6" style="text-align:center;">
          New to AETHER? <a href="#signup">Create a local account</a>
        </p>
      </div>
    </div>
  `;

  bindPasswordToggles(container);
  refreshIcons();

  const form = container.querySelector('#signin-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailEl = container.querySelector('#signin-email');
    const passEl = container.querySelector('#signin-password');
    const rememberEl = container.querySelector('#signin-remember');
    const submitBtn = container.querySelector('#signin-submit-btn');

    container.querySelector('#signin-email-err').textContent = '';
    container.querySelector('#signin-password-err').textContent = '';
    container.querySelector('#signin-form-err').textContent = '';

    const emailCheck = validateEmail(emailEl.value);
    if (!emailCheck.valid) {
      container.querySelector('#signin-email-err').textContent = emailCheck.message;
      return;
    }
    if (!passEl.value) {
      container.querySelector('#signin-password-err').textContent = 'Password is required.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying credentials...';
    try {
      const user = await loginAccount({
        email: emailCheck.value,
        password: passEl.value,
        remember: rememberEl.checked
      });
      showToast(`Welcome back, ${user.fullName}.`, 'success');
      onAuthSuccess(user, user.profile?.onboardingCompleted ? '#dashboard' : '#onboarding');
    } catch (err) {
      container.querySelector('#signin-form-err').textContent = err.message || 'Sign-in failed.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

export function renderSignUpView(container, { onAuthSuccess }) {
  container.innerHTML = `
    <div class="auth-container fade-in">
      <div class="card">
        <div class="page-eyebrow">New Local Explorer Account</div>
        <h1 style="font-size:1.6rem;">Create Account</h1>
        <p class="text-sm text-muted mb-6">
          Creates a local educational account inside this browser's IndexedDB. Passwords are hashed locally with salted PBKDF2-SHA256.
        </p>

        <form id="signup-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input type="text" id="signup-name" class="form-control" autocomplete="name" placeholder="e.g. Elena Vance" required />
            <div class="form-error" id="signup-name-err"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-email">Email Address</label>
            <input type="email" id="signup-email" class="form-control" autocomplete="email" placeholder="elena@example.com" required />
            <div class="form-error" id="signup-email-err"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <div class="input-password-wrap">
              <input type="password" id="signup-password" class="form-control" autocomplete="new-password" placeholder="Minimum 8 chars with letters & numbers" required />
              <button type="button" class="password-toggle" data-target="signup-password" aria-label="Show password">
                <i data-lucide="eye" style="width:17px;height:17px;"></i>
              </button>
            </div>
            <div class="form-error" id="signup-password-err"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-confirm">Confirm Password</label>
            <div class="input-password-wrap">
              <input type="password" id="signup-confirm" class="form-control" autocomplete="new-password" placeholder="Re-enter password" required />
              <button type="button" class="password-toggle" data-target="signup-confirm" aria-label="Show password">
                <i data-lucide="eye" style="width:17px;height:17px;"></i>
              </button>
            </div>
            <div class="form-error" id="signup-confirm-err"></div>
          </div>

          <div class="form-error mb-4" id="signup-form-err" role="alert"></div>

          <button type="submit" class="btn btn-primary w-full" id="signup-submit-btn">Create Local Account</button>
        </form>

        <p class="text-sm text-muted mt-6" style="text-align:center;">
          Already have a local account? <a href="#signin">Sign In</a>
        </p>
      </div>
    </div>
  `;

  bindPasswordToggles(container);
  refreshIcons();

  const form = container.querySelector('#signup-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = container.querySelector('#signup-name').value;
    const emailVal = container.querySelector('#signup-email').value;
    const passVal = container.querySelector('#signup-password').value;
    const confirmVal = container.querySelector('#signup-confirm').value;
    const submitBtn = container.querySelector('#signup-submit-btn');

    ['name', 'email', 'password', 'confirm', 'form'].forEach((k) => {
      container.querySelector(`#signup-${k}-err`).textContent = '';
    });

    const nCheck = validateFullName(nameVal);
    const eCheck = validateEmail(emailVal);
    const pCheck = validatePassword(passVal);
    const cCheck = validateConfirmPassword(passVal, confirmVal);

    let hasErr = false;
    if (!nCheck.valid) { container.querySelector('#signup-name-err').textContent = nCheck.message; hasErr = true; }
    if (!eCheck.valid) { container.querySelector('#signup-email-err').textContent = eCheck.message; hasErr = true; }
    if (!pCheck.valid) { container.querySelector('#signup-password-err').textContent = pCheck.message; hasErr = true; }
    if (!cCheck.valid) { container.querySelector('#signup-confirm-err').textContent = cCheck.message; hasErr = true; }
    if (hasErr) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Securing local account...';
    try {
      const user = await createAccount({
        fullName: nCheck.value,
        email: eCheck.value,
        password: pCheck.value
      });
      showToast('Account created in local IndexedDB.', 'success');
      onAuthSuccess(user, '#onboarding');
    } catch (err) {
      container.querySelector('#signup-form-err').textContent = err.message || 'Could not create account.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Local Account';
    }
  });
}

export function renderForgotPasswordView(container) {
  container.innerHTML = `
    <div class="auth-container fade-in">
      <div class="card">
        <div class="page-eyebrow">Local Account Recovery Notice</div>
        <h1 style="font-size:1.55rem;">Forgot Password?</h1>
        <p class="text-sm text-secondary mt-3">
          Because AETHER runs 100% locally in your browser without a remote server or email backend, it cannot email password reset links and does not store plaintext passwords.
        </p>
        <div class="alert-banner alert-warning mt-4 mb-5">
          <i data-lucide="shield-alert" style="width:18px;height:18px;flex-shrink:0;color:var(--accent-amber);"></i>
          <div>
            <strong>Your Options:</strong>
            <ul style="margin:6px 0 0;padding-left:1.1rem;">
              <li>If you are signed in on this browser, change your password in <a href="#settings">Settings</a>.</li>
              <li>If you previously exported a JSON backup, create a new local account and import your backup file to restore all learning progress, bookmarks, and achievements.</li>
            </ul>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="#signin" class="btn btn-primary">Back to Sign In</a>
          <a href="#signup" class="btn btn-secondary">Create New Account</a>
        </div>
      </div>
    </div>
  `;
  refreshIcons();
}

export function renderOnboardingView(container, state, { onUserUpdated }) {
  if (!state.user) {
    window.location.hash = '#signin';
    return;
  }

  let selectedLevel = state.user.profile?.level || 'Beginner';
  const selectedInterests = new Set(state.user.profile?.interests || []);

  const renderInner = () => {
    container.innerHTML = `
      <div class="auth-hero-card fade-in" style="text-align:left;">
        <div class="page-eyebrow">Mission Briefing — Personalization</div>
        <h1>Welcome aboard, ${escapeHtml(state.user.fullName)}</h1>
        <p class="text-muted mb-6">Tell AETHER your astronomy background and favorite subjects so we can recommend the right Space Academy learning path.</p>

        <div class="mb-6">
          <h3 class="mb-3">1. Select Your Astronomy Learning Level</h3>
          <div class="grid-3">
            ${['Beginner', 'Intermediate', 'Advanced'].map((lvl) => `
              <button type="button" class="card card-interactive ${selectedLevel === lvl ? 'badge-cyan' : ''}" data-level="${lvl}" style="text-align:left;cursor:pointer;${selectedLevel === lvl ? 'border-color:var(--accent-cyan);background:var(--accent-cyan-dim);' : ''}">
                <strong style="display:block;color:var(--text-primary);margin-bottom:4px;">${lvl}</strong>
                <span class="text-xs text-muted">
                  ${lvl === 'Beginner' ? 'Foundations, Solar System & space history' : lvl === 'Intermediate' ? 'Planetary science, stars, galaxies & spacecraft' : 'Orbital mechanics, black holes & relativity'}
                </span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="mb-6">
          <h3 class="mb-3">2. Choose Your Areas of Interest</h3>
          <div class="interest-grid">
            ${INTEREST_OPTIONS.map((topic) => `
              <button type="button" class="interest-chip ${selectedInterests.has(topic) ? 'selected' : ''}" data-interest="${escapeHtml(topic)}">
                <i data-lucide="${selectedInterests.has(topic) ? 'check-circle-2' : 'circle'}" style="width:16px;height:16px;"></i>
                <span>${escapeHtml(topic)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="flex flex-wrap gap-3 justify-between items-center">
          <a href="#dashboard" class="btn btn-ghost">Skip for now</a>
          <button type="button" class="btn btn-primary" id="finish-onboarding-btn">Launch Mission Control</button>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedLevel = btn.dataset.level;
        renderInner();
      });
    });

    container.querySelectorAll('[data-interest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.interest;
        if (selectedInterests.has(t)) selectedInterests.delete(t);
        else selectedInterests.add(t);
        renderInner();
      });
    });

    container.querySelector('#finish-onboarding-btn').addEventListener('click', async () => {
      const pathMap = {
        Beginner: 'astronomy-beginner',
        Intermediate: 'planetary-science',
        Advanced: 'orbital-mechanics'
      };
      const updated = await updateUserProfile(state.user.id, {
        level: selectedLevel,
        interests: Array.from(selectedInterests),
        currentPathId: pathMap[selectedLevel] || 'astronomy-beginner',
        onboardingCompleted: true
      });
      showToast('Learning preferences saved.', 'success');
      onUserUpdated(updated, '#dashboard');
    });

    refreshIcons();
  };

  renderInner();
}
