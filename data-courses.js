/**
 * AETHER Space Academy — 16 Courses, 7 Learning Paths & Achievement Definitions
 */

export const COURSES = [
  { id: 'intro-astronomy', title: 'Introduction to Astronomy', difficulty: 'Beginner', duration: '35 min', pathId: 'astronomy-beginner', summary: 'Foundations of observational astronomy, electromagnetic spectra, celestial coordinates, and cosmic scales.' },
  { id: 'solar-system', title: 'The Solar System', difficulty: 'Beginner', duration: '40 min', pathId: 'solar-system-explorer', summary: 'Architecture of our planetary system: terrestrial worlds, gas and ice giants, asteroid belts, and the Kuiper Belt.' },
  { id: 'the-sun', title: 'The Sun', difficulty: 'Beginner', duration: '35 min', pathId: 'solar-system-explorer', summary: 'Nuclear fusion in the solar core, radiative and convective zones, sunspots, flares, and the solar wind.' },
  { id: 'planetary-science', title: 'Planetary Science', difficulty: 'Intermediate', duration: '45 min', pathId: 'planetary-science', summary: 'Comparative planetology: differentiation, volcanism, atmospheres, magnetospheres, and habitability.' },
  { id: 'earths-moon', title: "Earth's Moon", difficulty: 'Beginner', duration: '30 min', pathId: 'solar-system-explorer', summary: 'Giant-impact formation theory, lunar maria and highlands, tidal locking, phases, and eclipses.' },
  { id: 'stars-evolution', title: 'Stars and Stellar Evolution', difficulty: 'Intermediate', duration: '45 min', pathId: 'deep-space-explorer', summary: 'Hertzsprung-Russell diagram, main-sequence fusion, red giants, white dwarfs, neutron stars, and supernovae.' },
  { id: 'galaxies', title: 'Galaxies', difficulty: 'Intermediate', duration: '40 min', pathId: 'deep-space-explorer', summary: 'Spiral, elliptical, and irregular morphologies, dark matter halos, galaxy clusters, and cosmic expansion.' },
  { id: 'nebulae', title: 'Nebulae', difficulty: 'Beginner', duration: '30 min', pathId: 'deep-space-explorer', summary: 'Emission, reflection, dark, planetary nebulae, and supernova remnants as stellar nurseries and recyclers.' },
  { id: 'black-holes', title: 'Black Holes', difficulty: 'Advanced', duration: '45 min', pathId: 'advanced-astronomy', summary: 'Event horizons, Schwarzschild radii, accretion disks, gravitational lensing, and Event Horizon Telescope imaging.' },
  { id: 'exoplanets', title: 'Exoplanets', difficulty: 'Intermediate', duration: '40 min', pathId: 'planetary-science', summary: 'Transit photometry, radial velocity detection, habitable zones, and atmospheric spectroscopy with JWST.' },
  { id: 'space-history', title: 'Space Exploration History', difficulty: 'Beginner', duration: '35 min', pathId: 'astronomy-beginner', summary: 'From Sputnik 1 and Apollo 11 to space stations, robotic planetary landers, and modern international coalitions.' },
  { id: 'spacecraft-satellites', title: 'Spacecraft and Satellites', difficulty: 'Intermediate', duration: '40 min', pathId: 'space-technology', summary: 'Power systems, thermal control, propulsion, communications, and LEO/MEO/GEO orbital regimes.' },
  { id: 'orbital-mechanics', title: 'Orbital Mechanics', difficulty: 'Advanced', duration: '50 min', pathId: 'orbital-mechanics', summary: 'Kepler’s laws, vis-viva equation, Hohmann transfer orbits, delta-v budgets, and gravity assists.' },
  { id: 'gravity-physics', title: 'Gravity and Physics', difficulty: 'Intermediate', duration: '40 min', pathId: 'orbital-mechanics', summary: 'Newton’s law of universal gravitation, escape velocity, tidal forces, and Einstein’s general relativity.' },
  { id: 'modern-missions', title: 'Modern Space Missions', difficulty: 'Intermediate', duration: '35 min', pathId: 'space-technology', summary: 'Active scientific flagships: JWST, Perseverance, Parker Solar Probe, Juno, and Artemis architecture.' },
  { id: 'future-exploration', title: 'The Future of Space Exploration', difficulty: 'Advanced', duration: '40 min', pathId: 'advanced-astronomy', summary: 'Sustained lunar bases, Mars transit challenges, ocean-world exploration, and next-generation space telescopes.' }
];

