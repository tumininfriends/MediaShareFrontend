const BASE_URL = "http://127.0.0.1:8000";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const role = document.getElementById("registerRole").value;

  if (!username || !password || !role) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert(`Registration failed: ${data.detail || "Unknown error"}`);
    } else {
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Registration Error:", error);
    alert("Failed to connect to the server. Please try again later.");
  }
});
