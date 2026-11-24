/**
 * AETHER Initial Seed Data — Satellites Catalog, Curated NASA/ESA Gallery & APOD Fallback
 */

export const APOD_FALLBACK = {
  title: 'The Pillars of Creation in the Eagle Nebula (M16)',
  date: 'Historical Reference',
  explanation: 'Captured by NASA’s Hubble and James Webb Space Telescopes, these towering columns of cool interstellar hydrogen and dust span roughly 4 to 5 light-years inside the Eagle Nebula, ~6,500 light-years away in the constellation Serpens.',
  url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~medium.jpg',
  mediaType: 'image',
  copyright: 'NASA, ESA, CSA, STScI'
};

export const SATELLITES = [
  {
    id: 'iss',
    name: 'International Space Station (ISS)',
    noradId: '25544',
    category: 'Space Station',
    agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
    orbitRegime: 'Low Earth Orbit (LEO)',
    altitudeKm: 420,
    inclinationDeg: 51.64,
    periodMin: 92.9,
    speedKmS: 7.66,
    purpose: 'Continuously crewed microgravity laboratory for space medicine, Earth observation, and orbital engineering.',
    sourceLabel: 'NASA ISS Mission',
    sourceUrl: 'https://www.nasa.gov/'
  },
  {
    id: 'hst',
    name: 'Hubble Space Telescope (HST)',
    noradId: '20580',
    category: 'Space Observatory',
    agency: 'NASA / ESA',
    orbitRegime: 'Low Earth Orbit (LEO)',
    altitudeKm: 525,
    inclinationDeg: 28.47,
    periodMin: 95.1,
    speedKmS: 7.60,
    purpose: '2.4-meter UV, visible, and near-infrared astrophysics observatory above Earth’s atmosphere.',
    sourceLabel: 'NASA Hubble',
    sourceUrl: 'https://science.nasa.gov/mission/hubble/'
  },
  {
    id: 'landsat-9',
    name: 'Landsat 9',
    noradId: '49260',
    category: 'Earth Observation',
    agency: 'NASA / USGS',
    orbitRegime: 'Sun-Synchronous LEO',
    altitudeKm: 705,
    inclinationDeg: 98.2,
    periodMin: 98.9,
    speedKmS: 7.50,
    purpose: 'Multispectral land imaging monitoring forests, agriculture, glaciers, and water resources.',
    sourceLabel: 'NASA Earth Observatory',
    sourceUrl: 'https://earthobservatory.nasa.gov/'
  },
  {
    id: 'sentinel-2a',
    name: 'Copernicus Sentinel-2A',
    noradId: '40697',
    category: 'Earth Observation',
    agency: 'ESA / European Commission',
    orbitRegime: 'Sun-Synchronous LEO',
    altitudeKm: 786,
    inclinationDeg: 98.62,
    periodMin: 100.6,
    speedKmS: 7.46,
    purpose: 'High-resolution optical Earth observation supporting land monitoring and emergency response.',
    sourceLabel: 'ESA Earth Observation',
    sourceUrl: 'https://www.esa.int/'
  },
  {
    id: 'terra',
    name: 'Terra (EOS AM-1)',
    noradId: '25994',
    category: 'Climate & Science',
    agency: 'NASA',
    orbitRegime: 'Sun-Synchronous LEO',
    altitudeKm: 705,
    inclinationDeg: 98.2,
    periodMin: 98.8,
    speedKmS: 7.50,
    purpose: 'Flagship Earth Observing System satellite measuring aerosols, clouds, radiation budget, and wildfires.',
    sourceLabel: 'NASA Earthdata',
    sourceUrl: 'https://www.earthdata.nasa.gov/'
  },
  {
    id: 'gps-iii',
    name: 'GPS III Navigation Constellation',
    noradId: '43873',
    category: 'Navigation (GNSS)',
    agency: 'U.S. Space Force',
    orbitRegime: 'Medium Earth Orbit (MEO)',
    altitudeKm: 20200,
    inclinationDeg: 55.0,
    periodMin: 718.0,
    speedKmS: 3.87,
    purpose: 'Global positioning, navigation, and atomic-clock timing signals.',
    sourceLabel: 'NASA Space Communications',
    sourceUrl: 'https://www.nasa.gov/'
  },
  {
    id: 'goes-18',
    name: 'GOES-18 (GOES-West)',
    noradId: '51850',
    category: 'Weather & Space Weather',
    agency: 'NOAA / NASA',
    orbitRegime: 'Geostationary Orbit (GEO)',
    altitudeKm: 35786,
    inclinationDeg: 0.05,
    periodMin: 1436.1,
    speedKmS: 3.07,
    purpose: 'Continuous geostationary weather monitoring, lightning mapping, and solar X-ray space weather alerts.',
    sourceLabel: 'NASA Science',
    sourceUrl: 'https://science.nasa.gov/'
  },
  {
    id: 'jwst-l2',
    name: 'James Webb Space Telescope',
    noradId: '50463',
    category: 'Deep-Space Observatory',
    agency: 'NASA / ESA / CSA',
    orbitRegime: 'Sun-Earth L2 Halo Orbit',
    altitudeKm: 1500000,
    inclinationDeg: 0.0,
    periodMin: 525600,
    speedKmS: 0.25,
    purpose: 'Infrared space observatory positioned ~1.5 million km beyond Earth’s night side.',
    sourceLabel: 'NASA JWST',
    sourceUrl: 'https://webb.nasa.gov/'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-earthrise',
    title: 'Apollo 8 Earthrise',
    category: 'Planetary',
    date: '1968-12-24',
    credit: 'NASA / Bill Anders (Apollo 8)',
    description: 'Earth rising above the battered lunar horizon photographed from lunar orbit by Apollo 8 astronaut William Anders.',
    imageUrl: 'https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~medium.jpg',
    palette: ['#1E6091', '#90E0EF', '#050B14'],
    variant: 'planet',
    sourceUrl: 'https://images.nasa.gov/details/as08-14-2383'
  },
  {
    id: 'gal-pillars',
    title: 'Pillars of Creation (Eagle Nebula)',
    category: 'Nebulae',
    date: '2015-01-05',
    credit: 'NASA, ESA, Hubble Heritage Team',
    description: 'Columns of interstellar gas and dust in the Eagle Nebula (M16) sculpted by ultraviolet radiation from young massive stars.',
    imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~medium.jpg',
    palette: ['#8C5A2B', '#35D6F2', '#0A1220'],
    variant: 'nebula',
    sourceUrl: 'https://images.nasa.gov/'
  },
  {
    id: 'gal-saturn-cassini',
    title: 'Saturn & Its Ring System',
    category: 'Planetary',
    date: '2008-07-23',
    credit: 'NASA / JPL-Caltech / Space Science Institute',
    description: 'Natural-color mosaic of Saturn and its icy rings captured by NASA’s Cassini spacecraft.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA11141/PIA11141~medium.jpg',
    palette: ['#C5AD7B', '#EADBB8', '#1C1810'],
    variant: 'ringed',
    sourceUrl: 'https://images.nasa.gov/details/PIA11141'
  },
  {
    id: 'gal-jupiter-juno',
    title: 'Jupiter Atmospheric Cyclones (Juno)',
    category: 'Planetary',
    date: '2019-02-12',
    credit: 'NASA / JPL-Caltech / SwRI / MSSS',
    description: 'Turbulent swirling cloud belts and anticyclonic storms in Jupiter’s southern hemisphere imaged by JunoCam.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA22946/PIA22946~medium.jpg',
    palette: ['#B57E52', '#E3C3A3', '#2B1B0F'],
    variant: 'planet',
    sourceUrl: 'https://images.nasa.gov/details/PIA22946'
  },
  {
    id: 'gal-andromeda',
    title: 'Andromeda Galaxy (M31)',
    category: 'Galaxies',
    date: '2012-03-01',
    credit: 'NASA / JPL-Caltech / GALEX',
    description: 'Ultraviolet view of our nearest major spiral neighbor showing rings of intense star formation.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA15416/PIA15416~medium.jpg',
    palette: ['#3B5998', '#90CAF9', '#07111F'],
    variant: 'galaxy',
    sourceUrl: 'https://images.nasa.gov/details/PIA15416'
  },
  {
    id: 'gal-orion',
    title: 'Orion Nebula (M42)',
    category: 'Nebulae',
    date: '2006-01-11',
    credit: 'NASA, ESA, M. Robberto (STScI)',
    description: 'Panoramic mosaic of the Orion Nebula revealing thousands of young stars and glowing ionized hydrogen filaments.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA08653/PIA08653~medium.jpg',
    palette: ['#9D3B72', '#35D6F2', '#090F1E'],
    variant: 'nebula',
    sourceUrl: 'https://images.nasa.gov/details/PIA08653'
  },
  {
    id: 'gal-perseverance',
    title: 'Perseverance Sky-Crane Descent on Mars',
    category: 'Missions',
    date: '2021-02-18',
    credit: 'NASA / JPL-Caltech',
    description: 'High-resolution engineering camera view of Perseverance lowered toward Jezero Crater by its rocket-powered descent stage.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
    palette: ['#9E3F24', '#E07A5F', '#1F0C07'],
    variant: 'mission',
    sourceUrl: 'https://images.nasa.gov/details/PIA24542'
  },
  {
    id: 'gal-hubble',
    title: 'Hubble Space Telescope Over Earth',
    category: 'Missions',
    date: '2009-05-19',
    credit: 'NASA (STS-125)',
    description: 'Hubble photographed after release from Space Shuttle Atlantis following Servicing Mission 4.',
    imageUrl: 'https://images-assets.nasa.gov/image/sts125-s-005/sts125-s-005~medium.jpg',
    palette: ['#1D4E89', '#35D6F2', '#07111F'],
    variant: 'mission',
    sourceUrl: 'https://images.nasa.gov/details/sts125-s-005'
  },
  {
    id: 'gal-crab',
    title: 'Crab Nebula Supernova Remnant (M1)',
    category: 'Deep Space',
    date: '2005-12-01',
    credit: 'NASA, ESA, J. Hester & A. Loll',
    description: 'Expanding filamentary remnant of the 1054 CE supernova powered by a central spinning neutron star.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA03606/PIA03606~medium.jpg',
    palette: ['#B34E3C', '#5BD3F0', '#0A101E'],
    variant: 'nebula',
    sourceUrl: 'https://images.nasa.gov/details/PIA03606'
  }
];
