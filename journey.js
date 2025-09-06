fetch("journey.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("journeyTimeline");
    container.innerHTML = "";
    data.forEach(step => {
      const div = document.createElement("div");
      div.className = "milestone";

      let resultHTML = "";
      if (step.courses) {
        const rows = step.courses.map(c => `
          <tr>
            <td>${c.sl}</td>
            <td>${c.code}</td>
            <td class="course-title">${c.title}</td>
            <td>${c.credit}</td>
            <td>${c.grade}</td>
            <td>${c.point}</td>
          </tr>
        `).join("");

        resultHTML = `
          <div class="result-wrapper">
            <button class="toggle-result" aria-expanded="false">View Result</button>
            <div class="result-table hidden" aria-hidden="true">
              <table class="course-table neat">
                <thead>
                  <tr>
                    <th>SL</th><th>Code</th><th>Course Title</th>
                    <th>Credit</th><th>Grade</th><th>Point</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="3"></td>
                    <td><strong>Total Credit</strong><br>${step.total_credit}</td>
                    <td colspan="2"><strong>SGPA</strong><br>${step.sgpa}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;
      }

      div.innerHTML = `
        <div class="milestone-icon"><i class="fa-solid fa-${step.icon}"></i></div>
        <div class="milestone-content">
          <h3>${step.milestone}</h3>
          <span class="milestone-date">${step.date}</span>
          <p>${step.note}</p>
          ${resultHTML}
        </div>
      `;
      container.appendChild(div);
    });

    // Toggle expand/collapse
    document.querySelectorAll(".toggle-result").forEach(btn => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const isHidden = panel.classList.toggle("hidden");
        btn.textContent = isHidden ? "View Result" : "Hide Result";
        btn.setAttribute("aria-expanded", String(!isHidden));
        panel.setAttribute("aria-hidden", String(isHidden));
      });
    });
  });