const journeyEscape = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function courseTable(step, index) {
  if (!Array.isArray(step.courses) || !step.courses.length) return "";

  const rows = step.courses.map((course) => `
    <tr>
      <td>${journeyEscape(course.code)}</td>
      <td>${journeyEscape(course.title)}</td>
      <td>${journeyEscape(course.credit)}</td>
      <td>${journeyEscape(course.grade)}</td>
      <td>${journeyEscape(course.point)}</td>
    </tr>`).join("");

  return `
    <button class="result-toggle" type="button" aria-expanded="false" aria-controls="result-${index}">View semester results +</button>
    <div class="result-panel" id="result-${index}" hidden>
      <table class="result-table">
        <thead><tr><th>Code</th><th>Course</th><th>Credit</th><th>Grade</th><th>Point</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="result-summary"><span>${journeyEscape(step.total_credit)} credits</span><span>SGPA ${Number(step.sgpa).toFixed(2)}</span></div>
    </div>`;
}

function renderJourney(steps) {
  const timeline = document.querySelector("#journeyTimeline");
  if (!timeline) return;

  timeline.innerHTML = steps.map((step, index) => `
    <article class="timeline-item reveal">
      <div class="timeline-meta"><span>${journeyEscape(step.label || `Chapter ${index + 1}`)}</span><time>${journeyEscape(step.date)}</time></div>
      <h3>${journeyEscape(step.milestone)}</h3>
      <p>${journeyEscape(step.note)}</p>
      ${courseTable(step, index)}
    </article>`).join("");

  timeline.querySelectorAll(".result-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.querySelector(`#${button.getAttribute("aria-controls")}`);
      const opening = panel.hidden;
      panel.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      button.textContent = opening ? "Hide semester results −" : "View semester results +";
    });
  });

  if (typeof observeReveals === "function") observeReveals(timeline);
}

async function loadJourney() {
  const timeline = document.querySelector("#journeyTimeline");
  try {
    const response = await fetch("journey.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load journey");
    const steps = await response.json();
    renderJourney(steps);
  } catch {
    if (timeline) timeline.innerHTML = "<article class='timeline-item'><p>The journey is being updated. Please check back soon.</p></article>";
  }
}

document.addEventListener("DOMContentLoaded", loadJourney);
