# MapMySkills — AI Career Skill Gap Analyzer

<div align="center">

![MapMySkills Banner](https://img.shields.io/badge/MapMySkills-AI%20Career%20Analyzer-00d4c8?style=for-the-badge&logo=sparkles&logoColor=white)

[![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)](https://github.com/bhargavi2048-boop)
[![No Backend](https://img.shields.io/badge/Backend-None%20Required-blue?style=flat-square)](.)
[![Powered By](https://img.shields.io/badge/Powered%20By-Claude%20AI-orange?style=flat-square)](https://anthropic.com)
[![Domains](https://img.shields.io/badge/Career%20Domains-16+-purple?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](.)

**An AI-powered, zero-backend web app that analyzes your resume against any job description, identifies skill gaps, and generates a personalized week-by-week learning roadmap — all in your browser.**

Demo Link : "https://bhargavi2048-boop.github.io/MapMySkills/"                           
Demo Video : "https://drive.google.com/file/d/1cfuOMLU9RmPErGRxR4HLwdFLjJimHJ8J/view?usp=sharing"

*Built by [Bhargavi N](https://www.linkedin.com/in/bhargavi-nagaraj-967811381) · First Year CSE Student*

</div>

---

## What Is MapMySkills?

MapMySkills is a client-side AI tool for students and early-career professionals. Paste your resume and a job description, and within seconds the app will tell you exactly where you stand — what skills you have, what's missing, how you compare to the job's requirements, and what to learn next.

No account. No server. No backend. Just open `index.html` and go.

---

## Features

### Core Analysis
- **AI Skill Gap Analysis** — Compares your resume against any job description using Claude AI, identifying strengths, critical gaps, and partial matches
- **Match Score** — An animated percentage score showing how well your current profile fits the target role
- **Experience Level Detection** — Automatically classifies your profile as Junior, Mid-level, or Senior based on your resume
- **Salary Range Estimation** — Market salary insight based on your domain and level

### Results Page
- **Animated Score Ring** — SVG ring that draws and counts up to your match score on load
- **4-Stat Summary** — Strengths, Gaps, Partial Matches, and Role Fits at a glance
- **Skill Radar Chart** — Visual spider chart overlaying your skills vs. the job's requirements
- **Side-by-Side Skills Grid** — Color-coded strengths vs. gaps with animated row reveals
- **Priority Skills Pills** — Key missing skills highlighted for quick action
- **Certification Recommendations** — Suggested certifications tailored to your domain
- **Best-Fit Job Roles** — Ranked role matches with animated progress bars and fit percentages

### Roadmap Generator
- **Personalized Weekly Roadmap** — AI-generated week-by-week study plan to close your skill gaps
- **Mini Projects** — Each week includes a hands-on project to build real experience
- **Resource Links** — Curated free and paid learning resources per week
- **Time Estimates** — Hours-per-week guidance for realistic planning
- **Module Progress Bars** — Visual progress tracking per roadmap module

### Extras
- **GitHub Integration** — Optionally link your GitHub to enrich analysis with real project data
- **PDF Resume Upload** — Drag-and-drop PDF parsing with automatic text extraction
- **Voice Explainer** — Text-to-speech summary of your results
- **What-If Simulator** — See how adding a new skill would affect your match score
- **Company Match** — Estimate your fit at a specific company
- **Share Results** — One-click shareable text summary of your analysis
- **Full HTML Report** — Download a complete, formatted career report as a standalone `.html` file
- **Auto Domain Detection** — AI automatically identifies the right career domain from your job description

### Supported Career Domains

| Domain | Domain | Domain | Domain |
|---|---|---|---|
| 💻 Software Developer | 📊 Data Analyst | 🌐 Web Developer | 🔐 Cybersecurity Analyst |
| 🏗️ Civil Engineer | ⚙️ Mechanical Engineer | 🏛️ Architect | 🚀 Entrepreneur / Business |
| 🩺 Doctor / Medical | ⚖️ Lawyer / Legal | 📐 Chartered Accountant | 🎓 Teacher / Professor |
| 🏛️ IAS / Government | 📣 Digital Marketing | 🎨 Graphic Designer | 📰 Journalist / Media |

---

## Getting Started

### Prerequisites
- Any modern browser (Chrome, Firefox, Edge, or Safari)
- An internet connection (for the Claude AI API calls)
- That's it.

### Running Locally

```bash
# Clone or download the project
git clone https://github.com/bhargavi2048-boop/mapmyskills.git

# Navigate into the folder
cd MapMySkills

# Open in your browser
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

Or simply double-click `index.html`. No `npm install`. No build step. No server.

### Usage

1. **Select your career domain** — or let the app auto-detect it from your job description
2. **Add your resume** — paste text directly or upload a PDF (up to 10MB, up to 6 pages extracted)
3. **Paste the job description** — the more detailed, the better the analysis
4. **Optionally add your GitHub URL** — enhances analysis with real project data
5. **Click "Analyze My Skills →"** — AI processes your input (takes ~5–10 seconds)
6. **Review your Results page** — explore your match score, skill radar, and role fits
7. **Click "Generate Roadmap →"** — get your personalized week-by-week learning plan
8. **Click "Open Report →"** — download a full career analysis as an HTML file

---

## Project Structure

```
MapMySkills/
│
├── index.html                  ← Single-page application (all pages live here)
│
├── css/
│   └── main.css                ← All styles: layout, components, animations,
│                                  dark theme, responsive breakpoints
│
├── js/
│   ├── job-profiles.js         ← 16 career domain definitions (skills, radar
│   │                              axes, roles, salary ranges, certifications)
│   │
│   ├── app.js                  ← Core application logic:
│   │                              - Page navigation & tab switching
│   │                              - Resume paste / PDF upload
│   │                              - GitHub data fetching
│   │                              - AI analysis (Claude API)
│   │                              - Results rendering with animations
│   │                              - Roadmap generation & rendering
│   │                              - Voice, What-If, Company Match, Share
│   │                              - Contact form
│   │
│   └── report-generator.js     ← Full report builder:
│                                  opens a formatted report window,
│                                  print-to-PDF and save-as-HTML support
│
└── README.md
```

---

## How It Works

```
User Input (Resume + JD + GitHub)
          │
          ▼
  Domain Auto-Detection
  (keyword matching in job-profiles.js)
          │
          ▼
  Claude AI — Analysis Call
  (buildAnalysisPrompt → /v1/messages)
          │
          ▼
  JSON Response Parsed:
  matchScore, strengths, gaps,
  partialMatches, radarData, jobRoles,
  salary, certifications
          │
          ▼
  Results Page Rendered
  (animated score ring, radar chart,
   skill rows, role fit bars)
          │
          ▼
  User clicks "Generate Roadmap →"
          │
          ▼
  Claude AI — Roadmap Call
  (buildRoadmapPrompt → /v1/messages)
          │
          ▼
  Weekly Plan Rendered
  (tasks, projects, resources, timers)
          │
          ▼
  Optional: Full Report Window
  (report-generator.js)
```

All AI calls go directly from the browser to `api.anthropic.com/v1/messages`. There is no intermediate server.

---

## Customization

### Adding a New Career Domain

Open `js/job-profiles.js` and add an entry to the `JOB_PROFILES` object:

```javascript
"your-domain-key": {
  label: "Your Domain Name",
  icon: "🎯",
  domain: "Domain Category",
  coreSkills: ["Skill A", "Skill B", "Skill C", ...],
  radarAxes: ["Axis 1", "Axis 2", "Axis 3", "Axis 4", "Axis 5", "Axis 6"],
  roles: ["Role Title 1", "Role Title 2", "Role Title 3"],
  salaryRange: "₹X–Y LPA"
}
```

### Changing the Contact Email

In `js/app.js`, search for `bharkavi1878@gmail.com` and replace with your address.

### Swapping the AI Model

In `js/app.js`, find the `fetch` calls to `/v1/messages` and change the `model` field:

```javascript
model: "claude-opus-4-20250514"  // More powerful, slower
model: "claude-sonnet-4-20250514" // Default — balanced
model: "claude-haiku-4-5-20251001" // Fastest, lightest
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (single file, multi-page via class toggling) |
| Styling | Vanilla CSS3 (custom properties, grid, flexbox, keyframe animations) |
| Logic | Vanilla JavaScript (ES2020+, async/await, Fetch API) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| PDF Parsing | PDF.js (`cdnjs`, v3.11.174) |
| Charts | HTML5 Canvas (custom radar chart, no Chart.js dependency) |
| Voice | Web Speech API (browser-native) |
| Fonts | Google Fonts (served via CDN) |
| Hosting | Any static host — GitHub Pages, Netlify, Vercel, or local file |

**Zero npm packages. Zero build tools. Zero server.**

---

## Deployment

Since MapMySkills is a pure static site, you can host it anywhere:

**GitHub Pages**
```bash
# Push to a repo, then enable GitHub Pages in Settings → Pages
# Point it to the root of your branch
```

**Netlify**
```
Drag the MapMySkills/ folder into netlify.com/drop
Done — live in seconds.
```

**Vercel**
```bash
npx vercel --prod
```

**Local network sharing**
```bash
# Python simple server
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full (Voice may vary) |

---

## Known Limitations

- **API Key** — The Anthropic API key must be present in the environment. This app is intended to be run in environments where the key is injected (e.g., Claude.ai artifacts, internal tools). Do not expose a raw API key in public deployments.
- **PDF Extraction** — Complex multi-column or image-heavy PDFs may not extract cleanly. Use the paste option as a fallback.
- **Voice** — The Web Speech API is browser-native and may behave differently across devices.
- **GitHub Rate Limits** — GitHub's public API allows 60 unauthenticated requests/hour per IP.

---

## Roadmap (Project)

- [ ] User authentication + saved analyses
- [ ] LinkedIn profile URL parsing
- [ ] Multi-resume comparison mode
- [ ] Progress tracker — mark roadmap tasks as complete
- [ ] Email report delivery
- [ ] Dark/light theme toggle
- [ ] More languages and regional salary data

---

## Author

**Bhargavi N**
First Year B.E. Computer Science · Passionate about AI and career tools

[![LinkedIn](https://img.shields.io/badge/LinkedIn-bhargavi--nagaraj-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/bhargavi-nagaraj-967811381)
[![GitHub](https://img.shields.io/badge/GitHub-bhargavi2048--boop-181717?style=flat-square&logo=github)](https://github.com/bhargavi2048-boop)
[![Email](https://img.shields.io/badge/Email-bhargavi2048%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:bhargavi2048@gmail.com)

---

## License

This project is open source under the [MIT License](LICENSE).

You are free to use, modify, and distribute this project. Attribution appreciated but not required.

---

<div align="center">

Made with ☕ and late nights by Bhargavi N

*"Every expert was once a beginner who knew their gaps."*

</div>
