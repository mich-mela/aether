/**
 * AETHER — Main Application Entry Point
 * Initializes theme, IndexedDB (AETHER_DATABASE), session restoration, router, and all 17 platform views.
 */

import { Router } from './router.js';
import { initDatabase } from './db.js';
import { restoreSession } from './users-db.js';
import { applyReducedMotion, applyTheme, getPref } from './storage.js';
import { renderNavigation } from './navigation.js';
import { renderFooter } from './footer.js';
import { showToast } from './components.js';

import {
  renderForgotPasswordView,
  renderOnboardingView,
  renderSignInView,
  renderSignUpView,
  renderWelcomeView
} from './auth.js';
import { renderDashboardView } from './dashboard.js';
import { renderSolarSystemView } from './solar-system.js';
import { renderPlanetsView } from './planets.js';
import { renderMissionsView } from './missions.js';
import { renderSatellitesView } from './satellites.js';
import { renderSimulatorView } from './simulator.js';
import { renderDeepSpaceView } from './deep-space.js';
import { renderAcademyView } from './academy.js';
import { renderLearningPathsView } from './learning-paths.js';
import { renderLessonView } from './lessons.js';
import { renderQuizView } from './quizzes.js';
import { renderTimelineView } from './timeline.js';
import { renderGalleryView } from './gallery.js';
import { renderSearchView } from './search.js';
import { renderFavoritesView } from './favorites.js';
import { renderNotificationsView } from './notifications.js';
import { renderProfileView } from './profile.js';
import { renderSettingsView } from './settings.js';
import { renderAboutView } from './about.js';

const state = {
  user: null,
  dbReady: false,
  activeRoute: 'dashboard'
};

const router = new Router();

function refreshNav() {
  renderNavigation(state, state.activeRoute, (target) => router.navigate(target));
}

function handleAuthSuccess(user, redirectHash = '#dashboard') {
  state.user = user;
  refreshNav();
  router.navigate(redirectHash);
}

function handleUserUpdated(user, redirectHash = null) {
  state.user = user;
  refreshNav();
  if (redirectHash) router.navigate(redirectHash);
}

function handleLogout() {
  state.user = null;
  refreshNav();
  router.navigate('#welcome');
}

async function bootstrap() {
  // 1. Apply persisted UI theme and reduced motion preferences
  applyTheme(getPref('theme', 'dark'));
  applyReducedMotion(getPref('reducedMotion', false));

  // 2. Initialize IndexedDB and restore active local session if present
  try {
    await initDatabase();
    state.dbReady = true;
    state.user = await restoreSession();
  } catch (err) {
    state.dbReady = false;
    showToast(err.message || 'IndexedDB storage is unavailable.', 'warning', 6000);
  }

  // 3. Render persistent footer & initial navigation
  renderFooter();

  const mainEl = document.getElementById('main-content');

  // 4. Register all application routes
  router.register('welcome', () => renderWelcomeView(mainEl, state));
  router.register('signin', () => renderSignInView(mainEl, { onAuthSuccess: handleAuthSuccess }));
  router.register('signup', () => renderSignUpView(mainEl, { onAuthSuccess: handleAuthSuccess }));
  router.register('forgot-password', () => renderForgotPasswordView(mainEl));
  router.register('onboarding', () => renderOnboardingView(mainEl, state, { onUserUpdated: handleUserUpdated }));

  router.register('dashboard', () => renderDashboardView(mainEl, state));
  router.register('solar-system', () => renderSolarSystemView(mainEl, state));
  router.register('planets', ({ param }) => renderPlanetsView(mainEl, state, param));
  router.register('missions', ({ param }) => renderMissionsView(mainEl, state, param));
  router.register('satellites', () => renderSatellitesView(mainEl, state));
  router.register('simulator', () => renderSimulatorView(mainEl, state));
  router.register('deep-space', ({ param }) => renderDeepSpaceView(mainEl, state, param));
  router.register('academy', () => renderAcademyView(mainEl, state));
  router.register('learning-paths', () => renderLearningPathsView(mainEl, state, { onUserUpdated: handleUserUpdated }));
  router.register('lesson', ({ param }) => renderLessonView(mainEl, state, param));
  router.register('quiz', ({ param }) => renderQuizView(mainEl, state, param));
  router.register('timeline', () => renderTimelineView(mainEl));
  router.register('gallery', () => renderGalleryView(mainEl, state));
  router.register('search', ({ query }) => renderSearchView(mainEl, query.get('q') || ''));
  router.register('favorites', () => renderFavoritesView(mainEl, state));
  router.register('notifications', () => renderNotificationsView(mainEl, state, { onRefreshNav: refreshNav }));
  router.register('profile', () => renderProfileView(mainEl, state, { onUserUpdated: handleUserUpdated, onLogout: handleLogout }));
  router.register('settings', () => renderSettingsView(mainEl, state, { onLogout: handleLogout, onRefreshNav: refreshNav }));
  router.register('about', () => renderAboutView(mainEl));

  router.setOnNavigate(({ route }) => {
    state.activeRoute = route;
    refreshNav();
  });

  if (!window.location.hash) {
    window.location.hash = state.user ? '#dashboard' : '#dashboard';
  }

  router.start();
}

window.addEventListener('DOMContentLoaded', bootstrap);
