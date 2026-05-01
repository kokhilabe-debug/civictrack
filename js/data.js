const STORAGE_KEY = "civictrack_issues";

const fallbackIssues = [
  {
    id: 1,
    title: "Large pothole near bus stop",
    category: "Road",
    area: "MG Road",
    status: "Pending",
    severity: "High",
    latitude: 12.9716,
    longitude: 77.5946,
    reportedDate: "2026-04-20",
    duplicateReports: 8,
    nearSensitivePlace: true,
    description: "A deep pothole is causing traffic slowdown and risk for two-wheelers."
  },
  {
    id: 2,
    title: "Streetlight not working",
    category: "Electricity",
    area: "College Road",
    status: "In Progress",
    severity: "Medium",
    latitude: 12.9752,
    longitude: 77.6001,
    reportedDate: "2026-04-23",
    duplicateReports: 4,
    nearSensitivePlace: true,
    description: "Streetlight near the college gate has not worked for several nights."
  },
  {
    id: 3,
    title: "Garbage overflow near market",
    category: "Waste",
    area: "City Market",
    status: "Pending",
    severity: "High",
    latitude: 12.9659,
    longitude: 77.5862,
    reportedDate: "2026-04-18",
    duplicateReports: 11,
    nearSensitivePlace: false,
    description: "Waste bin is overflowing and causing bad smell near shops."
  }
];

async function getIssues() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  try {
    const response = await fetch("data/issues.json");
    const issues = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    return issues;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackIssues));
    return fallbackIssues;
  }
}

function saveIssues(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

function calculatePriority(issue) {
  const severityValue = {
    Low: 1,
    Medium: 2,
    High: 3
  };

  const reportedDate = new Date(issue.reportedDate);
  const today = new Date();
  const daysOpen = Math.max(0, Math.floor((today - reportedDate) / (1000 * 60 * 60 * 24)));
  const duplicateReports = Number(issue.duplicateReports || 1);
  let score = severityValue[issue.severity] * 22;

  score += Math.min(daysOpen * 1.5, 18);
  score += Math.min(duplicateReports * 3, 24);

  if (issue.nearSensitivePlace) {
    score += 18;
  }

  if (issue.status === "Resolved") {
    score -= 25;
  }

  return Math.max(0, Math.min(Math.round(score), 100));
}

function getPriorityLevel(score) {
  if (score >= 70) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

function getBadgeClass(value) {
  return String(value).toLowerCase().replaceAll(" ", "-");
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] || "Unknown";
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}