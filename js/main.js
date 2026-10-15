/* Balance — vanilla JS + GSAP (ScrollTrigger, ScrollSmoother, SplitText) */
(() => {
  "use strict";

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  // the preloader always reveals the top of the page
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const PAGE = document.body.dataset.page || "home";
  const IS_HOME = PAGE === "home";
  let pageIntro = () => gsap.timeline(); // each page module replaces this

  /* ---------------------------------------------------------------------
     Smooth scroll
     --------------------------------------------------------------------- */
  const smoother = reduceMotion
    ? null
    : ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.15,
        effects: true,
        smoothTouch: false,
      });
  smoother && smoother.paused(true);

  // touch: scroll on the JS thread so iOS/Android rubber-band overscroll and the
  // collapsing address bar can't fight the pinned sections (jitter at top/bottom)
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (!finePointer && ScrollTrigger.isTouch) ScrollTrigger.normalizeScroll(true);

  const scrollToTarget = (hash) => {
    const target = hash === "#home" || hash === "#top" ? 0 : $(hash);
    if (target === null) return;
    if (smoother) smoother.scrollTo(target, true, "top top");
    else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + scrollY, behavior: "smooth" });
  };

  /* ---------------------------------------------------------------------
     Preloader
     --------------------------------------------------------------------- */
  const loader = $(".loader");
  const loaderNum = $(".loader__num");
  const loaderBar = $(".loader__bar span");
  const loaderMark = $(".loader__mark img");
  // the counter + bar are optional (they can be removed from the markup)
  const showProgress = (p) => {
    if (loaderNum) loaderNum.textContent = Math.round(p);
    if (loaderBar) gsap.set(loaderBar, { scaleX: p / 100 });
  };

  const imgs = $$("img").filter((i) => !i.closest(".loader"));
  let loaded = 0;
  const progress = { v: 0 };
  const loadPromise = new Promise((resolve) => {
    const tick = () => { loaded++; if (loaded >= imgs.length) resolve(); };
    imgs.forEach((img) => {
      if (img.complete) tick();
      else { img.addEventListener("load", tick, { once: true }); img.addEventListener("error", tick, { once: true }); }
    });
    if (!imgs.length) resolve();
    setTimeout(resolve, 5000); // never hang
  });

  gsap.to(loaderMark, { yPercent: -105, duration: 1.1, ease: "expo.out", delay: 0.15 });
  const progressTween = gsap.to(progress, {
    v: 90, duration: 2.4, ease: "power2.out",
    onUpdate: () => {
      const p = Math.max(progress.v, (loaded / Math.max(imgs.length, 1)) * 90);
      showProgress(p);
    },
  });

  Promise.all([loadPromise, document.fonts ? document.fonts.ready : Promise.resolve()]).then(() => {
    progressTween.kill();
    const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
    tl.to(progress, {
      v: 100, duration: reduceMotion ? 0.1 : 0.5, ease: "power2.out",
      onUpdate: () => showProgress(progress.v),
    })
      .to(loaderMark, { yPercent: -210, duration: 0.8, ease: "expo.in" }, "+=0.1")
      .to($$(".loader__bar, .loader__count"), { autoAlpha: 0, duration: 0.4 }, "<")
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.1 }, "-=0.2")
      .add(() => {
        loader.remove();
        document.body.classList.remove("is-loading");
        smoother && smoother.paused(false);
        ScrollTrigger.refresh();
      })
      .add(introAll(), "-=0.75");
  });

  // page transition: an ember-edged black wipe rises, then the next page loads
  function navigateTo(href) {
    const wipe = document.createElement("div");
    wipe.className = "page-wipe";
    document.body.appendChild(wipe);
    smoother && smoother.paused(true);
    gsap.to(wipe, { clipPath: "inset(0% 0 0 0)", duration: reduceMotion ? 0.01 : 0.8, ease: "expo.inOut", onComplete: () => (location.href = href) });
  }
  addEventListener("pageshow", (e) => { // back/forward cache: drop a stale wipe
    if (!e.persisted) return;
    $$(".page-wipe").forEach((w) => w.remove());
    smoother && smoother.paused(false);
  });

  gsap.set([".header__logo", ".nav__link", ".burger"], { autoAlpha: 0 });
  function introAll() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(".header__logo", { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.35)
      .fromTo([".nav__link", ".burger"], { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.45)
      .add(pageIntro(), 0)
      .add(() => location.hash && $(location.hash) && !$(location.hash).classList.contains("lmodal") && scrollToTarget(location.hash), 0.6);
    return tl;
  }

  /* ---------------------------------------------------------------------
     Home hero
     --------------------------------------------------------------------- */
  if (IS_HOME) {
  const heroTitle = $(".hero__title");
  const heroText = $(".hero__text");
  const flame = $(".hero__flame");
  let titleSplit, textSplit;

  gsap.set([".hero__tag", ".hero .btn-pill"], { autoAlpha: 0 });
  gsap.set(heroTitle, { autoAlpha: 0 });
  gsap.set(heroText, { autoAlpha: 0 });
  gsap.set(flame, { scale: 1.25, autoAlpha: 0 });

  function heroIntro() {
    titleSplit = SplitText.create(heroTitle, { type: "lines", mask: "lines", linesClass: "line" });
    textSplit = SplitText.create(heroText, { type: "lines", mask: "lines", linesClass: "line" });
    gsap.set([heroTitle, heroText], { autoAlpha: 1 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(flame, { scale: 1, autoAlpha: 1, duration: 2.4, ease: "power3.out" })
      .from(titleSplit.lines, { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.25)
      .from(textSplit.lines, { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.55)
      .fromTo([".hero__tag", ".hero .btn-pill"], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.8)
      .add(startFlameLife, 1.2);
    return tl;
  }
  pageIntro = heroIntro;

  function startFlameLife() {
    if (reduceMotion) return;
    // slow "breathing" drift of the smoke
    gsap.to(flame, { xPercent: -2.2, yPercent: 1.6, rotation: -1.2, scale: 1.04, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    if (finePointer) {
      const xTo = gsap.quickTo(flame, "x", { duration: 1.6, ease: "power3.out" });
      const yTo = gsap.quickTo(flame, "y", { duration: 1.6, ease: "power3.out" });
      $(".hero").addEventListener("pointermove", (e) => {
        xTo((e.clientX / innerWidth - 0.5) * -36);
        yTo((e.clientY / innerHeight - 0.5) * -24);
      });
    }
  }

  // scroll-out parallax
  gsap.to(".hero__media", {
    yPercent: 18, scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to([".hero__content", ".hero__bottom"], {
    y: -90, autoAlpha: 0, ease: "none", stagger: 0.05,
    scrollTrigger: { trigger: ".hero", start: "30% top", end: "bottom 20%", scrub: true },
  });

  } // IS_HOME hero

  /* ---------------------------------------------------------------------
     Hero fire — blurred flame at rest; hovering burns through to the sharp
     flame and throws off fire + sparks (canvas, additive glow sprites)
     --------------------------------------------------------------------- */
  $$("[data-fire]").forEach((hero) => {
    const canvas = $(".hero__fire", hero);
    const sharp = $(".flame--sharp", hero); // optional burn-through layer
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    const MAX = 900;
    const rand = gsap.utils.random;
    const clamp = gsap.utils.clamp;

    // fire colour ramp, hot → cool
    const RAMP = ["#fff6d8", "#ffe39a", "#ffc061", "#ff9a3a", "#ff7a1f", "#ff4d00", "#d63200", "#8a1800", "#3a0800"];
    const STEPS = 32;
    const sprites = [];
    {
      const toRGB = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const mix = gsap.utils.interpolate(RAMP.map(toRGB));
      for (let i = 0; i < STEPS; i++) {
        const [r, g, b] = mix(i / (STEPS - 1)).map(Math.round);
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const x = c.getContext("2d");
        const grd = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grd.addColorStop(0.25, `rgba(${r},${g},${b},.75)`);
        grd.addColorStop(0.6, `rgba(${r},${g},${b},.18)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        x.fillStyle = grd; x.fillRect(0, 0, 64, 64);
        sprites.push(c);
      }
    }
    const sprite = (t) => sprites[Math.min(STEPS - 1, Math.max(0, (t * (STEPS - 1)) | 0))];

    let W = 0, H = 0;
    const resize = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
    };
    resize();
    addEventListener("resize", resize);

    const parts = [];
    const ptr = { x: W * 0.6, y: H * 0.5, sx: W * 0.6, sy: H * 0.5, vx: 0, vy: 0, speed: 0, over: false };
    const fx = { heat: 0, r: 0 }; // heat = emission intensity, r = burn-through radius
    const R = () => clamp(170, 340, W * 0.22);
    let flameAcc = 0, emberAcc = 0, time = 0, inView = true;

    const spawnFlame = (x, y, boost = 1) => {
      if (parts.length >= MAX) return;
      parts.push({
        k: 0, x: x + rand(-14, 14), y: y + rand(-10, 10),
        vx: ptr.vx * 5 + rand(-16, 16), vy: rand(-150, -70) * boost,
        size: rand(18, 46) * (W < 700 ? 0.7 : 1), life: rand(0.4, 0.8), t: 0, seed: rand(0, 99),
      });
    };
    const spawnEmber = (x, y, speed = 1, spread = 1) => {
      if (parts.length >= MAX) return;
      const a = rand(-Math.PI, 0) * spread - (spread < 1 ? Math.PI / 2 * (1 - spread) : 0);
      const v = rand(40, 200) * speed;
      parts.push({
        k: 1, x: x + rand(-8, 8), y: y + rand(-8, 8),
        vx: Math.cos(a) * v + ptr.vx * 14, vy: Math.sin(a) * v + ptr.vy * 6,
        size: rand(0.9, 2.4), life: rand(0.5, 1.3), t: 0, seed: rand(0, 99),
      });
    };

    const local = (e) => {
      const b = hero.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const xTo = gsap.quickTo(ptr, "sx", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ptr, "sy", { duration: 0.35, ease: "power3.out" });

    const ignite = () => {
      gsap.to(fx, { heat: 1, duration: 0.6, ease: "power2.out", overwrite: true });
      gsap.to(fx, { r: R(), duration: 1.1, ease: "expo.out", overwrite: "auto" });
    };
    const douse = () => {
      gsap.to(fx, { heat: 0, duration: 0.9, ease: "power2.out", overwrite: true });
      gsap.to(fx, { r: 0, duration: 1.2, ease: "power3.inOut", overwrite: "auto" });
    };

    hero.addEventListener("pointerenter", (e) => {
      const [x, y] = local(e);
      Object.assign(ptr, { x, y, sx: x, sy: y, over: true });
      ignite();
    });
    hero.addEventListener("pointermove", (e) => {
      const [x, y] = local(e);
      ptr.vx = (x - ptr.x) * 0.5 + ptr.vx * 0.5;
      ptr.vy = (y - ptr.y) * 0.5 + ptr.vy * 0.5;
      ptr.x = x; ptr.y = y; xTo(x); yTo(y);
      if (!ptr.over) { ptr.over = true; ignite(); }
      if (e.pointerType !== "mouse") { clearTimeout(ptr.tt); ptr.tt = setTimeout(() => { ptr.over = false; douse(); }, 900); }
    });
    hero.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      ptr.over = false; douse();
    });
    hero.addEventListener("pointerdown", (e) => {
      const [x, y] = local(e);
      Object.assign(ptr, { x, y, sx: x, sy: y });
      if (!ptr.over) { ptr.over = true; ignite(); }
      for (let i = 0; i < 45; i++) spawnEmber(x, y, 1.4);
      for (let i = 0; i < 10; i++) spawnFlame(x, y, 1.2);
      gsap.fromTo(fx, { r: R() * 1.35 }, { r: R(), duration: 1, ease: "expo.out", overwrite: "auto" });
      if (e.pointerType !== "mouse") { clearTimeout(ptr.tt); ptr.tt = setTimeout(() => { ptr.over = false; douse(); }, 1200); }
    });

    ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (st) => (inView = st.isActive) });

    function tick(_, deltaMs) {
      if (!inView) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      time += dt;

      // burn-through window, with a fire-like flicker of its radius
      if (sharp && fx.r > 0.5) {
        const sb = sharp.getBoundingClientRect(), hb = hero.getBoundingClientRect();
        const sx = (ptr.sx + hb.left - sb.left) * (sharp.offsetWidth / sb.width);
        const sy = (ptr.sy + hb.top - sb.top) * (sharp.offsetHeight / sb.height);
        const flick = 1 + Math.sin(time * 13) * 0.05 + Math.sin(time * 7.3 + 1) * 0.04 + Math.sin(time * 23) * 0.02;
        sharp.style.setProperty("--mx", sx + "px");
        sharp.style.setProperty("--my", sy + "px");
        sharp.style.setProperty("--r", fx.r * flick + "px");
      } else if (sharp) sharp.style.setProperty("--r", "0px");

      // emission
      ptr.speed = Math.hypot(ptr.vx, ptr.vy);
      ptr.vx *= 0.9; ptr.vy *= 0.9;
      if (fx.heat > 0.01 && !reduceMotion) {
        flameAcc += fx.heat * (1.1 + ptr.speed * 0.04) * dt * 60;
        emberAcc += fx.heat * (0.3 + ptr.speed * 0.07) * dt * 60;
        for (; flameAcc >= 1; flameAcc--) spawnFlame(ptr.sx, ptr.sy);
        for (; emberAcc >= 1; emberAcc--) spawnEmber(ptr.sx, ptr.sy, 0.8 + Math.min(ptr.speed * 0.02, 1.2));
      }
      // ambient embers rising off the flame for touch screens (no hover)
      if (!finePointer && !reduceMotion && Math.random() < 0.35) {
        const hb = hero.getBoundingClientRect(), sb = sharp ? sharp.getBoundingClientRect() : hb;
        spawnEmber(sb.left - hb.left + sb.width * rand(0.3, 0.95), sb.top - hb.top + sb.height * rand(0.3, 0.7), 0.35, 0.4);
      }

      // simulate + draw
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (!parts.length && fx.heat < 0.01) return;
      ctx.globalCompositeOperation = "lighter";

      if (fx.heat > 0.01) { // heat glow under the cursor
        const g = R() * 0.9;
        ctx.globalAlpha = 0.18 * fx.heat;
        ctx.drawImage(sprite(0.62), ptr.sx - g / 2, ptr.sy - g / 2, g, g);
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.t += dt / p.life;
        if (p.t >= 1 || p.y < -40) { parts[i] = parts[parts.length - 1]; parts.pop(); continue; }
        const t = p.t;
        if (p.k === 0) { // flame tongue: rises, sways, shrinks, cools
          p.vy -= 60 * dt;
          p.vx *= 0.94;
          p.x += (p.vx + Math.sin(time * 9 + p.seed) * 40) * dt;
          p.y += p.vy * dt;
          const size = p.size * (1 - t * 0.75) * (0.85 + Math.min(t * 6, 1) * 0.15);
          ctx.globalAlpha = 0.5 * Math.min(1, t * 10) * Math.pow(1 - t, 1.3);
          ctx.drawImage(sprite(0.2 + t * 0.75), p.x - size / 2, p.y - size / 2, size, size);
        } else { // ember: buoyant, turbulent, flickering spark
          p.vy -= 90 * dt;
          p.vx += Math.sin(p.y * 0.025 + p.seed + time * 4) * 160 * dt;
          p.vx *= 0.985; p.vy *= 0.985;
          p.x += p.vx * dt; p.y += p.vy * dt;
          const flick = 0.6 + 0.4 * Math.sin(time * 38 + p.seed * 7);
          const a = Math.pow(1 - t, 1.2) * flick;
          const glow = p.size * 5.5;
          ctx.globalAlpha = a * 0.55;
          ctx.drawImage(sprite(0.25 + t * 0.6), p.x - glow / 2, p.y - glow / 2, glow, glow);
          ctx.globalAlpha = a;
          const core = p.size * 1.6;
          ctx.drawImage(sprite(t * 0.45), p.x - core / 2, p.y - core / 2, core, core);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    gsap.ticker.add(tick);
  });

  /* ---------------------------------------------------------------------
     Header — scrolled state, hide on scroll down, active link
     --------------------------------------------------------------------- */
  const header = $(".header");
  let headerHidden = false;
  let menuOpen = false; // read by the header trigger below, set by the mobile menu
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle("is-scrolled", y > 40);
      const hide = self.direction === 1 && y > innerHeight * 0.6 && !menuOpen;
      if (hide !== headerHidden) {
        headerHidden = hide;
        gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.7, ease: "expo.out" });
      }
    },
  });

  const navMap = { home: "#home", about: "#about", projects: "#projects", locations: "#locations" };
  Object.entries(navMap).forEach(([id, hash]) => {
    const el = document.getElementById(id);
    const link = $(`.nav__link[href="${hash}"]`);
    if (!el || !link) return;
    ScrollTrigger.create({
      trigger: id === "locations" ? ".locations" : el,
      start: "top 55%", end: "bottom 45%",
      onToggle: (self) => self.isActive && $$(".nav__link").forEach((l) => l.classList.toggle("is-active", l === link)),
    });
  });

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  const burger = $(".burger");
  const menu = $(".menu");
  const menuTl = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut" } })
    .set(menu, { visibility: "visible" })
    .to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.9 })
    .from($$("a", menu), { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.35");
  const setMenu = (open) => {
    menuOpen = open;
    burger.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    open ? menuTl.timeScale(1).play() : menuTl.timeScale(1.6).reverse();
    smoother && smoother.paused(open);
  };
  burger.addEventListener("click", () => setMenu(!menuOpen));

  // in-page links scroll smoothly; links to another page play the wipe first
  $$("a[href]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.closest(".lpin")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const samePage = url.pathname.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "");
      if (samePage && url.hash && $(url.hash)) {
        e.preventDefault();
        if (menuOpen) { setMenu(false); setTimeout(() => scrollToTarget(url.hash), 450); }
        else scrollToTarget(url.hash);
      } else if (samePage && !url.hash) {
        e.preventDefault();
        if (menuOpen) setMenu(false);
        scrollToTarget("#top");
      } else if (!samePage) {
        e.preventDefault();
        navigateTo(url.href);
      }
    })
  );

  if (IS_HOME) {
  /* ---------------------------------------------------------------------
     Logos marquee — endless, but user-controlled:
     drag/swipe with momentum, horizontal wheel (or shift+wheel), arrow keys,
     page-scroll direction & speed steer it, hover slows it down
     --------------------------------------------------------------------- */
  const logos = $(".logos");
  const viewport = $(".logos__viewport");
  const track = $(".logos__track");
  const set = $(".logos__set");
  const BASE = 55; // px/s auto-scroll
  const mq = { x: 0, w: 1, dir: 1, boost: 0, inertia: 0, hover: 1, dragging: false };

  function buildMarquee() {
    $$(".logos__set", track).slice(1).forEach((n) => n.remove());
    mq.w = set.offsetWidth;
    const copies = Math.ceil((innerWidth * 2) / mq.w) + 1;
    for (let i = 0; i < copies; i++) {
      const c = set.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      $$("img", c).forEach((img) => (img.alt = ""));
      track.appendChild(c);
    }
  }
  buildMarquee();
  let mqW = innerWidth;
  addEventListener("resize", () => { if (Math.abs(innerWidth - mqW) > 40) { mqW = innerWidth; buildMarquee(); } });

  gsap.ticker.add((_, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 0.05);
    if (!mq.dragging) {
      const auto = reduceMotion ? 0 : -BASE * mq.dir * mq.hover;
      mq.x += (auto - mq.boost * mq.dir + mq.inertia) * dt;
      mq.inertia *= Math.pow(0.94, dt * 60); // momentum decays back to auto-scroll
      mq.boost *= Math.pow(0.92, dt * 60);
    }
    mq.x = gsap.utils.wrap(-mq.w, 0, mq.x);
    gsap.set(track, { x: mq.x });
  });

  // page scroll steers direction + speed
  ScrollTrigger.create({
    trigger: logos, start: "top bottom", end: "bottom top",
    onUpdate: (self) => {
      mq.dir = self.direction;
      mq.boost = Math.max(mq.boost, Math.min(Math.abs(self.getVelocity()) / 6, 900));
    },
  });

  // hover slows it so logos can be read
  logos.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && gsap.to(mq, { hover: 0.25, duration: 0.8 }));
  logos.addEventListener("pointerleave", () => gsap.to(mq, { hover: 1, duration: 0.8 }));

  // drag / swipe with momentum
  let lastX = 0, lastT = 0, vel = 0, mqStartX = 0, mqStartY = 0, axis = null;
  viewport.addEventListener("pointerdown", (e) => {
    mq.dragging = true; axis = e.pointerType === "mouse" ? "x" : null;
    mqStartX = lastX = e.clientX; mqStartY = e.clientY; lastT = performance.now(); vel = 0; mq.inertia = 0; mq.boost = 0;
    logos.classList.add("is-dragging");
    try { viewport.setPointerCapture(e.pointerId); } catch {}
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!mq.dragging) return;
    if (!axis) { // touch: decide between swiping logos and scrolling the page
      const dx = Math.abs(e.clientX - mqStartX), dy = Math.abs(e.clientY - mqStartY);
      if (dx + dy < 6) return;
      axis = dx > dy ? "x" : "y";
      if (axis === "y") { mq.dragging = false; logos.classList.remove("is-dragging"); return; }
    }
    const now = performance.now();
    const dx = e.clientX - lastX;
    mq.x += dx;
    vel = 0.8 * (dx / Math.max(now - lastT, 1)) * 1000 + 0.2 * vel;
    lastX = e.clientX; lastT = now;
  });
  const release = () => {
    if (!mq.dragging) return;
    mq.dragging = false; logos.classList.remove("is-dragging");
    mq.inertia = gsap.utils.clamp(-4000, 4000, vel);
    if (vel) mq.dir = vel < 0 ? 1 : -1; // keep drifting the way it was thrown
  };
  viewport.addEventListener("pointerup", release);
  viewport.addEventListener("pointercancel", release);

  // trackpad horizontal scroll / shift + wheel
  viewport.addEventListener("wheel", (e) => {
    const dx = e.shiftKey ? e.deltaY : e.deltaX;
    if (Math.abs(dx) <= Math.abs(e.shiftKey ? e.deltaX : e.deltaY)) return; // vertical → let the page scroll
    e.preventDefault();
    mq.x -= dx;
    mq.inertia = gsap.utils.clamp(-2500, 2500, -dx * 12);
    mq.dir = dx > 0 ? 1 : -1;
  }, { passive: false });

  // keyboard
  logos.tabIndex = 0;
  logos.setAttribute("aria-label", "Our brands — drag, swipe or use arrow keys to scroll");
  logos.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const d = e.key === "ArrowRight" ? 1 : -1;
    mq.inertia = -d * 1400; mq.dir = d;
  });

  gsap.from(".logos__viewport", {
    autoAlpha: 0, y: 30, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: ".logos", start: "top 92%" },
  });

  } // IS_HOME logos

  /* ---------------------------------------------------------------------
     Section labels — char reveal
     --------------------------------------------------------------------- */
  document.fonts?.ready.then(() => {
    $$(".about__title, .label").forEach((el) => {
      const split = SplitText.create(el, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.025,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  });

  if (IS_HOME) {
  /* ---------------------------------------------------------------------
     Pillars — scroll-driven stage (modelled on cominvi.com.mx "Minerals")
     One scrubbed value `pos` (0 → steps-1) drives:
       · the orange dial filling clockwise (conic mask --angle)
       · the pattern card spinning in 3D, revealing the next pillar on its back
       · the active name + odometer ticker, switched when the card is edge-on
     --------------------------------------------------------------------- */
  const pin = $(".pillars__pin");
  const PATTERNS = ["technology", "sustainability", "investment", "creativity"]
    .map((n) => `assets/img/pillar-${n}.png`);
  const steps = PATTERNS.length;
  const listItems = $$(".pillars__list li", pin);
  const dialFill = $(".dial--fill", pin);
  const card = $(".spinner__card", pin);
  const faces = $$(".spinner__face", pin);
  const frontImg = $(".spinner__face--front img", pin);
  const backImg = $(".spinner__face--back img", pin);
  const shadow = $(".spinner__shadow", pin);
  const glow = $(".pillars__glow", pin);
  const tickerTracks = $$(".ticker__track", pin);
  const HOLD = 0.22; // share of each segment the card rests on a pillar (each side)
  let current = -1, frontIdx = 0, backIdx = 1;

  const setActive = (i) => {
    if (i === current) return;
    current = i;
    listItems.forEach((li) => li.classList.toggle("is-active", +li.dataset.step === i));
    tickerTracks.forEach((t, k) =>
      gsap.to(t, { yPercent: (-100 / steps) * i, duration: 0.7, ease: "expo.out", delay: k * 0.05, overwrite: true })
    );
  };

  const stage = { pos: 0 };
  function renderPillars() {
    const pos = stage.pos;
    const seg = Math.min(Math.floor(pos), steps - 2);
    const f = pos - seg;
    const s = gsap.parseEase("power2.inOut")(gsap.utils.clamp(0, 1, (f - HOLD) / (1 - HOLD * 2)));
    const edge = Math.sin(s * Math.PI); // 0 flat → 1 edge-on

    if (frontIdx !== seg) { frontIdx = seg; frontImg.src = PATTERNS[seg]; }
    if (backIdx !== seg + 1) { backIdx = seg + 1; backImg.src = PATTERNS[seg + 1]; }

    gsap.set(card, { rotationY: s * 180, rotationX: edge * 8, scale: 1 - edge * 0.1 });
    faces.forEach((el) => el.style.setProperty("--shade", (edge * 0.55).toFixed(3)));
    gsap.set(shadow, { scaleX: 1 - edge * 0.55, opacity: 1 - edge * 0.4 });
    dialFill.style.setProperty("--angle", (pos / (steps - 1)) * 360 + "deg");
    gsap.set(glow, { autoAlpha: Math.max(0, 1 - Math.abs(pos - 1)) }); // Sustainability glow

    setActive(seg + (s >= 0.5 ? 1 : 0));
  }
  renderPillars();

  const pillarsTl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => "+=" + innerHeight * (steps - 1) * 0.95,
      pin: true,
      scrub: 0.9,
    },
  }).to(stage, { pos: steps - 1, ease: "none", onUpdate: renderPillars });

  // idle float so the card feels alive while resting
  if (!reduceMotion) gsap.to(card, { y: -10, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

  // entrance before the pin engages
  gsap.from([".dial--base", ".dial--fill", ".spinner"], {
    scale: 0.8, autoAlpha: 0, duration: 1.6, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".pillars", start: "top 75%" },
  });
  gsap.from([".pillars__label", ".pillars__kicker", ".pillars__list", ".ticker"], {
    autoAlpha: 0, y: 20, duration: 1.1, ease: "expo.out", stagger: 0.06,
    scrollTrigger: { trigger: ".pillars", start: "top 60%" },
  });

  // click a pillar name to scroll to it
  listItems.forEach((li) => {
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      const st = pillarsTl.scrollTrigger;
      const y = st.start + (st.end - st.start) * (+li.dataset.step / (steps - 1));
      smoother ? smoother.scrollTo(y + 1, true) : scrollTo({ top: y + 1, behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------------------
     Warm background parallax + About scrubbed words
     --------------------------------------------------------------------- */
  gsap.fromTo(".warm__bg", { yPercent: -8 }, {
    yPercent: 8, ease: "none",
    scrollTrigger: { trigger: ".warm", start: "top bottom", end: "bottom top", scrub: true },
  });

  document.fonts?.ready.then(() => {
    const aboutSplit = SplitText.create(".about__text", { type: "words", wordsClass: "word" });
    gsap.to(aboutSplit.words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: ".about__text", start: "top 82%", end: "bottom 50%", scrub: true },
    });
  });

  /* ---------------------------------------------------------------------
     Projects carousel — center 641×404, sides 529×333, gap 75 (infinite)
     --------------------------------------------------------------------- */
  const carousel = $(".carousel");
  const cards = $$(".carousel__card", carousel);
  const N = cards.length;
  const state = { pos: 0 };
  const SIDE = 529 / 641;      // side scale
  const STEP1 = 660 / 641;     // center → neighbour distance, in card widths
  const STEPN = 604 / 641;     // neighbour → next distance

  const wrapOffset = (o) => { o = ((o % N) + N) % N; return o > N / 2 ? o - N : o; };
  function render() {
    const cw = cards[0].offsetWidth;
    cards.forEach((card, i) => {
      const o = wrapOffset(i - state.pos);
      const a = Math.abs(o);
      const dist = a <= 1 ? a * STEP1 : STEP1 + (a - 1) * STEPN;
      const s = 1 - Math.min(a, 1) * (1 - SIDE);
      gsap.set(card, {
        x: Math.sign(o) * dist * cw,
        scale: s,
        borderRadius: (31 + Math.min(a, 1) * (32 / SIDE - 31)) * (cw / 641),
        zIndex: 10 - Math.round(a * 2),
        filter: `brightness(${1 - Math.min(a, 1.5) * 0.12})`,
      });
    });
  }
  render();
  addEventListener("resize", render);

  // scroll drives the carousel: the block pins and scrolling moves card → card
  const count = $(".projects__count");
  const bar = $(".projects__bar i");
  $(".projects__total").textContent = String(N).padStart(2, "0");
  const skewTo = gsap.quickTo(carousel, "skewX", { duration: 0.6, ease: "power3.out" });

  const projectsST = ScrollTrigger.create({
    trigger: ".projects__pin",
    start: "center center",
    end: () => "+=" + innerHeight * (N - 1) * 0.6,
    pin: true,
    scrub: 0.8,
    snap: reduceMotion ? false : { snapTo: 1 / (N - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.1, ease: "power2.inOut" },
    onUpdate: (self) => {
      state.pos = self.progress * (N - 1);
      render();
      count.textContent = String(Math.round(state.pos) + 1).padStart(2, "0");
      gsap.set(bar, { scaleX: self.progress });
      if (!reduceMotion) skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -400));
    },
    onLeave: () => skewTo(0),
    onLeaveBack: () => skewTo(0),
  });
  ScrollTrigger.addEventListener("scrollEnd", () => skewTo(0));

  // drag / keys / click move the page scroll, so scroll stays the source of truth
  const yFor = (pos) => projectsST.start + (projectsST.end - projectsST.start) * (gsap.utils.clamp(0, N - 1, pos) / (N - 1));
  const setScroll = (y, smooth) => {
    if (smoother) smooth ? smoother.scrollTo(y, true) : smoother.scrollTop(y);
    else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
  };
  const goTo = (pos) => setScroll(yFor(Math.round(pos)) + 1, true);

  let dragging = false, startX = 0, startPos = 0, moved = 0;
  carousel.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0; startX = e.clientX; startPos = state.pos;
    carousel.classList.add("is-dragging");
    try { carousel.setPointerCapture(e.pointerId); } catch {}
  });
  carousel.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
    if (moved > 6) setScroll(yFor(startPos - dx / (cards[0].offsetWidth * STEP1)), false);
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false; carousel.classList.remove("is-dragging");
    const dx = e.clientX - startX;
    let target = Math.round(state.pos);
    if (target === Math.round(startPos) && Math.abs(dx) > 40) target += dx < 0 ? 1 : -1;
    if (moved < 6) { // click a side card → centre it; click the centred card → open it
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest(".carousel__card");
      if (hit) {
        const idx = cards.indexOf(hit);
        if (idx === ((Math.round(state.pos) % N) + N) % N) return navigateTo(`projects.html#project-${idx + 1}`);
        target = idx;
      }
    }
    goTo(target);
  };
  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointercancel", endDrag);
  carousel.tabIndex = 0;
  carousel.setAttribute("aria-label", "Projects carousel — use arrow keys");
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(Math.round(state.pos) + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(Math.round(state.pos) - 1); }
  });

  gsap.from(cards, {
    y: 120, autoAlpha: 0, duration: 1.4, ease: "expo.out", stagger: { each: 0.08, from: "center" },
    scrollTrigger: { trigger: carousel, start: "top 85%" },
    onStart: render,
  });

  /* ---------------------------------------------------------------------
     Locations map
     --------------------------------------------------------------------- */
  const map = $(".map");
  const pins = $$(".pin", map);
  const mapItems = $$(".map__list li");

  gsap.fromTo(".map__img", { scale: 1.18 }, {
    scale: 1, ease: "none",
    scrollTrigger: { trigger: map, start: "top bottom", end: "bottom 60%", scrub: true },
  });
  pins.forEach((p) => p.style.setProperty("--d", (Math.random() * 2.4).toFixed(2) + "s"));
  gsap.from(pins, {
    scale: 0, autoAlpha: 0, duration: 0.9, ease: "back.out(2.4)", stagger: { each: 0.12, from: "random" },
    scrollTrigger: { trigger: map, start: "top 55%" },
  });
  gsap.from(".map__card", {
    yPercent: 25, autoAlpha: 0, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: map, start: "top 60%" },
  });
  gsap.from(mapItems, {
    yPercent: 100, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, delay: 0.3,
    scrollTrigger: { trigger: map, start: "top 60%" },
  });

  const lightGroup = (g) => {
    map.classList.toggle("has-focus", g !== null);
    pins.forEach((p) => p.classList.toggle("is-lit", g !== null && p.dataset.group === g));
    mapItems.forEach((li) => li.classList.toggle("is-lit", g !== null && li.dataset.group === g));
  };
  mapItems.forEach((li) => {
    li.addEventListener("pointerenter", () => lightGroup(li.dataset.group));
    li.addEventListener("pointerleave", () => lightGroup(null));
  });
  pins.forEach((p) => {
    p.addEventListener("pointerenter", () => { lightGroup(p.dataset.group); gsap.to(p, { scale: 1.35, duration: 0.5, ease: "back.out(3)" }); });
    p.addEventListener("pointerleave", () => { lightGroup(null); gsap.to(p, { scale: 1, duration: 0.5, ease: "expo.out" }); });
    p.addEventListener("focus", () => lightGroup(p.dataset.group));
    p.addEventListener("blur", () => lightGroup(null));
  });

  } // IS_HOME pillars → map

  /* ---------------------------------------------------------------------
     PROJECTS PAGE
     --------------------------------------------------------------------- */
  if (PAGE === "projects") {
    const phero = $(".phero");
    const media = $(".phero__media");
    const panel = $(".phero__panel");
    const card = $(".phero__card");
    const pTitle = $(".phero__title");
    const pText = $(".phero__text");
    gsap.set(media, { scale: 1.2, autoAlpha: 0 });
    gsap.set(panel, { autoAlpha: 0, y: 60 });
    // the card's clip in px (computed clip-path keeps calc() unresolved, which GSAP can't tween)
    const frame = $(".phero__frame");
    const cardClip = () => {
      const h = phero.getBoundingClientRect(), f = frame.getBoundingClientRect();
      const t = f.top - h.top, l = f.left - h.left;
      return `inset(${t}px ${h.width - l - f.width}px ${h.height - t - f.height}px ${l}px)`;
    };
    gsap.set(panel, { clipPath: cardClip() });
    gsap.set(card, { x: 0, y: 0, xPercent: -50, yPercent: -50 }); // centred by GSAP so later tweens stay in %
    gsap.set([pTitle, pText], { autoAlpha: 0 });
    gsap.set(".phero__rule", { scaleX: 0 });

    pageIntro = () => {
      const chars = SplitText.create(pTitle, { type: "chars", mask: "chars" }).chars;
      const lines = SplitText.create(pText, { type: "lines", mask: "lines" }).lines;
      gsap.set([pTitle, pText], { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(media, { scale: 1.08, autoAlpha: 1, duration: 2.4, ease: "power3.out" })
        .to(panel, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.15)
        .from(chars, { yPercent: 110, duration: 1.2, stagger: 0.035 }, 0.75)
        .to(".phero__rule", { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0.95)
        .from(lines, { yPercent: 110, duration: 1.1, stagger: 0.05 }, 1.0);
      return tl;
    };

    if (finePointer && !reduceMotion) {
      const xTo = gsap.quickTo(".phero__bg", "x", { duration: 1.6, ease: "power3.out" });
      const yTo = gsap.quickTo(".phero__bg", "y", { duration: 1.6, ease: "power3.out" });
      phero.addEventListener("pointermove", (e) => {
        xTo((e.clientX / innerWidth - 0.5) * -40);
        yTo((e.clientY / innerHeight - 0.5) * -26);
      });
    }

    /* Hero (range "Caribbean Island Retreats"): the stage pins and the black
       card grows until it fills the viewport, handing over to the black list */
    gsap.timeline({
      scrollTrigger: { trigger: phero, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: 1, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      .fromTo(panel, { clipPath: cardClip }, { clipPath: "inset(0px 0px 0px 0px)", ease: "power2.inOut", duration: 1, immediateRender: false }, 0)
      .to(media, { scale: 1.22, duration: 1 }, 0)
      .to(".phero__fade", { autoAlpha: 0, duration: 0.6 }, 0)
      .to(card, { yPercent: -104, duration: 1, ease: "power1.in" }, 0.25) // text drifts up as the panel takes over
      .to(".phero__rule", { scaleX: 2.2, duration: 0.6, ease: "power2.inOut" }, 0.1);

    /* List (range "middle menu"): the row at viewport centre is active —
       bright, logo + copy shown, its dividers lit; sticky slots swap images */
    const rows = $$(".proj");
    const lines = $$(".proj__line");
    const slots = $$(".slot");
    const names = rows.map((r) => $(".proj__title", r).textContent.replace(/\s+/g, " ").trim());
    const slotImgs = slots.map((slot, k) =>
      rows.map((row, i) => {
        const fig = document.createElement("figure");
        fig.className = "slot__img";
        const src = (row.dataset.images || "").split(",")[k];
        fig.innerHTML = src && src.trim()
          ? `<img src="${src.trim()}" alt="">`
          : `<span class="slot__ph">${String(i + 1).padStart(2, "0")} — ${names[i]}</span>`;
        slot.appendChild(fig);
        return fig;
      })
    );
    const dimA = matchMedia("(max-width: 900px)").matches ? 0.28 : 0.14;
    gsap.set(rows, { opacity: dimA });
    gsap.set(rows.map((r) => [$(".proj__logo", r), $(".proj__desc", r)]).flat(), { autoAlpha: 0, y: 18 });

    let activeIdx = -1, layer = 1;
    const setActiveRow = (i) => {
      if (i === activeIdx) return;
      const prev = activeIdx;
      activeIdx = i;
      rows.forEach((r, k) => {
        const on = k === i;
        gsap.to(r, { opacity: on ? 1 : dimA, duration: 0.7, ease: "power2.out", overwrite: "auto" });
        gsap.to([$(".proj__logo", r), $(".proj__desc", r)], {
          autoAlpha: on ? 1 : 0, y: on ? 0 : 18, duration: on ? 0.9 : 0.5, ease: on ? "expo.out" : "power2.out",
          stagger: on ? 0.08 : 0, delay: on ? 0.1 : 0, overwrite: "auto",
        });
      });
      // the active row's top + bottom dividers light up with the ember gem
      lines.forEach((l, k) => {
        const on = k === i || k === i + 1;
        gsap.to(l, { opacity: on ? 1 : 0.18, duration: 0.7, overwrite: "auto" });
        gsap.to($(".proj__gem", l), { scale: on ? 1 : 0, rotation: 45, duration: 0.6, ease: on ? "back.out(3)" : "power2.in", overwrite: "auto" });
      });
      // images: the new project's frames wipe in over the old ones
      layer++;
      slotImgs.forEach((set, k) => {
        const fig = set[i];
        gsap.set(fig, { zIndex: layer });
        gsap.fromTo(fig, { clipPath: prev < i ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", delay: k * 0.08, overwrite: true,
        });
        gsap.fromTo(fig.firstElementChild, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: "expo.out", delay: k * 0.08, overwrite: true });
      });
    };

    rows.forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row, start: "top 55%", end: "bottom 55%",
        onToggle: (st) => st.isActive && setActiveRow(i),
      });
      row.addEventListener("pointermove", (e) => { // fire glow follows the pointer
        const b = row.getBoundingClientRect();
        row.style.setProperty("--mx", e.clientX - b.left + "px");
        row.style.setProperty("--my", e.clientY - b.top + "px");
      });
    });
    setActiveRow(0);

    // the slot layer stays put while the list scrolls under it
    ScrollTrigger.create({
      trigger: ".plist__sticky", start: "top top", endTrigger: ".plist__rows", end: "bottom bottom",
      pin: true, pinSpacing: false,
    });
    gsap.from(slots, {
      autoAlpha: 0, y: 40, duration: 1.2, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: ".plist__rows", start: "top 70%" },
    });

    // warm background drifts behind the list
    gsap.fromTo(".plist__bg img", { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".plist", start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  /* ---------------------------------------------------------------------
     LOCATION PAGE (modelled on sobha-privy-collection.com/location)
     A pinned stage; scroll flies a CSS-3D camera over the map. Pins live in
     a flat overlay and follow 0×0 anchors inside the tilted map each frame.
     --------------------------------------------------------------------- */
  if (PAGE === "location") {
    const stage = $(".loc__stage");
    const camera = $(".loc__camera");
    const map = $(".loc__map");
    const title = $(".loc__title");
    const clouds = $$(".cloud");
    const anchors = $$(".loc__anchor").reduce((o, a) => ((o[a.dataset.pin] = a), o), {});
    const pins = $$(".lpin");
    const pinOf = (id) => pins.find((p) => p.dataset.pin === id);

    /* ---- 3D city: CSS cuboids standing on the map (sizes in em = map design px) ---- */
    const city = document.createElement("div");
    city.className = "loc__city";
    map.appendChild(city);
    const el = (cls, parent) => { const n = document.createElement(cls === "i" ? "i" : "div"); if (cls !== "i") n.className = cls; parent && parent.appendChild(n); return n; };
    function box(parent, w, d, h, ox = 0, oy = 0, oz = 0, rz = 0, extra = "") {
      const b = el("box" + (extra ? " " + extra : ""), parent);
      b.style.transform = `translate3d(${ox}em, ${oy}em, ${oz}em) rotateZ(${rz}deg)`;
      const face = (cls, css) => { const f = document.createElement("i"); f.className = cls; Object.assign(f.style, css); b.appendChild(f); };
      face("f-front", { left: -w / 2 + "em", top: d / 2 - h + "em", width: w + "em", height: h + "em" });
      face("f-back", { left: -w / 2 + "em", top: -d / 2 - h + "em", width: w + "em", height: h + "em" });
      face("f-left", { left: -w / 2 - h + "em", top: -d / 2 + "em", width: h + "em", height: d + "em" });
      face("f-right", { left: w / 2 - h + "em", top: -d / 2 + "em", width: h + "em", height: d + "em" });
      face("f-top", { left: -w / 2 + "em", top: -d / 2 + "em", width: w + "em", height: d + "em", transform: `translateZ(${h}em)` });
      return b;
    }
    function building(x, y, kind, cls) {
      const b = el("bld " + cls, city);
      b.style.setProperty("--x", x + "%"); b.style.setProperty("--y", y + "%");
      const sh = el("bld__shadow", b);
      let top = 20, foot = 40;
      const B = (...a) => box(b, ...a);
      switch (kind) {
        case "kingdom": // 302 m tower with its sky-bridge gap
          B(30, 20, 190); B(8, 20, 46, -11, 0, 190); B(8, 20, 46, 11, 0, 190); B(30, 20, 4, 0, 0, 232); top = 240; foot = 46; break;
        case "faisaliah": // tapered steps + golden crown
          B(28, 28, 120); B(20, 20, 46, 0, 0, 120); B(12, 12, 30, 0, 0, 166, 0, "is-gold"); B(5, 5, 22, 0, 0, 196, 0, "is-gold"); top = 222; foot = 44; break;
        case "kafd":
          B(24, 24, 160); B(18, 18, 118, 30, 12); B(16, 16, 94, -26, 16); B(14, 14, 72, 8, -30); top = 168; foot = 80; break;
        case "boulevard":
          B(64, 30, 12); B(32, 26, 20, 44, 22); B(26, 22, 10, -40, 20); top = 30; foot = 100; break;
        case "fort": // walls + corner towers
          B(62, 50, 16); [[-27, -21], [27, -21], [-27, 21], [27, 21]].forEach(([ox, oy]) => B(11, 11, 28, ox, oy)); top = 36; foot = 80; break;
        case "stadium": // ring of stands
          for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; B(17, 7, 16, Math.cos(a) * 36, Math.sin(a) * 30, 0, (a * 180) / Math.PI + 90); }
          top = 26; foot = 96; break;
        case "tower": { // Balance residences: 3 floors (6em each), main block + side wing
          const F = 6, floors = 3;
          B(46, 36, F * floors); B(26, 24, F * floors, 22, 16); top = F * floors + 6; foot = 66; break;
        }
        default: { // filler block
          const [w, d, h] = kind; B(w, d, h); top = h; foot = Math.max(w, d) * 1.5;
        }
      }
      sh.style.width = foot * 1.5 + "em"; sh.style.height = foot * 1.2 + "em";
      const roof = el("loc__roof", b);
      roof.style.transform = `translateZ(${top + 8}em)`;
      roof.dataset.z = top + 8; // roof height (em) — used by the JS projection
      return { b, roof };
    }
    const KIND = { kafd: "kafd", "kingdom-centre": "kingdom", "al-faisaliah": "faisaliah", boulevard: "boulevard", masmak: "fort", stadium: "stadium" };
    const buildings = {};
    pins.forEach((pin) => {
      const id = pin.dataset.pin, a = anchors[id];
      if (!a || pin.classList.contains("lpin--label")) return;
      const x = parseFloat(a.style.getPropertyValue("--x")), y = parseFloat(a.style.getPropertyValue("--y"));
      const primary = pin.classList.contains("lpin--primary");
      const { b, roof } = building(x, y, primary ? "tower" : KIND[id] || "kafd", (primary ? "bld--project" : "bld--landmark") + " bld--down is-link");
      b.style.setProperty("--d", (Math.random() * 0.35).toFixed(2) + "s");
      buildings[id] = b;
      anchors[id] = roof; // labels now float above the roof
      // hover/click the building itself, mirrored with its label
      b.addEventListener("pointerenter", () => { b.classList.add("is-hot"); pin.classList.add("is-hover"); });
      b.addEventListener("pointerleave", () => { b.classList.remove("is-hot"); pin.classList.remove("is-hover"); });
      pin.addEventListener("pointerenter", () => b.classList.add("is-hot"));
      pin.addEventListener("pointerleave", () => b.classList.remove("is-hot"));
      b.addEventListener("click", () => !pin.classList.contains("lpin--hidden") && open(id));
    });
    // filler skyline across the dense city (seeded so it is the same every visit)
    {
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const taken = Object.values(anchors).length ? $$(".loc__anchor").map((a) => [parseFloat(a.style.getPropertyValue("--x")), parseFloat(a.style.getPropertyValue("--y"))]) : [];
      let placed = 0, tries = 0;
      while (placed < 90 && tries++ < 900) {
        const x = 58 + rnd() * 30, y = 22 + rnd() * 68;
        const dist = Math.hypot((x - 70) / 14, (y - 54) / 30);
        if (dist > 1.05 || taken.some(([tx, ty]) => Math.abs(tx - x) < 2.6 && Math.abs(ty - y) < 4.5)) continue;
        if (x > 64.5 && x < 73.5 && y > 55.5 && y < 74) continue; // keep the street-level sightline to OLYX clear
        const h = 8 + (1 - Math.min(dist, 1)) * 70 * rnd() + rnd() * 10;
        const w = 10 + rnd() * 14, d = 10 + rnd() * 14;
        const { b } = building(x, y, [w, d, h], "bld--filler bld--down");
        b.style.setProperty("--d", (0.4 + rnd() * 1.4).toFixed(2) + "s");
        taken.push([x, y]); placed++;
      }
    }

    // film grain texture, generated once
    (() => {
      const c = document.createElement("canvas"); c.width = c.height = 180;
      const x = c.getContext("2d"), img = x.createImageData(180, 180);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.random() < 0.5 ? 18 : 0;
      }
      x.putImageData(img, 0, 0);
      $(".loc__noise").style.backgroundImage = `url(${c.toDataURL()})`;
    })();

    /* camera path — a shot list sampled on one continuous Catmull-Rom spline
       fx/fy: focus point on the map (%) · rx: pitch (0 = top-down) · rz: orbit
       s: altitude (zoom) · per: lens (perspective px) · bank: eagle roll (deg) */
    const K = [
      // aerial high-angle → mid-air → bird-like descent onto Al Olaya (OLYX centred, Kingdom Centre behind).
      // fx and rz stay fixed: no left/right, no turning — only a forward glide (fy) while descending.
      // po = eye line on screen (perspective-origin y %), cy = where the camera's anchor sits on screen
      { p: 0.00, fx: 69, fy: 66, rx: 58, rz: 0, s: 0.72, per: 1600, bank: 0, po: 38, cy: 52 },   // aerial high-angle
      { p: 0.12, fx: 69, fy: 65.5, rx: 57, rz: 0, s: 0.80, per: 1550, bank: 0, po: 38, cy: 52 },
      { p: 0.24, fx: 69, fy: 65, rx: 50, rz: 0, s: 1.15, per: 1300, bank: 0, po: 38, cy: 52 },   // diving through the smoke
      { p: 0.36, fx: 69, fy: 64, rx: 41, rz: 0, s: 1.55, per: 1350, bank: 0, po: 40, cy: 52 },   // mid-air shot
      { p: 0.52, fx: 69, fy: 59, rx: 62, rz: 0, s: 1.60, per: 1250, bank: 0, po: 43, cy: 55 },   // still descending, nose coming up
      { p: 0.64, fx: 69, fy: 57, rx: 73, rz: 0, s: 1.62, per: 1300, bank: 0, po: 47, cy: 59 },   // final frame: low oblique over Al Olaya, all projects in view
      { p: 0.78, fx: 69, fy: 57, rx: 73, rz: 0, s: 1.62, per: 1300, bank: 0, po: 47, cy: 59 },   // hold it
      // then out to MAAD along Makkah Road, and the overview (unchanged)
      { p: 0.90, fx: 30, fy: 36, rx: 46, rz: -6, s: 1.05, per: 1500, bank: 0, po: 38, cy: 52 },
      { p: 1.00, fx: 66, fy: 50, rx: 36, rz: 0, s: 1.25, per: 1500, bank: 0, po: 38, cy: 52 },
    ];
    const CH = ["fx", "fy", "rx", "rz", "s", "per", "bank", "po", "cy"];
    const catmull = (p0, p1, p2, p3, t) => {
      const t2 = t * t, t3 = t2 * t;
      return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    };
    const sample = (p) => {
      p = gsap.utils.clamp(0, 1, p);
      let i = 0;
      while (i < K.length - 2 && p > K[i + 1].p) i++;
      const b = K[i], c = K[i + 1], a = K[i - 1], d = K[i + 2];
      const t = (p - b.p) / (c.p - b.p || 1);
      const o = {};
      // smooth, but never overshoot a segment: constant channels stay constant, the dive never re-climbs.
      // at the ends, extrapolate a phantom point so the first/last segment has no wobble
      CH.forEach((k) => {
        const pa = a ? a[k] : 2 * b[k] - c[k], pd = d ? d[k] : 2 * c[k] - b[k];
        o[k] = gsap.utils.clamp(Math.min(b[k], c[k]), Math.max(b[k], c[k]), catmull(pa, b[k], c[k], pd, t));
      });
      o.rx = Math.max(o.rx, 0.5); o.s = Math.max(o.s, 0.3);
      return o;
    };
    const scene = $(".loc__scene");
    const intro = { s: -0.28, rz: 0, rx: 6 }; // the intro starts higher, then descends straight into the establishing shot
    let cam = sample(0);
    // geometry cache (updated on resize) — no layout reads inside the frame loop
    const G = { W: 0, H: 0, mw: 0, mh: 0, em: 0 };
    const measure = () => {
      G.W = stage.clientWidth; G.H = stage.clientHeight;
      G.mw = map.offsetWidth; G.mh = map.offsetHeight; G.em = G.mw / 2376;
    };
    measure();
    const view = {}; // the transform actually applied this frame (cam + intro), shared with the pin projection
    let camDirty = true;
    const applyCam = () => {
      view.rx = cam.rx + intro.rx; view.rz = cam.rz + intro.rz; view.z = cam.s + intro.s;
      view.fx = cam.fx; view.fy = cam.fy; view.per = cam.per; view.po = cam.po; view.cy = cam.cy; view.bank = cam.bank;
      // plain style strings (no GSAP setters per frame); scale3d so building height zooms with the city
      map.style.transform = `translate3d(${-(view.fx / 100 - 0.5) * G.mw}px, ${-(view.fy / 100 - 0.5) * G.mh}px, 0)`;
      camera.style.transform = `rotateX(${view.rx}deg) rotateZ(${view.rz}deg) scale3d(${view.z}, ${view.z}, ${view.z})`;
      camera.style.top = view.cy + "%";
      scene.style.perspective = view.per + "px";
      scene.style.perspectiveOrigin = `50% ${view.po}%`;
      scene.style.transform = view.bank ? `rotate(${view.bank}deg)` : "";
      camDirty = true;
    };
    applyCam();

    const path = { p: 0 };
    const loc = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: "top top", end: () => "+=" + innerHeight * 7, pin: true, scrub: 1.4,
        onUpdate: (st) => revealPins(st.progress),
      },
    });
    loc.to(path, { p: 1, duration: 1, ease: "none", onUpdate: () => { cam = sample(path.p); applyCam(); } }, 0);
    // smoke scatters outward and thins; title lifts away (sobha parallax)
    clouds.forEach((c, i) => {
      const b = c.getBoundingClientRect();
      const dx = (b.left + b.width / 2 - innerWidth / 2) / innerWidth, dy = (b.top + b.height / 2 - innerHeight / 2) / innerHeight;
      loc.to(c, { x: dx * innerWidth * 1.2, y: dy * innerHeight * 1.2, opacity: i % 2 ? 0.06 : 0.12, scale: 2.1, duration: 0.3, ease: "power2.in" }, 0.04);
    });
    loc.to(title, { yPercent: -70, opacity: 0, duration: 0.12, ease: "power1.in" }, 0)
       .to(".loc__arrow", { opacity: 0, y: 20, duration: 0.06 }, 0);

    // idle smoke drift
    if (!reduceMotion) clouds.forEach((c, i) =>
      gsap.to(c, { xPercent: i % 2 ? 7 : -7, yPercent: i % 3 ? 5 : -4, rotation: i % 2 ? 4 : -3, duration: 9 + i * 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 })
    );

    /* pins: project their 3D anchor with the same math CSS uses (scale → rotateZ → rotateX →
       camera anchor → perspective). Zero layout reads per frame, and work only when the camera moved. */
    const D2R = Math.PI / 180;
    const pinData = pins.map((pin) => {
      const id = pin.dataset.pin, base = $(`.loc__anchor[data-pin="${id}"]`);
      return {
        pin, x: parseFloat(base.style.getPropertyValue("--x")) / 100, y: parseFloat(base.style.getPropertyValue("--y")) / 100,
        zEm: anchors[id] && anchors[id].dataset.z ? +anchors[id].dataset.z : 0, off: null, tx: -1e9, ty: -1e9,
      };
    });
    const project = (d) => {
      const v = view, z = v.z;
      // map-local → camera-local (map is centred on the focus point), then scale
      let x = (d.x - v.fx / 100) * G.mw * z, y = (d.y - v.fy / 100) * G.mh * z, h = d.zEm * G.em * z;
      const cz = Math.cos(v.rz * D2R), sz = Math.sin(v.rz * D2R);
      [x, y] = [x * cz - y * sz, x * sz + y * cz];                      // rotateZ
      const cx = Math.cos(v.rx * D2R), sx = Math.sin(v.rx * D2R);
      const Y = y * cx - h * sx, Z = y * sx + h * cx;                  // rotateX
      const wx = G.W / 2 + x, wy = (v.cy / 100) * G.H + Y;             // camera anchor on the stage
      const ox = G.W / 2, oy = (v.po / 100) * G.H, k = v.per / (v.per - Z); // perspective
      let sx2 = ox + (wx - ox) * k, sy2 = oy + (wy - oy) * k;
      if (v.bank) { // scene roll about its centre
        const c = Math.cos(v.bank * D2R), s = Math.sin(v.bank * D2R), dx = sx2 - G.W / 2, dy = sy2 - G.H / 2;
        sx2 = G.W / 2 + dx * c - dy * s; sy2 = G.H / 2 + dx * s + dy * c;
      }
      return [sx2, sy2, Z < v.per - 1];
    };
    const placePins = () => {
      if (!camDirty) return;
      camDirty = false;
      for (const d of pinData) {
        const [x, y, inFront] = project(d);
        const off = !inFront || x < -80 || y < -80 || x > G.W + 80 || y > G.H + 80;
        if (off !== d.off) { d.off = off; d.pin.classList.toggle("is-offscreen", off); }
        if (!off && (Math.abs(x - d.tx) > 0.1 || Math.abs(y - d.ty) > 0.1)) {
          d.tx = x; d.ty = y;
          d.pin.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        }
      }
    };
    gsap.ticker.add(placePins);
    addEventListener("resize", () => { measure(); applyCam(); });
    function revealPins(p) { // hoisted: ScrollTrigger may call onUpdate while it is being created
      pins.forEach((pin) => {
        const hidden = p < +pin.dataset.reveal;
        pin.classList.toggle("lpin--hidden", hidden);
        buildings[pin.dataset.pin]?.classList.toggle("bld--down", hidden);
      });
    }
    revealPins(0);

    pageIntro = () => {
      const chars = SplitText.create(title, { type: "chars", mask: "chars" }).chars;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(intro, { s: 0, rz: 0, rx: 0, duration: 3, ease: "power3.out", onUpdate: applyCam }, 0)
        .from(clouds, { opacity: 0, scale: 1.4, duration: 2.6, stagger: 0.08, ease: "power2.out" }, 0)
        .from(chars, { yPercent: 105, duration: 1.4, stagger: 0.06 }, 0.5)
        .from(".loc__arrow", { opacity: 0, y: 20, duration: 1.2 }, 1.1)
        .add(() => $$(".bld--filler").forEach((b) => b.classList.remove("bld--down")), 0.4);
      return tl;
    };

    /* side panels — sobha modal--side: clip-path wipe from the right, 1s */
    const EASE = "power4.inOut";
    const mobile = () => matchMedia("(max-width: 900px)").matches;
    let openModal = null;
    const panelOf = (m) => $(".lmodal__panel", m);
    function open(id, fromHash) {
      const m = document.getElementById(id);
      if (!m || !m.classList.contains("lmodal") || openModal === m) return;
      if (openModal) close(true);
      openModal = m;
      m.classList.add("is-open"); m.setAttribute("aria-hidden", "false");
      pins.forEach((p) => p.classList.toggle("is-active", p.dataset.pin === id));
      smoother && smoother.paused(true);
      const panel = panelOf(m);
      gsap.killTweensOf(panel);
      if (mobile()) gsap.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: EASE });
      else gsap.fromTo(panel, { clipPath: "inset(0% 0% 0% 100%)", x: 20 }, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1, ease: EASE });
      const img = $(".lproj__ph, .lpoi__ph", m);
      img && gsap.fromTo(img, { x: mobile() ? 0 : 100, scale: 1.15 }, { x: 0, scale: 1, duration: 1.4, ease: "expo.out", delay: 0.15 });
      gsap.fromTo($$(".lpoi__title, .lpoi__desc, .lproj__content > *", m), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.35 });
      if (!fromHash) history.replaceState(null, "", "#" + id);
      setTimeout(() => $(".lmodal__close", m).focus({ preventScroll: true }), 600);
    }
    function close(instant) {
      const m = openModal;
      if (!m) return;
      openModal = null;
      pins.forEach((p) => p.classList.remove("is-active"));
      const panel = panelOf(m);
      const done = () => { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); };
      if (instant) { gsap.killTweensOf(panel); done(); }
      else if (mobile()) gsap.to(panel, { yPercent: 100, duration: 0.8, ease: EASE, onComplete: done });
      else gsap.to(panel, { clipPath: "inset(0% 0% 0% 100%)", x: 20, duration: 0.9, ease: EASE, onComplete: done });
      history.replaceState(null, "", location.pathname);
      smoother && smoother.paused(false);
    }
    pins.forEach((pin) => pin.tagName === "A" && pin.addEventListener("click", (e) => { e.preventDefault(); open(pin.dataset.pin); }));
    $$(".lmodal").forEach((m) => {
      $(".lmodal__close", m).addEventListener("click", () => close());
      m.addEventListener("click", (e) => { if (e.target === m) close(); }); // click the map area to dismiss
    });
    addEventListener("keydown", (e) => e.key === "Escape" && close());
    addEventListener("hashchange", () => { const id = location.hash.slice(1); id ? open(id, true) : close(); });
    // deep link: /location.html#kafd opens that panel once the intro has played
    if (location.hash && document.getElementById(location.hash.slice(1))?.classList.contains("lmodal")) {
      const id = location.hash.slice(1);
      history.replaceState(null, "", location.pathname);
      setTimeout(() => open(id), 2600);
    }
  }

  /* ---------------------------------------------------------------------
     PROJECT PAGE (IVORY | Al Yasmin)
     --------------------------------------------------------------------- */
  if (PAGE === "project") {
    const hero = $(".phx");
    const night = $(".phx__img--night"), day = $(".phx__img--day");
    gsap.set([".phx__lead", ".phx__note", ".phx__stat"], { autoAlpha: 0 });
    gsap.set(night, { scale: 1.15 });

    pageIntro = () => {
      const lead = SplitText.create(".phx__lead", { type: "lines", mask: "lines" }).lines;
      gsap.set([".phx__lead", ".phx__note"], { autoAlpha: 1 });
      return gsap.timeline({ defaults: { ease: "expo.out" } })
        .to(night, { scale: 1.04, duration: 2.6, ease: "power3.out" }, 0)
        .from(lead, { yPercent: 110, duration: 1.2, stagger: 0.06 }, 0.5)
        .from(".phx__note", { y: 20, autoAlpha: 0, duration: 1.1 }, 0.7)
        .fromTo(".phx__stat", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1 }, 0.8);
    };

    /* hero (azimute): pinned; the cue fades, then the whole hero switches from dark to light mode —
       night → day render, dark shade → daylight wash, white → ink text — with the same content */
    const setTheme = (light) => document.body.classList.toggle("theme-light", light);
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero, start: "top top", end: () => "+=" + innerHeight * 0.9, pin: true, scrub: 1,
        onUpdate: (st) => setTheme(st.progress > 0.32),
        onLeave: () => setTheme(false),
        onEnterBack: (st) => setTheme(st.progress > 0.32),
        onLeaveBack: () => setTheme(false),
      },
    })
      .to(".phx__cue", { autoAlpha: 0, duration: 0.09 }, 0)
      .to(day, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 0.09)
      .to(".phx__shade:not(.phx__shade--light)", { opacity: 0, duration: 0.5, ease: "power1.inOut" }, 0.09)
      .to(".phx__shade--light", { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 0.09)
      .to(hero, { "--ink": "#141414", duration: 0.4, ease: "power1.inOut" }, 0.16)
      .to([night, day], { scale: 1, duration: 0.7 }, 0.09)
      .to({}, { duration: 0.3 }, 0.7); // hold the light frame before the page moves on

    // About + warranties reveals (split after fonts so the lines are final)
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      const tLines = SplitText.create(".pabout__title", { type: "lines", mask: "lines" }).lines;
      gsap.from(tLines, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".pabout__title", start: "top 85%" } });
      $$(".pabout__text p").forEach((p) => {
        const l = SplitText.create(p, { type: "lines", mask: "lines" }).lines;
        gsap.from(l, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: p, start: "top 88%" } });
      });
      const wChars = SplitText.create(".pwar__title", { type: "chars", mask: "chars" }).chars;
      gsap.from(wChars, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: ".pwar__title", start: "top 85%" } });
      const pTitle = SplitText.create(".ploc__title", { type: "chars", mask: "chars" }).chars;
      gsap.from(pTitle, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.03, scrollTrigger: { trigger: ".ploc__title", start: "top 85%" } });
    });
    gsap.from(".pabout__label", { y: 16, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".pabout", start: "top 80%" } });
    gsap.fromTo(".pwarm__bg img", { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: ".pwarm", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".pwar__line", { scaleY: 0, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".pwar__line", start: "top 85%" } });
    gsap.from(".pwar__text", { y: 24, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".pwar__text", start: "top 88%" } });
    gsap.from(".wcell", {
      y: 40, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: { each: 0.07, grid: [2, 4] },
      scrollTrigger: { trigger: ".pwar__grid", start: "top 82%" },
    });
    $$(".wcell__num").forEach((n) => { // years count up
      const to = +n.dataset.to, o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => (n.textContent = Math.round(o.v)), scrollTrigger: { trigger: n, start: "top 90%" } });
    });

    /* exterior: the stage pins and the photo opens from the card's thumbnail slot to full bleed */
    const ext = $(".pext__stage"), photo = $(".pext__photo"), thumb = $(".pext__thumb");
    const thumbClip = () => {
      const st = ext.getBoundingClientRect(), t = thumb.getBoundingClientRect();
      const top = t.top - st.top, left = t.left - st.left;
      return `inset(${top}px ${st.width - left - t.width}px ${st.height - top - t.height}px ${left}px)`;
    };
    gsap.set(photo, { clipPath: thumbClip() });
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ext, start: "top top", end: () => "+=" + innerHeight * 1.2, pin: true, scrub: 1, invalidateOnRefresh: true },
    })
      .fromTo(photo, { clipPath: thumbClip }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1, ease: "power2.inOut", immediateRender: false }, 0.1)
      .fromTo(photo, { scale: 1.12 }, { scale: 1, duration: 1.1 }, 0)
      .to([".pext__title", ".pext__text"], { autoAlpha: 0, y: -30, duration: 0.3 }, 0.05)
      .to(".pext__card", { borderColor: "rgba(253,253,253,0)", duration: 0.4 }, 0.3);
    gsap.from(".pext__card", { y: 60, autoAlpha: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".pext", start: "top 70%" } });
    gsap.from(".pext__label", { x: -20, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".pext", start: "top 80%" } });

    /* location: the line draws, then the map pins and its two panels swap */
    gsap.from(".ploc__line", { scaleY: 0, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".ploc__line", start: "top 85%" } });
    const dotsLine = $(".ploc__dots i"), dots = $$(".ploc__dots span");
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".ploc__stage", start: "top top", end: () => "+=" + innerHeight * 1.2, pin: true, scrub: 1,
        onUpdate: (st) => {
          dotsLine.style.setProperty("--p", st.progress.toFixed(3));
          dots.forEach((d, k) => d.classList.toggle("is-on", (st.progress >= 0.5 ? 1 : 0) === k));
        },
      },
    })
      .fromTo(".ploc__map img", { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
      .fromTo(".ploc__panel", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power2.out" }, 0)
      .to(".ploc__slide--a", { autoAlpha: 0, y: -24, duration: 0.15, ease: "power2.in" }, 0.45)
      .fromTo(".ploc__slide--b", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.55);
  }

  /* ---------------------------------------------------------------------
     Footer
     --------------------------------------------------------------------- */
  gsap.from([".footer__title", ".footer__links li"], {
    y: 40, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.05,
    scrollTrigger: { trigger: ".footer", start: "top 75%" },
  });
  gsap.from(".form", {
    y: 80, autoAlpha: 0, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: ".footer", start: "top 75%" },
  });
  gsap.from(".form > *", {
    y: 24, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.2,
    scrollTrigger: { trigger: ".footer", start: "top 75%" },
  });
  gsap.fromTo(".footer__mark-inner", { yPercent: 100, scaleY: 1.3 }, {
    yPercent: 0, scaleY: 1, ease: "power2.out",
    scrollTrigger: { trigger: ".footer__mark", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
  });

  // wordmark hover spotlight — the cursor lights the letters with fire
  (() => {
    const mark = $(".footer__mark");
    const inner = $(".footer__mark-inner", mark);
    const reveal = $(".footer__mark-reveal", mark);
    if (!mark || !reveal) return;
    const spot = { x: -9999, y: -9999, r: 0 };
    const xTo = gsap.quickTo(spot, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(spot, "y", { duration: 0.45, ease: "power3.out" });
    const radius = () => gsap.utils.clamp(140, 320, innerWidth * 0.16);
    const paint = () => {
      reveal.style.setProperty("--x", spot.x + "px");
      reveal.style.setProperty("--y", spot.y + "px");
      reveal.style.setProperty("--r", spot.r + "px");
    };
    const local = (e) => { // pointer → the wordmark's own (untransformed) coordinates
      const b = inner.getBoundingClientRect();
      return [(e.clientX - b.left) * (inner.offsetWidth / b.width), (e.clientY - b.top) * (inner.offsetHeight / b.height)];
    };
    let ticking = false;
    const start = () => { if (!ticking) { ticking = true; gsap.ticker.add(paint); } };
    const stop = () => { ticking = false; gsap.ticker.remove(paint); paint(); };
    const show = (e) => {
      const [x, y] = local(e);
      if (spot.r < 1) { spot.x = x; spot.y = y; } // appear under the cursor, no slide-in
      xTo(x); yTo(y); start();
      gsap.to(spot, { r: radius(), duration: 0.6, ease: "expo.out", overwrite: "auto" });
    };
    const hide = () => gsap.to(spot, { r: 0, duration: 0.7, ease: "power3.inOut", overwrite: "auto", onComplete: stop });
    mark.addEventListener("pointerenter", show);
    mark.addEventListener("pointermove", (e) => { const [x, y] = local(e); xTo(x); yTo(y); if (spot.r < radius() * 0.5) show(e); });
    mark.addEventListener("pointerleave", hide);
    mark.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && setTimeout(hide, 600));
  })();

  // form
  const form = $(".form");
  const note = $(".form__note");
  const noteDefault = note.textContent;
  let submitter = null;
  $$("button[type=submit]", form).forEach((b) => b.addEventListener("click", () => (submitter = b)));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$(".field", form).forEach((f) => {
      const input = $("input", f);
      const valid = input.value.trim() && input.checkValidity();
      f.classList.toggle("is-invalid", !valid);
      if (!valid) { ok = false; gsap.fromTo(f, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" }); }
    });
    if (!ok) { note.textContent = "Please enter your name and a valid email."; note.classList.remove("is-ok"); return; }
    const kind = submitter && submitter.value === "appointment" ? "appointment request" : "call-back request";
    note.textContent = `Thank you — your ${kind} has been received.`;
    note.classList.add("is-ok");
    form.reset();
    setTimeout(() => { note.textContent = noteDefault; note.classList.remove("is-ok"); }, 5000);
  });
  $$(".field input", form).forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.remove("is-invalid")));

  // outline buttons: fill grows from pointer position
  $$(".btn-outline").forEach((b) =>
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      b.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    })
  );

  /* ---------------------------------------------------------------------
     Magnetic + cursor (fine pointers only)
     --------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.5);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    const cursor = $(".cursor");
    const dot = $(".cursor__dot");
    const ringEl = $(".cursor__ring");
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ringEl, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ringEl, "y", { duration: 0.5, ease: "power3.out" });
    gsap.set([dot, ringEl], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    addEventListener("pointermove", (e) => {
      gsap.to([dot, ringEl], { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    document.addEventListener("pointerleave", () => gsap.to([dot, ringEl], { autoAlpha: 0, duration: 0.3 }));
    document.addEventListener("pointerover", (e) => {
      const t = e.target;
      cursor.classList.toggle("is-drag", !!t.closest("[data-cursor]"));
      cursor.classList.toggle("is-hover", !!t.closest("a, button, input, .pillars__list li, .map__list li"));
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
