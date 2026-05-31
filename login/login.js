function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "NU_student" && password === "student001") {
    window.location.href = "../student/student.html";
    return;
  }

  const stallSession = typeof authenticateStallAdmin === "function"
    ? authenticateStallAdmin(username, password)
    : null;

  if (stallSession) {
    setAdminSession(stallSession);
    window.location.href = "../admin/admin.html";
    return;
  }

  openLoginErrorModal();
}

function continueAsGuest() {
  window.location.href = "../guest/guest.html";
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePasswordBtn");
  const iconEl = toggleBtn.querySelector("[data-icon]");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    if (iconEl) iconEl.dataset.icon = "eye-off";
  } else {
    passwordInput.type = "password";
    if (iconEl) iconEl.dataset.icon = "eye";
  }
  if (typeof renderIcons === "function") renderIcons(toggleBtn);
}

function openLoginErrorModal() {
  document.getElementById("loginErrorModal").style.display = "flex";
}

function closeLoginErrorModal() {
  document.getElementById("loginErrorModal").style.display = "none";
}