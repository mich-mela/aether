/**
 * AETHER Hash-Based SPA Router
 * Supports parameterized routes (e.g. #planets/mars, #lesson/intro-astronomy-1)
 * and clean view teardown hooks (important for Three.js & Canvas animation cleanup).
 */

export class Router {
  constructor() {
    this.routes = [];
    this.currentCleanup = null;
    this.onNavigateCallback = null;
  }

  register(pattern, handler) {
    this.routes.push({ pattern, handler });
  }

  setOnNavigate(cb) {
    this.onNavigateCallback = cb;
  }

  parseHash(rawHash = window.location.hash) {
    const cleaned = (rawHash || '#dashboard').replace(/^#\/?/, '');
    const [pathPart, queryPart] = cleaned.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    const params = new URLSearchParams(queryPart || '');
    return {
      full: cleaned || 'dashboard',
      route: segments[0] || 'dashboard',
      param: segments[1] ? decodeURIComponent(segments[1]) : null,
      query: params
    };
  }

  navigate(hash) {
    const target = hash.startsWith('#') ? hash : `#${hash}`;
    if (window.location.hash === target) {
      this.resolve();
    } else {
      window.location.hash = target;
    }
  }

  async resolve() {
    if (typeof this.currentCleanup === 'function') {
      try {
        this.currentCleanup();
      } catch {
        // Ignore cleanup errors
      }
      this.currentCleanup = null;
    }

    const parsed = this.parseHash();
    const match = this.routes.find((r) => r.pattern === parsed.route) || this.routes.find((r) => r.pattern === 'dashboard');

    if (typeof this.onNavigateCallback === 'function') {
      this.onNavigateCallback(parsed);
    }

    if (match) {
      const cleanup = await match.handler(parsed);
      if (typeof cleanup === 'function') {
        this.currentCleanup = cleanup;
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  start() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  }
}
