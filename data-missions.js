/**
 * AETHER Verified Space Missions Catalog
 * All dates, agencies, destinations, and statuses sourced from NASA, ESA, and JPL.
 */

export const MISSIONS = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    agency: 'NASA',
    type: 'Crewed Lunar Landing',
    launchDate: 'July 16, 1969',
    status: 'Historical',
    destination: 'The Moon (Sea of Tranquility)',
    spacecraft: 'Saturn V, Command Module Columbia, Lunar Module Eagle',
    objectives: [
      'Perform the first crewed lunar landing and return safely to Earth.',
      'Collect lunar soil and rock samples for scientific analysis.',
      'Deploy scientific instruments including a laser ranging retroreflector and seismometer.'
    ],
    discoveries: [
      'Returned 21.55 kg of lunar basalt and regolith, confirming the Moon’s ancient igneous history.',
      'Enabled millimeter-precision Earth-Moon distance measurements via laser retroreflectors.'
    ],
    timeline: [
      'Jul 16, 1969 — Launch from Kennedy Space Center Launch Complex 39A.',
      'Jul 20, 1969 — Lunar Module Eagle lands at Tranquility Base; Neil Armstrong & Buzz Aldrin walk on the Moon.',
      'Jul 24, 1969 — Safe splashdown in the Pacific Ocean.'
    ],
    relatedMissions: ['artemis'],
    imageUrl: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~medium.jpg',
    palette: ['#3A506B', '#C8D3DF', '#0B132B'],
    sources: [{ label: 'NASA Apollo 11 Mission Page', url: 'https://www.nasa.gov/mission/apollo-11/' }]
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    agency: 'NASA / JPL',
    type: 'Interstellar Probe',
    launchDate: 'September 5, 1977',
    status: 'Current',
    destination: 'Jupiter, Saturn, Interstellar Space',
    spacecraft: 'Voyager Spacecraft (RTG-powered, 3.7 m high-gain dish)',
    objectives: [
      'Conduct close-up flyby studies of Jupiter and Saturn and their moons.',
      'Measure the heliopause boundary and sample the local interstellar medium.'
    ],
    discoveries: [
      'Discovered active volcanism on Jupiter’s moon Io and a thin Jovian ring.',
      'Revealed Titan’s thick nitrogen haze and captured the famous "Pale Blue Dot" portrait of Earth (1990).',
      'Became the first human-made spacecraft to enter interstellar space in August 2012.'
    ],
    timeline: [
      'Sep 5, 1977 — Launched aboard Titan IIIE-Centaur.',
      'Mar 1979 — Jupiter flyby; Nov 1980 — Saturn & Titan flyby.',
      'Aug 2012 — Crossed the heliopause into interstellar space.'
    ],
    relatedMissions: ['voyager-2', 'cassini-huygens'],
    imageUrl: 'https://images-assets.nasa.gov/image/PIA17046/PIA17046~medium.jpg',
    palette: ['#1D3557', '#35D6F2', '#07111F'],
    sources: [{ label: 'NASA JPL Voyager Mission', url: 'https://science.nasa.gov/mission/voyager/' }]
  },
  {
    id: 'voyager-2',
    name: 'Voyager 2',
    agency: 'NASA / JPL',
    type: 'Grand Tour & Interstellar Probe',
    launchDate: 'August 20, 1977',
    status: 'Current',
    destination: 'Jupiter, Saturn, Uranus, Neptune, Interstellar Space',
    spacecraft: 'Voyager Spacecraft (Grand Tour trajectory)',
    objectives: [
      'Execute the planetary Grand Tour visiting all four outer giant planets.',
      'Continue measuring cosmic rays, plasma, and magnetic fields beyond the heliosphere.'
    ],
    discoveries: [
      'Only spacecraft to date to visit both ice giants, Uranus (1986) and Neptune (1989).',
      'Discovered active nitrogen geysers on Neptune’s moon Triton and 11 previously unknown Uranian moons.',
      'Crossed the heliopause into interstellar space in November 2018.'
    ],
    timeline: [
      'Aug 20, 1977 — Launched 16 days before Voyager 1.',
      '1979–1989 — Flybys of Jupiter, Saturn, Uranus, and Neptune.',
      'Nov 2018 — Entered interstellar space.'
    ],
    relatedMissions: ['voyager-1'],
    imageUrl: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg',
    palette: ['#1E3A8A', '#60A5FA', '#07111F'],
    sources: [{ label: 'NASA Voyager 2 Overview', url: 'https://science.nasa.gov/mission/voyager/' }]
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    agency: 'NASA / ESA / CSA',
    type: 'Infrared Space Observatory',
    launchDate: 'December 25, 2021',
    status: 'Current',
    destination: 'Sun-Earth L2 Halo Orbit (~1.5 million km)',
    spacecraft: '6.5 m gold-coated beryllium segmented mirror, 5-layer sunshield',
    objectives: [
      'Observe the earliest galaxies formed after the Big Bang in infrared wavelengths.',
      'Peer through dense dust clouds to study star and protoplanetary disk formation.',
      'Perform transmission spectroscopy of exoplanet atmospheres.'
    ],
    discoveries: [
      'Detected spectroscopically confirmed galaxies at redshifts exceeding z = 14.',
      'Measured carbon dioxide, methane, and water vapor signatures in exoplanet atmospheres.',
      'Delivered unprecedented infrared views of the Carina Nebula, Pillars of Creation, and outer planets.'
    ],
    timeline: [
      'Dec 25, 2021 — Launched on an ESA Ariane 5 from Kourou, French Guiana.',
      'Jan 2022 — Completed mirror deployment and arrived at Sun-Earth L2.',
      'Jul 12, 2022 — First full-color scientific images released.'
    ],
    relatedMissions: ['hubble'],
    imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~medium.jpg',
    palette: ['#8C6D1F', '#F5B041', '#0B1728'],
    sources: [
      { label: 'NASA JWST Official Site', url: 'https://webb.nasa.gov/' },
      { label: 'STScI Webb Science', url: 'https://www.stsci.edu/' }
    ]
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    agency: 'NASA / ESA',
    type: 'Optical/UV Space Observatory',
    launchDate: 'April 24, 1990',
    status: 'Current',
    destination: 'Low Earth Orbit (~515–540 km)',
    spacecraft: '2.4 m Ritchey-Chrétien reflector telescope',
    objectives: [
      'Observe the universe above Earth’s turbulent atmosphere in UV, visible, and near-IR light.',
      'Measure cosmic expansion rate and study galaxies, nebulae, and Solar System dynamics.'
    ],
    discoveries: [
      'Pinned down the age of the universe to ~13.8 billion years through Cepheid variable measurements.',
      'Captured the Hubble Deep Field and Ultra Deep Field, revealing thousands of distant galaxies.',
      'Confirmed supermassive black holes reside at the centers of most large galaxies.'
    ],
    timeline: [
      'Apr 24, 1990 — Deployed by Space Shuttle Discovery (STS-31).',
      '1993–2009 — Upgraded across five Space Shuttle servicing missions.',
      '1990–Present — Over 1.6 million astronomical observations completed.'
    ],
    relatedMissions: ['jwst'],
    imageUrl: 'https://images-assets.nasa.gov/image/sts125-s-005/sts125-s-005~medium.jpg',
    palette: ['#1D4E89', '#35D6F2', '#07111F'],
    sources: [{ label: 'NASA Hubble Mission Page', url: 'https://science.nasa.gov/mission/hubble/' }]
  },
  {
    id: 'mars-perseverance',
    name: 'Mars Perseverance Rover',
    agency: 'NASA / JPL',
    type: 'Planetary Rover & Sample Caching',
    launchDate: 'July 30, 2020',
    status: 'Current',
    destination: 'Mars (Jezero Crater)',
    spacecraft: 'Perseverance Rover (MMRTG-powered) & Ingenuity Mars Helicopter',
    objectives: [
      'Search for signs of ancient microbial life in Jezero Crater’s ancient river delta.',
      'Collect and seal core samples of Martian rock and regolith for potential future return.',
      'Demonstrate in-situ oxygen production (MOXIE) and powered Martian flight (Ingenuity).'
    ],
    discoveries: [
      'Confirmed igneous crater floor rocks and layered deltaic sediments shaped by ancient flowing water.',
      'MOXIE successfully generated breathable-grade oxygen from Martian CO₂ across 16 runs.',
      'Ingenuity completed 72 flights before retiring in January 2024.'
    ],
    timeline: [
      'Jul 30, 2020 — Launched aboard Atlas V from Cape Canaveral.',
      'Feb 18, 2021 — Sky-crane landing in Jezero Crater.',
      '2021–Present — Ongoing geological exploration and sample caching.'
    ],
    relatedMissions: ['artemis'],
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
    palette: ['#9E3F24', '#E07A5F', '#1F0C07'],
    sources: [{ label: 'NASA Mars 2020 Perseverance', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/' }]
  },
  {
    id: 'artemis',
    name: 'Artemis Program',
    agency: 'NASA / International Partners (ESA, JAXA, CSA)',
    type: 'Crewed Lunar Exploration Program',
    launchDate: 'November 16, 2022 (Artemis I)',
    status: 'Upcoming',
    destination: 'The Moon & Cislunar Space',
    spacecraft: 'Space Launch System (SLS), Orion Spacecraft, Gateway Lunar Station',
    objectives: [
      'Return humans to the lunar surface, targeting the scientifically rich lunar South Pole.',
      'Establish sustainable long-term lunar exploration with international and commercial partners.',
      'Test deep-space systems and life support in preparation for future crewed Mars missions.'
    ],
    discoveries: [
      'Artemis I successfully completed a 25.5-day uncrewed flight test around the Moon in Nov–Dec 2022, validating Orion’s heat shield.'
    ],
    timeline: [
      'Nov 16, 2022 — Artemis I uncrewed lunar orbit test flight launched.',
      'Dec 11, 2022 — Orion splashed down safely in the Pacific Ocean.',
      'Upcoming — Artemis II crewed lunar flyby and Artemis III crewed lunar South Pole landing.'
    ],
    relatedMissions: ['apollo-11', 'mars-perseverance'],
    imageUrl: 'https://images-assets.nasa.gov/image/NHQ202211160136/NHQ202211160136~medium.jpg',
    palette: ['#243B55', '#F5B041', '#07111F'],
    sources: [{ label: 'NASA Artemis Official Portal', url: 'https://www.nasa.gov/humans-in-space/artemis/' }]
  },
  {
    id: 'parker-solar-probe',
    name: 'Parker Solar Probe',
    agency: 'NASA / JHUAPL',
    type: 'Heliophysics Mission',
    launchDate: 'August 12, 2018',
    status: 'Current',
    destination: 'Solar Corona (Inner Heliosphere)',
    spacecraft: 'Carbon-composite heat-shielded solar probe',
    objectives: [
      'Trace the flow of energy that heats the Sun’s corona and accelerates the solar wind.',
      'Determine the structure and dynamics of plasma and magnetic fields near the Sun.'
    ],
    discoveries: [
      'Became the first spacecraft to fly directly through the Sun’s upper atmosphere (corona) in 2021.',
      'Discovered magnetic "switchbacks" (zig-zag reversals) in the young solar wind.',
      'Reached speeds near 692,000 km/h during closest perihelion passes, the fastest human-made object.'
    ],
    timeline: [
      'Aug 12, 2018 — Launched aboard Delta IV Heavy.',
      'Apr 2021 — First crossing of the Alfvén critical surface into the solar corona.',
      'Dec 2024 — Closest planned perihelion approach (~6.1 million km from solar surface).'
    ],
    relatedMissions: ['voyager-1'],
    imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~medium.jpg',
    palette: ['#B85D19', '#F5B041', '#1F0F04'],
    sources: [{ label: 'NASA Parker Solar Probe', url: 'https://science.nasa.gov/mission/parker-solar-probe/' }]
  },
  {
    id: 'cassini-huygens',
    name: 'Cassini-Huygens',
    agency: 'NASA / ESA / ASI',
    type: 'Outer Planet Orbiter & Titan Lander',
    launchDate: 'October 15, 1997',
    status: 'Historical',
    destination: 'Saturn System & Titan',
    spacecraft: 'Cassini Orbiter (NASA) & Huygens Probe (ESA)',
    objectives: [
      'Orbit Saturn to map its atmosphere, magnetosphere, rings, and moons over multiple seasons.',
      'Land the ESA Huygens probe on Titan to sample its atmosphere and surface.'
    ],
    discoveries: [
      'Huygens completed the first landing in the outer Solar System on Titan in January 2005.',
      'Discovered active hydrothermal water-ice plumes erupting from Enceladus’s south polar tiger stripes.',
      'Revealed intricate propeller structures and moonlets embedded within Saturn’s rings.'
    ],
    timeline: [
      'Oct 15, 1997 — Launched aboard Titan IVB/Centaur.',
      'Jul 2004 — Saturn orbit insertion; Jan 2005 — Huygens lands on Titan.',
      'Sep 15, 2017 — Grand Finale plunge into Saturn’s atmosphere to protect icy moons.'
    ],
    relatedMissions: ['voyager-1', 'voyager-2'],
    imageUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
    palette: ['#8F7A52', '#EADBB8', '#1C1810'],
    sources: [
      { label: 'NASA Cassini Mission', url: 'https://science.nasa.gov/mission/cassini/' },
      { label: 'ESA Cassini-Huygens', url: 'https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens' }
    ]
  },
  {
    id: 'juno',
    name: 'Juno',
    agency: 'NASA / JPL',
    type: 'Planetary Polar Orbiter',
    launchDate: 'August 5, 2011',
    status: 'Current',
    destination: 'Jupiter & Galilean Moons',
    spacecraft: 'Solar-powered radiation-vaulted polar orbiter',
    objectives: [
      'Determine Jupiter’s water abundance, deep internal structure, and core properties.',
      'Map Jovian gravity, magnetic fields, polar cyclones, and auroras.'
    ],
    discoveries: [
      'Revealed geometric clusters of persistent polar cyclones around Jupiter’s north and south poles.',
      'Showed Jupiter’s core is likely dilute and fuzzy rather than a sharp solid boundary.',
      'Conducted close flybys of Ganymede, Europa, and volcanic Io during its extended mission.'
    ],
    timeline: [
      'Aug 5, 2011 — Launched on Atlas V 551.',
      'Jul 4, 2016 — Entered polar orbit around Jupiter.',
      '2021–Present — Extended mission studying Jovian moons and rings.'
    ],
    relatedMissions: ['voyager-1', 'cassini-huygens'],
    imageUrl: 'https://images-assets.nasa.gov/image/PIA21974/PIA21974~medium.jpg',
    palette: ['#9A6A47', '#E6B89C', '#1D140E'],
    sources: [{ label: 'NASA Juno Mission', url: 'https://science.nasa.gov/mission/juno/' }]
  }
];
