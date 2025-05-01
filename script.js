const BASE_URL = "http://127.0.0.1:8000";

// DOM Elements
const uploadSection = document.getElementById("upload");
const mediaSection = document.getElementById("media");
const loginSection = document.getElementById("login");
const registerSection = document.getElementById("register");
const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const mediaGrid = document.getElementById("mediaGrid");
const uploadLink = document.getElementById("uploadLink");

// Show/Hide Sections
loginLink.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
  uploadSection.classList.add("hidden");
});

registerLink.addEventListener("click", () => {
  registerSection.classList.remove("hidden");
  loginSection.classList.add("hidden");
  uploadSection.classList.add("hidden");
});

// Register User
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  if (response.ok) {
    alert("Registration successful! Please login.");
    window.location.href = "login.html"; // Redirect to login page
  } else {
    alert("Registration failed.");
  }
});

// Login User
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.access_token);

    // Decode the token to get the user's role
    const payload = JSON.parse(atob(data.access_token.split(".")[1]));
    updateUI(payload.role);

    alert("Login successful!");
    fetchMedia(); // Refresh the media list
    window.location.href = "index.html"; // Redirect to home page
  } else {
    alert("Login failed.");
  }
});

// Upload Media
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("mediaFile").files[0];
  const title = document.getElementById("mediaTitle").value;
  const caption = document.getElementById("mediaCaption").value;
  const location = document.getElementById("mediaLocation").value;
  const mediaType = document.getElementById("mediaType").value;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("media_type", mediaType);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });

  if (response.ok) {
    alert("Media uploaded successfully!");
    fetchMedia(); // Refresh the media list
  } else {
    alert("Upload failed.");
  }
});

// Check user role and update UI
function updateUI(userRole) {
  if (userRole === "creator") {
    uploadLink.classList.remove("hidden");
  } else {
    uploadLink.classList.add("hidden");
  }
}

// Replace the existing fetchMedia function in script.js
async function fetchMedia() {
  const response = await fetch(`${BASE_URL}/media`);
  const mediaItems = await response.json();
  const mediaGrid = document.getElementById("mediaGrid");
  mediaGrid.innerHTML = mediaItems.map(item => `
    <div class="media-item" data-id="${item.id}">
      <h3>${item.title}</h3>
      ${item.media_type === "photo" ? `<img src="${item.url}" alt="${item.title}">` : `<video src="${item.url}" controls></video>`}
      <div class="comment-section">
        <h4>Comments</h4>
        ${item.comments.map(comment => `
          <div class="comment">
            <p><strong>User ${comment.user_id}:</strong> ${comment.content}</p>
          </div>
        `).join("")}
        <textarea placeholder="Add a comment"></textarea>
        <button class="btn" onclick="addComment(${item.id})">Comment</button>
      </div>
      <div class="rating-section">
        <h4>Ratings</h4>
        <p>Average Rating: ${item.ratings.length > 0 ? (item.ratings.reduce((sum, rating) => sum + rating.rating, 0) / item.ratings.length).toFixed(1) : "No ratings yet"}</p>
        <div class="stars">
          ${[1, 2, 3, 4, 5].map(star => `
            <span onclick="rateMedia(${item.id}, ${star})">⭐</span>
          `).join("")}
        </div>
      </div>
    </div>
  `).join("");
}
fetchMedia();

async function addComment(mediaId) {
  const commentText = document.querySelector(`.media-item[data-id="${mediaId}"] textarea`).value;
  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to add a comment.");
    return;
  }

  const response = await fetch(`${BASE_URL}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      media_id: mediaId,
      content: commentText
    })
  });

  if (response.ok) {
    alert("Comment added successfully!");
    fetchMedia(); // Refresh the media list
  } else {
    alert("Failed to add comment.");
  }
}

async function rateMedia(mediaId, rating) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to rate media.");
    return;
  }

  const response = await fetch(`${BASE_URL}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      media_id: mediaId,
      rating: rating
    })
  });

  if (response.ok) {
    alert("Rating added successfully!");
    fetchMedia(); // Refresh the media list
  } else {
    alert("Failed to add rating.");
  }
}

// Rate Media
async function rateMedia(mediaId, rating) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to rate media.");
    return;
  }

  const response = await fetch(`${BASE_URL}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      media_id: mediaId,
      rating: rating
    })
  });

  if (response.ok) {
    alert("Rating added successfully!");
    fetchMedia(); // Refresh the media list
  } else {
    alert("Failed to add rating.");
  }
}

// Fetch and display media when the page loads
fetchMedia();

// Add this to script.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    updateUI(payload.role); // Show/hide the Upload link based on the role
  } else {
    updateUI(null); // Hide the Upload link
  }

  fetchMedia(); // Fetch and display media when the page loads
});