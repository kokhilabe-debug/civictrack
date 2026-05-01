document.addEventListener("DOMContentLoaded", initIssuesPage);

let allIssues = [];

async function initIssuesPage() {
  allIssues = await getIssues();
  renderIssues(allIssues);

  ["searchInput", "categoryFilter", "statusFilter", "severityFilter"].forEach(id => {
    document.getElementById(id).addEventListener("input", applyFilters);
  });
}

function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;
  const severity = document.getElementById("severityFilter").value;

  const filtered = allIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search) || issue.area.toLowerCase().includes(search);
    const matchesCategory = category === "All" || issue.category === category;
    const matchesStatus = status === "All" || issue.status === status;
    const matchesSeverity = severity === "All" || issue.severity === severity;

    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  renderIssues(filtered);
}

function renderIssues(issues) {
  const issueList = document.getElementById("issueList");

  if (!issues.length) {
    issueList.innerHTML = `<p class="empty-state">No issues found for the selected filters.</p>`;
    return;
  }

  issueList.innerHTML = issues.map(issue => {
    const score = calculatePriority(issue);
    const level = getPriorityLevel(score);

    return `
      <article class="issue-row">
        <div>
          <h2>${issue.title}</h2>
          <p>${issue.description}</p>
          <div class="tags">
            <span>${issue.area}</span>
            <span>${issue.category}</span>
            <span>${issue.reportedDate}</span>
          </div>
        </div>
        <div class="issue-side">
          <span class="badge ${getBadgeClass(issue.status)}">${issue.status}</span>
          <span class="badge ${getBadgeClass(issue.severity)}">${issue.severity}</span>
          <strong>Score ${score}</strong>
          <small>${level} Priority</small>
        </div>
      </article>
    `;
  }).join("");
}