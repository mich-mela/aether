/**
 * AETHER Centralized Scientific Data Service
 * Coordinates static verified datasets and live/cached public APIs.
 */

import { fetchNasaApod, searchNasaImages } from './nasa.js';
import { fetchJplCloseApproaches } from './jpl.js';
import { PLANETS } from './data-planets.js';
import { MISSIONS } from './data-missions.js';
import { DEEP_SPACE_OBJECTS } from './data-deep-space.js';
import { TIMELINE_EVENTS } from './data-timeline.js';
import { COURSES, LEARNING_PATHS } from './data-courses.js';
import { LESSONS } from './data-lessons.js';
import { SATELLITES, GALLERY_ITEMS } from './data-initial.js';

export async function getDashboardData() {
  const [apod, jpl] = await Promise.all([fetchNasaApod(), fetchJplCloseApproaches()]);
  return {
    apod,
    jpl,
    stats: {
      planetsCount: PLANETS.length,
      missionsCount: MISSIONS.length,
      deepSpaceCount: DEEP_SPACE_OBJECTS.length,
      coursesCount: COURSES.length,
      lessonsCount: LESSONS.length,
      pathsCount: LEARNING_PATHS.length,
      satellitesCount: SATELLITES.length,
      galleryCount: GALLERY_ITEMS.length
    }
  };
}

export function getAllSearchableItems() {
  const items = [];
  for (const p of PLANETS) {
    items.push({ type: 'Planet', id: p.id, title: p.name, subtitle: `${p.classification} • ${p.distanceFromSun}`, route: `#planets/${p.id}`, keywords: `${p.name} ${p.classification} ${p.description}` });
  }
  for (const m of MISSIONS) {
    items.push({ type: 'Mission', id: m.id, title: m.name, subtitle: `${m.agency} • ${m.status}`, route: `#missions/${m.id}`, keywords: `${m.name} ${m.agency} ${m.destination} ${m.objectives.join(' ')}` });
  }
  for (const s of SATELLITES) {
    items.push({ type: 'Satellite', id: s.id, title: s.name, subtitle: `${s.category} • ${s.orbitRegime}`, route: `#satellites`, keywords: `${s.name} ${s.category} ${s.agency} ${s.purpose}` });
  }
  for (const d of DEEP_SPACE_OBJECTS) {
    items.push({ type: 'Deep Space', id: d.id, title: d.name, subtitle: `${d.category} • ${d.distance}`, route: `#deep-space/${d.id}`, keywords: `${d.name} ${d.category} ${d.description}` });
  }
  for (const c of COURSES) {
    items.push({ type: 'Course', id: c.id, title: c.title, subtitle: `${c.difficulty} • ${c.duration}`, route: `#academy`, keywords: `${c.title} ${c.summary} ${c.difficulty}` });
  }
  for (const l of LESSONS) {
    items.push({ type: 'Lesson', id: l.id, title: l.title, subtitle: `Space Academy • ${l.duration}`, route: `#lesson/${l.id}`, keywords: `${l.title} ${l.intro}` });
  }
  for (const t of TIMELINE_EVENTS) {
    items.push({ type: 'Timeline', id: t.id, title: `${t.year} — ${t.title}`, subtitle: t.date, route: `#timeline`, keywords: `${t.title} ${t.year} ${t.description}` });
  }
  for (const g of GALLERY_ITEMS) {
    items.push({ type: 'Gallery', id: g.id, title: g.title, subtitle: `${g.category} • ${g.credit}`, route: `#gallery`, keywords: `${g.title} ${g.category} ${g.description}` });
  }
  return items;
}

export { fetchNasaApod, searchNasaImages, fetchJplCloseApproaches };
