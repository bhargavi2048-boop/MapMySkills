// ============================================================
// MapMySkills — Main Application Logic
// ============================================================

/* global pdfjsLib, JOB_PROFILES, detectJobDomain, getJobProfile,
          buildAnalysisPrompt, buildRoadmapPrompt,
          generateReportPage, openReportWindow */

let analysisData = null;
let roadmapData = null;
let currentProfileKey = "software-developer";
let resumeText = "";

// ─── PAGE NAVIGATION ───────────────────────────────────────
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  const page = document.getElementById("page-" + id);
  if (page) { page.classList.add("active"); page.scrollIntoView({ behavior: "instant", block: "start" }); window.scrollTo(0, 0); }
  const navLink = document.querySelector(`.nav-links a[data-page="${id}"]`);
  if (navLink) navLink.classList.add("active");
  observeReveal();
}

// ─── DEMO TABS ─────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll(".demo-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".demo-panel").forEach(p => p.classList.remove("active"));
  const tab = document.querySelector(`.demo-tab[data-tab="${id}"]`);
  const panel = document.getElementById("panel-" + id);
  if (tab) tab.classList.add("active");
  if (panel) panel.classList.add("active");
}

// ─── RESUME INPUT TABS ─────────────────────────────────────
function switchResumeTab(id) {
  document.querySelectorAll(".resume-tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("resumePasteArea").style.display = id === "paste" ? "block" : "none";
  document.getElementById("resumeUploadArea").style.display = id === "upload" ? "block" : "none";
  document.querySelector(`.resume-tab-btn[data-rtab="${id}"]`).classList.add("active");
}

// ─── JOB SELECTOR ──────────────────────────────────────────
function renderJobSelector() {
  const grid = document.getElementById("jobSelectGrid");
  if (!grid) return;
  grid.innerHTML = Object.entries(JOB_PROFILES).map(([key, profile]) => `
    <div class="job-select-card ${key === currentProfileKey ? "selected" : ""}"
         onclick="selectJobProfile('${key}')" data-key="${key}">
      <span class="jsc-icon">${profile.icon}</span>
      <div>
        <div class="jsc-name">${profile.label}</div>
        <div class="jsc-domain">${profile.domain}</div>
      </div>
    </div>`).join("");
}

function selectJobProfile(key) {
  currentProfileKey = key;
  document.querySelectorAll(".job-select-card").forEach(c => {
    c.classList.toggle("selected", c.dataset.key === key);
  });
  const profile = getJobProfile(key);
  const bar = document.getElementById("domainDetectedBar");
  const text = document.getElementById("domainDetectedText");
  if (bar && text) {
    text.innerHTML = `<strong>${profile.icon} ${profile.label}</strong> — ${profile.domain} domain selected`;
    bar.classList.add("show");
  }
}

// ─── AUTO DETECT DOMAIN from job description ───────────────
function autoDetectDomain() {
  const jd = document.getElementById("jobDescArea")?.value || "";
  if (jd.length < 30) return;
  const detected = detectJobDomain(jd);
  if (detected !== currentProfileKey) {
    selectJobProfile(detected);
    const profile = getJobProfile(detected);
    document.querySelectorAll(".job-select-card").forEach(c => {
      c.classList.toggle("selected", c.dataset.key === detected);
    });
    const bar = document.getElementById("domainDetectedBar");
    const text = document.getElementById("domainDetectedText");
    if (bar && text) {
      text.innerHTML = `🤖 Auto-detected: <strong>${profile.icon} ${profile.label}</strong> from your job description`;
      bar.classList.add("show");
    }
  }
}

// ─── PDF UPLOAD ─────────────────────────────────────────────
if (typeof pdfjsLib !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

async function handlePdfUpload(file) {
  if (!file || file.type !== "application/pdf") { showNotif("⚠️", "Please upload a PDF file."); return; }
  document.getElementById("pdfStatus").textContent = "⏳ Extracting text from PDF…";
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= Math.min(pdf.numPages, 6); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    resumeText = text.trim();
    document.getElementById("resumeTextArea").value = resumeText;
    document.getElementById("pdfStatus").textContent = `✅ Extracted ${resumeText.length.toLocaleString()} characters from ${pdf.numPages} page(s)`;
    autoDetectDomain();
  } catch (err) {
    document.getElementById("pdfStatus").textContent = "❌ Failed to read PDF. Try pasting text instead.";
  }
}

// ─── LOAD SAMPLE DATA ───────────────────────────────────────
function loadSampleData() {
  const profile = getJobProfile(currentProfileKey);
  const samples = {
    "software-developer": {
      resume: `John Doe\nSoftware Engineer | Bangalore\njohn@example.com\n\nEXPERIENCE\nJunior Developer — StartupXYZ (2022–2024)\n- Built REST APIs with Node.js and Express\n- Implemented React frontend components\n- Used Git for version control\n\nSKILLS: JavaScript, React, Node.js, HTML, CSS, Git, MySQL, Python (basic)\n\nEDUCATION: B.E. Computer Science — VTU, 2022`,
      jd: `We are looking for a Software Engineer with:\n- Strong JavaScript and TypeScript skills\n- React.js or Vue.js experience\n- Backend: Node.js / Python / Java\n- Databases: PostgreSQL, MongoDB\n- DevOps: Docker, Kubernetes, CI/CD\n- System design knowledge\n- AWS or GCP experience preferred`
    },
    "data-analyst": {
      resume: `Priya Sharma\nData Analyst | Mumbai\npriya@email.com\n\nEXPERIENCE\nJunior Data Analyst — FinCorp (2023–present)\n- Created dashboards in Excel and basic Tableau\n- Wrote SQL queries for reporting\n- Cleaned datasets using Python pandas\n\nSKILLS: SQL, Excel, Python, Pandas, Basic Statistics\n\nEDUCATION: B.Sc. Statistics — Mumbai University, 2022`,
      jd: `Data Analyst role requiring:\n- Advanced SQL and database skills\n- Python / R for data analysis\n- Tableau or Power BI dashboards\n- Machine Learning basics\n- Statistical analysis\n- Business intelligence reporting\n- Communication with stakeholders`
    },
    "web-developer": {
      resume: `Rahul Nair\nWeb Developer | Chennai\nrahul@web.dev\n\nEXPERIENCE\nFrontend Developer — AgencyXYZ (2022–2024)\n- Built responsive websites with HTML, CSS, JavaScript\n- Used React for UI development\n- Integrated REST APIs\n- Basic Node.js exposure\n\nSKILLS: HTML5, CSS3, JavaScript, React, Git, Basic Node.js\nPROJECTS: Portfolio site, Todo app with React\n\nEDUCATION: Diploma in Computer Engineering, 2022`,
      jd: `Full Stack Web Developer needed:\n- Frontend: React.js or Next.js, TypeScript, Tailwind CSS\n- Backend: Node.js with Express or Django\n- Databases: PostgreSQL, MongoDB\n- REST and GraphQL APIs\n- Git, Docker basics\n- Deployment: Vercel, AWS, or Render\n- Performance optimization and SEO`
    }
  };
  const sample = samples[currentProfileKey] || samples["software-developer"];
  document.getElementById("resumeTextArea").value = sample.resume;
  document.getElementById("jobDescArea").value = sample.jd;
  resumeText = sample.resume;
  showNotif("📋", `Sample ${profile.label} data loaded!`);
}

// ─── GITHUB FETCH ───────────────────────────────────────────
async function fetchGitHubData(username) {
  if (!username) return "";
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=20&sort=updated`)
    ]);
    if (userRes.ok && reposRes.ok) {
      const user = await userRes.json();
      const repos = await reposRes.json();
      const langs = {};
      repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      return `GitHub: ${user.name || username}, ${user.public_repos} repos, followers: ${user.followers}. Top languages: ${Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l, c]) => `${l}(${c})`).join(", ")}. Recent repos: ${repos.slice(0, 5).map(r => r.name + (r.description ? " - " + r.description : "")).join("; ")}.`;
    }
  } catch (e) { /* silent */ }
  return "";
}

// ─── MAIN ANALYZE FUNCTION ─────────────────────────────────
async function analyzeSkills() {
  const btn = document.getElementById("analyzeBtn");
  const effectiveResume = resumeText || document.getElementById("resumeTextArea")?.value || "";
  const jobDesc = document.getElementById("jobDescArea")?.value || "";
  const github = document.getElementById("githubInput")?.value?.trim() || "";

  if (!effectiveResume || effectiveResume.length < 50) { showNotif("⚠️", "Please add your resume text or upload a PDF first."); return; }
  if (!jobDesc || jobDesc.length < 30) { showNotif("⚠️", "Please paste a job description."); return; }

  btn.disabled = true;
  btn.textContent = "⏳ Analyzing…";
  document.getElementById("aiLoading").classList.add("show");
  switchTab("results");

  const steps = ["🔍 Reading your resume…", "🎯 Detecting job domain…", "🤖 Comparing with AI…", "📊 Building radar chart…", "🗺 Generating roadmap…"];
  let stepIdx = 0;
  const stepEl = document.getElementById("aiLoadingStep");
  const stepTimer = setInterval(() => {
    if (stepEl) stepEl.textContent = steps[stepIdx++ % steps.length];
  }, 1200);

  const detected = detectJobDomain(jobDesc);
  if (detected) currentProfileKey = detected;

  try {
    const githubContext = github ? await fetchGitHubData(github.replace(/.*github\.com\//, "").split("/")[0]) : "";
    const prompt = buildAnalysisPrompt(effectiveResume, jobDesc, githubContext, currentProfileKey);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    let text = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    analysisData = JSON.parse(text);
  } catch (err) {
    console.warn("AI analysis failed, using fallback:", err);
    analysisData = generateFallbackAnalysis(document.getElementById("jobDescArea").value, currentProfileKey);
  }

  clearInterval(stepTimer);
  document.getElementById("aiLoading").classList.remove("show");
  switchTab("results");
  renderResults(analysisData);
  btn.disabled = false;
  btn.textContent = "🔍 Analyze My Skills →";
  showNotif("✅", `Analysis complete for ${analysisData.candidateName}!`);
}

// ─── FALLBACK ANALYSIS ─────────────────────────────────────
function generateFallbackAnalysis(jobDesc, profileKey) {
  const profile = getJobProfile(profileKey || currentProfileKey);
  const skills = profile.coreSkills;
  return {
    candidateName: "Your Profile",
    detectedDomain: profile.label,
    matchScore: 58,
    experienceLevel: "Junior",
    summary: `Based on your resume, you have a solid foundation in ${profile.domain}. There are key skills to develop to fully match this ${profile.label} role.`,
    domainInsight: `The ${profile.domain} market is competitive — specialization and portfolio projects are key differentiators.`,
    salaryRange: "₹4–8 LPA",
    strengths: [
      { skill: skills[0] || "Core Skills", level: "Good", note: "Shown in resume" },
      { skill: skills[1] || "Communication", level: "Strong", note: "Evident from profile" },
      { skill: "Problem Solving", level: "Good", note: "Demonstrated through projects" }
    ],
    gaps: [
      { skill: skills[2] || "Advanced Tools", priority: "High", note: `Required for ${profile.label}` },
      { skill: skills[3] || "Domain Expertise", priority: "High", note: "Core requirement" },
      { skill: skills[4] || "Industry Frameworks", priority: "Medium", note: "Industry standard" },
      { skill: "System Design / Architecture", priority: "Medium", note: "Expected at senior level" }
    ],
    partialMatches: [
      { skill: skills[5] || "Supporting Tool", resumeLevel: "Beginner", requiredLevel: "Intermediate" },
      { skill: skills[6] || "Domain Knowledge", resumeLevel: "Familiar", requiredLevel: "Proficient" }
    ],
    radarData: profile.radarAxes.map((axis, i) => ({
      axis,
      candidate: [65, 55, 45, 40, 75, 60][i] || 55,
      required: [85, 80, 75, 70, 70, 80][i] || 75
    })),
    jobRoles: profile.roles.slice(0, 4).map((role, i) => ({
      role, fit: [75, 65, 80, 60][i], icon: profile.icon,
      reason: `Based on your profile for the ${profile.domain} sector.`
    })),
    keyMissingSkills: skills.slice(2, 6),
    topCertifications: skills.slice(0, 3).map(s => s + " Certification")
  };
}

// ─── RENDER RESULTS ────────────────────────────────────────
function renderResults(d) {
  const score = d.matchScore || 0;
  const scoreColor = score >= 75 ? "var(--accent)" : score >= 50 ? "var(--gold)" : "var(--danger)";
  const scoreLabel = score >= 75 ? "Excellent" : score >= 60 ? "Strong" : score >= 45 ? "Moderate" : "Needs Work";
  const profile = getJobProfile(currentProfileKey);

  const strengthsHTML = (d.strengths || []).map((s, i) => `
    <div class="result-skill-row reveal-item" style="animation-delay:${i * 0.08}s;">
      <div class="rsk-left">
        <span class="rsk-dot dot-strength"></span>
        <div>
          <div class="rsk-name">${s.skill}</div>
          <div class="rsk-note">${s.note || ""}</div>
        </div>
      </div>
      <span class="rsk-badge badge-strength">${s.level || "Match"}</span>
    </div>`).join("");

  const gapsHTML = (d.gaps || []).map((g, i) => `
    <div class="result-skill-row reveal-item" style="animation-delay:${i * 0.08}s;">
      <div class="rsk-left">
        <span class="rsk-dot dot-gap"></span>
        <div>
          <div class="rsk-name">${g.skill}</div>
          <div class="rsk-note">${g.note || ""}</div>
        </div>
      </div>
      <span class="rsk-badge badge-gap">${g.priority || "Gap"}</span>
    </div>`).join("");

  const partialHTML = (d.partialMatches || []).map((p, i) => `
    <div class="result-skill-row reveal-item" style="animation-delay:${i * 0.08}s;">
      <div class="rsk-left">
        <span class="rsk-dot dot-partial"></span>
        <div>
          <div class="rsk-name">${p.skill}</div>
          <div class="rsk-note">${p.resumeLevel} → ${p.requiredLevel}</div>
        </div>
      </div>
      <span class="rsk-badge badge-partial">Partial</span>
    </div>`).join("");

  const rolesHTML = (d.jobRoles || []).map((r, i) => `
    <div class="role-fit-card reveal-item" style="animation-delay:${i * 0.1}s;">
      <div class="role-fit-top">
        <span class="role-fit-icon">${r.icon || "💼"}</span>
        <div>
          <div class="role-fit-name">${r.role}</div>
          <div class="role-fit-pct" style="color:${r.fit >= 75 ? 'var(--accent)' : r.fit >= 55 ? 'var(--gold)' : 'var(--danger)'};">${r.fit}% fit</div>
        </div>
      </div>
      <div class="role-bar-track"><div class="role-bar-fill" data-w="${r.fit}" style="width:0%;background:${r.fit >= 75 ? 'var(--accent)' : r.fit >= 55 ? 'var(--gold)' : 'var(--danger)'};"></div></div>
      ${r.reason ? `<div class="role-fit-reason">${r.reason}</div>` : ""}
    </div>`).join("");

  const missingPills = (d.keyMissingSkills || []).map(s => `<span class="gap-pill">⚡ ${s}</span>`).join("");
  const certPills = (d.topCertifications || []).map(s => `<span class="cert-pill">🏅 ${s}</span>`).join("");

  // Score ring animation value
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  document.getElementById("resultsContent").innerHTML = `
    <div class="results-page-wrap">

      <!-- HERO BANNER -->
      <div class="res-hero">
        <div class="res-hero-left">
          <div class="res-hero-tag">${profile.icon} ${profile.label} · ${profile.domain}</div>
          <div class="res-hero-name">${d.candidateName}</div>
          <div class="res-hero-level">
            <span class="level-chip">${d.experienceLevel || "Junior"} Level</span>
            ${d.salaryRange ? `<span class="salary-chip">💰 ${d.salaryRange}</span>` : ""}
          </div>
          ${d.domainInsight ? `<div class="res-hero-insight">"${d.domainInsight}"</div>` : ""}
        </div>
        <div class="res-score-ring-wrap">
          <svg width="130" height="130" viewBox="0 0 130 130" class="score-svg">
            <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="10"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="${scoreColor}" stroke-width="10"
              stroke-linecap="round" stroke-dasharray="${circumference}"
              stroke-dashoffset="${circumference}"
              style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1);"
              id="scoreRingCircle" data-offset="${dashOffset}"/>
          </svg>
          <div class="res-score-center">
            <div class="res-score-num" style="color:${scoreColor};" id="scoreAnimNum">0%</div>
            <div class="res-score-lbl">${scoreLabel}</div>
          </div>
        </div>
      </div>

      <!-- QUICK STATS ROW -->
      <div class="res-stats-row">
        <div class="res-stat-card">
          <div class="res-stat-val" style="color:var(--accent);">${(d.strengths||[]).length}</div>
          <div class="res-stat-label">Strengths</div>
        </div>
        <div class="res-stat-card">
          <div class="res-stat-val" style="color:var(--danger);">${(d.gaps||[]).length}</div>
          <div class="res-stat-label">Skill Gaps</div>
        </div>
        <div class="res-stat-card">
          <div class="res-stat-val" style="color:var(--gold);">${(d.partialMatches||[]).length}</div>
          <div class="res-stat-label">Partials</div>
        </div>
        <div class="res-stat-card">
          <div class="res-stat-val" style="color:#a78bfa;">${(d.jobRoles||[]).length}</div>
          <div class="res-stat-label">Role Matches</div>
        </div>
      </div>

      <!-- SUMMARY -->
      ${d.summary ? `
      <div class="res-summary-card">
        <div class="res-card-label">🧠 AI Summary</div>
        <div class="res-summary-text">${d.summary}</div>
      </div>` : ""}

      <!-- RADAR CHART -->
      <div class="res-section-card">
        <div class="res-card-label">📡 Skill Radar</div>
        <div class="res-radar-legend">
          <span class="legend-dot" style="background:rgba(0,212,200,0.7);"></span> You &nbsp;
          <span class="legend-dot" style="background:rgba(248,113,113,0.7);"></span> Required
        </div>
        <canvas id="radarChart" width="320" height="320" style="max-width:100%;display:block;margin:0 auto;"></canvas>
      </div>

      <!-- SKILLS GRID -->
      <div class="res-skills-grid">
        <div class="res-section-card">
          <div class="res-card-label" style="color:var(--accent);">✅ Your Strengths</div>
          <div class="res-skill-list">${strengthsHTML || '<div class="res-empty">No data</div>'}</div>
        </div>
        <div class="res-section-card">
          <div class="res-card-label" style="color:var(--danger);">❌ Skill Gaps</div>
          <div class="res-skill-list">${gapsHTML || '<div class="res-empty">No significant gaps!</div>'}</div>
          ${partialHTML ? `
          <div class="res-card-label" style="color:var(--gold);margin-top:1.25rem;">⚡ Partial Matches</div>
          <div class="res-skill-list">${partialHTML}</div>` : ""}
        </div>
      </div>

      <!-- MISSING SKILLS -->
      ${missingPills ? `
      <div class="res-section-card">
        <div class="res-card-label">🔑 Priority Skills to Learn</div>
        <div class="pill-cloud">${missingPills}</div>
      </div>` : ""}

      <!-- CERTIFICATIONS -->
      ${certPills ? `
      <div class="res-section-card">
        <div class="res-card-label">🏅 Recommended Certifications</div>
        <div class="pill-cloud">${certPills}</div>
      </div>` : ""}

      <!-- JOB ROLES -->
      ${rolesHTML ? `
      <div class="res-section-card">
        <div class="res-card-label">💼 Best-Fit Job Roles</div>
        <div class="role-fits-grid">${rolesHTML}</div>
      </div>` : ""}

      <!-- ACTION BUTTONS -->
      <div class="res-actions-row">
        <button class="res-action-btn btn-voice" onclick="speakResults()">🎤 Voice Explainer</button>
        <button class="res-action-btn btn-whatif" onclick="openWhatIf()">🧠 What-If Simulator</button>
        <button class="res-action-btn btn-company" onclick="openCompanyMatch()">🔍 Company Match</button>
        <button class="res-action-btn btn-share" onclick="openShareModal()">🌐 Share</button>
      </div>

      <!-- ROADMAP CTA -->
      <div class="res-roadmap-cta">
        <div class="res-roadmap-cta-left">
          <div class="res-cta-title">🗺️ Ready for Your Learning Roadmap?</div>
          <div class="res-cta-sub">Get your personalized week-by-week plan to close every skill gap and land the role.</div>
        </div>
        <div class="res-cta-buttons">
          <button class="btn-cta-roadmap" onclick="goToRoadmap()">Generate Roadmap →</button>
          <button class="btn-cta-report" onclick="triggerReport()">📄 Full Report</button>
        </div>
      </div>

    </div>`;

  // Animate score ring
  setTimeout(() => {
    const circle = document.getElementById("scoreRingCircle");
    const numEl = document.getElementById("scoreAnimNum");
    if (circle) circle.style.strokeDashoffset = dashOffset;
    if (numEl) {
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + Math.ceil(score / 40), score);
        numEl.textContent = current + "%";
        if (current >= score) clearInterval(interval);
      }, 35);
    }
    // Animate role bars
    document.querySelectorAll(".role-bar-fill").forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.w + "%"; }, 400);
    });
    // Animate reveal items
    document.querySelectorAll(".reveal-item").forEach((el, i) => {
      setTimeout(() => el.classList.add("revealed"), 200 + i * 60);
    });
  }, 80);

  // Draw radar
  setTimeout(() => drawRadar(d.radarData || []), 200);
}

// ─── RADAR CANVAS ──────────────────────────────────────────
function drawRadar(radarData) {
  const canvas = document.getElementById("radarChart");
  if (!canvas || !radarData.length) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 36;
  const n = radarData.length;
  ctx.clearRect(0, 0, W, H);

  // Grid
  [0.25, 0.5, 0.75, 1].forEach(ratio => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * R * ratio;
      const y = cy + Math.sin(angle) * R * ratio;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(0,212,200,0.12)";
    ctx.stroke();
  });

  // Axes
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
    ctx.strokeStyle = "rgba(0,212,200,0.12)";
    ctx.stroke();
  }

  // Required polygon
  ctx.beginPath();
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (d.required / 100) * R;
    const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(248,113,113,0.1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(248,113,113,0.7)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Candidate polygon
  ctx.beginPath();
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (d.candidate / 100) * R;
    const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(0,212,200,0.15)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,212,200,0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Labels
  ctx.fillStyle = "rgba(157,188,204,0.9)";
  ctx.font = "bold 10px DM Sans, sans-serif";
  ctx.textAlign = "center";
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const lx = cx + Math.cos(angle) * (R + 20);
    const ly = cy + Math.sin(angle) * (R + 20);
    ctx.fillText(d.axis.length > 12 ? d.axis.substring(0, 12) + "…" : d.axis, lx, ly + 4);
  });

  // Dots
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (d.candidate / 100) * R;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4c8";
    ctx.fill();
  });
}

// ─── TRIGGER REPORT ────────────────────────────────────────
function triggerReport() {
  if (!analysisData) { showNotif("⚠️", "Run an analysis first."); return; }
  openReportWindow(analysisData, roadmapData, currentProfileKey);
}

// ─── GO TO ROADMAP ────────────────────────────────────────
async function goToRoadmap() {
  switchTab('roadmap');
  await generateRoadmap();
}

// ─── GENERATE ROADMAP ──────────────────────────────────────
async function generateRoadmap() {
  if (!analysisData) return;
  document.getElementById("roadmapPreviewContent").innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted);"><div style="font-size:2rem;margin-bottom:1rem;">⏳</div><div>Generating your personalized roadmap…</div></div>`;

  const profile = getJobProfile(currentProfileKey);

  try {
    const prompt = buildRoadmapPrompt(analysisData, profile);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2500, messages: [{ role: "user", content: prompt }] })
    });
    const data = await response.json();
    let text = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    roadmapData = JSON.parse(text);
  } catch (e) {
    roadmapData = generateFallbackRoadmap(analysisData);
  }
  renderRoadmapPreview(roadmapData);
}

