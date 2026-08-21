// ===== DOM REFERENCES =====
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ===== LOGIN HANDLER =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError("Please fill in both fields.");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }

  localStorage.setItem("loggedInUser", email);

  // Redirect to the home page (absolute path from project root)
  window.location.href = "/frontend/components/home.html";
});

// ===== HELPERS =====
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function showError(message) {
  const existingError = document.querySelector(".error-msg");
  if (existingError) existingError.remove();

  const errorEl = document.createElement("p");
  errorEl.className = "error-msg";
  errorEl.textContent = message;
  errorEl.style.color = "#ffdddd";
  errorEl.style.background = "rgba(255, 0, 0, 0.15)";
  errorEl.style.padding = "8px 12px";
  errorEl.style.borderRadius = "6px";
  errorEl.style.marginTop = "10px";

  loginForm.appendChild(errorEl);
}