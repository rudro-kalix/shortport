fetch("journey.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("journeyTimeline");
    container.innerHTML = "";
    data.forEach((step, idx) => {
      const div = document.createElement("div");
      div.className = "milestone";
      div.setAttribute("data-step", (idx + 1));

      const hasResult = Array.isArray(step.courses) && step.courses.length;

      // Build optional result HTML
      let resultHTML = "";
      if (hasResult) {
        const rows = step.courses.map(c => `
          <tr>
            <td>${c.sl ?? ""}</td>
            <td>${c.code ?? ""}</td>
            <td class="course-title">${c.title ?? ""}</td>
            <td>${(c.credit ?? "").toString()}</td>
            <td>${c.grade ?? ""}</td>
            <td>${(c.point ?? "").toString()}</td>
          </tr>
        `).join("");

        resultHTML = `
          <div class="result-wrapper">
            <button class="toggle-result" aria-expanded="false" aria-controls="panel-${idx}">
              <i class="fa-solid fa-eye"></i> View Result
            </button>
            <div id="panel-${idx}" class="result-table hidden" aria-hidden="true">
              <table class="course-table neat" aria-label="Semester course breakdown">
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
                    <td><strong>Total Credit</strong><br>${(step.total_credit ?? step.totalCredit ?? 0).toFixed ? step.total_credit.toFixed(2) : step.total_credit ?? ""}</td>
                    <td colspan="2"><strong>SGPA</strong><br>${(step.sgpa ?? step.gpa ?? 0).toFixed ? (step.sgpa ?? step.gpa).toFixed(2) : (step.sgpa ?? step.gpa ?? "")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;
      }

      const sgpaVal = step.sgpa ?? step.gpa;
      const sgpaBadge = (sgpaVal !== undefined && sgpaVal !== null)
        ? `<span class="sgpa-badge"><i class="fa-solid fa-graduation-cap"></i> SGPA: ${Number(sgpaVal).toFixed(2)}</span>`
        : "";

      div.innerHTML = `
        <div class="milestone-icon"><i class="fa-solid fa-${step.icon}"></i></div>
        <div class="milestone-content">
          <div class="milestone-top">
            <h3>${step.milestone}</h3>
            ${sgpaBadge}
          </div>
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
        btn.innerHTML = isHidden
          ? '<i class="fa-solid fa-eye"></i> View Result'
          : '<i class="fa-solid fa-eye-slash"></i> Hide Result';
        btn.setAttribute("aria-expanded", String(!isHidden));
        panel.setAttribute("aria-hidden", String(isHidden));
      });
    });
  });
