// ============================================================
// MapMySkills — Job Profiles Database
// 16 career domains with skills, radar axes, and role maps
// ============================================================

const JOB_PROFILES = {
  "software-developer": {
    label: "Software Developer",
    domain: "IT",
    icon: "💻",
    color: "#00d4c8",
    radarAxes: ["Programming", "Frameworks", "Databases", "DevOps", "System Design", "Soft Skills"],
    coreSkills: ["JavaScript", "Python", "Java", "C++", "Data Structures", "Algorithms", "Git", "REST APIs"],
    keywords: ["developer", "software", "engineer", "programming", "code", "coding", "backend", "fullstack", "full stack", "full-stack"],
    roles: ["Backend Developer", "Full Stack Engineer", "Junior Software Engineer", "Systems Programmer", "API Developer"],
    tip: "Focus on DSA, system design, and one solid backend language."
  },
  "data-analyst": {
    label: "Data Analyst",
    domain: "Data Science",
    icon: "📊",
    color: "#0ea5ea",
    radarAxes: ["Statistics", "SQL/Databases", "Python/R", "Visualization", "ML Basics", "Domain Knowledge"],
    coreSkills: ["SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics", "Data Cleaning", "Machine Learning"],
    keywords: ["data analyst", "data science", "analytics", "business intelligence", "bi analyst", "machine learning", "ml", "ai", "data engineer"],
    roles: ["Data Analyst", "Business Intelligence Analyst", "Junior Data Scientist", "Reporting Analyst", "BI Developer"],
    tip: "Master SQL and storytelling with data — they're non-negotiable."
  },
  "civil-engineer": {
    label: "Civil Engineer",
    domain: "Engineering",
    icon: "🏗️",
    color: "#f59e0b",
    radarAxes: ["Structural Design", "AutoCAD/Software", "Project Mgmt", "Site Knowledge", "Regulations", "Reporting"],
    coreSkills: ["AutoCAD", "Structural Analysis", "STAAD.Pro", "Project Management", "Surveying", "Concrete Design", "Road Design", "BOQ"],
    keywords: ["civil engineer", "structural", "construction", "infrastructure", "site engineer", "project engineer", "geotechnical", "highway"],
    roles: ["Site Engineer", "Structural Designer", "Project Engineer", "Survey Engineer", "Junior Civil Engineer"],
    tip: "AutoCAD + site experience + IS/IRC code knowledge is the winning combo."
  },
  "doctor": {
    label: "Doctor / Medical",
    domain: "Medical",
    icon: "🩺",
    color: "#34d399",
    radarAxes: ["Clinical Knowledge", "Diagnostics", "Patient Care", "Procedures", "Research/EBM", "Communication"],
    coreSkills: ["Clinical Diagnosis", "Patient History", "Pharmacology", "Surgery Basics", "EMR Systems", "Evidence-Based Medicine", "Communication", "Emergency Care"],
    keywords: ["doctor", "physician", "medical", "mbbs", "md", "surgeon", "clinical", "hospital", "healthcare", "resident", "intern"],
    roles: ["General Physician", "Medical Resident", "Junior Doctor", "Clinical Associate", "Medical Officer"],
    tip: "Clinical rotations + strong communication + up-to-date guidelines = success."
  },
  "chartered-accountant": {
    label: "Chartered Accountant",
    domain: "Finance",
    icon: "📈",
    color: "#a78bfa",
    radarAxes: ["Accounting Standards", "Taxation", "Audit", "Financial Reporting", "ERP/Tools", "Analytical Skills"],
    coreSkills: ["IFRS/GAAP", "Income Tax", "GST", "Tally ERP", "SAP FICO", "Financial Statements", "Audit", "Cost Accounting"],
    keywords: ["chartered accountant", "ca", "accountant", "accounting", "audit", "finance", "taxation", "cpa", "cfa", "financial analyst"],
    roles: ["CA / CPA", "Financial Analyst", "Tax Consultant", "Audit Associate", "Finance Manager"],
    tip: "Deep GST/IFRS knowledge + ERP experience is the shortcut to senior roles."
  },
  "ias-officer": {
    label: "IAS / Government Officer",
    domain: "Government/Public Service",
    icon: "🏛️",
    color: "#fb923c",
    radarAxes: ["General Knowledge", "Policy Analysis", "Administration", "Communication", "Ethics & Integrity", "Leadership"],
    coreSkills: ["Constitutional Law", "Public Administration", "Policy Writing", "Indian Polity", "Economics", "Report Writing", "Leadership", "Ethics"],
    keywords: ["ias", "ips", "upsc", "government", "civil service", "bureaucrat", "public service", "collector", "sdm", "district"],
    roles: ["IAS Officer", "IPS Officer", "State Civil Services", "Government Administrator", "Policy Analyst"],
    tip: "Strong current affairs + essay writing + ethics preparation = UPSC success."
  },
  "digital-marketer": {
    label: "Digital Marketing Specialist",
    domain: "Marketing",
    icon: "📣",
    color: "#f472b6",
    radarAxes: ["SEO/SEM", "Social Media", "Content Strategy", "Analytics", "Email/Automation", "Paid Ads"],
    coreSkills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Google Analytics", "Email Marketing", "Copywriting", "Social Media Management"],
    keywords: ["digital marketing", "marketing", "seo", "sem", "social media", "content", "ads", "ppc", "growth", "brand"],
    roles: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager", "Content Strategist", "PPC Analyst"],
    tip: "Data-driven thinking + platform certifications (Google, Meta) = rapid growth."
  },
  "graphic-designer": {
    label: "Graphic Designer",
    domain: "Creative/Design",
    icon: "🎨",
    color: "#c084fc",
    radarAxes: ["Design Tools", "Typography", "Color Theory", "Branding", "UI/UX Basics", "Communication"],
    coreSkills: ["Adobe Photoshop", "Illustrator", "Figma", "InDesign", "Typography", "Color Theory", "Branding", "Motion Design"],
    keywords: ["graphic designer", "designer", "ui designer", "ux designer", "visual designer", "brand designer", "creative", "motion designer"],
    roles: ["Graphic Designer", "Visual Designer", "Brand Designer", "Junior UI Designer", "Creative Executive"],
    tip: "A stunning portfolio beats any certificate — build 5 case studies."
  },
  "teacher": {
    label: "Teacher / Professor",
    domain: "Education",
    icon: "📚",
    color: "#4ade80",
    radarAxes: ["Subject Mastery", "Pedagogy", "Communication", "Curriculum Design", "Tech Tools", "Research"],
    coreSkills: ["Subject Expertise", "Lesson Planning", "Classroom Management", "Communication", "Assessment Design", "Ed-Tech Tools", "Research", "Mentoring"],
    keywords: ["teacher", "professor", "lecturer", "educator", "faculty", "tutor", "academic", "school", "college", "university", "instructor"],
    roles: ["School Teacher", "College Lecturer", "Online Tutor", "Academic Coordinator", "Education Consultant"],
    tip: "Subject depth + student engagement + digital teaching tools = career gold."
  },
  "lawyer": {
    label: "Lawyer / Legal Professional",
    domain: "Legal",
    icon: "⚖️",
    color: "#94a3b8",
    radarAxes: ["Legal Research", "Drafting", "Litigation", "Domain Law", "Communication", "Ethics"],
    coreSkills: ["Legal Research", "Contract Drafting", "Litigation", "Corporate Law", "IPR", "Communication", "Negotiation", "Legal Databases"],
    keywords: ["lawyer", "advocate", "attorney", "legal", "law", "litigation", "corporate law", "counsel", "barrister", "solicitor"],
    roles: ["Associate Advocate", "Corporate Lawyer", "Legal Counsel", "Paralegal", "IPR Specialist"],
    tip: "Specialization (corporate, IPR, criminal) + strong drafting skills = fast growth."
  },
  "mechanical-engineer": {
    label: "Mechanical Engineer",
    domain: "Engineering",
    icon: "⚙️",
    color: "#60a5fa",
    radarAxes: ["CAD/CAM", "Thermodynamics", "Manufacturing", "Materials", "Project Mgmt", "Problem Solving"],
    coreSkills: ["SolidWorks", "AutoCAD", "ANSYS", "GD&T", "Manufacturing Processes", "Thermodynamics", "Quality Control", "Lean Manufacturing"],
    keywords: ["mechanical engineer", "mechanical", "manufacturing", "production", "design engineer", "product engineer", "automotive", "HVAC", "aerospace"],
    roles: ["Design Engineer", "Production Engineer", "Quality Engineer", "Maintenance Engineer", "R&D Engineer"],
    tip: "SolidWorks + ANSYS + any manufacturing domain expertise = industry-ready."
  },
  "cybersecurity": {
    label: "Cybersecurity Analyst",
    domain: "IT/Security",
    icon: "🔐",
    color: "#f87171",
    radarAxes: ["Network Security", "Threat Analysis", "Tools/SIEM", "Ethical Hacking", "Compliance", "Incident Response"],
    coreSkills: ["Network Security", "SIEM Tools", "Ethical Hacking", "Penetration Testing", "Firewalls", "Python Scripting", "OWASP", "ISO 27001"],
    keywords: ["cybersecurity", "security analyst", "ethical hacker", "penetration tester", "soc analyst", "infosec", "network security", "cloud security"],
    roles: ["SOC Analyst", "Penetration Tester", "Security Engineer", "Incident Responder", "Cloud Security Analyst"],
    tip: "CEH or CompTIA Security+ + hands-on labs (HackTheBox, TryHackMe) = credibility."
  },
  "journalist": {
    label: "Journalist / Media Professional",
    domain: "Media & Communication",
    icon: "📰",
    color: "#fbbf24",
    radarAxes: ["Writing/Editing", "Research", "Storytelling", "Digital Tools", "Ethics", "Domain Knowledge"],
    coreSkills: ["News Writing", "Investigative Research", "Editing", "Video Production", "Social Media", "SEO for News", "Interviewing", "AP Style"],
    keywords: ["journalist", "reporter", "editor", "media", "news", "content writer", "correspondent", "broadcast", "news anchor", "copywriter"],
    roles: ["News Reporter", "Content Writer", "Digital Journalist", "Copy Editor", "Feature Writer"],
    tip: "Strong beat knowledge + digital media skills + real published clips = your portfolio."
  },
  "architect": {
    label: "Architect",
    domain: "Construction/Design",
    icon: "🏛️",
    color: "#e879f9",
    radarAxes: ["Design Creativity", "Technical Drawing", "Software Tools", "Project Mgmt", "Regulations", "Client Communication"],
    coreSkills: ["AutoCAD", "Revit", "SketchUp", "3D Rendering", "Construction Documents", "Building Codes", "Project Management", "Site Supervision"],
    keywords: ["architect", "architecture", "architectural designer", "urban planner", "interior designer", "landscape architect", "building designer"],
    roles: ["Junior Architect", "Architectural Designer", "Project Architect", "Interior Designer", "Urban Planner"],
    tip: "Portfolio + BIM software (Revit) + site experience = the industry trifecta."
  },
  "entrepreneur": {
    label: "Entrepreneur / Business",
    domain: "Business",
    icon: "🚀",
    color: "#fb7185",
    radarAxes: ["Business Strategy", "Finance/Funding", "Marketing", "Leadership", "Tech Literacy", "Resilience"],
    coreSkills: ["Business Planning", "Financial Modelling", "Marketing Strategy", "Product Thinking", "Team Building", "Pitching", "Legal Basics", "Customer Discovery"],
    keywords: ["entrepreneur", "startup", "founder", "business owner", "venture", "ceo", "coo", "product manager", "product owner", "business development"],
    roles: ["Startup Founder", "Product Manager", "Business Development Manager", "Venture Analyst", "Growth Hacker"],
    tip: "Validate before you build — customer discovery is your most underrated skill."
  },
  "web-developer": {
    label: "Web Developer",
    domain: "IT (Frontend & Backend)",
    icon: "🌐",
    color: "#38bdf8",
    radarAxes: ["Frontend (HTML/CSS/JS)", "Frameworks (React/Vue)", "Backend (Node/Python)", "Databases", "DevOps/Deployment", "Performance & SEO"],
    coreSkills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Express", "SQL", "MongoDB", "Git", "REST APIs", "TypeScript", "Tailwind CSS"],
    keywords: ["web developer", "web development", "frontend", "backend", "full stack", "react developer", "node developer", "django", "laravel", "next.js", "nuxt"],
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "React Developer", "Node.js Developer"],
    tip: "Ship real projects — a deployed app speaks louder than 10 certificates."
  }
};

