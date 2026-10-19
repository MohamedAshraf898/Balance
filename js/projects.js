/* ==========================================================================
   Builds the project markup from js/projects-data.js — runs before main.js,
   so the animations pick the generated elements up exactly like hand-written ones.
   ========================================================================== */
(() => {
  const list = window.BALANCE_PROJECTS || [];
  const I = window.BALANCE_I18N || { AR: false, t: (x) => x, yearsUnit: (n, u) => u };
  const t = I.t;
  const ARROW = I.AR ? "←" : "→"; // "forward" points left in Arabic
  const tpl = I.AR // composed labels (alt text, titles)
    ? { site: (n) => `${n} — بالانس`, by: (n) => `${n} من بالانس`, ext: (n) => `${n} — الواجهة الخارجية`, view: (n, k) => `${n} — منظر خارجي ${k}`, map: (n) => `خريطة موقع ${n}` }
    : { site: (n) => `${n} — Balance`, by: (n) => `${n} by Balance`, ext: (n) => `${n} exterior`, view: (n, k) => `${n} exterior view ${k}`, map: (n) => `Map of ${n}'s location` };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const titleHTML = (name) => esc(name).split(" | ").join(' <span class="proj__bar">|</span> ');
  const lines = (d) => (Array.isArray(d) ? d : [d]).map(esc).join("<br>");
  const anchor = (i) => `project-${i + 1}`; // carousel clicks link to projects.html#project-N
  // detail page: the project's own `page` if set, otherwise the shared project page with its id
  const projectPage = (p) => p.page || `project.html?id=${encodeURIComponent(p.id)}`;

  /* Our Projects page — one row per project */
  const rows = document.querySelector(".plist__rows");
  if (rows) {
    rows.innerHTML = list.map((p, i) => {
      const vars = [p.logoSlot && `--slot:${p.logoSlot}`, p.descWidth && `--dw:${p.descWidth}`].filter(Boolean).join(";");
      const imgs = (p.images || []).filter(Boolean).join(",");
      return `
      <article class="proj" id="${anchor(i)}"${vars ? ` style="${vars}"` : ""}${imgs ? ` data-images="${esc(imgs)}"` : ""}>
        <span class="proj__line" aria-hidden="true"><i class="proj__gem"></i></span>
        <div class="proj__body">
          ${p.logo && p.logo.src
            ? `<div class="proj__logo" style="--w:${p.logo.w};--h:${p.logo.h}"><span class="proj__logo-clip"><img src="${esc(p.logo.src)}"
            alt="${esc(p.name)} logo" style="${esc(p.logo.crop || "width:100%;height:100%;left:0%;top:0%")}"></span></div>`
            : '<div class="proj__logo" style="--w:0;--h:0" aria-hidden="true"></div>' /* no logo: keep the row's spacing */}
          <h2 class="proj__title">${titleHTML(p.name)}</h2>
          <p class="proj__desc">${lines(p.description)}</p>
          <a class="proj__more" href="${esc(projectPage(p))}">${t("View project")} <span aria-hidden="true">${ARROW}</span></a>
        </div>
      </article>`;
    }).join("") + '\n      <span class="proj__line proj__line--end" aria-hidden="true"><i class="proj__gem"></i></span>';
  }

  /* Home carousel — one card per project (grey placeholder unless a cover photo is set), with the
     logo, project name and area in the bottom-left corner. Name + area come from BALANCE_HOME_MAP
     (the labels / area names used on the home map); a project's own `card: { name, area }` wins. */
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const fromMap = {};
    ((window.BALANCE_HOME_MAP || {}).areas || []).forEach((a) =>
      (a.projects || []).forEach((id, k) => (fromMap[id] = { name: (a.labels || [])[k], area: a.name })));
    carousel.innerHTML = list.map((p) => {
      const [nm, ar] = p.name.split(" | ");
      const name = (p.card && p.card.name) || (fromMap[p.id] && fromMap[p.id].name) || nm;
      const area = (p.card && p.card.area) || (fromMap[p.id] && fromMap[p.id].area) || ar || "";
      const logo = p.logo && p.logo.src;
      return `<div class="carousel__card${p.cover ? " has-cover" : ""}" data-title="${esc(p.name)}"${p.cover ? ` style="background:url('${esc(p.cover)}') center / cover"` : ""}>
        <div class="carousel__info">
          ${logo ? `<img class="carousel__logo" src="${esc(logo)}" alt="">` : ""}
          <div class="carousel__text"><p class="carousel__name">${esc(name)}</p>${area ? `<p class="carousel__area">${esc(area)}</p>` : ""}</div>
        </div>
      </div>`;
    }).join("");
  }

  /* Footer contact — email, WhatsApp and social icons from BALANCE_CONTACT */
  const ICONS = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>',
    snapchat: '<path d="M12 3.2c2.9 0 4.9 2.2 4.9 5.1v2.2l1.6-.5c.5-.1.9.4.6.8-.5.6-1.4.9-2.1 1.1.6 1.6 1.9 2.9 3.6 3.5.4.1.4.6 0 .8-.9.4-1.9.5-2.4.7-.2.5-.1 1.1-.6 1.2-.8.1-1.6-.2-2.5.1-1 .4-1.8 1.8-3.1 1.8s-2.1-1.4-3.1-1.8c-.9-.3-1.7 0-2.5-.1-.5-.1-.4-.7-.6-1.2-.5-.2-1.5-.3-2.4-.7-.4-.2-.4-.7 0-.8 1.7-.6 3-1.9 3.6-3.5-.7-.2-1.6-.5-2.1-1.1-.3-.4.1-.9.6-.8l1.6.5V8.3c0-2.9 2-5.1 4.9-5.1z" stroke-linejoin="round"/>',
    x: '<path d="M17.9 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.4 21H2.3l7.3-8.3L2 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.3 4.7H5.5z" fill="currentColor" stroke="none"/>',
  };
  const contact = window.BALANCE_CONTACT;
  document.querySelectorAll(".footer__links--contact").forEach((ul) => {
    if (!contact) return;
    const icon = (k) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${ICONS[k] || ""}</svg>`;
    ul.innerHTML = [
      contact.email && `<li>${t("Email:")} <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>`,
      contact.phone && `<li>${t("Whatsapp:")} <a href="https://wa.me/${esc(contact.whatsapp || contact.phone.replace(/\D/g, ""))}" target="_blank" rel="noopener" dir="ltr">${esc(contact.phone)}</a></li>`,
      (contact.social || []).length && `<li class="footer__social">${contact.social.map((s) =>
        `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}" title="${esc(s.name)}">${icon(s.icon)}</a>`).join("")}</li>`,
    ].filter(Boolean).join("");
  });

  /* Home map card — heading, one list item per area, and the area's pins on the map */
  const pinLayer = document.querySelector(".map__zoom"); // pins sit beside .map__world and follow its pan/zoom via CSS vars
  const areaList = document.querySelector(".map__list");
  const homeMap = window.BALANCE_HOME_MAP;
  if (pinLayer && areaList && homeMap) {
    const title = document.querySelector(".map__title");
    if (title) title.textContent = homeMap.title || "";
    const byId = Object.fromEntries(list.map((p) => [p.id, p]));
    (homeMap.areas || []).forEach((a, i) => {
      const spots = a.map ? [a.map] : (a.projects || []).map((id) => byId[id] && byId[id].map).filter(Boolean);
      spots.forEach((m, k) => { // each pin shows its project's logo + name (falls back to the area name, no logo)
        const label = (a.labels || [])[k] || a.name;
        const proj = byId[(a.projects || [])[k]];
        const logo = (a.logos || [])[k] || (proj && proj.logo && proj.logo.src);
        pinLayer.insertAdjacentHTML("beforeend",
          `<button class="pin${logo ? " pin--logo" : ""}" type="button" style="--x:${m.x}%;--y:${m.y}%" data-group="${i}" aria-label="${esc(label)} — ${esc(a.name)}"><img
            src="assets/svg/${a.projects ? "location" : "location-alt"}.svg" alt="">${logo ? `<span class="pin__preview"><img src="${esc(logo)}" alt=""></span>` : ""}<span
            class="pin__tip">${esc(label)}</span></button>`);
      });
      areaList.insertAdjacentHTML("beforeend",
        `<li data-group="${i}"><button type="button"${spots.length ? "" : " disabled"}>${esc(a.name)}</button></li>`);
    });
  }

  /* Project page (project.html?id=…) — every text and image comes from the project's `detail` */
  const phx = document.querySelector(".phx");
  if (phx) {
    const id = new URLSearchParams(location.search).get("id");
    const p = list.find((x) => x.id === id) || list.find((x) => x.id === "ivory") || list[0];
    const own = p.detail || {};
    const merge = (base, over) => { // project values win; missing fields fall back to the placeholders
      if (Array.isArray(over) || typeof over !== "object" || over === null) return over === undefined ? base : over;
      const out = { ...base };
      for (const k in over) out[k] = merge(base ? base[k] : undefined, over[k]);
      return out;
    };
    const d = merge(window.BALANCE_PROJECT_DEFAULTS || {}, own);
    const H = d.hero || {}, A = d.about || {}, W = d.warranties || {}, E = d.exterior || {}, L = d.location || {};
    const set = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
    const attr = (sel, name, val) => { const el = document.querySelector(sel); if (el && val != null) el.setAttribute(name, val); };

    document.title = own.title || tpl.site(p.name);
    phx.setAttribute("aria-label", p.name);
    // hero
    attr(".phx__img--day", "src", H.day);
    if (H.night) attr(".phx__img--night", "src", H.night);
    else phx.classList.add("phx--single"); // one photo only: no day → night transition
    if (H.position) document.querySelectorAll(".phx__img").forEach((img) => (img.style.objectPosition = H.position));
    attr(".phx__img--day", "alt", (own.hero && own.hero.alt) || tpl.by(p.name));
    set(".phx__lead", esc(H.lead));
    set(".phx__note", lines(H.note || ""));
    set(".phx__stats", (H.stats || []).map((s) => `<div class="phx__stat"><b>${esc(s.title)}</b><span>${esc(s.text)}</span></div>`).join(""));
    set(".phx__cue span", esc(H.cue || ""));
    // about
    attr(".pwarm__bg img", "src", A.background);
    set(".pabout__label", esc(A.label));
    set(".pabout__title", lines(A.title || ""));
    set(".pabout__text", (A.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join(""));
    // warranties
    set(".pwar__title", esc(W.title));
    set(".pwar__text", esc(W.text));
    set(".pwar__grid", (W.items || []).map((w) => `
      <div class="wcell${w.icon ? " wcell--icon" : ""}">
        ${w.icon ? `<img class="wcell__icon" src="${esc(w.icon)}" alt="" width="50" height="48">` : ""}
        <p class="wcell__label">${lines(w.label)}</p>
        <p class="wcell__years"><span class="wcell__num" data-to="${+w.years || 0}">${+w.years || 0}</span> ${esc(I.yearsUnit(+w.years || 0, w.unit || W.unit || ""))}</p>
      </div>`).join(""));
    // exterior
    set(".pext__label", esc(E.label));
    set(".pext__title", esc(E.title));
    set(".pext__text", esc(E.text));
    attr(".pext__band img", "src", E.band);
    attr(".pext__photo", "src", E.photo);
    attr(".pext__photo", "alt", (own.exterior && own.exterior.alt) || tpl.ext(p.name));
    const gal = document.querySelector(".pgal");
    if (gal) { // the other renders, side by side at one height (each sized by its own shape)
      const items = (E.gallery || []).map((g) => (typeof g === "string" ? { src: g } : g)).filter((g) => g.src);
      gal.innerHTML = items.map((g, k) => `<figure class="pgal__item" style="--r:${g.ratio || 1.5}"><img src="${esc(g.src)}"
        alt="${esc(tpl.view(p.name, k + 2))}" loading="lazy" decoding="async"></figure>`).join("");
      gal.hidden = !items.length;
    }
    // location — the locations-page map centred on this project, its landmarks + other projects
    // around it, and a panel with the project's map details (slide 1) and what's nearby (slide 2)
    const MAP = "assets/img/map-loc.webp";
    const LM = window.BALANCE_LANDMARKS || [];
    set(".ploc__title", esc(L.title));
    attr(".ploc__ghost img", "src", MAP);
    const stage = document.querySelector(".ploc__stage");
    const mapBox = document.querySelector(".ploc__map");
    if (mapBox && p.map) {
      const dot = (cls, m, name) => `<span class="ploc__dot ${cls}" style="--x:${m.x}%;--y:${m.y}%"><i></i><b>${esc(name)}</b></span>`;
      const logo = p.logo && p.logo.src;
      mapBox.innerHTML = `<div class="ploc__world" style="--px:${p.map.x / 100};--py:${p.map.y / 100}">
        <img class="ploc__map-img" src="${MAP}" alt="${esc(tpl.map(p.name))}" width="1823" height="863">
        ${LM.map((l) => dot(l.type === "area" ? "ploc__dot--area" : "ploc__dot--landmark", l.map, l.name)).join("")}
        ${list.filter((x) => x !== p && x.map).map((x) => dot("ploc__dot--project", x.map, x.name)).join("")}
        <span class="pin is-lit${logo ? " pin--logo" : ""}" style="--x:${p.map.x}%;--y:${p.map.y}%"><img src="assets/svg/location.svg"
          alt="">${logo ? `<span class="pin__preview"><img src="${esc(logo)}" alt=""></span>` : ""}<span class="pin__tip">${esc(p.name)}</span></span>
      </div>`;
    }
    // label collisions on that map: this project's name + logo always stay clear; then other
    // projects, landmarks, areas — a label that would cover one already placed is hidden
    const declutterMap = () => {
      const world = document.querySelector(".ploc__world");
      if (!world) return;
      const hit = (a, c) => a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top;
      const grow = (r, m) => ({ left: r.left - m, right: r.right + m, top: r.top - m, bottom: r.bottom + m });
      const placed = [...world.querySelectorAll(".pin, .pin__tip, .pin__preview")].map((el) => grow(el.getBoundingClientRect(), 6));
      const rank = (el) => (el.classList.contains("ploc__dot--project") ? 0 : el.classList.contains("ploc__dot--landmark") ? 1 : 2);
      [...world.querySelectorAll(".ploc__dot")].sort((x, y) => rank(x) - rank(y)).forEach((d) => {
        d.classList.remove("is-hidden");
        const r = grow(d.querySelector("b").getBoundingClientRect(), 3), dotR = d.querySelector("i").getBoundingClientRect();
        const box = { left: Math.min(r.left, dotR.left), right: r.right, top: Math.min(r.top, dotR.top), bottom: Math.max(r.bottom, dotR.bottom) };
        if (placed.some((q) => hit(box, q))) d.classList.add("is-hidden");
        else placed.push(box);
      });
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(declutterMap));
    addEventListener("resize", () => requestAnimationFrame(declutterMap));

    // panel: IVORY keeps its own two image panels; every other project gets the generated ones
    const ownPanels = own.location && own.location.panels;
    const slideA = document.querySelector(".ploc__slide--a"), slideB = document.querySelector(".ploc__slide--b");
    if (ownPanels && slideA && slideB) {
      ["a", "b"].forEach((k, i) => {
        const panel = ownPanels[i] || {};
        const el = document.querySelector(`.ploc__slide--${k}`);
        el.innerHTML = panel.src ? `<img src="${esc(panel.src)}" alt="${esc(panel.alt || "")}">` : "";
      });
    } else if (slideA && slideB) {
      const near = LM.filter((l) => l.map)
        .map((l) => ({ l, d: Math.hypot((l.map.x - p.map.x) * 2.11, l.map.y - p.map.y) })) // map is 2.11× wider than tall
        .sort((a, c) => a.d - c.d).slice(0, 5);
      document.querySelector(".ploc__panel").classList.add("ploc__panel--info");
      slideA.innerHTML = `<div class="ploc__info">
          ${p.tag ? `<span class="ploc__tag">${esc(p.tag)}</span>` : ""}
          <p class="ploc__name">${esc(p.name)}</p>
          ${p.tagline ? `<p class="ploc__tagline">${esc(p.tagline)}</p>` : ""}
          <p class="ploc__about">${esc(p.about || (Array.isArray(p.description) ? p.description.join(" ") : p.description || ""))}</p>
        </div>`;
      slideB.innerHTML = `<div class="ploc__info">
          <span class="ploc__tag">${t("Nearby")}</span>
          <ul class="ploc__near">${near.map(({ l }) => `<li><span>${esc(l.name)}</span><small>${t(l.type === "area" ? "Area" : "Landmark")}</small></li>`).join("")}</ul>
        </div>`;
    }
    // "View on the map" → the locations page, flown to this project with its panel open
    const panelEl = document.querySelector(".ploc__panel");
    if (panelEl && stage) panelEl.insertAdjacentHTML("beforeend",
      `<a class="ploc__cta" href="location.html#${esc(p.id)}">${t("View on the map")} <span aria-hidden="true">${ARROW}</span></a>`);
  }

  /* Locations map — anchor (position), pin (label + logo) and side panel per project */
  const anchors = document.querySelector(".loc__anchors");
  const pins = document.querySelector(".loc__pins");
  if (anchors && pins) {
    // landmarks first (area labels, then landmark pins + their panels), then the projects
    (window.BALANCE_LANDMARKS || []).forEach((l) => {
      anchors.insertAdjacentHTML("beforeend",
        `<i class="loc__anchor" data-pin="${esc(l.id)}" style="--x:${l.map.x}%;--y:${l.map.y}%"></i>`);
      if (l.type === "area") {
        pins.insertAdjacentHTML("beforeend", `
        <div class="lpin lpin--label lpin--hidden" data-pin="${esc(l.id)}" data-reveal="0.15"><span
          class="lpin__content"><span class="lpin__bg"></span><span class="lpin__label">${esc(l.name)}</span></span></div>`);
        return;
      }
      pins.insertAdjacentHTML("beforeend", `
        <a class="lpin lpin--secondary lpin--hidden" href="#${esc(l.id)}" data-pin="${esc(l.id)}" data-reveal="0.28"
          aria-label="${esc(l.name)}"><span class="lpin__content"><span class="lpin__bg"></span><span
          class="lpin__label">${esc(l.name)}</span></span></a>`);
      document.body.insertAdjacentHTML("beforeend", `
        <div class="lmodal lmodal--poi" id="${esc(l.id)}" role="dialog" aria-modal="true" aria-label="${esc(l.name)}" aria-hidden="true">
          <div class="lmodal__panel">
            <button class="lmodal__close" type="button">${t("Close")}</button>
            <div class="lpoi">
              <div></div>
              <div class="lpoi__top">
                <div class="lpoi__image"><span class="lpoi__ph"></span></div>
                <p class="lpoi__title" role="heading" aria-level="2">${esc(l.name)}</p>
              </div>
              <p class="lpoi__desc">${esc(l.description || "")}</p>
            </div>
          </div>
        </div>`);
    });
    list.forEach((p) => {
      const logoSrc = p.logo && p.logo.src; // optional
      anchors.insertAdjacentHTML("beforeend",
        `<i class="loc__anchor" data-pin="${esc(p.id)}" style="--x:${p.map.x}%;--y:${p.map.y}%"></i>`);
      pins.insertAdjacentHTML("beforeend", `
        <a class="lpin lpin--primary lpin--hidden" href="#${esc(p.id)}" data-pin="${esc(p.id)}" data-reveal="0.42"
          aria-label="${esc(p.name)}"><span class="lpin__content"><span class="lpin__bg"></span><span
          class="lpin__preview">${logoSrc ? `<img src="${esc(logoSrc)}" alt="">` : ""}</span><span
          class="lpin__label">${esc(p.name)}</span></span></a>`);
      document.body.insertAdjacentHTML("beforeend", `
        <div class="lmodal lmodal--project" id="${esc(p.id)}" role="dialog" aria-modal="true" aria-label="${esc(p.name)}" aria-hidden="true">
          <div class="lmodal__panel">
            <button class="lmodal__close" type="button">${t("Close")}</button>
            <div class="lproj">
              <div class="lproj__image lmodal__side-image"><span class="lproj__ph">${logoSrc ? `<img src="${esc(logoSrc)}" alt="">` : ""}</span></div>
              <div class="lproj__content">
                <p class="lproj__title" role="heading" aria-level="2">${esc(p.name)}</p>
                <div class="lproj__top">
                  ${p.tag ? `<span class="lproj__tag">${esc(p.tag)}</span>` : "<span></span>"}
                  ${logoSrc ? `<img class="lproj__logo" src="${esc(logoSrc)}" alt="${esc(p.name)} logo">` : ""}
                </div>
                <p class="lproj__tagline">${esc(p.tagline || "")}</p>
                <div class="lproj__bottom">
                  <p>${esc(p.about || (Array.isArray(p.description) ? p.description.join(" ") : p.description))}</p>
                  <a class="lproj__link" href="${esc(projectPage(p))}">${t("View project")} <span aria-hidden="true">${ARROW}</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>`);
    });
  }
})();
