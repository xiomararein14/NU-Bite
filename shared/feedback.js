const FEEDBACK_KEY = "feedback";

const RATING_CATEGORIES = [
  { key: "service", label: "Service" },
  { key: "foodQuality", label: "Food Quality" },
  { key: "system", label: "NU Bite System" },
  { key: "ambiance", label: "Ambiance" }
];

function getFeedbacks() {
  return JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || [];
}

function saveFeedbacks(list) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
}

function starsDisplay(value) {
  if (typeof starsHtml === "function") return starsHtml(value);
  const n = Math.round(Number(value)) || 0;
  return `${n}/5`;
}

function averageRating(ratings) {
  const values = RATING_CATEGORIES.map(c => Number(ratings[c.key])).filter(v => v > 0);
  if (!values.length) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function mountFeedbackForm(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || mount.dataset.mounted === "true") return;

  const role = mount.dataset.role || "Guest";

  const ratingRows = RATING_CATEGORIES.map(cat => `
    <div class="rating-row">
      <span class="rating-label">${cat.label}</span>
      <div class="star-rating" data-category="${cat.key}">
        ${[5, 4, 3, 2, 1].map(n => `
          <input type="radio" id="${cat.key}-${n}" name="rating-${cat.key}" value="${n}" required>
          <label for="${cat.key}-${n}" title="${n} star${n > 1 ? "s" : ""}">${typeof icon === "function" ? icon("star", "icon") : ""}</label>
        `).join("")}
      </div>
    </div>
  `).join("");

  mount.innerHTML = `
    <div class="feedback-page">
      <div class="feedback-card">
        <h1>Share Your Feedback</h1>
        <p class="feedback-intro">Help us improve! Share your insights about our service, food quality, the NU Bite system, ambiance, and your overall experience.</p>
        <form id="feedbackForm">
          <div class="feedback-field">
            <label for="feedbackName">Your Name (optional)</label>
            <input type="text" id="feedbackName" placeholder="Enter your name or leave blank">
          </div>
          <div class="feedback-field">
            <label>Rate your experience</label>
            ${ratingRows}
          </div>
          <div class="feedback-field">
            <label for="feedbackMessage">Additional insights</label>
            <textarea id="feedbackMessage" placeholder="Tell us more about your experience — what went well, what we can improve, suggestions, etc." required></textarea>
          </div>
          <button type="submit" class="feedback-submit">Submit Feedback</button>
        </form>
        <div class="feedback-recent" id="myRecentFeedback"></div>
      </div>
    </div>
  `;

  mount.querySelector("#feedbackForm").addEventListener("submit", e => {
    e.preventDefault();
    submitFeedback(role, mount);
  });

  mount.dataset.mounted = "true";
  if (typeof renderIcons === "function") renderIcons(mount);
  renderMyRecentFeedback(role, mount);
}

