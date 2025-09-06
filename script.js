const LINKS = {
  fullPortfolio: "https://www.portfolio.ovairal.xyz/",
  socials: {
    github: "https://github.com/rudro-kalix",
    linkedin: "https://www.portfolio.ovairal.xyz/404.html",
    twitter: "https://www.portfolio.ovairal.xyz/404.html",
    email: "mailto:252-35-584@diu.edu.bd"
  }
};


let PROJECTS = [
  { title: "AuraUI — Minimal UI Kit", live: "#" },
  { title: "Tasklight — Focus Timer", live: "#" },
  { title: "DataViz Pro", live: "#" },
  { title: "SecureNet Scanner", live: "#" }
];

const $ = s => document.querySelector(s);

function setLinks() {
  $("#portfolioLink").href = LINKS.fullPortfolio;
  $("#githubLink").href = LINKS.socials.github;
  $("#linkedinLink").href = LINKS.socials.linkedin;
  $("#twitterLink").href = LINKS.socials.twitter;
  $("#emailLink").href = LINKS.socials.email;
  $("#emailCta").href = LINKS.socials.email;
}

function yearStamp() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

function renderProjects(list = PROJECTS) {
  const grid = $("#projectsGrid");
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <a class="btn" href="${p.live}" target="_blank" rel="noopener">Live Project</a>
    `;
    grid.appendChild(card);
  });
}

function attachSearch() {
  const input = $("#searchInput");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const filtered = PROJECTS.filter(p =>
      (p.title || "").toLowerCase().includes(q)
    );
    renderProjects(filtered);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setLinks();
  yearStamp();
  renderProjects();
  attachSearch();
});

// ---------- Performance Auto-Tune (non-breaking) ----------
(() => {
  // Detect modest devices and set a hint for CSS fallbacks
  const lowPerf =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  if (lowPerf) document.documentElement.setAttribute('data-lowperf', '');

  // Only animate sections that are actually in view
  const targets = [
    ...document.querySelectorAll('.about-top .code-particles'),
    ...document.querySelectorAll('#journeyTimeline')
  ];
  targets.forEach(el => el.classList.add('animating')); // ensure no “paused on load” flicker

  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add('animating');
        else e.target.classList.remove('animating');
      }
    },
    { rootMargin: '0px 0px -20% 0px', threshold: 0.1 }
  );
  targets.forEach(el => io.observe(el));
})();


// ---------- Runtime FPS Probe (Journey) ----------
// If scrolling/animating is under ~45 FPS for a short burst, enable lowperf mode.
(() => {
  let frames = 0, start = null;
  function tick(ts){ if(!start) start = ts; frames++; if (ts - start < 800) requestAnimationFrame(tick); else finalize(ts); }
  function finalize(ts){
    const avgMs = (ts - start) / Math.max(frames,1);
    if (avgMs > 22) { // < ~45fps
      document.documentElement.setAttribute('data-lowperf', '');
    }
  }
  requestAnimationFrame(tick);
})();

// Also include Journey heading in intersection-pausing
(() => {
  const addTargets = [
    ...document.querySelectorAll('.journey-title h2'),
    ...document.querySelectorAll('#journey h2')
  ];
  const io = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle('animating', e.isIntersecting)),
    { rootMargin: '0px 0px -20% 0px', threshold: 0.1 }
  );
  addTargets.forEach(el => { el.classList.add('animating'); io.observe(el); });
})();