function generateFallbackRoadmap(analysis) {
  const profile = getJobProfile(currentProfileKey);
  const gaps = (analysis.gaps || []).map(g => g.skill);
  return {
    title: `${analysis.candidateName}'s 30-Day ${profile.label} Roadmap`,
    totalWeeks: 5,
    weeks: [
      { weekRange: "Week 1–2", topic: gaps[0] || profile.coreSkills[0], description: `Build a strong foundation in ${gaps[0] || "core skills"}. Focus on official documentation and hands-on practice.`, skills: [gaps[0] || profile.coreSkills[0]], hoursPerWeek: 10, project: `Build a beginner project using ${gaps[0] || profile.coreSkills[0]}.`, tasks: ["Study official docs", "Complete beginner tutorial", "Build a mini project", "Push to GitHub"], resources: [{ title: "Official Documentation", url: "https://developer.mozilla.org", type: "free", icon: "📘" }, { title: "freeCodeCamp", url: "https://freecodecamp.org", type: "free", icon: "🎓" }] },
      { weekRange: "Week 3", topic: gaps[1] || profile.coreSkills[1], description: `Deepen ${gaps[1] || "secondary skills"} through structured learning and practice exercises.`, skills: [gaps[1] || profile.coreSkills[1]], hoursPerWeek: 12, project: `Create a project integrating ${gaps[1] || profile.coreSkills[1]}.`, tasks: ["Watch crash course series", "Solve practice problems", "Build integration project", "Write documentation"], resources: [{ title: "YouTube Tutorial", url: "https://youtube.com", type: "free", icon: "▶️" }, { title: "Coursera Course", url: "https://coursera.org", type: "paid", icon: "🎓" }] },
      { weekRange: "Week 4", topic: gaps[2] || "Applied Practice", description: "Apply all learned skills in a realistic project that simulates real work scenarios.", skills: [gaps[2] || profile.coreSkills[2]], hoursPerWeek: 10, project: "Build a portfolio-worthy full project.", tasks: ["Design the project scope", "Implement core features", "Add tests/documentation", "Deploy and share"], resources: [{ title: "GitHub Documentation", url: "https://docs.github.com", type: "free", icon: "🐙" }] },
      { weekRange: "Week 5", topic: "Interview & Portfolio Prep", description: `Prepare specifically for ${profile.label} roles — update portfolio, practice questions, and apply.`, skills: ["Portfolio", "Interview Prep"], hoursPerWeek: 8, project: "Polish portfolio and apply to 5 jobs.", tasks: ["Update resume and LinkedIn", "Prepare common interview Q&A", "Practice mock interviews", "Apply to target companies"], resources: [{ title: "LeetCode", url: "https://leetcode.com", type: "free", icon: "💻" }, { title: "LinkedIn Jobs", url: "https://linkedin.com/jobs", type: "free", icon: "🔗" }] }
    ]
  };
}

