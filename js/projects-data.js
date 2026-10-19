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
    id: "al-murooj",
    name: "Balance Al Murooj",
    logo: { src: "assets/img/logo-nrouj.png", w: 80, h: 93, crop: "width:95.8%;height:131.59%;left:4.92%;top:7.04%" },
    description: ["Inner courtyards bring natural light into the rooms and hallways of these homes in Al-Morouj."],
    images: ["assets/img/renders/web/al-murooj-1.webp", "assets/img/renders/web/al-murooj-2.webp", "assets/img/renders/web/al-murooj-3.webp"],
    cover: "assets/img/covers/al-murooj.webp",
    map: { x: 67, y: 40 },
    tag: "Residences",
    tagline: "Comfort in every detail",
    about: "The residences feature smart home systems, central air conditioning, and a central vacuum system. The development also includes parking spaces, air-conditioned corridors, and security cameras.",
    descWidth: 761,
    // this project's page (project.html?id=al-murooj) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/al-murooj-day.webp",   // shown first (light)
        night: "assets/img/hero/al-murooj-night.webp", // scroll fades to this (dark)
        lead: "Inner courtyards open MOROUG to the sky, bringing daylight into rooms and hallways, with light and shade changing the feel of each home throughout the day.",
        note: ["MOROUG", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Morouj, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2024" },
        ],
      },
      about: {
        label: "About MOROUG",
        title: ["A home shaped by", "the daylight."],   // each string = a new line
        paragraphs: [
          "In Al-Morouj, Riyadh, MOROUG begins with a simple idea: opening the home to the sky. Inner courtyards bring natural light into rooms and hallways, allowing the spaces to change with the day, from the first morning light to the warmth of the evening.",
          "That changing light is part of what gives each home its character. As sunlight moves through the courtyards, it creates different patterns of light and shade indoors. The result is a home where daylight is part of the architecture, rather than something that simply comes through a window.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/al-murooj-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/al-murooj-1-large.webp", ratio: 1.389 },
          { src: "assets/img/renders/web/al-murooj-2-large.webp", ratio: 1.364 },
        ],
      },
    },
  },
  {
    id: "olyx",
    name: "OLYX | Al Olaya",
    logo: { src: "assets/img/logo-olyx.png", w: 212.8, h: 87.62, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["Villa-style living in Al-Olayya, with sunlit spaces, green views, and the warmth of wood and marble."],
    images: ["assets/img/renders/web/olyx-1.webp", "assets/img/renders/web/olyx-2.webp", "assets/img/renders/web/olyx-3.webp"],
    cover: "assets/img/covers/olyx.webp",
    map: { x: 69, y: 55 },
    tag: "Luxurious life",
    tagline: "In the heart of Al Olaya",
    about: "The residences offer smart home systems, private parking, and staff rooms with en-suite. Private pools are available in selected units, while balconies and green spaces vary by unit type.",
    logoSlot: 84,
    // this project's page (project.html?id=olyx) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/olyx-day.webp",   // shown first (light)
        night: null,                            // only one photo: it stays, no day → night transition
        position: "50% 66%",                  // focus point of the photo (keeps the building in frame)
        lead: "OLYX brings the feel of a villa to each home, with carefully placed windows, views of greenery, and interiors warmed by wood and marble.",
        note: ["OLYX", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Olayya, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2025" },
        ],
      },
      about: {
        label: "About OLYX",
        title: ["A home with", "the feel of a villa."],   // each string = a new line
        paragraphs: [
          "OLYX brings a villa-inspired approach to residential living in Al-Olayya, Riyadh. Carefully placed windows bring daylight into the interiors, while views of greenery create a connection with the spaces outside. Each floor has its own character, with light playing a central role in how it feels.",
          "Inside, wood and marble bring warmth to a soft gray palette. These materials work alongside the windows, views, and interior details to create a home with a distinct identity. The focus is on how these elements come together, giving everyday spaces the comfort and character of a villa.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/olyx-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/olyx-1-large.webp", ratio: 0.8 },
          { src: "assets/img/renders/web/olyx-2-large.webp", ratio: 0.8 },
        ],
      },
    },
  },
  {
    id: "zahia",
    name: "ZAHIA | Al Mughrazat",
    logo: { src: "assets/img/logo-zahya.png", w: 131, h: 83, crop: "width:100.19%;height:149.86%;left:0%;top:0%" },
    description: ["Homes in Al-Mughrzat where color is part of the experience, bringing a sense of openness, calm, and comfort."],
    images: ["assets/img/renders/web/zahia-1.webp", "assets/img/renders/web/zahia-2.webp", "assets/img/renders/web/zahia-3.webp"],
    cover: "assets/img/covers/zahia.webp",
    map: { x: 77, y: 41 },
    tag: "Residences",
    tagline: "Formed to adjust",
    about: "The residences feature smart home systems, concealed central air conditioning, and staff rooms with en-suite bathrooms.",
    // this project's page (project.html?id=zahia) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/zahia-day.webp",   // shown first (light)
        night: "assets/img/hero/zahia-night.webp", // scroll fades to this (dark)
        lead: "At ZAHYA, color is part of how a home feels, not just how it looks. A thoughtful palette brings openness, calm, and comfort to everyday living.",
        note: ["ZAHYA", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Mughrzat, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2025" },
        ],
      },
      about: {
        label: "About ZAHYA",
        title: ["Color that feels", "like home."],   // each string = a new line
        paragraphs: [
          "At ZAHYA in Al-Mughrzat, Riyadh, color is part of the architecture from the beginning. The palette is chosen to bring a sense of openness, calm, and comfort to the home, shaping how the spaces feel as much as how they look.",
          "The idea goes beyond decoration. Color becomes part of the experience of living here, helping create a residential setting that feels clear, welcoming, and easy to settle into. Throughout ZAHYA, the design returns to that connection between the spaces around you and the way you feel within them.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/zahia-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/zahia-1-large.webp", ratio: 1.778 },
          { src: "assets/img/renders/web/zahia-2-large.webp", ratio: 1.778 },
        ],
      },
    },
  },
  {
    id: "ivory",
    name: "IVORY | Al Yasmin",
    logo: { src: "assets/img/logo-ivory.png", w: 146, h: 108, crop: "width:99.97%;height:133.73%;left:0%;top:0%" },
    description: ["White tones, natural materials, and daylight give these homes in Al-Yasmin their quiet, distinctive character."],
    images: ["assets/img/renders/web/ivory-1.webp", "assets/img/renders/web/ivory-2.webp", "assets/img/renders/web/ivory-3.webp"],
    cover: "assets/img/covers/ivory.webp",
    map: { x: 65, y: 26 },
    tag: "Residences",
    tagline: "Independent entrances, private parking",
    about: "Smart home systems and central air conditioning are complemented by independent entrances and private parking.",
    // everything on this project's page (project.html?id=ivory) — any field left out uses BALANCE_PROJECT_DEFAULTS below
    detail: {
      title: "IVORY | Al Yasmin — Balance",       // browser tab title
      hero: {
        day: "assets/img/hero/ivory-day.webp",   // shown first (light)
        night: "assets/img/hero/ivory-night.webp", // scroll fades to this (dark)
        alt: "IVORY | Al Yasmin by Balance",
        lead: "White tones, natural materials, and daylight give IVORY its character. Together, they create homes that feel open and calm, with simplicity at the heart of the design.",
        note: ["IVORY", "Residential project"], // upper-right block
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Yasmin, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2025" },
        ],
        cue: "Explore",
      },
      about: {
        label: "About IVORY",
        title: ["Simple tones.", "A calmer home."],   // each string = a new line
        paragraphs: [
          "In Al-Yasmin, Riyadh, IVORY takes its identity from the clarity of white. The palette works with natural materials and daylight to create a sense of space and calm, giving the homes a consistent, understated character.",
          "The idea goes beyond choosing a color. It is about the relationship between light, materials, and the spaces you use every day. At IVORY, white is the starting point for that balance, bringing the different elements of the design together in a home that feels open and comfortable to live in.",
        ],
        background: "assets/img/about-bg.png",
      },
      warranties: {
        title: "Warranties",                // same on every project page
        text: "Know what’s covered, and for how long. Explore the warranty details for your home, or speak with our team about the coverage, durations, and terms that apply.",
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
        title: "Take a closer look.",           // same on every project page
        text: "Explore the spaces and details, and get a feel for what life here could look like.",
        band: "assets/img/ivory/flame-wide.webp",          // wide strip behind the card
        photo: "assets/img/renders/web/ivory-3-large.webp",     // render 3 — grows to full screen on scroll
        alt: "IVORY | Al Yasmin exterior",
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/ivory-1-large.webp", ratio: 2.0 },
          { src: "assets/img/renders/web/ivory-2-large.webp", ratio: 1.5 },
        ],
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
    id: "al-nada",
    name: "Al Nada",
    logo: { src: "assets/img/logo-alnada.png", w: 152, h: 110, crop: "width:99.74%;height:134.07%;left:0%;top:0%" },
    description: ["A limited collection of homes in Al-Nada, designed for privacy, quiet living, and everyday comfort."],
    images: ["assets/img/renders/web/al-nada-1.webp", "assets/img/renders/web/al-nada-2.webp", "assets/img/renders/web/al-nada-3.webp"],
    cover: "assets/img/covers/al-nada.webp",
    map: { x: 73, y: 23 },
    tag: "Residences",
    tagline: "Smart living, quietly refined",
    about: "The residences feature smart home systems, concealed central air conditioning, parking spaces, and security cameras. The development includes air-conditioned corridors, with private internal elevators available in selected units.",
    // this project's page (project.html?id=al-nada) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/al-nada-day.webp",   // shown first (light)
        night: "assets/img/hero/al-nada-night.webp", // scroll fades to this (dark)
        lead: "A limited collection of homes where privacy and comfort come first. At AL-NADA, luxury is about the quality of everyday life, not just the size of a home.",
        note: ["AL-NADA", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Nada, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2025" },
        ],
      },
      about: {
        label: "About AL-NADA",
        title: ["A home with", "privacy in mind."],   // each string = a new line
        paragraphs: [
          "AL-NADA brings together a limited collection of homes in Riyadh’s Al-Nada district, with privacy and everyday comfort at the center of the design. Its architecture combines a simple, refined appearance with practical interiors and a thoughtful use of natural light.",
          "Here, the measure of a home is not just its floor area, but how it feels to live in. The limited scale of the development, attention to privacy between homes, and carefully planned spaces reflect that approach, creating a quieter residential setting with everyday needs in mind.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/al-nada-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/al-nada-1-large.webp", ratio: 1.78 },
          { src: "assets/img/renders/web/al-nada-2-large.webp", ratio: 1.78 },
        ],
      },
    },
  },
  {
    id: "al-rabwah-1",
    name: "Balance Al Rabwah 1",
    logo: { src: "assets/img/logo-coltine.png", w: 217, h: 56, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["Homes in Al Rabwah with a choice of sizes, a focus on privacy, and a distinctive architectural character."],
    images: ["assets/img/renders/web/al-rabwah-1-1.webp", "assets/img/renders/web/al-rabwah-1-2.webp", "assets/img/renders/web/al-rabwah-1-3.webp"],
    cover: "assets/img/covers/al-rabwah-1.webp",
    map: { x: 79, y: 63 },
    tag: "Colline",
    tagline: "Space for family life",
    about: "The project plans include outdoor spaces, dressing areas, and family living rooms. Selected unit layouts also incorporate staff rooms, laundry rooms, and storage spaces.",
    // this project's page (project.html?id=al-rabwah-1) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/al-rabwah-1-day.webp",   // shown first (light)
        night: "assets/img/hero/al-rabwah-1-night.webp", // scroll fades to this (dark)
        lead: "COLLINE 1 combines a choice of home sizes with a focus on privacy and a distinctive architectural character, designed to suit the way families live.",
        note: ["COLLINE 1", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al Rabwah, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2026" },
        ],
      },
      about: {
        label: "About COLLINE 1",
        title: ["A home that fits", "your family."],   // each string = a new line
        paragraphs: [
          "Families do not all need the same kind of home. At COLLINE 1 in Al Rabwah, Riyadh, a choice of home sizes reflects that difference, with a focus on privacy and a distinctive architectural character connecting the development.",
          "The project begins with an understanding of how families live, rather than location alone. Its approach brings those everyday needs into the planning, offering different spaces within a residential development people can picture themselves living in. It is this balance of choice, privacy, and architectural identity that defines COLLINE 1.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/al-rabwah-1-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/al-rabwah-1-1-large.webp", ratio: 1.9 },
          { src: "assets/img/renders/web/al-rabwah-1-2-large.webp", ratio: 0.8 },
        ],
      },
    },
  },
  {
    id: "al-rabwah-2",
    name: "Balance Al Rabwah 2",
    logo: { src: "assets/img/logo-coltine.png", w: 217, h: 56, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["A residential project by Balance in Al Rabwah, Riyadh."],
    images: [],
    cover: "",
    map: { x: 83, y: 68 },
    tag: "Colline",
    tagline: "Light from above",
    about: "The project plans include outdoor spaces and skylights in selected units. Dressing areas, staff rooms, and dedicated laundry spaces are incorporated according to the unit layout.",
    // this project's page (project.html?id=al-rabwah-2) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        lead: "COLLINE 2 is a residential project by Balance in Al Rabwah, Riyadh.",
        note: ["COLLINE 2", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al Rabwah, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "To be announced" },
        ],
      },
      about: {
        label: "About COLLINE 2",
        title: ["Meet COLLINE 2", "in Al Rabwah."],   // each string = a new line
        paragraphs: [
          "COLLINE 2 is a residential project by Balance in Al Rabwah, Riyadh.",
          "Speak with our team to ask about the project and discuss what you’re looking for in your next home.",
        ],
      },
    },
  },
  {
    id: "al-rayyan",
    name: "AL-RAYYAN",
    logo: null,                          // no logo yet — add { src, w, h } when there is one
    description: ["A residential project by Balance in Al-Rayyan, Riyadh."],
    images: ["assets/img/renders/web/al-rayyan-1.webp", "assets/img/renders/web/al-rayyan-2.webp", "assets/img/renders/web/al-rayyan-3.webp"],
    cover: "assets/img/covers/al-rayyan.webp",
    map: { x: 85, y: 58 },               // approximate position — adjust if needed
    tag: "Residences",
    tagline: "",
    about: "",
    // this project's page (project.html?id=al-rayyan) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        day: "assets/img/hero/al-rayyan-day.webp",   // shown first (light)
        night: "assets/img/hero/al-rayyan-night.webp", // scroll fades to this (dark)
        position: "50% 52%",                  // focus point of the photo (keeps the building in frame)
        lead: "AL-RAYYAN is a residential project by Balance in the Al-Rayyan district of Riyadh.",
        note: ["AL-RAYYAN", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Rayyan, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2026" },
        ],
      },
      about: {
        label: "About AL-RAYYAN",
        title: ["Get to know", "AL-RAYYAN."],   // each string = a new line
        paragraphs: [
          "Located in Riyadh’s Al-Rayyan district, AL-RAYYAN is part of Balance’s residential portfolio.",
          "Contact our team for project details and to explore whether it could be the right home for you.",
        ],
      },
      exterior: {
        photo: "assets/img/renders/web/al-rayyan-3-large.webp",     // render 3 — grows to full screen on scroll
        gallery: [ // shown side by side under the exterior photo
          { src: "assets/img/renders/web/al-rayyan-1-large.webp", ratio: 0.8 },
          { src: "assets/img/renders/web/al-rayyan-2-large.webp", ratio: 0.8 },
        ],
      },
    },
  },
  {
    id: "al-saada",
    name: "AL-SAADA",
    logo: null,                          // no logo yet — add { src, w, h } when there is one
    description: ["A residential project by Balance in Al-Saada, Riyadh."],
    images: [],
    cover: "",                           // no photo yet — grey card until one is added
    map: { x: 89, y: 51 },               // approximate position — adjust if needed
    tag: "Residences",
    tagline: "",
    about: "",
    // this project's page (project.html?id=al-saada) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        lead: "AL-SAADA is a residential project by Balance in the Al-Saada district of Riyadh.",
        note: ["AL-SAADA", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Al-Saada, Riyadh" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "To be announced" },
        ],
      },
      about: {
        label: "About AL-SAADA",
        title: ["Discover", "AL-SAADA."],   // each string = a new line
        paragraphs: [
          "AL-SAADA is a residential project by Balance in the Al-Saada district of Riyadh.",
          "Get in touch to ask about the project and tell us what matters to you in a home.",
        ],
      },
    },
  },
  {
    id: "maad-mekkah",
    name: "MAAD MEKKAH",
    logo: { src: "assets/img/logo-arabic.png", w: 141, h: 96, crop: "width:100%;height:100%;left:0%;top:0%" },
    description: ["A place to live or invest in Makkah, designed with the city’s character in mind."],
    images: [],
    cover: "",
    map: { x: 7, y: 26 },
    tag: "Makkah",
    tagline: "Beyond Riyadh",
    about: "A place to live or invest in Makkah, designed with the city’s character in mind.",
    // this project's page (project.html?id=maad-mekkah) — anything not set here uses BALANCE_PROJECT_DEFAULTS
    detail: {
      hero: {
        lead: "In Mecca, MAAD is designed for living and investment, with an architectural approach shaped by the city’s character and close attention to detail.",
        note: ["MAAD", "Residential project"],
        stats: [ // bottom row, left → right
          { title: "Location", text: "Mecca" },
          { title: "Developer", text: "Balance" },
          { title: "Year", text: "2026" },
        ],
      },
      about: {
        label: "About MAAD",
        title: ["Feel at home", "in Makkah."],   // each string = a new line
        paragraphs: [
          "MAAD brings together residential living and investment in Makkah, with an approach that considers how the property will be used. Its planning focuses on making efficient use of space, with flexible layouts that respond to the needs of residents and visitors.",
          "Practical considerations continue beyond the layout. Ease of operation, maintenance, and the choice of materials form part of the design approach. Together, these priorities shape a project for people considering a property in Makkah, whether for their own use or as an investment.",
        ],
      },
    },
  },
];

