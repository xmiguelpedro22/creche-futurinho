(() => {
  "use strict";

  const WHATSAPP_NUMBER = "5521966203740";

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // ── links flutuantes / de contato para o WhatsApp ──
  document.querySelectorAll(".js-wa-link").forEach((el) => {
    el.href = waLink("Olá! Gostaria de saber sobre vagas disponíveis na Creche Escola Futurinho.");
  });

  // ── hover / focus: aplica o "style-hover" / "style-focus" declarado no HTML ──
  function bindStyleOverride(attr, onEvt, offEvt) {
    document.querySelectorAll("[" + attr + "]").forEach((el) => {
      const original = el.style.cssText;
      const override = el.getAttribute(attr);
      el.addEventListener(onEvt, () => { el.style.cssText = original + ";" + override; });
      el.addEventListener(offEvt, () => { el.style.cssText = original; });
    });
  }
  bindStyleOverride("style-hover", "mouseenter", "mouseleave");
  bindStyleOverride("style-focus", "focus", "blur");

  // ── menu mobile ──
  const burger = document.getElementById("fut-burger");
  const mobileMenu = document.getElementById("fut-mobile-menu");
  let menuOpen = false;

  function setMenuOpen(open) {
    menuOpen = open;
    mobileMenu.style.display = open ? "flex" : "none";
    burger.setAttribute("aria-expanded", String(open));
    updateNavBackground();
  }
  burger.addEventListener("click", () => setMenuOpen(!menuOpen));
  document.querySelectorAll(".js-close-menu").forEach((el) => {
    el.addEventListener("click", () => { if (menuOpen) setMenuOpen(false); });
  });

  // ── fundo da nav ao rolar ──
  const nav = document.getElementById("fut-nav");
  function updateNavBackground() {
    const on = window.scrollY > 24 || menuOpen;
    nav.style.background = on ? "rgba(255,249,240,.95)" : "rgba(255,249,240,0)";
    nav.style.boxShadow = on ? "0 8px 24px -16px rgba(35,48,90,.25)" : "none";
    nav.style.backdropFilter = on ? "blur(10px)" : "none";
  }
  window.addEventListener("scroll", updateNavBackground, { passive: true });
  updateNavBackground();

  // ── revelar seções ao rolar ──
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.setAttribute("data-revealed", ""));
  }

  // ── contador animado (+200 famílias) ──
  const counter = document.getElementById("fut-counter");
  if (counter) {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);
      counter.textContent = "+" + Math.round(200 * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── seletor de espaços (Pátio / Berçário / Sala de aula) ──
  document.querySelectorAll("[data-space]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.space;
      document.querySelectorAll("[data-space]").forEach((b) => {
        b.style.borderColor = b.dataset.space === idx ? "#E8622C" : "transparent";
      });
      document.querySelectorAll("[data-space-img]").forEach((img) => {
        img.style.opacity = img.dataset.spaceImg === idx ? "1" : "0";
      });
    });
  });

  // ── seletor de atividades (Ballet / Capoeira) ──
  document.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.act;
      document.querySelectorAll("[data-act]").forEach((b) => {
        const on = b.dataset.act === idx;
        b.style.background = on ? "#FFC53D" : "rgba(255,255,255,.1)";
        b.style.color = on ? "#23305A" : "#fff";
      });
      document.querySelectorAll("[data-act-img]").forEach((img) => {
        img.style.opacity = img.dataset.actImg === idx ? "1" : "0";
      });
      document.querySelectorAll("[data-act-panel]").forEach((p) => {
        p.style.display = p.dataset.actPanel === idx ? "flex" : "none";
      });
    });
  });

  // ── acordeão de FAQ ──
  document.querySelectorAll(".js-faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.parentElement.querySelector("[data-faq-panel]");
      const chev = btn.querySelector("[data-chev]");
      const open = panel.style.maxHeight && panel.style.maxHeight !== "0px";
      document.querySelectorAll("[data-faq-panel]").forEach((p) => { p.style.maxHeight = "0px"; });
      document.querySelectorAll("[data-chev]").forEach((c) => { c.style.transform = "rotate(0deg)"; });
      if (!open) {
        panel.style.maxHeight = panel.scrollHeight + "px";
        chev.style.transform = "rotate(180deg)";
      }
    });
  });

  // ── formulário de matrícula → WhatsApp ──
  const form = document.getElementById("fut-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const g = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
    const mark = (id, bad) => { const el = document.getElementById(id); if (el) el.style.borderColor = bad ? "#D64545" : "#EEE4D2"; };
    const err = document.getElementById("f-error");

    const missing = [];
    if (!g("f-resp")) missing.push("o nome do responsável");
    if (!g("f-idade")) missing.push("a idade da criança");
    const digits = g("f-tel").replace(/\D/g, "");
    const telMissing = !g("f-tel");
    const telInvalid = !telMissing && (digits.length < 10 || digits.length > 13);
    if (telMissing) missing.push("seu telefone");

    mark("f-resp", !g("f-resp"));
    mark("f-idade", !g("f-idade"));
    mark("f-tel", telMissing || telInvalid);

    if (missing.length) {
      err.textContent = "Quase lá! Para continuar, preencha " + missing.join(", ") + ".";
      err.style.display = "block";
      return;
    }
    if (telInvalid) {
      err.textContent = "Confira o telefone — inclua o DDD, ex.: (21) 96666-0000.";
      err.style.display = "block";
      return;
    }
    err.style.display = "none";

    let msg = "Olá! Gostaria de agendar uma visita à Creche Escola Futurinho.";
    msg += "\nResponsável: " + g("f-resp");
    if (g("f-crianca")) msg += "\nCriança: " + g("f-crianca");
    msg += "\nIdade: " + g("f-idade");
    msg += "\nTelefone: " + g("f-tel");
    if (g("f-horario")) msg += "\nMelhor horário para contato: " + g("f-horario");
    if (g("f-msg")) msg += "\nMensagem: " + g("f-msg");
    window.open(waLink(msg), "_blank");
  });
})();