export const LEARNING_PATHS = [
  {
    id: 'astronomy-beginner',
    title: 'Astronomy Beginner',
    difficulty: 'Beginner',
    duration: '1.5 hours',
    description: 'Build your scientific foundation in observational astronomy, cosmic scales, and the history of space exploration.',
    objectives: [
      'Understand astronomical distance units (AU, light-years, parsecs) and the electromagnetic spectrum.',
      'Trace the major milestones of human and robotic space exploration.'
    ],
    requirements: 'Complete all lessons in Introduction to Astronomy and Space Exploration History.',
    courseIds: ['intro-astronomy', 'space-history']
  },
  {
    id: 'solar-system-explorer',
    title: 'Solar System Explorer',
    difficulty: 'Beginner',
    duration: '2 hours',
    description: 'Tour the Sun, the eight planets, and Earth’s Moon to understand how our cosmic neighborhood formed and operates.',
    objectives: [
      'Compare terrestrial planets, gas giants, and ice giants.',
      'Explain solar energy generation and Earth-Moon tidal and eclipse mechanics.'
    ],
    requirements: 'Complete The Solar System, The Sun, and Earth’s Moon courses.',
    courseIds: ['solar-system', 'the-sun', 'earths-moon']
  },
  {
    id: 'planetary-science',
    title: 'Planetary Science',
    difficulty: 'Intermediate',
    duration: '2 hours',
    description: 'Examine planetary interiors, atmospheres, geology, and the detection and characterization of exoplanets.',
    objectives: [
      'Analyze planetary differentiation, atmospheres, and greenhouse physics.',
      'Apply transit and radial-velocity concepts to exoplanet discovery.'
    ],
    requirements: 'Complete Planetary Science and Exoplanets courses.',
    courseIds: ['planetary-science', 'exoplanets']
  },
  {
    id: 'deep-space-explorer',
    title: 'Deep Space Explorer',
    difficulty: 'Intermediate',
    duration: '2.5 hours',
    description: 'Journey beyond the Solar System into stellar life cycles, star-forming nebulae, and extragalactic structure.',
    objectives: [
      'Interpret stellar evolution tracks on the Hertzsprung-Russell diagram.',
      'Distinguish nebula types and galaxy classifications across cosmic scales.'
    ],
    requirements: 'Complete Stars and Stellar Evolution, Galaxies, and Nebulae courses.',
    courseIds: ['stars-evolution', 'galaxies', 'nebulae']
  },
  {
    id: 'space-technology',
    title: 'Space Technology',
    difficulty: 'Intermediate',
    duration: '2 hours',
    description: 'Learn how spacecraft survive the space environment and study the engineering behind flagship modern missions.',
    objectives: [
      'Identify core spacecraft subsystems and satellite orbital regimes.',
      'Evaluate scientific instruments on JWST, Perseverance, and Parker Solar Probe.'
    ],
    requirements: 'Complete Spacecraft and Satellites and Modern Space Missions.',
    courseIds: ['spacecraft-satellites', 'modern-missions']
  },
  {
    id: 'orbital-mechanics',
    title: 'Orbital Mechanics',
    difficulty: 'Advanced',
    duration: '2.5 hours',
    description: 'Master Newtonian gravitation, Keplerian orbits, escape velocity, and interplanetary trajectory transfers.',
    objectives: [
      'Calculate gravitational force and circular orbital velocity using SI units.',
      'Explain elliptical eccentricity, Hohmann transfers, and gravity assists.'
    ],
    requirements: 'Complete Gravity and Physics and Orbital Mechanics courses.',
    courseIds: ['gravity-physics', 'orbital-mechanics']
  },
  {
    id: 'advanced-astronomy',
    title: 'Advanced Astronomy',
    difficulty: 'Advanced',
    duration: '2.5 hours',
    description: 'Explore relativistic astrophysics, black hole physics, and the scientific roadmap for future space exploration.',
    objectives: [
      'Describe event horizons, relativistic jets, and gravitational lensing.',
      'Assess engineering and scientific challenges for lunar and Martian exploration.'
    ],
    requirements: 'Complete Black Holes and The Future of Space Exploration.',
    courseIds: ['black-holes', 'future-exploration']
  }
];

export const ACHIEVEMENT_DEFS = [
  { id: 'first-lesson', title: 'First Lesson Completed', description: 'Completed your first lesson in AETHER Space Academy.', icon: 'award' },
  { id: 'five-lessons', title: 'Five Lessons Completed', description: 'Completed five lessons across the AETHER curriculum.', icon: 'book-open-check' },
  { id: 'solar-system-explorer', title: 'Solar System Explorer', description: 'Completed all lessons in The Solar System, The Sun, and Planetary Science.', icon: 'orbit' },
  { id: 'deep-space-explorer', title: 'Deep Space Explorer', description: 'Completed at least three lessons across Galaxies, Nebulae, Black Holes, and Exoplanets.', icon: 'sparkles' },
  { id: 'first-path-completed', title: 'First Learning Path Completed', description: 'Finished every required lesson in a structured AETHER Learning Path.', icon: 'graduation-cap' },
  { id: 'astronomy-enthusiast', title: 'Astronomy Enthusiast', description: 'Completed 10+ lessons and achieved 80% or higher on a Space Academy quiz.', icon: 'trophy' }
];
