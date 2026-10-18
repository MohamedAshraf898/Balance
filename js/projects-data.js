/* ==========================================================================
   Balance projects — the ONLY place projects are listed.
   Every page builds itself from this list:
     · Our Projects page (projects.html) — one row per project, in this order
     · Home carousel (index.html)        — one card per project
     · Locations map (location.html)     — one pin + building + side panel per project

   To add a project: copy one { … } block, paste it where it should appear,
   and change the values. To remove one: delete its block.

   Fields
     id          unique, lowercase-with-dashes (used in links, e.g. location.html#al-nada)
     name        shown everywhere; a " | " becomes the thin divider bar
     logo        src = image file · w/h = logo size in design px (desktop)
                 crop = optional inline style to crop/position the logo inside that box
     description lines of text under the name (each string = a new line)
     images      optional: up to 3 photos for the side frames on the projects page
     cover       optional: photo for the home carousel card (grey card if empty)
     page        optional: where "View project" goes (default: project.html?id=<id>)
     detail      everything on the project's own page — see IVORY below for every field
     map         x/y position of the pin on the locations map, in % of the map
     tag         small pill on the map side panel (e.g. "Residences")
     tagline     one line under the logo on the map side panel
     about       paragraph on the map side panel (defaults to description)
     logoSlot / descWidth   optional fine-tuning of logo space / text width (design px)
   ========================================================================== */
