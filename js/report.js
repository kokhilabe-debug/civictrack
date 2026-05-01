document.addEventListener("DOMContentLoaded", initReportForm);

function initReportForm() {
  const form = document.getElementById("issueForm");
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("imagePreview");
  const successMessage = document.getElementById("successMessage");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) {
      preview.innerHTML = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    preview.innerHTML = `<img src="${imageUrl}" alt="Selected issue preview">`;
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const issues = await getIssues();
    const newIssue = {
      id: Date.now(),
      title: document.getElementById("title").value.trim(),
      category: document.getElementById("category").value,
      area: document.getElementById("area").value.trim(),
      status: "Pending",
      severity: document.getElementById("severity").value,
      latitude: Number(document.getElementById("latitude").value),
      longitude: Number(document.getElementById("longitude").value),
      reportedDate: new Date().toISOString().slice(0, 10),
      duplicateReports: Number(document.getElementById("duplicateReports").value),
      nearSensitivePlace: document.getElementById("nearSensitivePlace").checked,
      description: document.getElementById("description").value.trim()
    };

    issues.unshift(newIssue);
    saveIssues(issues);

    form.reset();
    preview.innerHTML = "";
    successMessage.textContent = "Issue submitted successfully. It is now visible in dashboard and issue list.";
  });
}