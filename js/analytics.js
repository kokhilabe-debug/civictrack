document.addEventListener("DOMContentLoaded", initAnalytics);

async function initAnalytics() {
  const issues = await getIssues();
  createBarChart("categoryChart", "Issues", countBy(issues, "category"), ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"]);
  createDoughnutChart("statusChart", countBy(issues, "status"), ["#f59e0b", "#2563eb", "#16a34a"]);
  createDoughnutChart("priorityChart", priorityCounts(issues), ["#16a34a", "#f59e0b", "#dc2626"]);
  createBarChart("areaChart", "Issue Count", countBy(issues, "area"), ["#0f766e", "#2563eb", "#9333ea", "#ea580c", "#0891b2"]);
}

function priorityCounts(issues) {
  return issues.reduce((result, issue) => {
    const level = getPriorityLevel(calculatePriority(issue));
    result[level] = (result[level] || 0) + 1;
    return result;
  }, {});
}

function createBarChart(canvasId, label, dataObject, colors) {
  const labels = Object.keys(dataObject);
  const values = Object.values(dataObject);

  new Chart(document.getElementById(canvasId), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: labels.map((_, index) => colors[index % colors.length]),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

function createDoughnutChart(canvasId, dataObject, colors) {
  const labels = Object.keys(dataObject);
  const values = Object.values(dataObject);

  new Chart(document.getElementById(canvasId), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((_, index) => colors[index % colors.length])
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}