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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Hide scroll indicator when scrolling (only on journey page)
let scrollTimeout;
window.addEventListener('scroll', () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator && document.getElementById('journey')) {
    scrollIndicator.style.opacity = '0';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollIndicator.style.opacity = '0.7';
    }, 1000);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  setLinks();
  yearStamp();
  renderProjects();
  attachSearch();
});
