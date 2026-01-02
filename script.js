const LINKS = {
  fullPortfolio: "https://www.portfolio.ovairal.xyz/",
  socials: {
    github: "https://github.com/rudro-kalix",
    linkedin: "https://www.portfolio.ovairal.xyz/404.html",
    twitter: "https://www.portfolio.ovairal.xyz/404.html",
    facebook: "https://www.facebook.com/nazmunxn",
    whatsapp: "https://wa.me/+8801607656890",
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
  const fb = $("#facebookLink"); if (fb) fb.href = LINKS.socials.facebook;
  const wa = $("#whatsappLink"); if (wa) wa.href = LINKS.socials.whatsapp;
  const el = $("#emailLink"); if (el) el.href = LINKS.socials.email;
  const cta = $("#emailCta"); if (cta) cta.href = LINKS.socials.email;
}

function yearStamp() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

function renderProjects(list = PROJECTS) {
  const grid = $("#projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!list || !list.length) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<h3>No projects to show</h3><p style="color:var(--muted)">Please check back soon.</p>`;
    grid.appendChild(empty);
    return;
  }
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const live = (p.live || '#');
    const desc = p.description ? `<p class="project-desc">${escapeHtml(p.description)}</p>` : '';
    const language = p.language ? `<span class="badge badge--lang">${escapeHtml(p.language)}</span>` : '';
    const stars = typeof p.stars === 'number' && p.stars > 0 ? `<span class="badge" title="Stars">★ ${p.stars}</span>` : '';
    const updated = p.updated_at ? `<span class="badge badge--muted" title="Last updated">${timeAgo(p.updated_at)}</span>` : '';
    const meta = (language || stars || updated) ? `<div class="project-meta">${language}${stars}${updated}</div>` : '';
    card.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      ${desc}
      ${meta}
      <a class="btn" href="${live}" target="_blank" rel="noopener">Open</a>
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

// Smooth scrolling for same-page hash links (ignore external or "#")
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // let normal behavior
    if (!href.startsWith('#')) return; // not a same-page hash anymore
    const target = document.querySelector(href);
    if (!target) return; // no target, let default
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  setLinks();
  yearStamp();
  renderProjects();
  attachSearch();
  // Force dark theme and remove toggle
  document.documentElement.classList.remove('theme-light');
  attachContactForm();
  // Load GitHub repositories and refresh the projects grid when ready
  loadGitHubRepos('rudro-kalix');
});

// -------- Theme toggle --------
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.classList.add('theme-light');
    setToggleIcon('light');
  } else {
    document.documentElement.classList.remove('theme-light');
    setToggleIcon('dark');
  }
}

function wireThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    setToggleIcon(isLight ? 'light' : 'dark');
  });
}

function setToggleIcon(mode) {
  const icon = document.querySelector('#themeToggle .theme-icon');
  if (!icon) return;
  icon.textContent = mode === 'light' ? '☀️' : '🌙';
}

// Contact form: fallback to mailto if no backend
function attachContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName')?.value?.trim() || '';
    const email = document.getElementById('cfEmail')?.value?.trim() || '';
    const message = document.getElementById('cfMessage')?.value?.trim() || '';
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:252-35-584@diu.edu.bd?subject=${subject}&body=${body}`;
  });
}

// -------- Load GitHub projects --------
async function loadGitHubRepos(username = 'rudro-kalix') {
  try {
    const resp = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`);
    if (!resp.ok) throw new Error('GitHub API error');
    const repos = await resp.json();
    const mapped = (repos || [])
      .filter(r => !r.fork)
      .map(r => ({
        title: r.name,
        live: r.homepage && r.homepage.trim() ? r.homepage : r.html_url,
        description: r.description || '',
        language: r.language || '',
        stars: r.stargazers_count || 0,
        updated_at: r.pushed_at || r.updated_at || r.created_at
      }));
    if (mapped.length) {
      PROJECTS = mapped;
      renderProjects(PROJECTS);
    } else {
      // keep defaults
      renderProjects(PROJECTS);
    }
  } catch (e) {
    // Leave default projects on failure
    console.warn('Failed to load GitHub repos:', e);
    renderProjects(PROJECTS);
  }
}

// Utilities
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function timeAgo(iso) {
  try {
    const then = new Date(iso);
    const now = new Date();
    const s = Math.floor((now - then) / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    const mo = Math.floor(d / 30);
    const y = Math.floor(d / 365);
    if (y > 0) return `${y}y ago`;
    if (mo > 0) return `${mo}mo ago`;
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return `just now`;
  } catch { return ''; }
}
