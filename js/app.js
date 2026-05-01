document.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  const issues = await getIssues();
  renderStats(issues);
  renderPriorityList(issues);
  renderMap(issues);
}

function renderStats(issues) {
  const total = issues.length;
  const pending = issues.filter(issue => issue.status === "Pending").length;
  const resolved = issues.filter(issue => issue.status === "Resolved").length;
  const highPriority = issues.filter(issue => getPriorityLevel(calculatePriority(issue)) === "High").length;

  const stats = [
    { label: "Total Issues", value: total },
    { label: "Pending", value: pending },
    { label: "Resolved", value: resolved },
    { label: "High Priority", value: highPriority }
  ];

  document.getElementById("statsGrid").innerHTML = stats.map(stat => `
    <article class="stat-card">
      <span>${stat.label}</span>
      <strong>${stat.value}</strong>
    </article>
  `).join("");
}

function renderPriorityList(issues) {
  const list = [...issues]
    .map(issue => ({ ...issue, priorityScore: calculatePriority(issue) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  document.getElementById("priorityList").innerHTML = list.map(issue => `
    <article class="issue-card">
      <div>
        <h3>${issue.title}</h3>
        <p>${issue.area} • ${issue.category}</p>
      </div>
      <div class="card-meta">
        <span class="badge ${getBadgeClass(getPriorityLevel(issue.priorityScore))}">${getPriorityLevel(issue.priorityScore)}</span>
        <strong>${issue.priorityScore}</strong>
      </div>
    </article>
  `).join("");
}

function renderMap(issues) {
  const map = L.map("map").setView([13.0827, 80.2707], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  issues.forEach(issue => {
    const score = calculatePriority(issue);
    const level = getPriorityLevel(score);
    const color = level === "High" ? "#dc2626" : level === "Medium" ? "#f59e0b" : "#16a34a";

    const marker = L.circleMarker([issue.latitude, issue.longitude], {
      radius: 9,
      color,
      fillColor: color,
      fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(`
      <strong>${issue.title}</strong><br>
      ${issue.area}<br>
      Status: ${issue.status}<br>
      Priority Score: ${score}
    `);
  });
}