fetch("journey.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("journeyTimeline");
    container.innerHTML = "";
    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "timeline-item journey-card";

      const sgpa = (item.sgpa ?? item.gpa ?? 0);
      const totalCredit = (item.total_credit ?? item.totalCredit ?? 0);

      const tableRows = (item.courses || []).map(c => `
        <tr>
          <td>${c.sl ?? ""}</td>
          <td>${c.code ?? ""}</td>
          <td class="course-title">${c.title ?? ""}</td>
          <td>${(c.credit ?? "").toString()}</td>
          <td>${c.grade ?? ""}</td>
          <td>${(c.point ?? "").toString()}</td>
        </tr>
      `).join("");

      div.innerHTML = `
        <div class="journey-header">
          <h3>${item.semester}</h3>
          <span class="sgpa-badge">SGPA: ${Number(sgpa).toFixed(2)}</span>
        </div>
        <table class="course-table neat" aria-label="Semester course breakdown">
          <thead>
            <tr>
              <th>SL</th>
              <th>Code</th>
              <th>Course Title</th>
              <th>Credit</th>
              <th>Grade</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3"></td>
              <td><strong>Total Credit</strong><br>${Number(totalCredit).toFixed(2)}</td>
              <td colspan="2"><strong>SGPA</strong><br>${Number(sgpa).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      `;

      container.appendChild(div);
    });
  });
