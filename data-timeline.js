/**
 * AETHER Historically Verified Space Exploration Timeline
 */

export const TIMELINE_EVENTS = [
  {
    id: 'sputnik-1',
    year: 1957,
    date: 'October 4, 1957',
    era: 'Space Age Dawn',
    title: 'Sputnik 1 — First Artificial Earth Satellite',
    description: 'The Soviet Union launched Sputnik 1, a 58 cm polished metal sphere transmitting radio pulses for 21 days from elliptical low Earth orbit.',
    context: 'Marked the beginning of the Space Age and accelerated global investment in orbital rocketry and space science.',
    imageUrl: 'https://images-assets.nasa.gov/image/6900956/6900956~medium.jpg',
    palette: ['#3A506B', '#35D6F2', '#07111F'],
    reference: { label: 'NASA Sputnik 1 History', url: 'https://www.nasa.gov/' }
  },
  {
    id: 'explorer-1',
    year: 1958,
    date: 'January 31, 1958',
    era: 'Space Age Dawn',
    title: 'Explorer 1 & Discovery of Van Allen Radiation Belts',
    description: 'The first U.S. satellite carried James Van Allen’s cosmic-ray instrument, revealing zones of trapped charged particles surrounding Earth.',
    context: 'Demonstrated that space around Earth is a dynamic plasma environment rather than an empty void.',
    imageUrl: 'https://images-assets.nasa.gov/image/6014258/6014258~medium.jpg',
    palette: ['#2B4C7E', '#8FC9F9', '#07111F'],
    reference: { label: 'NASA JPL Explorer 1', url: 'https://www.jpl.nasa.gov/' }
  },
  {
    id: 'vostok-1',
    year: 1961,
    date: 'April 12, 1961',
    era: 'Human Spaceflight',
    title: 'Vostok 1 — First Human in Space',
    description: 'Cosmonaut Yuri Gagarin completed one orbit of Earth in 108 minutes aboard Vostok 1.',
    context: 'Proved human physiological resilience to launch acceleration, microgravity, and atmospheric reentry.',
    imageUrl: 'https://images-assets.nasa.gov/image/s61-02719/s61-02719~medium.jpg',
    palette: ['#324A5F', '#C8D3DF', '#07111F'],
    reference: { label: 'NASA Human Spaceflight History', url: 'https://www.nasa.gov/' }
  },
  {
    id: 'apollo-8',
    year: 1968,
    date: 'December 21–27, 1968',
    era: 'Apollo Era',
    title: 'Apollo 8 — First Crewed Voyage to the Moon & Earthrise',
    description: 'Frank Borman, Jim Lovell, and William Anders became the first humans to leave low Earth orbit and orbit the Moon, capturing the iconic Earthrise photograph.',
    context: 'Validated deep-space navigation and shifted humanity’s visual perspective of Earth.',
    imageUrl: 'https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~medium.jpg',
    palette: ['#1E6091', '#90E0EF', '#050B14'],
    reference: { label: 'NASA Apollo 8', url: 'https://www.nasa.gov/' }
  },
  {
    id: 'apollo-11-landing',
    year: 1969,
    date: 'July 20, 1969',
    era: 'Apollo Era',
    title: 'Apollo 11 — First Human Moon Landing',
    description: 'Neil Armstrong and Buzz Aldrin landed Lunar Module Eagle in the Sea of Tranquility while Michael Collins orbited overhead in Columbia.',
    context: 'Fulfilled the first crewed lunar landing and initiated six Apollo surface science expeditions returning 382 kg of lunar samples.',
    imageUrl: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~medium.jpg',
    palette: ['#4A5D75', '#E2E8F0', '#07111F'],
    reference: { label: 'NASA Apollo 11', url: 'https://www.nasa.gov/mission/apollo-11/' }
  },
  {
    id: 'salyut-skylab',
    year: 1971,
    date: 'April 19, 1971',
    era: 'Space Stations',
    title: 'Salyut 1 — First Orbital Space Station',
    description: 'Launched by the Soviet Union, followed by NASA’s Skylab (1973) and Mir (1986), pioneering long-duration orbital habitation and solar/microgravity research.',
    context: 'Laid the engineering foundation for permanent human presence in low Earth orbit.',
    imageUrl: 'https://images-assets.nasa.gov/image/sl4-143-4706/sl4-143-4706~medium.jpg',
    palette: ['#3B5998', '#F5B041', '#07111F'],
    reference: { label: 'NASA Space Stations History', url: 'https://www.nasa.gov/' }
  },
  {
    id: 'viking-1',
    year: 1976,
    date: 'July 20, 1976',
    era: 'Planetary Exploration',
    title: 'Viking 1 — First Sustained Operations on Mars',
    description: 'NASA’s Viking 1 lander touched down in Chryse Planitia, transmitting the first clear panoramic images from the Martian surface and conducting astrobiology experiments.',
    context: 'Established decades of continuous robotic exploration of Mars.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA00563/PIA00563~medium.jpg',
    palette: ['#9E3F24', '#E07A5F', '#1A0B07'],
    reference: { label: 'NASA Mars Exploration', url: 'https://science.nasa.gov/mars/' }
  },
  {
    id: 'voyager-launch',
    year: 1977,
    date: 'August–September 1977',
    era: 'Outer Solar System',
    title: 'Voyager 1 & 2 Grand Tour Launch',
    description: 'Taking advantage of a rare 176-year planetary alignment, NASA launched twin probes to explore Jupiter, Saturn, Uranus, and Neptune before entering interstellar space.',
    context: 'Remains the longest-operating and most distant human-made mission in history.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA17046/PIA17046~medium.jpg',
    palette: ['#1D3557', '#35D6F2', '#07111F'],
    reference: { label: 'NASA Voyager Mission', url: 'https://science.nasa.gov/mission/voyager/' }
  },
  {
    id: 'hubble-launch',
    year: 1990,
    date: 'April 24, 1990',
    era: 'Great Observatories',
    title: 'Hubble Space Telescope Deployment',
    description: 'Deployed by Space Shuttle Discovery, Hubble revolutionized astrophysics with crisp UV, optical, and near-infrared observations unobstructed by Earth’s atmosphere.',
    context: 'Transformed public and scientific understanding of cosmic expansion, exoplanets, and galaxy evolution.',
    imageUrl: 'https://images-assets.nasa.gov/image/sts125-s-005/sts125-s-005~medium.jpg',
    palette: ['#1D4E89', '#35D6F2', '#07111F'],
    reference: { label: 'NASA Hubble Space Telescope', url: 'https://science.nasa.gov/mission/hubble/' }
  },
  {
    id: 'iss-assembly',
    year: 1998,
    date: 'November 20, 1998',
    era: 'Space Stations',
    title: 'International Space Station Assembly Begins',
    description: 'Launch of the Zarya module initiated orbital assembly of the ISS, continuously inhabited by international crews since November 2000.',
    context: 'Unites NASA, Roscosmos, ESA, JAXA, and CSA in microgravity science and orbital engineering.',
    imageUrl: 'https://images-assets.nasa.gov/image/iss066e081414/iss066e081414~medium.jpg',
    palette: ['#243B55', '#35D6F2', '#07111F'],
    reference: { label: 'NASA International Space Station', url: 'https://www.nasa.gov/' }
  },
  {
    id: 'huygens-titan',
    year: 2005,
    date: 'January 14, 2005',
    era: 'Outer Solar System',
    title: 'ESA Huygens Lands on Saturn’s Moon Titan',
    description: 'Released from NASA’s Cassini orbiter, the ESA Huygens probe descended through Titan’s hazy atmosphere and landed on an icy, methane-carved plain.',
    context: 'Remains the most distant planetary landing ever accomplished by a spacecraft.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA07232/PIA07232~medium.jpg',
    palette: ['#9A7036', '#E8C68E', '#1F1508'],
    reference: { label: 'ESA Cassini-Huygens', url: 'https://www.esa.int/Science_Exploration' }
  },
  {
    id: 'curiosity-mars',
    year: 2012,
    date: 'August 6, 2012',
    era: 'Planetary Exploration',
    title: 'Curiosity Rover Sky-Crane Landing in Gale Crater',
    description: 'NASA’s nuclear-powered rover proved ancient Mars had habitable freshwater lakes and organic carbon molecules.',
    context: 'Pioneered the sky-crane landing architecture later reused by Perseverance.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~medium.jpg',
    palette: ['#A6492A', '#E8A87C', '#1A0C08'],
    reference: { label: 'NASA Mars Curiosity', url: 'https://science.nasa.gov/mars/' }
  },
  {
    id: 'new-horizons-pluto',
    year: 2015,
    date: 'July 14, 2015',
    era: 'Outer Solar System',
    title: 'New Horizons Flyby of Pluto & Kuiper Belt',
    description: 'NASA’s New Horizons revealed nitrogen-ice glaciers in Sputnik Planitia and complex atmospheric haze layers on Pluto.',
    context: 'Completed the initial reconnaissance of the classical planetary frontier and Kuiper Belt.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg',
    palette: ['#7F5A50', '#D9C2B0', '#140E0D'],
    reference: { label: 'NASA New Horizons', url: 'https://science.nasa.gov/solar-system/' }
  },
  {
    id: 'perseverance-ingenuity',
    year: 2021,
    date: 'February 18 & April 19, 2021',
    era: 'Modern Exploration',
    title: 'Perseverance Landing & Ingenuity First Martian Flight',
    description: 'Perseverance began sampling Jezero Crater’s ancient delta while Ingenuity achieved humanity’s first powered, controlled aerodynamic flight on another world.',
    context: 'Opened aerial scouting as a new capability for planetary science.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
    palette: ['#9E3F24', '#F5B041', '#1A0B07'],
    reference: { label: 'NASA Perseverance', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/' }
  },
  {
    id: 'jwst-science',
    year: 2021,
    date: 'December 25, 2021',
    era: 'Modern Exploration',
    title: 'James Webb Space Telescope Launch',
    description: 'The largest infrared space telescope ever constructed deployed at Sun-Earth L2, peering back to galaxies formed within a few hundred million years of the Big Bang.',
    context: 'A joint NASA, ESA, and CSA milestone redefining cosmology and exoplanet spectroscopy.',
    imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~medium.jpg',
    palette: ['#8C6D1F', '#F5B041', '#07111F'],
    reference: { label: 'NASA JWST', url: 'https://webb.nasa.gov/' }
  },
  {
    id: 'artemis-i',
    year: 2022,
    date: 'November 16, 2022',
    era: 'Modern Exploration',
    title: 'Artemis I — Return to Cislunar Space',
    description: 'The maiden flight of NASA’s Space Launch System and Orion spacecraft traveled beyond the Moon and returned safely to Earth.',
    context: 'Inaugurated the Artemis architecture for sustained human exploration of the lunar South Pole.',
    imageUrl: 'https://images-assets.nasa.gov/image/NHQ202211160136/NHQ202211160136~medium.jpg',
    palette: ['#243B55', '#35D6F2', '#07111F'],
    reference: { label: 'NASA Artemis', url: 'https://www.nasa.gov/humans-in-space/artemis/' }
  }
];