window.BALANCE_PROJECTS = [
  {
    id: "al-nada",
    name: "Al Nada",
    logo: { src: "assets/img/logo-alnada.png", w: 152, h: 110, crop: "width:99.74%;height:134.07%;left:0%;top:0%" },
    description: ["The residences feature smart home systems, concealed central air conditioning, parking spaces, and security cameras.", "The development includes air-conditioned corridors, with private internal elevators available in selected units"],
    images: [],
    cover: "",
    map: { x: 73, y: 23 },
    tag: "Residences",
    tagline: "Smart living, quietly refined",
    about: "The residences feature smart home systems, concealed central air conditioning, parking spaces, and security cameras. The development includes air-conditioned corridors, with private internal elevators available in selected units.",
  },
  {
    id: "ivory",
    name: "IVORY | Al Yasmin",
    logo: { src: "assets/img/logo-ivory.png", w: 146, h: 108, crop: "width:99.97%;height:133.73%;left:0%;top:0%" },
    description: ["Smart home systems and central air conditioning are complemented by independent entrances and private parking."],
    images: [],
    cover: "",
    map: { x: 65, y: 26 },
    tag: "Residences",
    tagline: "Independent entrances, private parking",
    about: "Smart home systems and central air conditioning are complemented by independent entrances and private parking.",
    // everything on this project's page (project.html?id=ivory) — any field left out uses BALANCE_PROJECT_DEFAULTS below
    detail: {
      title: "IVORY | Al Yasmin — Balance",       // browser tab title
      hero: {
        day: "assets/img/ivory/ivory-day.webp",     // shown first (light)
        night: "assets/img/ivory/ivory-night.webp", // scroll fades to this (dark)
        alt: "IVORY | Al Yasmin by Balance",
        lead: "Remove all artificial AI-generated patterns, worm-like details, repeated grooves, excessive details. Reconstruct the",
        note: ["lorem ipsum lorem", "lorem ipsum T"],
        stats: [
          { title: "LOREM IPSUM LOREM", text: "LOREM IPSUM LOREM" },
          { title: "LOREM IPSUM LOREM", text: "LOREM IPSUM LOREM" },
          { title: "LOREM IPSUM LOREM", text: "LOREM IPSUM LOREM" },
        ],
        cue: "Explore",
      },
      about: {
        label: "About",
        title: ["lorem ipsum lorem ipsum", "lorem ipsum"],   // each string = a new line
        paragraphs: [
          "Created to strengthen the island’s marine tourism sector and energise the surrounding economy, the project brings together superyacht berths, boutique retail, culinary offerings, and key government services in a vibrant new waterfront district. After breaking ground in May 2024, Phase One is progressing toward its expected completion in Q1 2027.",
          "Guided by internationally recognised operators, the development is being built to world-class standards, with the ambition of drawing high-end travelers to the North and generating meaningful jobs for the community.",
        ],
        background: "assets/img/about-bg.png",
      },
      warranties: {
        title: "WARRANTIES",
        text: "LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM",
        unit: "years",
        items: [   // icon is optional; label can be ["line 1", "line 2"]
          { label: "Smart Home System", years: 3 },
          { label: "Water Heaters", years: 3 },
          { label: "Elevator", years: 2 },
          { label: "Security Systems", years: 2 },
          { label: "Plumbing System", years: 15, icon: "assets/img/ivory/warranty-1.png" },
          { label: ["Waterproofing", "& Thermal Insulation"], years: 10, icon: "assets/img/ivory/warranty-2.png" },
          { label: "Electrical Wiring", years: 25, icon: "assets/img/ivory/warranty-3.png" },
          { label: "Structural Frame", years: 15, icon: "assets/img/ivory/warranty-4.png" },
        ],
      },
      exterior: {
        label: "Exterior",
        title: "LOREM IPSUM",
        text: "Created to strengthen the island’s marine tourism sector and energise the surrounding economya vibrant new",
        band: "assets/img/ivory/flame-wide.webp",          // wide strip behind the card
        photo: "assets/img/ivory/ivory-exterior.webp",     // grows to full screen on scroll
        alt: "IVORY | Al Yasmin exterior",
      },
      location: {
        title: "PROJECT LOCATION",
        map: "assets/img/ivory/location-map.webp",
        mapAlt: "Map of IVORY | Al Yasmin's location",
        panels: [   // exactly 2: shown one after the other on scroll
          { src: "assets/img/ivory/panel-location.webp", alt: "Project location description (Arabic)" },
          { src: "assets/img/ivory/panel-distances.webp", alt: "Distances to nearby landmarks (Arabic)" },
        ],
      },
    },
  },
  {
    id: "zahia",
    name: "ZAHIA | Al Mughrazat",
    logo: { src: "assets/img/logo-zahya.png", w: 131, h: 83, crop: "width:100.19%;height:149.86%;left:0%;top:0%" },
    description: ["The residences feature smart home systems, concealed central air conditioning, and staff rooms with en-suite bathrooms."],
    images: [],
    cover: "",
    map: { x: 77, y: 41 },
    tag: "Residences",
    tagline: "Formed to adjust",
    about: "The residences feature smart home systems, concealed central air conditioning, and staff rooms with en-suite bathrooms.",
  },
  {
    id: "olyx",
    name: "OLYX | Al Olaya",
    logo: { src: "assets/img/logo-olyx.png", w: 212.8, h: 87.62, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["The residences offer smart home systems, private parking, and staff rooms with en-suite", "Private pools are available in selected units, while balconies and green spaces vary by unit type"],
    images: [],
    cover: "",
    map: { x: 69, y: 55 },
    tag: "Luxurious life",
    tagline: "In the heart of Al Olaya",
    about: "The residences offer smart home systems, private parking, and staff rooms with en-suite. Private pools are available in selected units, while balconies and green spaces vary by unit type.",
    logoSlot: 84,
  },
  {
    id: "al-murooj",
    name: "Balance Al Murooj",
    logo: { src: "assets/img/logo-nrouj.png", w: 80, h: 93, crop: "width:95.8%;height:131.59%;left:4.92%;top:7.04%" },
    description: ["The residences feature smart home systems, central air conditioning, and a central vacuum system.", "The development also includes parking spaces, air-conditioned corridors, and security cameras."],
    images: [],
    cover: "",
    map: { x: 67, y: 40 },
    tag: "Residences",
    tagline: "Comfort in every detail",
    about: "The residences feature smart home systems, central air conditioning, and a central vacuum system. The development also includes parking spaces, air-conditioned corridors, and security cameras.",
    descWidth: 761,
  },
  {
    id: "al-rabwah-1",
    name: "Balance Al Rabwah 1",
    logo: { src: "assets/img/logo-coltine.png", w: 217, h: 56, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["The project plans include outdoor spaces, dressing areas, and family living rooms.", "Selected unit layouts also incorporate staff rooms, laundry rooms, and storage spaces."],
    images: [],
    cover: "",
    map: { x: 79, y: 63 },
    tag: "Colline",
    tagline: "Space for family life",
    about: "The project plans include outdoor spaces, dressing areas, and family living rooms. Selected unit layouts also incorporate staff rooms, laundry rooms, and storage spaces.",
  },
  {
    id: "al-rabwah-2",
    name: "Balance Al Rabwah 2",
    logo: { src: "assets/img/logo-coltine.png", w: 217, h: 56, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["The project plans include outdoor spaces and skylights in selected units.", "Dressing areas, staff rooms, and dedicated laundry spaces are incorporated according to the unit layout."],
    images: [],
    cover: "",
    map: { x: 83, y: 68 },
    tag: "Colline",
    tagline: "Light from above",
    about: "The project plans include outdoor spaces and skylights in selected units. Dressing areas, staff rooms, and dedicated laundry spaces are incorporated according to the unit layout.",
  },
  {
    id: "maad-mekkah",
    name: "MAAD MEKKAH",
    logo: { src: "assets/img/logo-arabic.png", w: 141, h: 96, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["Remove all artificial AI-generated patterns, worm-like details, repeated grooves, excessive micro-texture, embossed appearance, sharpening artifacts, and"],
    images: [],
    cover: "",
    map: { x: 7, y: 26 },
    tag: "Makkah",
    tagline: "Beyond Riyadh",
    about: "Remove all artificial AI-generated patterns, worm-like details, repeated grooves, excessive micro-texture, embossed appearance, sharpening artifacts, and",
  },
];

/* Placeholder page content for projects that don't have their own `detail` yet
   (or leave out some fields). Copy IVORY's `detail` block into a project and
   change it to give that project its own page. */
window.BALANCE_PROJECT_DEFAULTS = (() => {
  const ivory = window.BALANCE_PROJECTS.find((p) => p.id === "ivory");
  return JSON.parse(JSON.stringify(ivory.detail)); // same layout, placeholder text + photos
})();