/* Placeholder page content for projects that don't have their own `detail` yet
   (or leave out some fields). Copy IVORY's `detail` block into a project and
   change it to give that project its own page. */
window.BALANCE_PROJECT_DEFAULTS = (() => {
  const ivory = window.BALANCE_PROJECTS.find((p) => p.id === "ivory");
  return JSON.parse(JSON.stringify(ivory.detail)); // same layout, placeholder text + photos
})();

/* Home page map card — heading + the areas listed under it.
   Hovering an area shows its project name(s) on the map; clicking flies the map there.
     projects  → uses those projects' map positions (from BALANCE_PROJECTS above)
     map       → or give a position directly, in % of the map (0,0 = top-left)
     labels    → the name shown on each pin, in the same order as `projects`
     logos     → optional logo per pin (defaults to the project's logo) */
window.BALANCE_HOME_MAP = {
  title: "Where would you like to call home?",
  areas: [
    { name: "Al-Morouj", projects: ["al-murooj"], labels: ["MOROUG"] },
    { name: "Al-Olayya", projects: ["olyx"], labels: ["OLYX"] },
    { name: "Al-Mughrzat", projects: ["zahia"], labels: ["ZAHYA"] },
    { name: "Al-Yasmin", projects: ["ivory"], labels: ["IVORY"] },
    { name: "Al-Nada", projects: ["al-nada"], labels: ["AL-NADA"] },
    { name: "Al Rabwah", projects: ["al-rabwah-1", "al-rabwah-2"], labels: ["COLLINE 1", "COLLINE 2"] },
    { name: "Al-Rayyan", projects: ["al-rayyan"], labels: ["AL-RAYYAN"] },
    { name: "Al-Saada", projects: ["al-saada"], labels: ["AL-SAADA"] },
    { name: "Mecca", projects: ["maad-mekkah"], labels: ["MAAD"] },
  ],
};

