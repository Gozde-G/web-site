// Portfolio interactions — golden cinematic edition + TR/EN switcher
const LANG_KEY = "gozde_portfolio_lang";

function getSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY) || sessionStorage.getItem(LANG_KEY);
    return saved === "en" ? "en" : "tr";
  } catch {
    return "tr";
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
    sessionStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore storage restrictions
  }
}

let currentLang = getSavedLang();

function applyLanguage(lang, animate = false) {
  currentLang = lang === "en" ? "en" : "tr";
  saveLang(currentLang);
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-tr][data-en]").forEach((el) => {
    const nextVal = el.getAttribute(`data-${currentLang}`);
    if (nextVal === null) return;
    if (el.tagName === "META") {
      el.setAttribute("content", nextVal);
    } else {
      el.innerHTML = nextVal;
    }
  });

  document.querySelectorAll("[data-tr-placeholder][data-en-placeholder]").forEach((el) => {
    const ph = el.getAttribute(`data-${currentLang}-placeholder`);
    if (ph !== null) el.setAttribute("placeholder", ph);
  });

  document.querySelectorAll("[data-tr-alt][data-en-alt]").forEach((el) => {
    const alt = el.getAttribute(`data-${currentLang}-alt`);
    if (alt !== null) el.setAttribute("alt", alt);
  });

  document.querySelectorAll("[data-tr-aria][data-en-aria]").forEach((el) => {
    const aria = el.getAttribute(`data-${currentLang}-aria`);
    if (aria !== null) el.setAttribute("aria-label", aria);
  });

  document.querySelectorAll("[data-tr-title][data-en-title]").forEach((el) => {
    const title = el.getAttribute(`data-${currentLang}-title`);
    if (title !== null) el.setAttribute("title", title);
  });

  document.querySelectorAll(".lang-switch").forEach((btn) => {
    btn.setAttribute("data-lang", currentLang);
    btn.setAttribute(
      "aria-pressed",
      String(currentLang === "en"),
    );
  });

  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.remove("lang-transitioning");
    void document.body.offsetWidth;
    document.body.classList.add("lang-transitioning");
    setTimeout(() => document.body.classList.remove("lang-transitioning"), 340);
  }
}

applyLanguage(currentLang, false);

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = getComputedStyle(nav).display === "none";
    nav.style.display = open ? "flex" : "none";
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (innerWidth < 620) nav.style.display = "none";
    }),
  );
}

document.querySelectorAll(".lang-switch").forEach((btn) => {
  btn.addEventListener("click", () => {
    const nextLang = currentLang === "tr" ? "en" : "tr";
    btn.classList.remove("pulse");
    void btn.offsetWidth;
    btn.classList.add("pulse");
    setTimeout(() => btn.classList.remove("pulse"), 580);
    applyLanguage(nextLang, true);
  });
});

if (
  !document.querySelector(".intro-flare") &&
  !sessionStorage.getItem("reduced-motion") &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const intro = document.createElement("div");
  intro.className = "intro-flare";
  intro.setAttribute("aria-hidden", "true");
  document.body.append(intro);
  setTimeout(() => intro.remove(), 1050);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

document
  .querySelectorAll("#year")
  .forEach((el) => (el.textContent = new Date().getFullYear()));

function accordion(card) {
  const expanded = !card.classList.contains("expanded");
  card.classList.toggle("expanded", expanded);
  card.setAttribute("aria-expanded", String(expanded));
}

document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("click", () => accordion(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      accordion(card);
    }
  });
});

document.querySelectorAll(".blog-entry").forEach((card) => {
  card.addEventListener("click", () => accordion(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      accordion(card);
    }
  });
});

const galleryCards = [...document.querySelectorAll(".gallery-box")];
function openGalleryCard(card) {
  if (document.querySelector(".gallery-modal")) return;
  const closeLabel = currentLang === "en" ? "Close" : "Kapat";
  const overlay = document.createElement("div");
  overlay.className = "gallery-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML =
    `<button class="gallery-modal-close" aria-label="${closeLabel}">×</button><div class="gallery-modal-content"></div>`;
  overlay.querySelector(".gallery-modal-content").append(card.cloneNode(true));
  document.body.append(overlay);
  requestAnimationFrame(() => overlay.classList.add("shown"));
  const close = () => {
    overlay.classList.remove("shown");
    setTimeout(() => overlay.remove(), 260);
  };
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".gallery-modal-close"))
      close();
  });
  const esc = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  };
  document.addEventListener("keydown", esc);
  overlay.querySelector(".gallery-modal-close").focus();
}

galleryCards.forEach((card) => {
  card.addEventListener("click", () => openGalleryCard(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGalleryCard(card);
    }
  });
});

document.querySelectorAll('a[href$=".html"]').forEach((link) =>
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      link.target === "_blank" ||
      href === location.pathname.split("/").pop()
    )
      return;
    e.preventDefault();
    saveLang(currentLang);
    const curtain = document.createElement("div");
    curtain.className = "page-curtain";
    document.body.append(curtain);
    requestAnimationFrame(() => curtain.classList.add("leave"));
    setTimeout(() => (location.href = href), 440);
  }),
);

if (matchMedia("(pointer:fine)").matches) {
  const light = document.createElement("div");
  light.className = "gold-pointer";
  document.body.append(light);
  let lastSpark = 0;
  document.addEventListener("mousemove", (e) => {
    light.style.left = e.clientX + "px";
    light.style.top = e.clientY + "px";
    const now = Date.now();
    if (now - lastSpark > 130 && Math.random() > 0.68) {
      lastSpark = now;
      const s = document.createElement("i");
      s.className = "gold-speck";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.setProperty("--dx", Math.random() * 50 - 25 + "px");
      document.body.append(s);
      setTimeout(() => s.remove(), 1200);
    }
  });
}

const form = document.querySelector("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const to = "gozdegunduz66@gmail.com";
    const defaultSubject =
      currentLang === "en"
        ? "Contact via Portfolio"
        : "Portfolyo üzerinden iletişim";
    const subject = encodeURIComponent(data.get("subject") || defaultSubject);
    const bodyText =
      currentLang === "en"
        ? `Name: ${data.get("name")}
Email: ${data.get("email")}

${data.get("message")}`
        : `İsim: ${data.get("name")}
E-posta: ${data.get("email")}

${data.get("message")}`;
    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}
