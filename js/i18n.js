/* ==========================================================================
   Languages — Arabic (default, right-to-left) and English.
   Runs after the data files and before projects.js / main.js:
     1. picks the language: ?lang=en|ar in the URL, else the last choice, else Arabic
     2. sets <html lang dir>, merges the Arabic project content (projects-data.ar.js)
     3. translates the page's fixed text (dictionary below, keyed by the English text)
     4. wires the EN / ع switch in the header
   Any text missing from the dictionary simply stays in English.
   ========================================================================== */
(() => {
  const KEY = "balance-lang";
  const store = { get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
                  set: (v) => { try { localStorage.setItem(KEY, v); } catch {} } };
  const param = new URLSearchParams(location.search).get("lang");
  const lang = param === "en" || param === "ar" ? param : store.get() === "en" ? "en" : "ar";
  if (param === "en" || param === "ar") store.set(param);
  const AR = lang === "ar";
  const root = document.documentElement;
  root.lang = lang;
  root.dir = AR ? "rtl" : "ltr";

  /* interface text: English → Arabic */
  const DICT = {
    // header / menu
    "Home": "الرئيسية",
    "Our Projects": "مشاريعنا",
    "Our Locations": "مواقعنا",
    "Primary": "القائمة الرئيسية",
    "Open menu": "فتح القائمة",
    "Balance — home": "بالانس — الرئيسية",
    "Balance": "بالانس",
    "Drag": "اسحب",
    // home
    "We think of you": "نفكّر فيك",
    "before we build": "قبل أن نبني",
    "Balance is a Saudi real estate developer creating refined residences in Riyadh, with thoughtful design, attention to every detail, and lasting value.":
      "بالانس مطوّر عقاري سعودي يصمّم مساكن راقية في الرياض، بتصميم مدروس، واهتمام بكل التفاصيل، وقيمة تدوم.",
    "Explore Projects": "استكشف المشاريع",
    "contact us": "تواصل معنا",
    "Our brands": "علاماتنا",
    "Our brands — drag, swipe or use arrow keys to scroll": "علاماتنا — اسحب أو مرّر أو استخدم مفاتيح الأسهم",
    "Balance 4 pillars": "ركائز بالانس الأربع",
    "balance 4 pillars": "ركائز بالانس الأربع",
    "Logo concept — Balance 4 pillars": "فكرة الشعار — ركائز بالانس الأربع",
    "LOGO CONCEPT": "فكرة الشعار",
    "Technology": "التقنية",
    "Sustainability": "الاستدامة",
    "Investment": "الاستثمار",
    "Creativity": "الإبداع",
    "ABOUT US": "من نحن",
    "At Balance, we develop projects with the people who will live in them in mind. Our approach brings together creative thinking, smart technology, environmental responsibility, and investment management. These pillars guide how we plan and build, with attention to the details that shape everyday life and a commitment to earning your trust along the way.":
      "في بالانس، نطوّر مشاريعنا ونحن نضع في اعتبارنا من سيعيشون فيها. يجمع نهجنا بين التفكير الإبداعي، والتقنية الذكية، والمسؤولية البيئية، وإدارة الاستثمار. وتوجّه هذه الركائز طريقة تخطيطنا وبنائنا، مع اهتمام بالتفاصيل التي تصنع الحياة اليومية، والتزام بكسب ثقتك في كل خطوة.",
    "OUR PROJECTS": "مشاريعنا",
    "Projects carousel — use arrow keys": "معرض المشاريع — استخدم مفاتيح الأسهم",
    "Locations map": "خريطة المواقع",
    "Map of Balance project locations": "خريطة مواقع مشاريع بالانس",
    // projects page
    "Our Projects — Balance": "مشاريعنا — بالانس",
    "FIND YOUR PLACE": "اعثر على مكانك",
    "Our projects bring together eight residential projects: seven in Riyadh and one in Mecca.":
      "تضم مشاريعنا ثمانية مشاريع سكنية: سبعة في الرياض وواحدًا في مكة المكرمة.",
    "We approach every home with care for its design, quality, and the people who will live there. Explore the locations and details of each project at your own pace. When a place catches your eye, get in touch. We’ll help you learn more and answer the questions that matter to you.":
      "نتعامل مع كل منزل بعناية بتصميمه وجودته وبمن سيعيشون فيه. استكشف مواقع كل مشروع وتفاصيله على مهل، وإذا لفت انتباهك مكان ما، تواصل معنا؛ سنساعدك على معرفة المزيد ونجيب عن الأسئلة التي تهمّك.",
    "Our projects": "مشاريعنا",
    "View project": "عرض المشروع",
    // project page
    "Project — Balance": "المشروع — بالانس",
    "More exterior views": "مزيد من المناظر الخارجية",
    "Residential project": "مشروع سكني",
    "Nearby": "بالقرب",
    "Area": "حي",
    "Landmark": "معلم",
    "View on the map": "اعرض على الخريطة",
    // locations page
    "Location — Balance": "الموقع — بالانس",
    "Location": "الموقع",
    "Map of Riyadh with Balance projects": "خريطة الرياض ومشاريع بالانس",
    "Scroll down": "مرّر للأسفل",
    "Breadcrumb": "مسار التنقل",
    "Close": "إغلاق",
    // footer (every page)
    "NAVIGATION": "التنقل",
    "CONTACT": "تواصل",
    "Email:": "البريد الإلكتروني:",
    "Whatsapp:": "واتساب:",
    "Have a question about your next home?": "لديك سؤال عن منزلك القادم؟",
    "Leave your details. Let’s talk.": "اترك بياناتك، ولنتحدث.",
    "NAME": "الاسم",
    "EMAIL": "البريد الإلكتروني",
    "REQUEST A CALL BACK": "اطلب اتصالًا",
    "BOOK AN APOINTMENT": "احجز موعدًا",
    "No spam, no obligation. your information is safe": "لا رسائل مزعجة ولا التزامات. بياناتك في أمان.",
    "Please enter your name and a valid email.": "يرجى إدخال اسمك وبريد إلكتروني صحيح.",
    "Thank you — your call-back request has been received.": "شكرًا لك — استلمنا طلب الاتصال.",
    "Thank you — your appointment request has been received.": "شكرًا لك — استلمنا طلب الموعد.",
  };
  const norm = (s) => String(s).replace(/\s+/g, " ").trim();
  const t = (s) => (AR && DICT[norm(s)] !== undefined ? DICT[norm(s)] : s);

  /* fixed text in the HTML: text nodes + labels/alts (whitespace kept around the words) */
  const translate = (scope) => {
    if (!AR) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const k = norm(n.nodeValue);
      if (k && DICT[k] !== undefined) n.nodeValue = n.nodeValue.replace(/\S[\s\S]*\S|\S/, DICT[k]);
    });
    scope.querySelectorAll("[alt], [aria-label], [data-text], [title]").forEach((el) =>
      ["alt", "aria-label", "data-text", "title"].forEach((a) => {
        const v = el.getAttribute(a);
        if (v && DICT[norm(v)] !== undefined) el.setAttribute(a, DICT[norm(v)]);
      }));
  };

  /* Arabic project content: merged over the English data before anything is built */
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  const merge = (target, src) => {
    for (const k in src) {
      if (isObj(src[k]) && isObj(target[k])) merge(target[k], src[k]);
      else target[k] = src[k];
    }
    return target;
  };
  if (AR && window.BALANCE_AR) {
    const A = window.BALANCE_AR;
    (window.BALANCE_PROJECTS || []).forEach((p) => {
      const o = A.projects && A.projects[p.id];
      if (o) merge(p, JSON.parse(JSON.stringify(o)));
    });
    if (A.defaults && window.BALANCE_PROJECT_DEFAULTS) merge(window.BALANCE_PROJECT_DEFAULTS, JSON.parse(JSON.stringify(A.defaults)));
    const hm = window.BALANCE_HOME_MAP;
    if (A.homeMap && hm) {
      if (A.homeMap.title) hm.title = A.homeMap.title;
      (A.homeMap.areas || []).forEach((a, i) => hm.areas[i] && merge(hm.areas[i], a));
    }
    (window.BALANCE_LANDMARKS || []).forEach((l) => A.landmarks && A.landmarks[l.id] && merge(l, A.landmarks[l.id]));
  }

  // Arabic text is cursive: splitting it into single letters breaks the joins, so animations
  // that reveal letter by letter use whole words in Arabic
  const SPLIT_CHARS = AR ? "words" : "chars";

  // warranty years in Arabic: 3–10 "سنوات", otherwise "سنة"
  const yearsUnit = (n, unit) => (AR ? (n >= 3 && n <= 10 ? "سنوات" : "سنة") : unit);

  window.BALANCE_I18N = { lang, AR, t, translate, SPLIT_CHARS, yearsUnit };
  window.t = t;

  translate(document.body);
  document.title = t(document.title);

  /* the EN / ع switch: shows the other language; keeps the page (and ?id=) and reloads */
  const other = AR ? "en" : "ar";
  document.querySelectorAll(".header .nav, .menu").forEach((host) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = host.classList.contains("nav") ? "lang-switch" : "lang-switch lang-switch--menu";
    b.lang = other;
    b.textContent = AR ? "EN" : "ع";
    b.setAttribute("aria-label", AR ? "View the site in English" : "عرض الموقع بالعربية");
    b.addEventListener("click", () => {
      store.set(other);
      const url = new URL(location.href);
      url.searchParams.set("lang", other);
      url.hash = "";
      location.href = url.href;
    });
    host.appendChild(b);
  });
})();
