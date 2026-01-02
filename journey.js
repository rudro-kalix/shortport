// Enhanced journey timeline with scroll animations + smoother scroll handling
(async function initJourneyPage() {
  try {
    const data = await fetch("journey.json").then(res => res.json());

    // Apply persisted theme and wire toggle (journey page may load standalone)
    initTheme();
    wireThemeToggle();

    const container = document.getElementById("journeyTimeline");
    if (!container) return;
    container.innerHTML = "";

    const frag = document.createDocumentFragment();

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
              <i class="fa-solid fa-chart-line"></i> View Detailed Results
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
        ? `<span class="sgpa-badge"><i class="fa-solid fa-trophy"></i> SGPA: ${Number(sgpaVal).toFixed(2)}</span>`
        : "";

      // Check if this is the ongoing semester milestone
      const isOngoing = step.milestone.toLowerCase().includes('ongoing');
      
      div.innerHTML = `
        <div class="milestone-icon"><i class="fa-solid fa-${step.icon}"></i></div>
        <div class="milestone-content">
          <div class="milestone-top">
            <h3>${isOngoing ? step.milestone.replace('Ongoing', '<span class="ongoing-text">Ongoing</span>') : step.milestone}</h3>
            ${sgpaBadge}
          </div>
          <span class="milestone-date">${step.date}</span>
          <p>${step.note}</p>
          ${resultHTML}
        </div>
      `;
      frag.appendChild(div);
    });

    container.appendChild(frag);

    const { updateProgress, recalcScrollable } = addProgressIndicator();
    const refreshProgress = () => {
      recalcScrollable();
      updateProgress();
    };

    // Enhanced toggle functionality with smoother updates
    setupResultToggles(refreshProgress);

    // Scroll-triggered animations
    wireJourneyObservers();

    // Single, throttled scroll lane for progress + indicator
    const indicatorController = setupScrollIndicator();
    setupScrollPipeline(() => {
      updateProgress();
      indicatorController.onScroll();
    }, () => {
      recalcScrollable();
      updateProgress();
    });
  } catch (err) {
    console.error("Failed to load journey data", err);
  }
})();

function setupResultToggles(onHeightChange) {
  document.querySelectorAll(".toggle-result").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const isHidden = panel.classList.toggle("hidden");

      if (!isHidden) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-10px)';
        panel.style.transition = 'all 0.3s ease';

        requestAnimationFrame(() => {
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        });
      }

      btn.innerHTML = isHidden
        ? '<i class="fa-solid fa-chart-line"></i> View Detailed Results'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Results';
      btn.setAttribute("aria-expanded", String(!isHidden));
      panel.setAttribute("aria-hidden", String(isHidden));

      if (typeof onHeightChange === "function") {
        requestAnimationFrame(onHeightChange);
      }
    });
  });
}

function wireJourneyObservers() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('animating');
      } else {
        entry.target.style.animationPlayState = 'paused';
        entry.target.classList.remove('animating');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.milestone').forEach(milestone => {
    observer.observe(milestone);
  });
}

// Add a progress indicator showing journey completion based on 12 semesters
function addProgressIndicator() {
  const timeline = document.getElementById("journeyTimeline");
  const totalSemesters = 12; // Total semesters in BSc Software Engineering
  const completedSemesters = 1; // Currently completed 1 semester
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'journey-progress';
  progressBar.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    <div class="progress-text">
      <span class="progress-label">Academic Progress:</span>
      <span class="progress-percentage">${Math.round((completedSemesters / totalSemesters) * 100)}%</span>
      <span class="progress-detail">(${completedSemesters}/${totalSemesters} semesters completed)</span>
    </div>
  `;
  
  timeline.parentNode.insertBefore(progressBar, timeline);

  const progressFill = progressBar.querySelector('.progress-fill');
  const progressPercentage = progressBar.querySelector('.progress-percentage');
  const progressDetail = progressBar.querySelector('.progress-detail');

  let scrollableHeight = 1;

  const recalcScrollable = () => {
    scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  };
  
  // Update progress on scroll (visual effect)
  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollPercent = (scrollTop / scrollableHeight);
    const clamped = Math.min(scrollPercent, 1);
    
    // Visual progress based on scroll (GPU-friendly transform)
    progressFill.style.transform = `scaleX(${clamped})`;
    
    // Academic progress (static based on completed semesters)
    const academicProgress = Math.round((completedSemesters / totalSemesters) * 100);
    progressPercentage.textContent = `${academicProgress}%`;
    progressDetail.textContent = `(${completedSemesters}/${totalSemesters} semesters completed)`;
  };

  recalcScrollable();
  updateProgress();

  return { updateProgress, recalcScrollable };
}

function setupScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  let scrollTimeout;

  const setOpacity = (value) => {
    if (scrollIndicator) scrollIndicator.style.opacity = value;
  };

  const onScroll = () => {
    if (!scrollIndicator) return;
    setOpacity('0');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      setOpacity('0.7');
    }, 900);
  };

  // Ensure initial visibility
  setOpacity(scrollIndicator ? '0.7' : '0');

  return { onScroll };
}

function setupScrollPipeline(onScroll, onResize) {
  let ticking = false;

  const run = () => {
    ticking = false;
    onScroll();
  };

  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(run);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    onResize();
    handleScroll();
  }, { passive: true });

  // Initial paint
  handleScroll();
}