function renderRoadmapPreview(data) {
  const previewHTML = (data.weeks || []).slice(0, 3).map((w, i) => `
    <div class="roadmap-item">
      <div class="roadmap-dot"></div>
      <div class="roadmap-week">${w.weekRange}</div>
      <div class="roadmap-title">${w.topic}</div>
      <div class="roadmap-desc">${w.description}</div>
      <div style="margin:0.5rem 0;">
        <button class="task-toggle" onclick="toggleTask('task-prev-${i}',this)">
          <span class="task-toggle-icon">▶</span> ${(w.tasks || []).length} learning tasks
        </button>
        <div class="task-content" id="task-prev-${i}">
          <ul>${(w.tasks || []).map(t => `<li>${t}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="roadmap-resources">${(w.resources || []).slice(0, 3).map(r => `<a href="${r.url}" target="_blank" class="resource-link">${r.icon || "📘"} ${r.title}</a>`).join("")}</div>
    </div>`).join("");

  const el = document.getElementById("roadmapPreviewContent");
  if (el) {
    el.innerHTML = `
      <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin-bottom:0.4rem;">${data.title || "Your Learning Roadmap"}</div>
      <div style="font-size:0.83rem;color:var(--muted);margin-bottom:1.75rem;">Showing first 3 weeks · ${data.totalWeeks || "?"} weeks total</div>
      <div class="roadmap-timeline">${previewHTML}</div>
      <div style="text-align:center;margin-top:1.5rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn-primary" onclick="showFullRoadmap()">🚀 View Full Roadmap →</button>
        <button class="btn-report" onclick="triggerReport()">📄 Full Report</button>
      </div>`;
  }
}

function toggleTask(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("open");
  btn.classList.toggle("open");
}

function showFullRoadmap() {
  if (!roadmapData) return;
  renderFullRoadmapPage(roadmapData);
  showPage("roadmap-result");
}

function renderFullRoadmapPage(data) {
  const score = analysisData?.matchScore || 0;
  const gapCount = analysisData?.gaps?.length || 0;
  const profile = getJobProfile(currentProfileKey);
  document.getElementById("roadmapResultTitle").textContent = data.title || "Your Personalized Roadmap";
  document.getElementById("roadmapResultSubtitle").textContent = `${data.totalWeeks || data.weeks?.length || 0}-week plan to close your skill gaps`;
  document.getElementById("roadmapStatsRow").innerHTML = `
    <div class="roadmap-stat-chip">📊 Match: <strong>${score}%</strong></div>
    <div class="roadmap-stat-chip">${profile.icon} Domain: <strong>${profile.label}</strong></div>
    <div class="roadmap-stat-chip">📅 Duration: <strong>${data.totalWeeks || data.weeks?.length || 0} weeks</strong></div>
    <div class="roadmap-stat-chip">🎯 Gaps: <strong>${gapCount}</strong></div>`;

  const weeksHTML = (data.weeks || []).map((w, idx) => `
    <div class="roadmap-week-card reveal" style="animation-delay:${idx * 0.1}s;">
      <div class="roadmap-week-label">📅 ${w.weekRange}</div>
      <div class="roadmap-week-title">${w.topic}</div>
      <div class="roadmap-week-desc">${w.description}</div>
      ${w.skills?.length ? `<div class="roadmap-week-skills">${w.skills.map(s => `<span class="roadmap-skill-chip">${s}</span>`).join("")}</div>` : ""}
      <div>
        <button class="task-toggle" onclick="toggleTask('task-full-${idx}',this)">
          <span class="task-toggle-icon">▶</span> ${(w.tasks || []).length} learning tasks
        </button>
        <div class="task-content" id="task-full-${idx}">
          <ul>${(w.tasks || ["Practice", "Build", "Review", "Share"]).map(t => `<li>${t}</li>`).join("")}</ul>
        </div>
      </div>
      ${w.project ? `<div class="roadmap-project-box"><strong>🛠️ Mini Project:</strong> ${w.project}</div>` : ""}
      <div class="roadmap-time-box">⏱️ Estimated: <strong style="color:var(--text);margin-left:4px;">${w.hoursPerWeek || 8}–${(w.hoursPerWeek || 8) + 3} hours/week</strong></div>
      <div style="margin-top:0.75rem;">
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:4px;">MODULE PROGRESS</div>
        <div class="module-progress"><div class="module-progress-fill" style="width:0%" data-target="${Math.floor(Math.random() * 30 + 5)}%"></div></div>
      </div>
      <div class="roadmap-week-resources">
        ${(w.resources || []).map(r => `<a href="${r.url}" target="_blank" rel="noopener" class="resource-link">${r.icon || "📘"} ${r.title} <span style="font-size:0.65rem;opacity:0.6;margin-left:2px;">${r.type === "free" ? "· free" : "· paid"}</span></a>`).join("")}
      </div>
    </div>`).join("");

  document.getElementById("roadmapResultBody").innerHTML = weeksHTML + `
    <div style="background:linear-gradient(135deg,rgba(0,212,200,0.06),rgba(14,165,234,0.06));border:1px solid rgba(0,212,200,0.14);border-radius:var(--radius);padding:2rem;text-align:center;margin-top:2rem;">
      <div style="font-family:var(--font-head);font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;">🎉 You've got this!</div>
      <div style="font-size:0.9rem;color:var(--muted2);margin-bottom:1.5rem;">Follow this roadmap consistently to land your ${profile.label} role!</div>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn-primary" onclick="showPage('demo');switchTab('input');">🔄 Analyze Another Role</button>
        <button class="btn-report" onclick="triggerReport()">📄 Full Report</button>
        <button class="btn-secondary" onclick="showPage('contact')">📩 Get Mentorship</button>
      </div>
    </div>`;

  setTimeout(() => {
    observeReveal();
    document.querySelectorAll(".module-progress-fill").forEach(el => {
      const target = el.dataset.target;
      setTimeout(() => { el.style.width = target; }, 300);
    });
  }, 100);
}

// ─── SPEECH ────────────────────────────────────────────────
function speakResults() {
  if (!analysisData || !window.speechSynthesis) { showNotif("🔇", "Speech not available."); return; }
  const profile = getJobProfile(currentProfileKey);
  const text = `Analysis complete for ${analysisData.candidateName}. You are targeting ${profile.label} in ${profile.domain}. Your match score is ${analysisData.matchScore} percent. ${analysisData.summary || ""} Key gaps are: ${(analysisData.gaps || []).map(g => g.skill).slice(0, 3).join(", ")}.`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// ─── WHAT-IF MODAL ─────────────────────────────────────────
function openWhatIf() { openModal("whatifModal"); }
function runWhatIf() {
  const skill = document.getElementById("whatifSkill")?.value?.trim();
  if (!skill || !analysisData) return;
  const newScore = Math.min(100, (analysisData.matchScore || 0) + Math.floor(Math.random() * 12 + 5));
  const el = document.getElementById("whatifResult");
  if (el) { el.innerHTML = `Adding <strong>${skill}</strong> would boost your match score from <span style="color:var(--danger)">${analysisData.matchScore}%</span> to approximately <span style="color:var(--accent)">${newScore}%</span>.`; el.classList.add("show"); }
}

// ─── COMPANY MATCH MODAL ───────────────────────────────────
function openCompanyMatch() { openModal("companyModal"); }
function runCompanyMatch() {
  const company = document.getElementById("companyInput")?.value?.trim();
  if (!company || !analysisData) return;
  const matchScore = Math.floor(Math.random() * 30 + 50);
  const el = document.getElementById("companyResult");
  if (el) { el.innerHTML = `Your profile matches <strong>${company}</strong> at approximately <strong style="color:var(--accent)">${matchScore}%</strong> for ${getJobProfile(currentProfileKey).label} roles.`; el.classList.add("show"); }
}

// ─── SHARE MODAL ───────────────────────────────────────────
function openShareModal() {
  openModal("shareModal");
  const score = analysisData?.matchScore || 0;
  const name = analysisData?.candidateName || "Me";
  const shareText = `I just analyzed my skills with MapMySkills! Match score: ${score}% for ${getJobProfile(currentProfileKey).label}. Try it at MapMySkills.app`;
  const el = document.getElementById("shareText");
  if (el) el.value = shareText;
}

function copyShareText() {
  const el = document.getElementById("shareText");
  if (el) { navigator.clipboard?.writeText(el.value); showNotif("📋", "Copied to clipboard!"); }
}

// ─── MODAL UTILITIES ───────────────────────────────────────
function openModal(id) { document.getElementById(id)?.classList.add("show"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("show"); }
document.addEventListener("click", e => {
  if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("show");
});

// ─── CONTACT FORM ──────────────────────────────────────────
async function submitContactForm() {
  const firstName = document.getElementById("firstName")?.value?.trim();
  const email = document.getElementById("contactEmail")?.value?.trim();
  const message = document.getElementById("contactMessage")?.value?.trim();
  const reason = document.getElementById("reason")?.value;
  if (!firstName || !email || !message) { showNotif("⚠️", "Please fill in name, email, and message."); return; }
  if (!email.includes("@") || !email.includes(".")) { showNotif("⚠️", "Enter a valid email address."); return; }
  const btn = document.getElementById("contactSubmitBtn");
  btn.disabled = true; btn.textContent = "⏳ Sending…";
  await new Promise(r => setTimeout(r, 1200));
  const ln = document.getElementById("lastName")?.value?.trim() || "";
  const subject = encodeURIComponent(`MapMySkills Contact: ${reason || "General"} — from ${firstName} ${ln}`);
  const body = encodeURIComponent(`Name: ${firstName} ${ln}\nEmail: ${email}\nReason: ${reason}\n\nMessage:\n${message}\n\n---\nSent via MapMySkills Contact Form`);
  // Updated to Bhargavi's email
  window.location.href = `mailto:bharkavi1878@gmail.com?subject=${subject}&body=${body}`;
  showNotif("📧", "Opening email client…");
  btn.disabled = false; btn.textContent = "Send Message 🚀";
}

// ─── NOTIFICATION ──────────────────────────────────────────
function showNotif(icon, text) {
  const n = document.getElementById("notif");
  document.getElementById("notifIcon").textContent = icon;
  document.getElementById("notifText").textContent = text;
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 4000);
}

// ─── SCROLL REVEAL ─────────────────────────────────────────
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => io.observe(el));
}
observeReveal();

// ─── PROGRESS BAR ──────────────────────────────────────────
window.addEventListener("scroll", () => {
  const el = document.getElementById("progressBar");
  if (!el) return;
  const scrolled = document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  el.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
});

// ─── PARTICLES ─────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.1
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,200,${p.opacity})`; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}
initParticles();

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderJobSelector();
  if (window.speechSynthesis) speechSynthesis.getVoices();

  // PDF drag-drop
  const zone = document.getElementById("pdfDropZone");
  if (zone) {
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("dragover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
    zone.addEventListener("drop", e => {
      e.preventDefault(); zone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file) handlePdfUpload(file);
    });
  }

  // Auto-detect domain on JD input
  let jdTimer;
  const jdArea = document.getElementById("jobDescArea");
  if (jdArea) {
    jdArea.addEventListener("input", () => {
      clearTimeout(jdTimer);
      jdTimer = setTimeout(autoDetectDomain, 800);
    });
  }

  // Hamburger
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    });
  }
});
