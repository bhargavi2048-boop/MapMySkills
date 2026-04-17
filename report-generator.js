// ============================================================
// MapMySkills — Report Generator
// Builds a full-page HTML report website from analysis data
// ============================================================

function generateReportPage(analysisData, roadmapData, profileKey) {
  const profile = getJobProfile(profileKey);
  const score = analysisData.matchScore || 0;
  const scoreColor = score >= 75 ? "#00d4c8" : score >= 50 ? "#fbbf24" : "#f87171";
  const scoreLabel = score >= 75 ? "Strong Match" : score >= 50 ? "Partial Match" : "Needs Work";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Radar chart SVG (static version for report)
  const radarSVG = buildRadarSVG(analysisData.radarData || []);

  // Strengths HTML
  const strengthsRows = (analysisData.strengths || []).map(s => `
    <div class="rpt-skill-row">
      <div class="rpt-skill-name">${s.skill}</div>
      <div class="rpt-skill-bar-wrap"><div class="rpt-skill-bar" style="width:${s.level === "Expert" ? 92 : s.level === "Strong" ? 75 : 58}%;background:#00d4c8;"></div></div>
      <span class="rpt-badge badge-green">${s.level}</span>
    </div>`).join("");

  // Gaps HTML
  const gapsRows = (analysisData.gaps || []).map(g => `
    <div class="rpt-skill-row">
      <div class="rpt-skill-name">${g.skill}</div>
      <div class="rpt-skill-note">${g.note || ""}</div>
      <span class="rpt-badge badge-${g.priority === "High" ? "red" : g.priority === "Medium" ? "yellow" : "gray"}">${g.priority}</span>
    </div>`).join("");

  // Partial matches
  const partialRows = (analysisData.partialMatches || []).map(p => `
    <div class="rpt-skill-row">
      <div class="rpt-skill-name">${p.skill}</div>
      <div class="rpt-skill-note">${p.resumeLevel} → ${p.requiredLevel}</div>
      <span class="rpt-badge badge-yellow">Partial</span>
    </div>`).join("");

  // Job roles
  const rolesCards = (analysisData.jobRoles || []).map(r => `
    <div class="rpt-role-card">
      <div class="rpt-role-icon">${r.icon || "💼"}</div>
      <div class="rpt-role-info">
        <div class="rpt-role-title">${r.role}</div>
        <div class="rpt-role-fit">${r.fit}% match</div>
        <div class="rpt-role-bar"><div class="rpt-role-bar-fill" style="width:${r.fit}%;"></div></div>
      </div>
    </div>`).join("");

  // Roadmap weeks
  const weekCards = (roadmapData?.weeks || []).map((w, i) => `
    <div class="rpt-week-card">
      <div class="rpt-week-header">
        <span class="rpt-week-badge">📅 ${w.weekRange}</span>
        <span class="rpt-week-hours">⏱ ${w.hoursPerWeek || 10}–${(w.hoursPerWeek || 10) + 3} hrs/week</span>
      </div>
      <div class="rpt-week-topic">${w.topic}</div>
      <p class="rpt-week-desc">${w.description}</p>
      ${w.skills?.length ? `<div class="rpt-week-chips">${w.skills.map(s => `<span class="rpt-chip">${s}</span>`).join("")}</div>` : ""}
      ${w.project ? `<div class="rpt-project-box">🛠️ <strong>Mini Project:</strong> ${w.project}</div>` : ""}
      <div class="rpt-tasks">
        ${(w.tasks || []).map(t => `<div class="rpt-task-item">✓ ${t}</div>`).join("")}
      </div>
      ${w.resources?.length ? `
        <div class="rpt-resources-title">📖 Resources</div>
        <div class="rpt-resources-grid">
          ${w.resources.map(r => `<a href="${r.url}" class="rpt-resource-link" target="_blank">${r.icon || "📘"} ${r.title} <span class="rpt-free-tag">${r.type === "free" ? "FREE" : "PAID"}</span></a>`).join("")}
        </div>` : ""}
    </div>`).join("");

  // Certifications
  const certs = (analysisData.topCertifications || profile.coreSkills.slice(0, 3)).map(c =>
    `<span class="rpt-cert-badge">🎓 ${c}</span>`).join("");

  // Missing skills pills
  const missingPills = (analysisData.keyMissingSkills || []).map(s =>
    `<span class="rpt-missing-pill">❌ ${s}</span>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MapMySkills Report — ${analysisData.candidateName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #040b10; --bg2: #071018; --card: #0b1820; --card2: #0f1e2a;
  --border: rgba(0,210,200,0.1); --border2: rgba(0,210,200,0.2);
  --accent: #00d4c8; --accent2: #0ea5ea; --gold: #fbbf24;
  --danger: #f87171; --text: #e8f4f8; --muted: #6b8fa0; --muted2: #9dbccc;
  --radius: 16px; --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  --domain-color: ${profile.color};
}
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 15px; line-height: 1.7; }

/* Animations */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes fillBar { from { width: 0; } }
.anim-1 { animation: fadeUp 0.5s ease 0.1s both; }
.anim-2 { animation: fadeUp 0.5s ease 0.2s both; }
.anim-3 { animation: fadeUp 0.5s ease 0.3s both; }
.anim-4 { animation: fadeUp 0.5s ease 0.4s both; }

/* PRINT CONTROLS */
.print-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
  background: rgba(4,11,16,0.97); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,210,200,0.2);
  padding: 10px 2rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
}
.print-logo { font-family: var(--font-head); font-weight: 800; font-size: 1.05rem; color: var(--text); display: flex; align-items: center; gap: 8px; text-decoration: none; }
.logo-dot { width: 26px; height: 26px; border-radius: 7px; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 13px; }
.print-spacer { flex: 1; }
.print-btn { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-family: var(--font-body); font-size: 0.82rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
.btn-pdf { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #040b10; }
.btn-pdf:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-download { background: rgba(251,191,36,0.12); color: var(--gold); border: 1px solid rgba(251,191,36,0.25); }
.btn-download:hover { background: rgba(251,191,36,0.2); transform: translateY(-1px); }
.btn-back { background: transparent; color: var(--muted2); border: 1px solid rgba(0,210,200,0.2); }
.btn-back:hover { color: var(--text); background: rgba(0,212,200,0.06); }
.print-meta { font-size: 0.73rem; color: var(--muted); }

/* HERO BANNER */
.rpt-hero {
  margin-top: 60px;
  background: linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(14,165,234,0.04) 100%);
  border-bottom: 1px solid rgba(0,210,200,0.2);
  padding: 3rem 2rem 2.5rem;
  position: relative; overflow: hidden;
}
.rpt-hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 600px 400px at 90% 50%, rgba(0,212,200,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.rpt-hero-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; }
.rpt-domain-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,212,200,0.08); border: 1px solid rgba(0,212,200,0.22);
  border-radius: 100px; padding: 5px 14px; font-size: 0.75rem; font-weight: 700;
  color: var(--accent); margin-bottom: 1rem; letter-spacing: 0.05em; text-transform: uppercase;
}
.rpt-candidate-name { font-family: var(--font-head); font-weight: 800; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.75rem; }
.rpt-candidate-name span { color: var(--domain-color); }
.rpt-role-label { font-size: 1rem; color: var(--muted2); margin-bottom: 0.5rem; }
.rpt-date { font-size: 0.78rem; color: var(--muted); }
.rpt-score-circle {
  width: 120px; height: 120px; border-radius: 50%;
  background: conic-gradient(${scoreColor} ${score}%, rgba(255,255,255,0.05) ${score}%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 40px rgba(0,212,200,0.2); flex-shrink: 0;
}
.rpt-score-inner { width: 92px; height: 92px; border-radius: 50%; background: var(--bg2); display: flex; align-items: center; justify-content: center; flex-direction: column; }
.rpt-score-num { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; color: ${scoreColor}; line-height: 1; }
.rpt-score-lbl { font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }

/* STATS ROW */
.rpt-stats-row { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
.rpt-stat-chip {
  background: var(--card); border: 1px solid var(--border); border-radius: 10px;
  padding: 0.6rem 1rem; font-size: 0.8rem; color: var(--muted2);
  display: flex; align-items: center; gap: 6px;
}

/* BODY LAYOUT */
.rpt-body { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }

/* EXEC SUMMARY */
.rpt-exec-card {
  background: var(--card); border: 1px solid var(--border2); border-radius: var(--radius);
  padding: 2rem; margin-bottom: 1.5rem;
}
.rpt-exec-title { font-family: var(--font-head); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 0.75rem; }
.rpt-exec-text { font-size: 0.92rem; color: var(--muted2); line-height: 1.8; }

/* DOMAIN CARD */
.rpt-domain-card {
  background: linear-gradient(135deg, rgba(0,212,200,0.06), rgba(14,165,234,0.04));
  border: 1px solid rgba(0,212,200,0.18); border-radius: var(--radius);
  padding: 1.75rem; margin-bottom: 1.5rem; display: flex; gap: 1.25rem; align-items: flex-start;
}
.rpt-domain-icon { font-size: 2.5rem; line-height: 1; flex-shrink: 0; }
.rpt-domain-title { font-family: var(--font-head); font-weight: 700; font-size: 1rem; margin-bottom: 0.4rem; }
.rpt-domain-text { font-size: 0.87rem; color: var(--muted2); line-height: 1.7; }
.rpt-salary-chip { display: inline-flex; margin-top: 0.75rem; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25); border-radius: 100px; padding: 4px 14px; font-size: 0.78rem; font-weight: 700; color: var(--gold); }

/* SECTIONS */
.rpt-section { margin-bottom: 1.5rem; }
.rpt-section-title { font-family: var(--font-head); font-weight: 700; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted2); margin-bottom: 1rem; }
.rpt-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.75rem; }

/* TWO COL */
.rpt-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
@media(max-width:700px) { .rpt-two-col { grid-template-columns: 1fr; } }

/* SKILL ROWS */
.rpt-skill-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
.rpt-skill-row:last-child { border-bottom: none; }
.rpt-skill-name { font-size: 0.85rem; font-weight: 500; flex: 0 0 130px; }
.rpt-skill-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; }
.rpt-skill-bar { height: 100%; border-radius: 100px; animation: fillBar 1s ease forwards; }
.rpt-skill-note { flex: 1; font-size: 0.75rem; color: var(--muted); }
.rpt-badge { font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 100px; flex-shrink: 0; }
.badge-green { background: rgba(0,212,200,0.12); color: var(--accent); }
.badge-red { background: rgba(248,113,113,0.12); color: var(--danger); }
.badge-yellow { background: rgba(251,191,36,0.12); color: var(--gold); }
.badge-gray { background: rgba(107,143,160,0.12); color: var(--muted2); }

/* RADAR */
.rpt-radar-section { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; align-items: start; }
@media(max-width:700px) { .rpt-radar-section { grid-template-columns: 1fr; } }
.rpt-radar-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.rpt-radar-legend { display: flex; gap: 1.25rem; margin-top: 0.75rem; justify-content: center; }
.rpt-legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--muted2); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.rpt-missing-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.25rem; }
.rpt-missing-pill { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: var(--danger); border-radius: 100px; padding: 4px 12px; font-size: 0.75rem; font-weight: 600; }
.rpt-cert-row { display: flex; flex-wrap: wrap; gap: 8px; }
.rpt-cert-badge { background: rgba(14,165,234,0.1); border: 1px solid rgba(14,165,234,0.22); color: var(--accent2); border-radius: 100px; padding: 5px 13px; font-size: 0.75rem; font-weight: 600; }

/* INSIGHT BOX */
.rpt-insight-box { background: rgba(0,212,200,0.05); border: 1px solid rgba(0,212,200,0.14); border-radius: 10px; padding: 1rem 1.25rem; font-size: 0.87rem; color: var(--muted2); line-height: 1.7; }

/* JOB ROLES */
.rpt-roles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
.rpt-role-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start; }
.rpt-role-icon { font-size: 1.75rem; line-height: 1; }
.rpt-role-title { font-weight: 600; font-size: 0.88rem; margin-bottom: 4px; }
.rpt-role-fit { font-size: 0.75rem; color: var(--accent); font-weight: 700; margin-bottom: 6px; }
.rpt-role-bar { height: 4px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; }
.rpt-role-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 100px; animation: fillBar 1s ease forwards; }

/* WEEK CARDS */
.rpt-week-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.75rem; margin-bottom: 1.25rem; }
.rpt-week-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
.rpt-week-badge { background: rgba(0,212,200,0.1); color: var(--accent); border-radius: 100px; padding: 3px 12px; font-size: 0.75rem; font-weight: 700; }
.rpt-week-hours { font-size: 0.75rem; color: var(--muted); }
.rpt-week-topic { font-family: var(--font-head); font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem; }
.rpt-week-desc { font-size: 0.87rem; color: var(--muted2); line-height: 1.7; margin-bottom: 0.75rem; }
.rpt-week-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.75rem; }
.rpt-chip { background: rgba(0,212,200,0.08); color: var(--accent); border-radius: 100px; padding: 3px 10px; font-size: 0.72rem; font-weight: 600; }
.rpt-project-box { background: rgba(14,165,234,0.07); border: 1px solid rgba(14,165,234,0.18); border-radius: 8px; padding: 0.75rem 1rem; margin: 0.75rem 0; font-size: 0.85rem; color: var(--muted2); }
.rpt-tasks { margin: 0.75rem 0; }
.rpt-task-item { font-size: 0.83rem; color: var(--muted2); padding: 3px 0; }
.rpt-resources-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin: 0.75rem 0 0.4rem; }
.rpt-resources-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.5rem; }
.rpt-resource-link { display: flex; align-items: center; gap: 6px; background: var(--card2); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; font-size: 0.78rem; color: var(--muted2); text-decoration: none; transition: all 0.2s; }
.rpt-resource-link:hover { border-color: rgba(0,212,200,0.3); color: var(--text); }
.rpt-free-tag { font-size: 0.62rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: rgba(0,212,200,0.1); color: var(--accent); margin-left: auto; }

/* FOOTER */
.rpt-footer { border-top: 1px solid var(--border); padding: 2rem; text-align: center; margin-top: 2rem; }
.rpt-footer-text { font-size: 0.78rem; color: var(--muted); line-height: 1.8; }
.rpt-footer-brand { font-weight: 700; color: var(--accent); }

/* PRINT STYLES */
@media print {
  .print-bar { display: none !important; }
  body { background: white !important; color: #0a0a0a !important; }
  .rpt-hero { background: #f8f9fa !important; border-color: #ddd !important; }
  .rpt-card, .rpt-week-card, .rpt-role-card { border-color: #ddd !important; background: #f8f9fa !important; }
  .rpt-hero { margin-top: 0 !important; }
}
</style>
</head>
<body>

<!-- FIXED TOP BAR -->
<div class="print-bar">
  <a class="print-logo" href="javascript:void(0)" onclick="goBack()">
    <div class="logo-dot">🗺</div>
    Map<span style="color:var(--accent)">My</span>Skills
  </a>
  <span class="print-meta">Report for ${analysisData.candidateName} · ${dateStr} ${timeStr}</span>
  <div class="print-spacer"></div>
  <button class="print-btn btn-back" onclick="goBack()">← Back to App</button>
  <button class="print-btn btn-download" onclick="downloadHTMLReport()">💾 Save as HTML</button>
  <button class="print-btn btn-pdf" onclick="window.print()">🖨️ Print / PDF</button>
</div>

<!-- HERO -->
<div class="rpt-hero">
  <div class="rpt-hero-inner">
    <div class="anim-1">
      <div class="rpt-domain-badge">${profile.icon} ${profile.label} · ${profile.domain}</div>
      <div class="rpt-candidate-name">${analysisData.candidateName.split(" ")[0]} <span>${analysisData.candidateName.split(" ").slice(1).join(" ") || ""}</span></div>
      <div class="rpt-role-label">${analysisData.experienceLevel || "Junior"} Level · ${scoreLabel}</div>
      <div class="rpt-date">Generated on ${dateStr} at ${timeStr}</div>
      <div class="rpt-stats-row">
        <div class="rpt-stat-chip">✅ ${(analysisData.strengths||[]).length} Strengths</div>
        <div class="rpt-stat-chip">❌ ${(analysisData.gaps||[]).length} Gaps</div>
        <div class="rpt-stat-chip">⚡ ${(analysisData.partialMatches||[]).length} Partial</div>
        ${analysisData.salaryRange ? `<div class="rpt-stat-chip">💰 ${analysisData.salaryRange}</div>` : ""}
      </div>
    </div>
    <div class="anim-1">
      <div class="rpt-score-circle">
        <div class="rpt-score-inner">
          <div class="rpt-score-num">${score}%</div>
          <div class="rpt-score-lbl">Match</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- BODY -->
<div class="rpt-body">

  <!-- EXEC SUMMARY -->
  <div class="rpt-exec-card anim-1">
    <div class="rpt-exec-title">📋 Executive Summary</div>
    <div class="rpt-exec-text">${analysisData.summary || "AI-powered analysis of your skills against the job requirements."}</div>
    ${analysisData.domainInsight ? `<div class="rpt-exec-text" style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">${analysisData.domainInsight}</div>` : ""}
  </div>

  <!-- DOMAIN CARD -->
  <div class="rpt-domain-card anim-2">
    <div class="rpt-domain-icon">${profile.icon}</div>
    <div>
      <div class="rpt-domain-title">${profile.label} · ${profile.domain}</div>
      <div class="rpt-domain-text">${profile.tip}</div>
      ${analysisData.salaryRange ? `<div class="rpt-salary-chip">💰 Market Range: ${analysisData.salaryRange}</div>` : ""}
    </div>
  </div>

  <!-- RADAR + MISSING SKILLS -->
  <div class="rpt-section anim-3">
    <div class="rpt-section-title">📊 Skills Radar Analysis</div>
    <div class="rpt-radar-section">
      <div class="rpt-radar-card">
        <div id="reportRadarWrap">
          ${radarSVG}
        </div>
        <div class="rpt-radar-legend">
          <div class="rpt-legend-item"><div class="legend-dot" style="background:rgba(0,212,200,0.5);"></div> Your Profile</div>
          <div class="rpt-legend-item"><div class="legend-dot" style="background:rgba(248,113,113,0.5);"></div> Required</div>
        </div>
      </div>
      <div>
        <div class="rpt-section-title">🔑 Key Missing Skills</div>
        <div class="rpt-missing-row">${missingPills}</div>
        <div style="margin-top:1.5rem;">
          <div class="rpt-section-title">🎓 Recommended Certifications</div>
          <div class="rpt-cert-row">${certs}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- STRENGTHS + GAPS -->
  <div class="rpt-two-col anim-3">
    <div class="rpt-card">
      <div class="rpt-section-title">✅ Strengths</div>
      ${strengthsRows || '<p style="color:var(--muted);font-size:0.85rem;">No data</p>'}
    </div>
    <div class="rpt-card">
      <div class="rpt-section-title">❌ Skill Gaps</div>
      ${gapsRows || '<p style="color:var(--muted);font-size:0.85rem;">No significant gaps detected.</p>'}
      ${partialRows ? `
        <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);">
          <div class="rpt-section-title" style="font-size:0.72rem;">⚡ Partial Matches</div>
          ${partialRows}
        </div>` : ""}
    </div>
  </div>

  <!-- JOB ROLES -->
  <div class="rpt-section anim-4">
    <div class="rpt-section-title">💼 Recommended Job Roles</div>
    <div class="rpt-roles-grid">${rolesCards}</div>
  </div>

  <!-- ROADMAP -->
  ${roadmapData ? `
  <div class="rpt-section anim-4">
    <div class="rpt-section-title">🗓 Your 30-Day Learning Roadmap</div>
    <div class="rpt-insight-box" style="margin-bottom:1.25rem;">
      <strong>${roadmapData.title}</strong><br>
      ${roadmapData.totalWeeks || 5}-week plan tailored to close your skill gaps for <strong>${profile.label}</strong> roles.
    </div>
    ${weekCards}
  </div>` : ""}

</div>

<!-- FOOTER -->
<div class="rpt-footer">
  <div class="rpt-footer-text">
    Generated by <span class="rpt-footer-brand">MapMySkills</span> · AI-Powered Career Intelligence · ${dateStr}
    <br>Powered by Claude AI (Anthropic) · For ${analysisData.candidateName}
    <br><span style="color:var(--accent);font-size:0.72rem;">Built with ❤️ by Bhargavi N · First Year CSE · mapmyskills.app</span>
  </div>
</div>

<script>
// ── Back button: tries window.close() then window.history.back() then postMessage ──
function goBack() {
  try {
    if (window.opener && !window.opener.closed) {
      window.close();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  } catch(e) {
    window.close();
  }
}

// ── Download the full report as an .html file ──
function downloadHTMLReport() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const name = '${analysisData.candidateName.replace(/[^a-zA-Z0-9]/g, '_')}';
  a.download = 'MapMySkills_Report_' + name + '_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Animate skill bars on scroll
const bars = document.querySelectorAll('.rpt-skill-bar, .rpt-role-bar-fill');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
}, { threshold: 0.1 });
bars.forEach(b => { b.style.animationPlayState = 'paused'; obs.observe(b); });
</script>
</body>
</html>`;

  return html;
}

// Build a static SVG radar chart for the report
function buildRadarSVG(radarData) {
  if (!radarData || radarData.length === 0) return '<p style="color:var(--muted);text-align:center;padding:2rem;">No radar data</p>';

  const W = 300, H = 300, cx = 150, cy = 150, R = 100;
  const n = radarData.length;
  let svgContent = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;">`;

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(ratio => {
    let points = "";
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      points += `${cx + Math.cos(angle) * R * ratio},${cy + Math.sin(angle) * R * ratio} `;
    }
    svgContent += `<polygon points="${points}" fill="none" stroke="rgba(0,212,200,0.12)" stroke-width="1"/>`;
    svgContent += `<text x="${cx + 3}" y="${cy - R * ratio + 3}" fill="rgba(0,212,200,0.35)" font-size="8" text-anchor="middle">${Math.round(ratio * 100)}%</text>`;
  });

  // Axes
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    svgContent += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(angle) * R}" y2="${cy + Math.sin(angle) * R}" stroke="rgba(0,212,200,0.12)" stroke-width="1"/>`;
  }

  // Required polygon
  let reqPoints = "";
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (d.required / 100) * R;
    reqPoints += `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r} `;
  });
  svgContent += `<polygon points="${reqPoints}" fill="rgba(248,113,113,0.1)" stroke="rgba(248,113,113,0.7)" stroke-width="1.5"/>`;

  // Candidate polygon
  let canPoints = "";
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (d.candidate / 100) * R;
    canPoints += `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r} `;
  });
  svgContent += `<polygon points="${canPoints}" fill="rgba(0,212,200,0.15)" stroke="rgba(0,212,200,0.9)" stroke-width="1.5"/>`;

  // Labels + dots
  radarData.forEach((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rc = (d.candidate / 100) * R;
    const lx = cx + Math.cos(angle) * (R + 24);
    const ly = cy + Math.sin(angle) * (R + 24);
    const anchor = Math.cos(angle) > 0.1 ? "start" : Math.cos(angle) < -0.1 ? "end" : "middle";
    const dy = Math.sin(angle) > 0.1 ? "0.9em" : Math.sin(angle) < -0.1 ? "-0.3em" : "0.35em";

    svgContent += `<text x="${lx}" y="${ly}" fill="rgba(157,188,204,0.9)" font-size="8" font-weight="bold" text-anchor="${anchor}" dy="${dy}">${d.axis}</text>`;
    svgContent += `<circle cx="${cx + Math.cos(angle) * rc}" cy="${cy + Math.sin(angle) * rc}" r="3" fill="#00d4c8"/>`;
  });

  svgContent += `</svg>`;
  return svgContent;
}

// Helper: hex color to rgb string
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "0,212,200";
}

// Open report in new window
function openReportWindow(analysisData, roadmapData, profileKey) {
  const html = generateReportPage(analysisData, roadmapData, profileKey);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  // Keep URL alive longer so download works inside the new tab
  setTimeout(() => URL.revokeObjectURL(url), 300000);
}
