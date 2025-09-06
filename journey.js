fetch("journey.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("journeyTimeline");
    container.innerHTML = "";
    data.forEach(step => {
      const div = document.createElement("div");
      div.className = "milestone";
      div.innerHTML = `
        <div class="milestone-icon">${step.icon}</div>
        <div class="milestone-content">
          <h3>${step.milestone}</h3>
          <span class="milestone-date">${step.date}</span>
          <p>${step.note}</p>
        </div>
      `;
      container.appendChild(div);
    });
  });
