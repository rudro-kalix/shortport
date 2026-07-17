const SELECTED_PROJECTS = [
  {
    title: "Digiplus",
    eyebrow: "Digital marketplace",
    description: "A polished subscription marketplace focused on clear product discovery and instant digital delivery.",
    tech: ["TypeScript", "Product UI", "Commerce"],
    live: "https://digiplus-smoky.vercel.app",
    repo: "https://github.com/rudro-kalix/Digiplus",
    tone: "violet"
  },
  {
    title: "Payment Gateway",
    eyebrow: "Workflow automation",
    description: "A verification workflow designed to reduce manual checks and help customer messages move faster.",
    tech: ["TypeScript", "Automation", "APIs"],
    repo: "https://github.com/rudro-kalix/payment-gateway",
    tone: "acid"
  },
  {
    title: "Complaint Management",
    eyebrow: "University system",
    description: "A structured complaint management system developed with Team ResolveX for a complex engineering project.",
    tech: ["C", "Systems", "Team project"],
    repo: "https://github.com/rudro-kalix/complaint-management-system",
    tone: "coral"
  },
  {
    title: "SGPA Calculator",
    eyebrow: "Student utility",
    description: "A focused academic calculator that turns semester results into an immediate, understandable SGPA.",
    tech: ["JavaScript", "UX", "Education"],
    live: "https://sgpa-calculator-lemon.vercel.app",
    repo: "https://github.com/rudro-kalix/sgpa-calculator",
    tone: "sky"
  }
];

const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function renderProjects(projects) {
  const grid = document.querySelector("#projectGrid");
  if (!grid) return;

  grid.innerHTML = projects.map((project, index) => {
    const destination = project.live || project.repo;
    const primaryLabel = project.live ? "View live project" : "View repository";
    const secondaryLink = project.live && project.repo
      ? `<a class="project-repo" href="${escapeHTML(project.repo)}" target="_blank" rel="noreferrer">Code ↗</a>`
      : "";
    const tags = (project.tech || []).map((tag) => `<li>${escapeHTML(tag)}</li>`).join("");

    return `
      <article class="project-card project-${escapeHTML(project.tone || "violet")} reveal">
        <div class="project-topline">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span>${escapeHTML(project.eyebrow)}</span>
        </div>
        <div class="project-graphic" aria-hidden="true"><span>${escapeHTML(project.title.charAt(0))}</span></div>
        <div class="project-content">
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.description)}</p>
          <ul class="project-tags">${tags}</ul>
        </div>
        <div class="project-links">
          <a class="project-primary" href="${escapeHTML(destination)}" target="_blank" rel="noreferrer">${primaryLabel} <span aria-hidden="true">↗</span></a>
          ${secondaryLink}
        </div>
      </article>`;
  }).join("");

  observeReveals(grid);
}

async function loadProjects() {
  try {
    const response = await fetch("projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load selected projects");
    const projects = await response.json();
    renderProjects(Array.isArray(projects) && projects.length ? projects : SELECTED_PROJECTS);
  } catch {
    renderProjects(SELECTED_PROJECTS);
  }
}

function initTheme() {
  const button = document.querySelector("#themeButton");
  const stored = localStorage.getItem("rudro-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const initial = stored || preferred;

  document.documentElement.dataset.theme = initial;
  if (!button) return;
  button.setAttribute("aria-label", initial === "dark" ? "Switch to light theme" : "Switch to dark theme");

  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("rudro-theme", next);
    button.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
}

function initMenu() {
  const button = document.querySelector("#menuButton");
  const menu = document.querySelector("#mobileNav");
  if (!button || !menu) return;

  const close = () => {
    button.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  window.addEventListener("resize", () => { if (window.innerWidth > 760) close(); });
}

let revealObserver;
function observeReveals(scope = document) {
  const elements = scope.querySelectorAll(".reveal:not(.is-visible)");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px" });
  }
  elements.forEach((element) => revealObserver.observe(element));
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#year").textContent = new Date().getFullYear();
  initTheme();
  initMenu();
  initHeader();
  observeReveals();
  loadProjects();
});