// Detect job domain from job description text
function detectJobDomain(jobDescText) {
  const text = (jobDescText || "").toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, profile] of Object.entries(JOB_PROFILES)) {
    let score = 0;
    for (const kw of profile.keywords) {
      if (text.includes(kw)) score += kw.split(" ").length; // multi-word = more weight
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = key;
    }
  }

  return bestScore > 0 ? bestMatch : "software-developer"; // default
}

// Get profile by key
function getJobProfile(key) {
  return JOB_PROFILES[key] || JOB_PROFILES["software-developer"];
}

// Build AI prompt tailored to job domain
function buildAnalysisPrompt(resumeText, jobDesc, githubContext, profileKey) {
  const profile = getJobProfile(profileKey);

  return `You are an expert career analyst specializing in the ${profile.domain} industry. Analyze this resume against the job description and return ONLY valid JSON (no markdown, no explanation).

CAREER DOMAIN: ${profile.label} (${profile.domain})
RESUME TEXT:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDesc.substring(0, 2000)}

${githubContext ? "GITHUB PROFILE:\n" + githubContext : ""}

Return this EXACT JSON structure — all fields required:
{
  "candidateName": "<extract full name from resume, or 'Candidate' if not found>",
  "detectedDomain": "${profile.label}",
  "matchScore": <integer 0-100>,
  "summary": "<2-sentence summary of the candidate's fit for this ${profile.label} role>",
  "experienceLevel": "<Fresher|Junior|Mid-Level|Senior|Expert>",
  "strengths": [{"skill":"<skill name>","level":"Expert|Strong|Good","note":"<brief evidence from resume>"}],
  "gaps": [{"skill":"<skill name>","priority":"High|Medium|Low","note":"<why it's needed for this ${profile.label} role>"}],
  "partialMatches": [{"skill":"<skill name>","resumeLevel":"<current level>","requiredLevel":"<needed level>"}],
  "radarData": [
    {"axis":"${profile.radarAxes[0]}","candidate":<0-100>,"required":<0-100>},
    {"axis":"${profile.radarAxes[1]}","candidate":<0-100>,"required":<0-100>},
    {"axis":"${profile.radarAxes[2]}","candidate":<0-100>,"required":<0-100>},
    {"axis":"${profile.radarAxes[3]}","candidate":<0-100>,"required":<0-100>},
    {"axis":"${profile.radarAxes[4]}","candidate":<0-100>,"required":<0-100>},
    {"axis":"${profile.radarAxes[5]}","candidate":<0-100>,"required":<0-100>}
  ],
  "jobRoles": [
    {"role":"<specific job title>","fit":<0-100>,"icon":"<relevant emoji>","reason":"<1 sentence why>"}
  ],
  "keyMissingSkills": ["<skill1>","<skill2>","<skill3>","<skill4>"],
  "domainInsight": "<1 specific insight about this candidate in the ${profile.domain} job market>",
  "salaryRange": "<realistic entry/mid salary range in INR for ${profile.label} in India>",
  "topCertifications": ["<cert1>","<cert2>","<cert3>"]
}

Rules:
- strengths: 3-6 skills the resume clearly demonstrates for ${profile.label}
- gaps: 3-7 skills missing or weak for this specific ${profile.label} role
- partialMatches: 2-4 partially developed skills
- jobRoles: 4-5 realistic roles based on the candidate's actual profile
- radarData: use the exact axis names provided above
- Be domain-specific — don't give generic tech advice for a ${profile.label} role
- salaryRange: be realistic for Indian job market 2025`;
}

