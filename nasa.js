/**
 * AETHER NASA Public API Client
 * Official endpoints: https://api.nasa.gov/ and https://images-api.nasa.gov/
 * Handles rate limits, offline fallback, caching, and clear data classification.
 */

import { getPref } from './storage.js';
import { APOD_FALLBACK } from './data-initial.js';

const APOD_CACHE_KEY = 'aether_cache_apod_v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Ignore quota errors
  }
}

export async function fetchNasaApod() {
  const cached = readCache(APOD_CACHE_KEY);
  const todayUtc = new Date().toISOString().slice(0, 10);

  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS && cached.data?.date === todayUtc) {
    return {
      ...cached.data,
      dataStatus: 'Cached',
      fetchedAt: new Date(cached.savedAt).toISOString(),
      sourceUrl: 'https://apod.nasa.gov/apod/astropix.html'
    };
  }

  const apiKey = (getPref('nasaApiKey', 'DEMO_KEY') || 'DEMO_KEY').trim();
  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`NASA APOD returned HTTP ${res.status}`);
    }
    const json = await res.json();
    const normalized = {
      title: json.title,
      date: json.date,
      explanation: json.explanation,
      url: json.media_type === 'image' ? json.url : APOD_FALLBACK.url,
      mediaType: json.media_type || 'image',
      copyright: json.copyright || 'NASA / Public Domain'
    };
    writeCache(APOD_CACHE_KEY, normalized);
    return {
      ...normalized,
      dataStatus: 'Live',
      fetchedAt: new Date().toISOString(),
      sourceUrl: 'https://apod.nasa.gov/apod/astropix.html'
    };
  } catch {
    if (cached && cached.data) {
      return {
        ...cached.data,
        dataStatus: 'Cached',
        fetchedAt: new Date(cached.savedAt).toISOString(),
        sourceUrl: 'https://apod.nasa.gov/apod/astropix.html'
      };
    }
    return {
      ...APOD_FALLBACK,
      dataStatus: 'Historical',
      fetchedAt: null,
      sourceUrl: 'https://apod.nasa.gov/apod/astropix.html'
    };
  }
}

export async function searchNasaImages(query, limit = 8) {
  const q = String(query || '').trim();
  if (!q) return { items: [], dataStatus: 'Historical' };

  const endpoint = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=${limit}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const items = (json?.collection?.items || []).slice(0, limit).map((item) => {
      const meta = item.data?.[0] || {};
      const link = item.links?.find((l) => l.rel === 'preview') || item.links?.[0];
      return {
        id: meta.nasa_id || `nasa_${Math.random().toString(36).slice(2)}`,
        title: meta.title || 'NASA Archive Image',
        description: meta.description || '',
        dateCreated: meta.date_created ? meta.date_created.slice(0, 10) : '',
        center: meta.center || 'NASA',
        credit: meta.secondary_creator || meta.center || 'NASA',
        imageUrl: link?.href || '',
        sourceUrl: meta.nasa_id ? `https://images.nasa.gov/details/${encodeURIComponent(meta.nasa_id)}` : 'https://images.nasa.gov/'
      };
    }).filter((x) => x.imageUrl);

    return { items, dataStatus: 'Live', fetchedAt: new Date().toISOString() };
  } catch {
    return { items: [], dataStatus: 'Cached', error: 'NASA Image Library is currently unreachable; displaying local verified archive.' };
  }
}
