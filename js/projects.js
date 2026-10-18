/* ==========================================================================
   Builds the project markup from js/projects-data.js — runs before main.js,
   so the animations pick the generated elements up exactly like hand-written ones.
   ========================================================================== */
(() => {
  const list = window.BALANCE_PROJECTS || [];
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
          <div class="proj__logo" style="--w:${p.logo.w};--h:${p.logo.h}"><img src="${esc(p.logo.src)}" alt="${esc(p.name)} logo"
            style="${esc(p.logo.crop || "width:100%;height:100%;left:0%;top:0%")}"></div>
          <h2 class="proj__title">${titleHTML(p.name)}</h2>
          <p class="proj__desc">${lines(p.description)}</p>
          <a class="proj__more" href="${esc(projectPage(p))}">View project <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
    }).join("") + '\n      <span class="proj__line proj__line--end" aria-hidden="true"><i class="proj__gem"></i></span>';
  }

  /* Home carousel — one card per project (grey placeholder unless a cover photo is set) */
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.innerHTML = list.map((p) =>
      `<div class="carousel__card" data-title="${esc(p.name)}"${p.cover ? ` style="background:url('${esc(p.cover)}') center / cover"` : ""}></div>`
    ).join("");
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

    document.title = own.title || `${p.name} — Balance`;
    phx.setAttribute("aria-label", p.name);
    // hero
    attr(".phx__img--day", "src", H.day);
    attr(".phx__img--night", "src", H.night);
    attr(".phx__img--day", "alt", (own.hero && own.hero.alt) || `${p.name} by Balance`);
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
        <p class="wcell__years"><span class="wcell__num" data-to="${+w.years || 0}">${+w.years || 0}</span> ${esc(w.unit || W.unit || "")}</p>
      </div>`).join(""));
    // exterior
    set(".pext__label", esc(E.label));
    set(".pext__title", esc(E.title));
    set(".pext__text", esc(E.text));
    attr(".pext__band img", "src", E.band);
    attr(".pext__photo", "src", E.photo);
    attr(".pext__photo", "alt", (own.exterior && own.exterior.alt) || `${p.name} exterior`);
    // location (2 panels: description, then distances)
    set(".ploc__title", esc(L.title));
    attr(".ploc__ghost img", "src", L.ghost || L.map);
    attr(".ploc__map img", "src", L.map);
    attr(".ploc__map img", "alt", (own.location && own.location.mapAlt) || `Map of ${p.name}'s location`);
    ["a", "b"].forEach((k, i) => {
      const panel = (L.panels || [])[i] || {};
      attr(`.ploc__slide--${k} img`, "src", panel.src);
      attr(`.ploc__slide--${k} img`, "alt", panel.alt || "");
    });
  }

  /* Locations map — anchor (position), pin (label + logo) and side panel per project */
  const anchors = document.querySelector(".loc__anchors");
  const pins = document.querySelector(".loc__pins");
  if (anchors && pins) {
    list.forEach((p, i) => {
      anchors.insertAdjacentHTML("beforeend",
        `<i class="loc__anchor" data-pin="${esc(p.id)}" style="--x:${p.map.x}%;--y:${p.map.y}%"></i>`);
      pins.insertAdjacentHTML("beforeend", `
        <a class="lpin lpin--primary lpin--hidden" href="#${esc(p.id)}" data-pin="${esc(p.id)}" data-reveal="0.42"
          aria-label="${esc(p.name)}"><span class="lpin__content"><span class="lpin__bg"></span><span
          class="lpin__preview"><img src="${esc(p.logo.src)}" alt=""></span><span
          class="lpin__label">${esc(p.name)}</span></span></a>`);
      document.body.insertAdjacentHTML("beforeend", `
        <div class="lmodal lmodal--project" id="${esc(p.id)}" role="dialog" aria-modal="true" aria-label="${esc(p.name)}" aria-hidden="true">
          <div class="lmodal__panel">
            <button class="lmodal__close" type="button">Close</button>
            <div class="lproj">
              <div class="lproj__image lmodal__side-image"><span class="lproj__ph"><img src="${esc(p.logo.src)}" alt=""></span></div>
              <div class="lproj__content">
                <p class="lproj__title" role="heading" aria-level="2">${esc(p.name)}</p>
                <div class="lproj__top">
                  ${p.tag ? `<span class="lproj__tag">${esc(p.tag)}</span>` : "<span></span>"}
                  <img class="lproj__logo" src="${esc(p.logo.src)}" alt="${esc(p.name)} logo">
                </div>
                <p class="lproj__tagline">${esc(p.tagline || "")}</p>
                <div class="lproj__bottom">
                  <p>${esc(p.about || (Array.isArray(p.description) ? p.description.join(" ") : p.description))}</p>
                  <a class="lproj__link" href="${esc(projectPage(p))}">View project <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>`);
    });
  }
})();
