/**
 * AETHER Space Academy — Structured Lessons & Quizzes across all 16 Courses
 * Every lesson includes introduction, structured sections, key facts, diagram spec,
 * knowledge check, and verified institutional references.
 */

export const LESSONS = [
  {
    id: 'intro-astronomy-1',
    courseId: 'intro-astronomy',
    order: 1,
    title: 'Cosmic Scales & The Electromagnetic Spectrum',
    duration: '15 min',
    intro: 'Astronomy measures phenomena spanning from subatomic fusion inside stars to galaxy superclusters billions of light-years away, decoded almost entirely through electromagnetic radiation.',
    sections: [
      {
        heading: 'Measuring Cosmic Distances',
        body: 'Because kilometers become unwieldy beyond Earth, astronomers use the Astronomical Unit (1 AU ≈ 149.6 million km, the mean Earth-Sun distance), the light-year (distance light travels in one Julian year, ~9.46 trillion km), and the parsec (~3.26 light-years).'
      },
      {
        heading: 'Multi-Wavelength Observation',
        body: 'Visible light is only a narrow slice of the electromagnetic spectrum. Radio arrays map cold hydrogen gas, infrared observatories like JWST pierce dusty nurseries, and X-ray telescopes reveal superheated plasma near black holes.'
      }
    ],
    facts: [
      'Light travels at 299,792,458 m/s in vacuum, taking ~8 minutes 20 seconds from the Sun to Earth.',
      'Earth’s atmosphere blocks most ultraviolet, X-ray, gamma-ray, and far-infrared radiation, motivating space-based observatories.'
    ],
    diagramLabel: 'Electromagnetic Spectrum: Gamma → X-Ray → UV → Visible (380–700 nm) → Infrared → Microwave → Radio',
    knowledgeCheck: {
      question: 'Which unit represents the average distance between Earth and the Sun?',
      options: ['Light-year', 'Astronomical Unit (AU)', 'Parsec', 'Kilometer'],
      answerIndex: 1,
      explanation: 'One Astronomical Unit (1 AU) is defined as 149,597,870.7 km, the mean Earth-Sun distance.'
    },
    references: [{ label: 'NASA Science — Electromagnetic Spectrum', url: 'https://science.nasa.gov/' }]
  },
  {
    id: 'intro-astronomy-2',
    courseId: 'intro-astronomy',
    order: 2,
    title: 'Telescopes & Observational Methods',
    duration: '20 min',
    intro: 'Modern astronomy combines large-aperture reflecting mirrors, adaptive optics, interferometry, and space telescopes to resolve faint and distant targets.',
    sections: [
      {
        heading: 'Aperture, Resolution & Spectroscopy',
        body: 'A telescope’s primary mirror diameter determines both its light-gathering power (proportional to area) and angular resolution. Splitting collected light into spectra reveals chemical composition, temperature, and radial velocity via the Doppler effect.'
      }
    ],
    facts: [
      'Doubling a telescope’s mirror diameter quadruples its light-collecting area.',
      'Spectroscopy identifies chemical elements by unique absorption and emission lines.'
    ],
    diagramLabel: 'Light Path: Primary Concave Mirror → Secondary Mirror → Spectrograph / Imaging Sensor',
    knowledgeCheck: {
      question: 'True or False: Spectroscopy can determine the chemical composition of distant stars and exoplanet atmospheres.',
      options: ['True', 'False'],
      answerIndex: 0,
      explanation: 'Each atom and molecule absorbs or emits light at characteristic wavelengths, producing a spectral fingerprint.'
    },
    references: [{ label: 'STScI Observatory Science', url: 'https://www.stsci.edu/' }]
  },
  {
    id: 'solar-system-1',
    courseId: 'solar-system',
    order: 1,
    title: 'Architecture of the Solar System',
    duration: '20 min',
    intro: 'Formed ~4.6 billion years ago from a collapsing solar nebula, the Solar System is organized into four inner rocky worlds, two gas giants, two ice giants, and icy small-body belts.',
    sections: [
      {
        heading: 'The Frost Line & Planetary Zones',
        body: 'Close to the young Sun, only metals and silicates could condense, forming Mercury, Venus, Earth, and Mars. Beyond the frost line, volatile ices condensed in abundance, enabling the rapid growth of Jupiter, Saturn, Uranus, and Neptune.'
      }
    ],
    facts: [
      'The Sun holds ~99.86% of the total mass of the Solar System.',
      'The Kuiper Belt beyond Neptune hosts icy dwarf planets including Pluto, Eris, Haumea, and Makemake.'
    ],
    diagramLabel: 'Zones: Sun → Terrestrial Planets (0.39–1.52 AU) → Asteroid Belt → Giant Planets (5.2–30 AU) → Kuiper Belt',
    knowledgeCheck: {
      question: 'Which two planets are classified as Ice Giants?',
      options: ['Jupiter and Saturn', 'Uranus and Neptune', 'Mars and Venus', 'Saturn and Neptune'],
      answerIndex: 1,
      explanation: 'Uranus and Neptune have interiors rich in heavier volatile "ices" (water, ammonia, methane) compared to H/He-dominated Jupiter and Saturn.'
    },
    references: [{ label: 'NASA Solar System Exploration', url: 'https://science.nasa.gov/solar-system/' }]
  },
  {
    id: 'the-sun-1',
    courseId: 'the-sun',
    order: 1,
    title: 'Solar Structure, Fusion & Space Weather',
    duration: '20 min',
    intro: 'Our Sun is a G2V main-sequence star powered by proton-proton nuclear fusion converting ~600 million metric tons of hydrogen into helium every second.',
    sections: [
      {
        heading: 'From Core to Corona',
        body: 'Energy generated at ~15 million K in the core travels outward through the radiative zone and convective zone before escaping from the 5,500 °C photosphere. Magnetic reconnection in the chromosphere and corona drives solar flares and coronal mass ejections.'
      }
    ],
    facts: [
      'The solar magnetic cycle reverses polarity roughly every 11 years (22-year Hale cycle).',
      'NASA’s Parker Solar Probe flies directly through the corona to study how it heats to over 1 million K.'
    ],
    diagramLabel: 'Solar Layers: Core (15M K) → Radiative Zone → Convective Zone → Photosphere → Chromosphere → Corona',
    knowledgeCheck: {
      question: 'What physical process powers the Sun’s core?',
      options: ['Chemical combustion', 'Nuclear fission of uranium', 'Proton-proton nuclear fusion of hydrogen', 'Gravitational tidal friction'],
      answerIndex: 2,
      explanation: 'Extreme core temperature and pressure fuse hydrogen nuclei into helium, releasing energy via E = mc².'
    },
    references: [{ label: 'NASA Sun Overview', url: 'https://science.nasa.gov/sun/' }]
  },
  {
    id: 'planetary-science-1',
    courseId: 'planetary-science',
    order: 1,
    title: 'Planetary Interiors, Atmospheres & Habitability',
    duration: '25 min',
    intro: 'Comparative planetology reveals why Earth hosts liquid oceans while neighboring Venus is a 464 °C furnace and Mars is a thin-atmosphere desert.',
    sections: [
      {
        heading: 'Greenhouse Physics & Magnetic Shielding',
        body: 'Planetary surface climate depends on solar irradiance, albedo, and atmospheric greenhouse gases. Meanwhile, liquid metallic cores generate magnetospheres that help protect atmospheres from solar wind stripping.'
      }
    ],
    facts: [
      'Venus’s thick CO₂ atmosphere produces a surface pressure ~92 times Earth’s.',
      'Mars lost its global dipole magnetic field early in its history, contributing to atmospheric erosion.'
    ],
    diagramLabel: 'Planetary Structure: Metallic Core → Silicate Mantle → Crust → Atmosphere / Magnetosphere',
    knowledgeCheck: {
      question: 'Why is Venus hotter than Mercury despite orbiting farther from the Sun?',
      options: ['Venus has a molten surface', 'Venus has a dense CO₂ runaway greenhouse atmosphere', 'Venus rotates faster', 'Venus has more moons'],
      answerIndex: 1,
      explanation: 'Venus’s 96.5% CO₂ atmosphere traps outgoing infrared radiation efficiently.'
    },
    references: [{ label: 'NASA Planetary Science', url: 'https://science.nasa.gov/planetary-science/' }]
  },
  {
    id: 'earths-moon-1',
    courseId: 'earths-moon',
    order: 1,
    title: 'Lunar Origins, Phases & Tides',
    duration: '15 min',
    intro: 'The Moon likely formed ~4.5 billion years ago from debris ejected when a Mars-sized protoplanet (Theia) collided with early Earth.',
    sections: [
      {
        heading: 'Tidal Locking & Lunar Geology',
        body: 'Gravitational tidal torques synchronized the Moon’s rotation with its 27.3-day orbital period, so the same nearside always faces Earth. Dark lunar maria are ancient basaltic lava plains, while bright highlands are older anorthositic crust.'
      }
    ],
    facts: [
      'The Moon is gradually receding from Earth by ~3.8 cm per year, measured by Apollo laser retroreflectors.',
      'Lunar phases are caused by the changing Sun-Earth-Moon viewing geometry, not Earth’s shadow.'
    ],
    diagramLabel: 'Earth-Moon System: Mean Distance 384,400 km • Tidally Locked 1:1 Spin-Orbit Ratio',
    knowledgeCheck: {
      question: 'True or False: Lunar phases are caused by Earth casting its shadow on the Moon.',
      options: ['True', 'False'],
      answerIndex: 1,
      explanation: 'False! Earth’s shadow causes lunar eclipses; monthly phases result from how much of the Moon’s sunlit hemisphere faces Earth.'
    },
    references: [{ label: 'NASA Moon Exploration', url: 'https://science.nasa.gov/moon/' }]
  },
  {
    id: 'stars-evolution-1',
    courseId: 'stars-evolution',
    order: 1,
    title: 'Stellar Life Cycles & The H-R Diagram',
    duration: '25 min',
    intro: 'A star’s initial mass dictates its luminosity, lifespan, and ultimate fate—from quiet white dwarfs to core-collapse supernovae and black holes.',
    sections: [
      {
        heading: 'Low-Mass vs. High-Mass Evolution',
        body: 'Sun-like stars spend ~10 billion years fusing hydrogen on the main sequence, expand into red giants, shed planetary nebulae, and leave carbon-oxygen white dwarfs. Stars above ~8 solar masses fuse heavier elements up to iron before collapsing as supernovae.'
      }
    ],
    facts: [
      'Low-mass red dwarfs can burn hydrogen steadily for trillions of years.',
      'Heavy elements such as oxygen, carbon, and iron were forged inside stars and supernovae.'
    ],
    diagramLabel: 'Evolution: Molecular Cloud → Main Sequence → Red Giant / Supergiant → White Dwarf / Neutron Star / Black Hole',
    knowledgeCheck: {
      question: 'Which stellar property primarily determines a star’s lifespan and final remnant?',
      options: ['Initial mass', 'Distance from Earth', 'Number of planets', 'Constellation location'],
      answerIndex: 0,
      explanation: 'More massive stars have far higher core pressures and fuse fuel much faster, living shorter lives.'
    },
    references: [{ label: 'NASA Stars Overview', url: 'https://science.nasa.gov/universe/stars/' }]
  },
  {
    id: 'galaxies-1',
    courseId: 'galaxies',
    order: 1,
    title: 'Galaxy Morphologies & Dark Matter Halos',
    duration: '20 min',
    intro: 'Galaxies are gravitationally bound assemblies of billions to trillions of stars, interstellar gas, dust, and dark matter halos.',
    sections: [
      {
        heading: 'Spirals, Ellipticals & Cosmic Web',
        body: 'Edwin Hubble classified galaxies into spirals (like the Milky Way and Andromeda), barred spirals, ellipticals, and irregulars. Flat galactic rotation curves provide compelling evidence that visible matter is embedded in much larger dark matter halos.'
      }
    ],
    facts: [
      'The observable universe contains an estimated hundreds of billions to over two trillion galaxies.',
      'Most large galaxies host a central supermassive black hole.'
    ],
    diagramLabel: 'Milky Way Profile: Central Bulge (Sgr A*) → Spiral Disk (~100,000 ly) → Dark Matter Halo',
    knowledgeCheck: {
      question: 'What observational evidence strongly indicates the presence of dark matter halos in spiral galaxies?',
      options: ['Flat outer orbital rotation curves', 'Blue star colors', 'Solar flares', 'Lunar tides'],
      answerIndex: 0,
      explanation: 'Outer stars orbit far faster than visible mass alone could gravitationally bind.'
    },
    references: [{ label: 'NASA Galaxies Science', url: 'https://science.nasa.gov/universe/galaxies/' }]
  },
  {
    id: 'nebulae-1',
    courseId: 'nebulae',
    order: 1,
    title: 'Interstellar Clouds: Star Nurseries & Remnants',
    duration: '15 min',
    intro: 'Nebulae are vast clouds of gas and cosmic dust where new stars ignite and dying stars return enriched material to the galaxy.',
    sections: [
      {
        heading: 'Five Major Nebula Types',
        body: 'Emission nebulae (like Orion M42) glow via ionized hydrogen; reflection nebulae scatter starlight; dark nebulae block background light; planetary nebulae are expelled shells of dying Sun-like stars; supernova remnants expand from massive stellar explosions.'
      }
    ],
    facts: [
      'The Pillars of Creation in M16 are evaporating gaseous globules actively forming stars.',
      'Planetary nebulae have nothing to do with planets; the name arose from their round telescopic appearance.'
    ],
    diagramLabel: 'Cosmic Recycling: Giant Molecular Cloud → Star Formation → Stellar Death → Enriched Nebula',
    knowledgeCheck: {
      question: 'Which nebula is the closest massive star-forming region to Earth?',
      options: ['Orion Nebula (M42)', 'Crab Nebula (M1)', 'Ring Nebula (M57)', 'Andromeda (M31)'],
      answerIndex: 0,
      explanation: 'At ~1,344 light-years away, the Orion Nebula is the nearest massive stellar nursery.'
    },
    references: [{ label: 'NASA Hubble Nebulae', url: 'https://science.nasa.gov/mission/hubble/' }]
  },
  {
    id: 'black-holes-1',
    courseId: 'black-holes',
    order: 1,
    title: 'Event Horizons, Relativity & Direct Imaging',
    duration: '25 min',
    intro: 'Predicted by Einstein’s General Relativity, black holes are regions where spacetime curvature is so extreme that nothing—not even light—can escape beyond the event horizon.',
    sections: [
      {
        heading: 'Schwarzschild Radius & Accretion Physics',
        body: 'For a non-rotating mass M, the event horizon radius is R_s = 2GM/c². While black holes emit no classical light, infalling matter forms glowing accretion disks and relativistic jets, allowing observatories like the Event Horizon Telescope to image black hole shadows such as M87* and Sgr A*.'
      }
    ],
    facts: [
      'A stellar-mass black hole of 10 solar masses has an event horizon radius of only ~30 km.',
      'Gravitational waves from merging black holes were first directly detected by LIGO in 2015.'
    ],
    diagramLabel: 'Anatomy: Singularity → Event Horizon (R_s = 2GM/c²) → Photon Sphere → Accretion Disk',
    knowledgeCheck: {
      question: 'Which observatory produced the first direct horizon-scale images of M87* and Sagittarius A*?',
      options: ['Event Horizon Telescope (EHT)', 'Voyager 1', 'Viking 1', 'Parker Solar Probe'],
      answerIndex: 0,
      explanation: 'The Event Horizon Telescope uses Earth-sized Very Long Baseline Interferometry (VLBI) at millimeter wavelengths.'
    },
    references: [{ label: 'NASA Black Holes', url: 'https://science.nasa.gov/universe/black-holes/' }]
  },
  {
    id: 'exoplanets-1',
    courseId: 'exoplanets',
    order: 1,
    title: 'Detecting & Characterizing Worlds Around Other Stars',
    duration: '20 min',
    intro: 'Over 5,500 confirmed exoplanets have been cataloged in the NASA Exoplanet Archive, spanning hot Jupiters, super-Earths, and temperate rocky worlds.',
    sections: [
      {
        heading: 'Transit Photometry & Radial Velocity',
        body: 'The transit method detects periodic dips in starlight when a planet crosses its host star’s disk, yielding planetary radius. Radial velocity measures the star’s gravitational wobble via Doppler shifts, yielding minimum mass. Together they reveal bulk density.'
      }
    ],
    facts: [
      'NASA’s Kepler and TESS space telescopes discovered the majority of known transiting exoplanets.',
      'JWST measures starlight filtered through exoplanet atmospheres during transits to detect CO₂, CH₄, and H₂O.'
    ],
    diagramLabel: 'Detection: Transit Depth ∝ (R_planet / R_star)² • Radial Velocity → Doppler Shift',
    knowledgeCheck: {
      question: 'Which detection method measures tiny periodic drops in a star’s brightness as a planet passes in front of it?',
      options: ['Transit photometry', 'Direct radar', 'Seismology', 'Astrometric parallax'],
      answerIndex: 0,
      explanation: 'Transit photometry measures brightness dips during planetary transits.'
    },
    references: [{ label: 'NASA Exoplanet Archive', url: 'https://exoplanetarchive.ipac.caltech.edu/' }]
  },
  {
    id: 'space-history-1',
    courseId: 'space-history',
    order: 1,
    title: 'From Sputnik 1 to International Space Stations',
    duration: '20 min',
    intro: 'In fewer than seven decades, humanity progressed from the first orbital radio beacon to lunar landings, interstellar probes, and continuous orbital laboratories.',
    sections: [
      {
        heading: 'Key Eras of Spaceflight',
        body: 'The 1957–1972 era achieved orbital flight (Sputnik 1, Vostok 1) and crewed lunar exploration (Apollo 11–17). Subsequent decades prioritized robotic planetary science (Viking, Voyager, Cassini, Mars rovers), space observatories (Hubble, JWST), and international cooperation on the ISS.'
      }
    ],
    facts: [
      'Apollo 11 landed on the Moon less than 12 years after Sputnik 1 launched.',
      'Humans have lived and worked continuously aboard the ISS since November 2000.'
    ],
    diagramLabel: 'Milestones: 1957 Sputnik → 1961 Vostok 1 → 1969 Apollo 11 → 1990 Hubble → 1998 ISS → 2021 JWST',
    knowledgeCheck: {
      question: 'In what year did Apollo 11 achieve the first crewed Moon landing?',
      options: ['1961', '1965', '1969', '1975'],
      answerIndex: 2,
      explanation: 'Apollo 11 landed on the Moon on July 20, 1969.'
    },
    references: [{ label: 'NASA History', url: 'https://www.nasa.gov/' }]
  },
  {
    id: 'spacecraft-satellites-1',
    courseId: 'spacecraft-satellites',
    order: 1,
    title: 'Spacecraft Subsystems & Orbital Regimes',
    duration: '20 min',
    intro: 'Every spacecraft integrates power, thermal control, attitude determination, propulsion, communications, and scientific payloads tailored to its target orbit.',
    sections: [
      {
        heading: 'LEO, MEO, GEO & Lagrange Points',
        body: 'Low Earth Orbit (LEO, 160–2,000 km) supports Earth observation and the ISS; Medium Earth Orbit (MEO, ~20,200 km) hosts GNSS navigation constellations; Geostationary Orbit (GEO, 35,786 km) matches Earth’s rotation for weather and communications; Sun-Earth L2 (~1.5M km) hosts infrared observatories like JWST.'
      }
    ],
    facts: [
      'Deep-space missions beyond Jupiter often use Radioisotope Thermoelectric Generators (RTGs) because sunlight weakens as 1/r².',
      'Reaction wheels and star trackers orient space telescopes to arcsecond precision.'
    ],
    diagramLabel: 'Altitude Bands: LEO (~400 km ISS) → MEO (~20,200 km GPS) → GEO (35,786 km) → L2 (1.5M km JWST)',
    knowledgeCheck: {
      question: 'At approximately what altitude above Earth’s equator does a Geostationary (GEO) satellite orbit?',
      options: ['400 km', '2,000 km', '20,200 km', '35,786 km'],
      answerIndex: 3,
      explanation: 'At 35,786 km altitude, a circular equatorial orbital period equals Earth’s sidereal rotation period.'
    },
    references: [{ label: 'ESA Space Engineering', url: 'https://www.esa.int/Science_Exploration' }]
  },
  {
    id: 'orbital-mechanics-1',
    courseId: 'orbital-mechanics',
    order: 1,
    title: 'Kepler’s Laws, Vis-Viva & Hohmann Transfers',
    duration: '25 min',
    intro: 'Orbital mechanics governs how spacecraft coast along conic sections and transition between orbits using propellant-efficient velocity changes (Δv).',
    sections: [
      {
        heading: 'Circular Velocity & Elliptical Transfers',
        body: 'For a circular orbit of radius r around mass M, orbital speed is v = √(GM/r). Elliptical orbits follow the vis-viva equation v² = GM(2/r − 1/a). A Hohmann transfer uses two tangential burns to shift efficiently between coplanar circular orbits.'
      }
    ],
    facts: [
      'Increasing velocity at periapsis raises apoapsis on the opposite side of the orbit.',
      'Voyager 2 used planetary gravity assists at Jupiter, Saturn, and Uranus to reach Neptune without massive propellant loads.'
    ],
    diagramLabel: 'Vis-Viva Equation: v = √( GM (2/r − 1/a) ) • Circular: v = √(GM/r)',
    knowledgeCheck: {
      question: 'In an elliptical orbit, where does a spacecraft travel fastest?',
      options: ['At apoapsis (farthest point)', 'At periapsis (closest point)', 'Speed is constant everywhere', 'Halfway between nodes'],
      answerIndex: 1,
      explanation: 'By Kepler’s Second Law (conservation of angular momentum), orbital speed peaks at periapsis.'
    },
    references: [{ label: 'NASA JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/' }]
  },
  {
    id: 'gravity-physics-1',
    courseId: 'gravity-physics',
    order: 1,
    title: 'Universal Gravitation & Escape Velocity',
    duration: '20 min',
    intro: 'Isaac Newton’s law of universal gravitation, F = G·m₁·m₂ / r², describes the attractive force binding moons, planets, stars, and galaxies.',
    sections: [
      {
        heading: 'Inverse-Square Law & Escape Velocity',
        body: 'Doubling the separation distance r reduces gravitational force to one-quarter. To escape a body’s gravitational well from distance r without further propulsion, an object must reach escape velocity v_esc = √(2GM/r), which equals √2 times circular orbital speed.'
      }
    ],
    facts: [
      'The universal gravitational constant is G ≈ 6.67430 × 10⁻¹¹ N·m²/kg².',
      'Earth’s surface escape velocity is approximately 11.186 km/s.'
    ],
    diagramLabel: 'Newton’s Law: F = G(m₁m₂)/r² • Escape Velocity: v_esc = √(2GM/r)',
    knowledgeCheck: {
      question: 'If the distance between two masses doubles while their masses stay constant, how does the gravitational force change?',
      options: ['It halves', 'It becomes one-quarter (1/4)', 'It doubles', 'It stays unchanged'],
      answerIndex: 1,
      explanation: 'Gravity follows an inverse-square law (1/r²), so doubling r reduces force by a factor of 2² = 4.'
    },
    references: [{ label: 'NASA Science — Gravity', url: 'https://science.nasa.gov/' }]
  },
  {
    id: 'modern-missions-1',
    courseId: 'modern-missions',
    order: 1,
    title: 'Flagship Observatories & Robotic Explorers',
    duration: '20 min',
    intro: 'Active missions today span the entire Solar System—from Parker Solar Probe touching the solar corona to Voyager 1 & 2 sampling interstellar space.',
    sections: [
      {
        heading: 'Synergy Across Missions',
        body: 'JWST and Hubble complement each other across infrared and UV/optical bands, while Mars Perseverance caches core samples in Jezero Crater and Juno maps Jupiter’s deep interior and icy moons.'
      }
    ],
    facts: [
      'JWST operates at ~40 K on its cold side behind a tennis-court-sized five-layer sunshield.',
      'Perseverance’s MOXIE instrument proved oxygen can be manufactured directly from Martian CO₂.'
    ],
    diagramLabel: 'Active Frontier: Sun (Parker) → Mars (Perseverance) → Jupiter (Juno) → L2 (JWST) → Interstellar (Voyagers)',
    knowledgeCheck: {
      question: 'Where does the James Webb Space Telescope orbit?',
      options: ['Low Earth Orbit', 'Geostationary Orbit', 'Sun-Earth L2 Halo Orbit', 'Lunar Polar Orbit'],
      answerIndex: 2,
      explanation: 'JWST orbits the Sun-Earth L2 Lagrange point ~1.5 million km from Earth.'
    },
    references: [{ label: 'NASA Missions Portal', url: 'https://science.nasa.gov/' }]
  },
  {
    id: 'future-exploration-1',
    courseId: 'future-exploration',
    order: 1,
    title: 'Artemis, Ocean Worlds & Next-Gen Observatories',
    duration: '20 min',
    intro: 'The coming decades target sustained lunar South Pole operations, astrobiology missions to icy ocean moons, and next-generation exoplanet-imaging telescopes.',
    sections: [
      {
        heading: 'Key Scientific Frontiers',
        body: 'NASA’s Artemis program with ESA, JAXA, and CSA aims to build sustained lunar infrastructure. In parallel, missions like Europa Clipper, ESA JUICE, and Dragonfly (to Titan) will investigate subsurface ocean worlds, while the Nancy Grace Roman Space Telescope will survey dark energy and exoplanets.'
      }
    ],
    facts: [
      'Permanently shadowed craters at the lunar South Pole contain water ice valuable for science and in-situ resource utilization.',
      'Jupiter’s moon Europa and Saturn’s moon Enceladus are prime targets in the search for extraterrestrial habitability.'
    ],
    diagramLabel: 'Roadmap: Lunar South Pole (Artemis) → Ocean Worlds (Europa / Titan) → Crewed Mars Architecture',
    knowledgeCheck: {
      question: 'Why is the lunar South Pole a primary target for the Artemis program?',
      options: ['It is closest to Mars', 'Permanently shadowed craters contain water ice and nearby peaks get near-continuous sunlight', 'It has a breathable atmosphere', 'It has stronger gravity'],
      answerIndex: 1,
      explanation: 'Lunar South Pole craters trap ancient water ice while adjacent ridges provide solar power illumination.'
    },
    references: [{ label: 'NASA Artemis Program', url: 'https://www.nasa.gov/humans-in-space/artemis/' }]
  }
];

