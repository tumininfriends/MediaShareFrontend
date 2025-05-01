const BASE_URL = "http://127.0.0.1:8000";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("mediaFile").files[0];
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });

  if (response.ok) {
    alert("Media uploaded successfully!");
    window.location.href = "index.html"; // Redirect to home page
  } else {
    alert("Upload failed.");
  }
});