function submitFeedback(role, mount) {
  const name = document.getElementById("feedbackName").value.trim() || "Anonymous";
  const message = document.getElementById("feedbackMessage").value.trim();

  const ratings = {};
  let valid = true;

  RATING_CATEGORIES.forEach(cat => {
    const selected = mount.querySelector(`input[name="rating-${cat.key}"]:checked`);
    if (!selected) valid = false;
    else ratings[cat.key] = Number(selected.value);
  });

  if (!valid) {
    if (typeof showToast === "function") showToast("Please rate all categories", "warning");
    return;
  }

  if (!message) {
    if (typeof showToast === "function") showToast("Please share your insights", "warning");
    return;
  }

  const now = new Date();
  const entry = {
    id: "FB" + Date.now(),
    role,
    name,
    ratings,
    message,
    average: averageRating(ratings),
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  const list = getFeedbacks();
  list.push(entry);
  saveFeedbacks(list);

  document.getElementById("feedbackForm").reset();
  renderMyRecentFeedback(role, mount);

  if (typeof showToast === "function") {
    showToast("Thank you! Your feedback has been submitted.", "success");
  }
}

function renderMyRecentFeedback(role, mount) {
  const container = mount.querySelector("#myRecentFeedback");
  if (!container) return;

  const mine = getFeedbacks()
    .filter(f => f.role === role)
    .slice()
    .reverse()
    .slice(0, 3);

  if (!mine.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <h3>Your recent feedback</h3>
    ${mine.map(f => `
      <div class="feedback-recent-item">
        <strong>${f.date} · ${f.time}</strong> — Overall: ${starsDisplay(f.average)} (${f.average}/5)
        <p style="margin-top:6px;">${escapeHtml(f.message).slice(0, 120)}${f.message.length > 120 ? "…" : ""}</p>
      </div>
    `).join("")}
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function loadAdminFeedback() {
  const container = document.getElementById("feedbackContainer");
  if (!container) return;

  const search = (document.getElementById("feedbackSearch")?.value || "").toLowerCase();
  const dateFilter = document.getElementById("feedbackDateFilter")?.value || "";
  const roleFilter = document.getElementById("feedbackRoleFilter")?.value || "";

  let list = getFeedbacks().slice().reverse();

  list = list.filter(f => {
    const matchSearch = !search ||
      f.name.toLowerCase().includes(search) ||
      f.message.toLowerCase().includes(search) ||
      f.id.toLowerCase().includes(search);
    const matchDate = !dateFilter || f.date === dateFilter;
    const matchRole = !roleFilter || f.role === roleFilter;
    return matchSearch && matchDate && matchRole;
  });

  const total = getFeedbacks().length;
  const countLabel = document.getElementById("feedbackCountLabel");
  if (countLabel) {
    countLabel.textContent = `${total} total submission${total !== 1 ? "s" : ""}${list.length !== total ? ` · Showing ${list.length} filtered` : ""}`;
  }

  if (!list.length) {
    container.innerHTML = typeof emptyStateMessage === "function"
      ? emptyStateMessage("No feedback submitted yet.")
      : "<p class='empty-message'>No feedback submitted yet.</p>";
    if (typeof renderIcons === "function") renderIcons(container);
    return;
  }

  container.innerHTML = list.map(f => feedbackAdminCard(f)).join("");
  if (typeof renderIcons === "function") renderIcons(container);
}

function feedbackAdminCard(f) {
  const roleClass = f.role === "Student" ? "student" : "guest";
  const ratingsHtml = RATING_CATEGORIES.map(cat => `
    <div class="feedback-rating-chip">
      <b>${cat.label}</b>
      ${starsDisplay(f.ratings[cat.key])} (${f.ratings[cat.key]}/5)
    </div>
  `).join("");

  return `
    <div class="feedback-card-admin">
      <div class="feedback-card-top">
        <div>
          <h3>${escapeHtml(f.name)}</h3>
          <small>${f.date} · ${f.time} · ID: ${f.id}</small>
        </div>
        <span class="role-pill ${roleClass}">${f.role}</span>
      </div>
      <div class="feedback-ratings-grid">${ratingsHtml}</div>
      <p class="feedback-avg">Overall average: <strong>${starsDisplay(f.average)}</strong> (${f.average}/5)</p>
      <div class="feedback-message-box">
        <b>Insights & comments</b>
        <p>${escapeHtml(f.message)}</p>
      </div>
    </div>
  `;
}

function clearFeedbackFilters() {
  const search = document.getElementById("feedbackSearch");
  const date = document.getElementById("feedbackDateFilter");
  const role = document.getElementById("feedbackRoleFilter");
  if (search) search.value = "";
  if (date) date.value = "";
  if (role) role.value = "";
  loadAdminFeedback();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("feedbackMount")) {
    mountFeedbackForm("feedbackMount");
  }
  if (document.getElementById("feedbackContainer")) {
    loadAdminFeedback();
  }
});