/**
 * Full Course Quizzes (MC + True/False with immediate feedback & explanations)
 */
export const QUIZZES = {
  'intro-astronomy': [
    {
      type: 'mc',
      question: 'Approximately how long does light take to travel from the Sun to Earth?',
      options: ['1.3 seconds', '8 minutes 20 seconds', '4.2 years', '24 hours'],
      answerIndex: 1,
      explanation: 'At 299,792 km/s across 149.6 million km (1 AU), sunlight takes ~499 seconds (~8m 20s).'
    },
    {
      type: 'tf',
      question: 'True or False: Space telescopes are placed above Earth’s atmosphere partly because the atmosphere blocks X-ray, gamma-ray, and much infrared light.',
      options: ['True', 'False'],
      answerIndex: 0,
      explanation: 'True. Earth’s atmosphere absorbs high-energy and many infrared wavelengths and blurs optical seeing.'
    },
    {
      type: 'mc',
      question: 'What does 1 parsec approximately equal in light-years?',
      options: ['0.39 light-years', '1.00 light-year', '3.26 light-years', '10.0 light-years'],
      answerIndex: 2,
      explanation: 'One parsec corresponds to a parallax angle of 1 arcsecond, equal to ~3.26 light-years.'
    }
  ],
  'solar-system': [
    {
      type: 'mc',
      question: 'Roughly what percentage of the Solar System’s total mass resides in the Sun?',
      options: ['50.2%', '78.4%', '91.0%', '99.86%'],
      answerIndex: 3,
      explanation: 'The Sun contains ~99.86% of the Solar System’s mass; Jupiter holds most of the remainder.'
    },
    {
      type: 'tf',
      question: 'True or False: Mercury is the hottest planet in the Solar System because it is closest to the Sun.',
      options: ['True', 'False'],
      answerIndex: 1,
      explanation: 'False. Venus is hotter (~464 °C) due to its dense carbon dioxide greenhouse atmosphere.'
    },
    {
      type: 'mc',
      question: 'Which planet rotates on its side with an axial tilt of ~97.77°?',
      options: ['Mars', 'Saturn', 'Uranus', 'Neptune'],
      answerIndex: 2,
      explanation: 'Uranus has an extreme 97.77° axial tilt, producing 42-year polar summers and winters.'
    }
  ],
  'orbital-mechanics': [
    {
      type: 'mc',
      question: 'What is the ratio of escape velocity to circular orbital velocity at the same radius r?',
      options: ['1.0', '√2 (≈ 1.414)', '2.0', 'π (≈ 3.141)'],
      answerIndex: 1,
      explanation: 'Since v_circ = √(GM/r) and v_esc = √(2GM/r), their ratio is exactly √2.'
    },
    {
      type: 'tf',
      question: 'True or False: A Hohmann transfer orbit is a two-burn elliptical trajectory connecting two coplanar circular orbits.',
      options: ['True', 'False'],
      answerIndex: 0,
      explanation: 'True. One burn enters the transfer ellipse and a second burn circularizes at the target altitude.'
    },
    {
      type: 'mc',
      question: 'According to Kepler’s Second Law, a planet moves fastest when it is at:',
      options: ['Perihelion', 'Aphelion', 'Vernal equinox', 'Opposition'],
      answerIndex: 0,
      explanation: 'Equal areas are swept in equal times, so orbital speed peaks at perihelion (closest approach).'
    }
  ],
  'deep-space': [
    {
      type: 'mc',
      question: 'What is the approximate mass of Sagittarius A*, the Milky Way’s central supermassive black hole?',
      options: ['4.3 solar masses', '4,300 solar masses', '4.3 million solar masses', '4.3 trillion solar masses'],
      answerIndex: 2,
      explanation: 'Stellar orbit tracking and EHT imaging confirm Sgr A* has a mass of ~4.3 million solar masses.'
    },
    {
      type: 'tf',
      question: 'True or False: The Cosmic Microwave Background (CMB) has a measured blackbody temperature of about 2.725 K.',
      options: ['True', 'False'],
      answerIndex: 0,
      explanation: 'True. COBE, WMAP, and ESA Planck measured the CMB at 2.7255 K.'
    },
    {
      type: 'mc',
      question: 'Which exoplanet system hosts seven Earth-sized planets around an ultracool dwarf star ~40.7 light-years away?',
      options: ['Proxima Centauri', 'TRAPPIST-1', 'Kepler-186', '51 Pegasi'],
      answerIndex: 1,
      explanation: 'TRAPPIST-1 hosts seven temperate terrestrial worlds, with TRAPPIST-1e inside the habitable zone.'
    }
  ]
};
