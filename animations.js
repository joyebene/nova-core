/**
 * NovaCore — Cinematic Scroll Animations
 * GSAP + ScrollTrigger enhanced experience
 * Drop-in: add <script src="animations.js"></script> before </body> in index.html
 * (after the existing script.js tag)
 */

(function () {
  "use strict";

  // ─── Respect reduced motion ───────────────────────────────────────────────
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  // ─── Wait for GSAP ────────────────────────────────────────────────────────
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("NovaCore Animations: GSAP or ScrollTrigger not found.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ─── Utility helpers ──────────────────────────────────────────────────────
  function splitWords(el) {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="word-wrap" style="display:inline-block;overflow:hidden;"><span class="word" style="display:inline-block;">${w}</span></span>`
      )
      .join(" ");
    return el.querySelectorAll(".word");
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  1. SMOOTH SCROLL — native CSS only (safe, no body lock)
  // ─────────────────────────────────────────────────────────────────────────
  // Custom virtual-scroller approaches break native scrolling in many browsers.
  // CSS scroll-behavior handles the buttery feel without any JavaScript hacks.
  document.documentElement.style.scrollBehavior = "smooth";

  const isMobile = window.innerWidth < 768;

  // ─────────────────────────────────────────────────────────────────────────
  //  2. FLOATING PARTICLES (Hero background)
  // ─────────────────────────────────────────────────────────────────────────
  const heroSection = document.getElementById("home");
  if (heroSection) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.35;";
    heroSection.style.position = "relative";
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const ctx = canvas.getContext("2d");
    const particles = [];
    const COUNT = 28;

    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,14,16,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  3. HERO SECTION — word-by-word headline reveal
  // ─────────────────────────────────────────────────────────────────────────
  const heroH1 = document.querySelector("#home h1");
  if (heroH1) {
    // Preserve the italic span by operating on text nodes carefully
    const heroWords = splitWords(heroH1);
    gsap.set(heroWords, { y: "100%", opacity: 0 });
    gsap.to(heroWords, {
      y: "0%",
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.2,
    });
  }

  // Hero paragraph fade in
  const heroPara = document.querySelector("#home p");
  if (heroPara) {
    gsap.fromTo(
      heroPara,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.85 }
    );
  }

  // Hero CTAs stagger
  const heroCTAs = document.querySelectorAll("#home .flex.flex-col a");
  if (heroCTAs.length) {
    gsap.fromTo(
      heroCTAs,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: 1.1,
      }
    );
  }

  // Hero badge
  const heroBadge = document.querySelector("#home .inline-flex.items-center.gap-2.bg-\\[\\#0E0E10\\]");
  if (heroBadge) {
    gsap.fromTo(
      heroBadge,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.05 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  4. SANDBOX CARD — scale in + mouse parallax
  // ─────────────────────────────────────────────────────────────────────────
  const sandboxCard = document.getElementById("sandbox-card");
  if (sandboxCard) {
    gsap.fromTo(
      sandboxCard,
      { scale: 0.88, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    // 3D tilt on mouse move
    heroSection &&
      heroSection.addEventListener("mousemove", (e) => {
        const rect = sandboxCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(sandboxCard, {
          rotationY: dx * 8,
          rotationX: -dy * 6,
          transformPerspective: 900,
          duration: 0.6,
          ease: "power2.out",
        });
      });

    heroSection &&
      heroSection.addEventListener("mouseleave", () => {
        gsap.to(sandboxCard, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  5. PERFORMANCE GRAPH SVG — draw path on load
  // ─────────────────────────────────────────────────────────────────────────
  const perfPath = document.querySelector("#sandbox-card svg path");
  if (perfPath) {
    const length = perfPath.getTotalLength
      ? perfPath.getTotalLength()
      : 200;
    gsap.set(perfPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.to(perfPath, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      delay: 1.2,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  6. HERO SCROLL PARALLAX — blueprint grid + text depth shift
  // ─────────────────────────────────────────────────────────────────────────
  if (heroSection) {
    // Blueprint grid moves at a different speed
    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(heroSection, {
          backgroundPositionY: `${p * 60}px`,
        });
      },
    });

    // Hero text mild parallax shift
    const heroLeft = document.querySelector("#home .lg\\:col-span-7");
    if (heroLeft) {
      gsap.to(heroLeft, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  7. ABOUT SECTION — bento cards stagger + tilt on scroll
  // ─────────────────────────────────────────────────────────────────────────
  const aboutSection = document.getElementById("about");
  const bentoCards = document.querySelectorAll("#about .bento-card");

  if (aboutSection && bentoCards.length) {
    // Override existing .reveal styles for bento cards
    gsap.set(bentoCards, { opacity: 0, y: 40 });

    bentoCards.forEach((card, i) => {
      const direction = i % 2 === 0 ? 50 : -50;
      gsap.fromTo(
        card,
        { opacity: 0, x: direction, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        }
      );

      // Subtle tilt while scrolling past
      gsap.to(card, {
        rotationX: 3,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    });
  }

  // About headline word reveal
  const aboutH2 = document.querySelector("#about h2");
  if (aboutH2) {
    const words = splitWords(aboutH2);
    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutH2,
          start: "top 88%",
        },
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  8. PROJECTS SECTION — pin briefly, cards appear one by one, magnetic hover
  // ─────────────────────────────────────────────────────────────────────────
  const projectsSection = document.getElementById("projects");
  const projectCards = document.querySelectorAll("#projects .project-card");

  if (projectsSection && projectCards.length) {
    // Stagger card reveals
    gsap.set(projectCards, { opacity: 0, y: 60, scale: 0.96 });
    projectCards.forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        delay: i * 0.1,
      });

      // Lift + rotate on scroll
      gsap.to(card, {
        y: -12,
        rotationZ: i % 2 === 0 ? 0.4 : -0.4,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      // Magnetic hover effect
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
        gsap.to(card, {
          x,
          y,
          rotationY: x * 0.6,
          rotationX: -y * 0.4,
          transformPerspective: 800,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  }

  // Projects headline
  const projectsH2 = document.querySelector("#projects h2");
  if (projectsH2) {
    const words = splitWords(projectsH2);
    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: projectsH2,
          start: "top 88%",
        },
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  9. FAQ SECTION — questions cascade upward, active glow, velocity-reactive bg
  // ─────────────────────────────────────────────────────────────────────────
  const faqSection = document.getElementById("faq");
  const faqCards = document.querySelectorAll("#faq .faq-card");

  if (faqSection && faqCards.length) {
    faqCards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
          delay: i * 0.12,
        }
      );
    });

    // FAQ background reacts to scroll velocity
    let lastScrollY = 0;
    ScrollTrigger.create({
      trigger: faqSection,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()) / 2000;
        const brightness = Math.min(1 + velocity * 0.06, 1.06);
        gsap.to(faqSection, {
          filter: `brightness(${brightness})`,
          duration: 0.3,
          ease: "power1.out",
        });
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  10. CONTACT SECTION — sequential form reveal, draw lines, pulse CTA
  // ─────────────────────────────────────────────────────────────────────────
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    // Left column elements reveal
    const contactLeft = document.querySelector("#contact .lg\\:col-span-5");
    if (contactLeft) {
      const children = [...contactLeft.children];
      gsap.fromTo(
        children,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactLeft,
            start: "top 85%",
          },
        }
      );
    }

    // Form inputs float up sequentially
    const formEl = document.getElementById("contact-form");
    if (formEl) {
      const formChildren = [...formEl.children];
      gsap.fromTo(
        formChildren,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formEl,
            start: "top 85%",
          },
        }
      );
    }

    // Pulse wave on submit button
    const submitBtn = document.querySelector("#contact-form button[type='submit']");
    if (submitBtn) {
      const pulse = document.createElement("span");
      pulse.style.cssText =
        "position:absolute;inset:0;border-radius:inherit;border:1.5px solid rgba(253,251,247,0.35);pointer-events:none;";
      submitBtn.style.position = "relative";
      submitBtn.appendChild(pulse);

      gsap.fromTo(
        pulse,
        { scale: 1, opacity: 0.6 },
        {
          scale: 1.18,
          opacity: 0,
          duration: 1.6,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 0.8,
        }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  11. CURSOR TRAIL (replaces simple circle — desktop only)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isMobile) {
    const existingCursor = document.getElementById("cursor");
    const trailCount = 7;
    const trails = [];

    for (let i = 0; i < trailCount; i++) {
      const dot = document.createElement("div");
      const scale = 1 - i / trailCount;
      dot.style.cssText = `
        position:fixed;
        width:${8 + i * 2.5}px;
        height:${8 + i * 2.5}px;
        border-radius:50%;
        pointer-events:none;
        z-index:9998;
        transform:translate(-50%,-50%);
        background:rgba(14,14,16,${0.25 - i * 0.03});
        mix-blend-mode:difference;
        will-change:transform;
        transition: none;
      `;
      document.body.appendChild(dot);
      trails.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0,
      mouseY = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (existingCursor) {
        existingCursor.style.display = "none";
      }
    });

    gsap.ticker.add(() => {
      let prevX = mouseX,
        prevY = mouseY;
      trails.forEach((t, i) => {
        const lag = 0.15 + i * 0.04;
        t.x = lerp(t.x, prevX, lag);
        t.y = lerp(t.y, prevY, lag);
        t.el.style.left = t.x + "px";
        t.el.style.top = t.y + "px";
        prevX = t.x;
        prevY = t.y;
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  12. MAGNETIC BUTTONS (nav CTA + primary CTAs)
  // ─────────────────────────────────────────────────────────────────────────
  const magnetBtns = document.querySelectorAll(
    "header a[href='#contact'], #home a[href='#projects'], #home a[href='#about']"
  );
  magnetBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  13. GLOWING ORBS behind project cards
  // ─────────────────────────────────────────────────────────────────────────
  if (projectsSection) {
    const orbColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];
    projectCards.forEach((card, i) => {
      const orb = document.createElement("div");
      orb.style.cssText = `
        position:absolute;
        width:220px;height:220px;
        border-radius:50%;
        background:${orbColors[i % orbColors.length]};
        opacity:0;
        filter:blur(70px);
        pointer-events:none;
        z-index:0;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        transition:opacity 0.5s ease;
      `;
      card.style.position = "relative";
      card.style.overflow = "hidden";
      card.insertBefore(orb, card.firstChild);

      card.addEventListener("mouseenter", () => {
        orb.style.opacity = "0.07";
      });
      card.addEventListener("mouseleave", () => {
        orb.style.opacity = "0";
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  14. SECTION ENTRY TRANSITIONS (cinematic scene-by-scene)
  // ─────────────────────────────────────────────────────────────────────────
  const sections = ["#about", "#projects", "#faq", "#contact"];
  sections.forEach((sel) => {
    const sec = document.querySelector(sel);
    if (!sec) return;
    gsap.fromTo(
      sec,
      { clipPath: "inset(8% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power3.out",
        duration: 1.1,
        scrollTrigger: {
          trigger: sec,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  15. COUNTER ANIMATIONS (hero sandbox card + any future counters)
  // ─────────────────────────────────────────────────────────────────────────
  function animateCounter(el, target, decimals = 0, suffix = "") {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = obj.val.toFixed(decimals) + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  }

  // Avg Load counter in sandbox card
  const loadCounter = document.querySelector(
    "#sandbox-card .font-mono:not(.text-\\[9px\\])"
  );
  if (loadCounter && loadCounter.textContent.includes("0.32")) {
    loadCounter.textContent = "0.00s";
    animateCounter(loadCounter, 0.32, 2, "s");
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  16. 3D TILT on ALL BENTO CARDS (About section)
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll(".bento-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      gsap.to(card, {
        rotationY: x,
        rotationX: -y,
        transformPerspective: 700,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  17. ANIMATED CONNECTION LINE between About and Projects sections
  // ─────────────────────────────────────────────────────────────────────────
  const connectorContainer = document.createElement("div");
  connectorContainer.style.cssText =
    "position:relative;height:0;overflow:visible;pointer-events:none;z-index:5;";
  const aboutSec = document.getElementById("about");
  if (aboutSec && aboutSec.nextElementSibling) {
    aboutSec.insertAdjacentElement("afterend", connectorContainer);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.style.cssText =
      "position:absolute;top:-20px;left:50%;transform:translateX(-50%);width:120px;height:40px;";
    svg.innerHTML = `<path d="M50,0 Q30,20 50,40" fill="none" stroke="rgba(14,14,16,0.15)" stroke-width="1" stroke-dasharray="5 3"/>`;
    connectorContainer.appendChild(svg);
    const connPath = svg.querySelector("path");
    const connLen = 80;
    gsap.set(connPath, { strokeDashoffset: connLen, strokeDasharray: `${connLen} ${connLen}` });
    gsap.to(connPath, {
      strokeDashoffset: 0,
      ease: "power2.inOut",
      duration: 1,
      scrollTrigger: {
        trigger: connectorContainer,
        start: "top 80%",
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  18. SCROLL-BASED header text color adaptation (for dark sections)
  // ─────────────────────────────────────────────────────────────────────────
  const mainHeader = document.getElementById("main-header");
  const darkSections = ["#projects", "#contact"];
  darkSections.forEach((sel) => {
    const sec = document.querySelector(sel);
    if (!sec || !mainHeader) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top top+=70",
      end: "bottom top+=70",
      onEnter: () => {
        mainHeader.style.setProperty("--nav-text", "#FDFBF7");
        if (!mainHeader.classList.contains("bg-\\[\\#FDFBF7\\]\\/90")) {
          mainHeader.style.background = "rgba(14,14,16,0.9)";
          mainHeader.style.backdropFilter = "blur(12px)";
          mainHeader
            .querySelectorAll("nav a, nav a")
            .forEach((a) => (a.style.color = "rgba(253,251,247,0.75)"));
        }
      },
      onLeaveBack: () => {
        mainHeader.style.background = "";
        mainHeader.style.backdropFilter = "";
        mainHeader
          .querySelectorAll("nav a")
          .forEach((a) => (a.style.color = ""));
      },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  19. REFRESH ScrollTrigger after everything is set
  // ─────────────────────────────────────────────────────────────────────────
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    // Force bento-card reveals that were overridden by existing .reveal system
    document.querySelectorAll(".bento-card").forEach((el) => {
      el.classList.add("is-revealed");
    });
  });
})();