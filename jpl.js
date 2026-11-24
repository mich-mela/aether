/**
 * AETHER NASA JPL Small-Body / Close-Approach API Client
 * Official documentation: https://ssd-api.jpl.nasa.gov/doc/
 * Note: JPL SSD APIs may restrict direct browser CORS requests depending on endpoint.
 * Falls back cleanly to verified historical educational reference data without inventing live events.
 */

const JPL_CACHE_KEY = 'aether_cache_jpl_cad_v1';

export const HISTORICAL_JPL_REFERENCE = {
  sourceName: 'NASA JPL Center for Near-Earth Object Studies (CNEOS)',
  sourceUrl: 'https://cneos.jpl.nasa.gov/',
  dataStatus: 'Historical',
  note: 'Direct browser access to some JPL SSD endpoints can be blocked by CORS or offline mode. Shown below are verified historical reference records from NASA JPL CNEOS.',
  records: [
    {
      designation: '99942 Apophis',
      date: '2029-04-13',
      distanceLd: '0.10 LD (~31,600 km above surface)',
      velocityKmS: '7.42 km/s',
      category: 'Notable Verified Future Flyby (No Impact Risk per NASA JPL)'
    },
    {
      designation: '433 Eros',
      date: '2012-01-31',
      distanceLd: '69.5 LD (0.179 AU)',
      velocityKmS: '5.92 km/s',
      category: 'Historic Near-Earth Asteroid (Visited by NEAR Shoemaker)'
    },
    {
      designation: '101955 Bennu',
      date: '2020-10-20',
      distanceLd: 'Sampled in orbit by OSIRIS-REx',
      velocityKmS: '6.14 km/s',
      category: 'Potentially Hazardous Asteroid (Sample returned Sep 2023)'
    }
  ]
};

export async function fetchJplCloseApproaches() {
  try {
    const cached = JSON.parse(localStorage.getItem(JPL_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.savedAt < 6 * 60 * 60 * 1000) {
      return { ...cached.data, dataStatus: 'Cached' };
    }
  } catch {
    // Ignore cache parse error
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ssd-api.jpl.nasa.gov/cad.api?dist-max=0.05&limit=5', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const fields = json.fields || [];
    const idxDes = fields.indexOf('des');
    const idxCd = fields.indexOf('cd');
    const idxDist = fields.indexOf('dist');
    const idxVrel = fields.indexOf('v_rel');

    const records = (json.data || []).map((row) => ({
      designation: row[idxDes] || 'Unknown',
      date: row[idxCd] || '—',
      distanceLd: row[idxDist] ? `${(Number(row[idxDist]) * 389.17).toFixed(2)} LD` : '—',
      velocityKmS: row[idxVrel] ? `${Number(row[idxVrel]).toFixed(2)} km/s` : '—',
      category: 'JPL CNEOS Close-Approach Data'
    }));

    if (records.length) {
      const payload = {
        sourceName: 'NASA JPL SSD Close-Approach API',
        sourceUrl: 'https://ssd-api.jpl.nasa.gov/doc/cad.html',
        dataStatus: 'Live',
        fetchedAt: new Date().toISOString(),
        note: 'Retrieved live from NASA JPL SSD CAD API.',
        records
      };
      try {
        localStorage.setItem(JPL_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: payload }));
      } catch {
        // Ignore storage error
      }
      return payload;
    }
    return HISTORICAL_JPL_REFERENCE;
  } catch {
    return HISTORICAL_JPL_REFERENCE;
  }
}