/* Footer contact details (every page with a footer). Each item is a link. */
window.BALANCE_CONTACT = {
  email: "info@balance.com",
  phone: "+966 57 350 7774",          // shown as written; opens a WhatsApp chat
  whatsapp: "966573507774",           // the same number, digits only, for the WhatsApp link
  social: [
    { name: "Instagram", url: "https://www.instagram.com/balance.csa", icon: "instagram" },
    { name: "Snapchat", url: "https://www.snapchat.com/@balance.csa", icon: "snapchat" },
    { name: "X", url: "https://x.com/balancecsa", icon: "x" },
  ],
};

/* Landmarks on the locations map (and around each project on its own page).
     type: "area"     → a small place-name label (no panel)
     type: "landmark" → a pin + 3D building that opens a side panel with its description
     map: position on the map in % (0,0 = top-left) */
window.BALANCE_LANDMARKS = [
  { id: "riyadh", name: "Riyadh", type: "area", map: { x: 70, y: 46 } },
  { id: "diriyah", name: "Diriyah", type: "area", map: { x: 55, y: 44 } },
  { id: "wadi-hanifah", name: "Wadi Hanifah", type: "area", map: { x: 57, y: 63 } },
  { id: "to-makkah", name: "Makkah Road", type: "area", map: { x: 22, y: 48 } },
  { id: "kafd", name: "KAFD", type: "landmark", map: { x: 75, y: 31 },
    description: "King Abdullah Financial District — Riyadh’s glass-and-steel business quarter, with towers, a monorail and landscaped wadi walks at its heart." },
  { id: "kingdom-centre", name: "Kingdom Centre", type: "landmark", map: { x: 70, y: 50 },
    description: "The city’s best-known silhouette: a 302-metre tower crowned by a sky bridge, with a luxury mall and hotel at its base on King Fahd Road." },
  { id: "al-faisaliah", name: "Al Faisaliah Tower", type: "landmark", map: { x: 74.5, y: 59 },
    description: "Riyadh’s first skyscraper, recognisable by its golden glass sphere, home to offices, a hotel and fine dining above the Olaya skyline." },
  { id: "boulevard", name: "Boulevard City", type: "landmark", map: { x: 62, y: 34 },
    description: "An open-air entertainment district of promenades, restaurants, theatres and seasonal events — the centre of Riyadh’s nightlife." },
  { id: "masmak", name: "Al Masmak Fortress", type: "landmark", map: { x: 68, y: 75 },
    description: "A clay-and-mudbrick fortress in old Riyadh, now a museum telling the story of the city’s founding." },
  { id: "stadium", name: "King Fahd Stadium", type: "landmark", map: { x: 88, y: 58 },
    description: "The national stadium, crowned by its iconic tensile-fabric roof, host to football’s biggest matches and major concerts." },
];
