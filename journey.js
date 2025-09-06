fetch("journey.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("journeyTimeline");
    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "timeline-item";

      const tableRows = item.courses.map(c => `
        <tr>
          <td>${c.sl}</td>
          <td>${c.code}</td>
          <td>${c.title}</td>
          <td>${c.credit.toFixed ? c.credit.toFixed(2) : c.credit}</td>
          <td>${c.grade}</td>
          <td>${c.point.toFixed ? c.point.toFixed(2) : c.point}</td>
        </tr>
      `).join("");

      div.innerHTML = `
        <h3>${item.semester}</h3>
        <table class="course-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credit</th>
              <th>Grade</th>
              <th>Grade Point</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"></td>
              <td><strong>Total Credit</strong><br>${(item.total_credit ?? 0).toFixed(2)}</td>
              <td><strong>SGPA</strong></td>
              <td>${(item.sgpa ?? 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      `;

      container.appendChild(div);
    });
  });