// Build roadmap prompt for job domain
function buildRoadmapPrompt(analysisData, profileKey) {
  const profile = getJobProfile(profileKey);
  const gaps = (analysisData.gaps || []).map(g => g.skill).join(", ");

  return `You are a career coach specializing in ${profile.domain}. Create a personalized 30-day learning roadmap.

Candidate: ${analysisData.candidateName}
Role Target: ${profile.label}
Skill Gaps: ${gaps}
Match Score: ${analysisData.matchScore}%
Experience Level: ${analysisData.experienceLevel || "Junior"}

Return ONLY valid JSON:
{
  "title": "<Personalized title with candidate name and target role>",
  "totalWeeks": 5,
  "weeks": [
    {
      "weekRange": "Week 1–2",
      "topic": "<specific skill/topic for ${profile.label}>",
      "description": "<2-3 sentence actionable plan>",
      "skills": ["<skill1>","<skill2>"],
      "hoursPerWeek": <8-15>,
      "project": "<concrete mini-project or practical exercise for ${profile.domain}>",
      "tasks": ["<specific task 1>","<specific task 2>","<specific task 3>","<specific task 4>"],
      "resources": [
        {"title":"<resource name>","url":"<real URL>","type":"free|paid","icon":"📘|▶️|🎓|🐙|📗|🔗"}
      ]
    }
  ]
}

Generate 4-5 weeks, covering each gap. Use real, domain-specific resources (Coursera, official docs, YouTube channels, books relevant to ${profile.label}). Be practical — no generic advice.`;
}
