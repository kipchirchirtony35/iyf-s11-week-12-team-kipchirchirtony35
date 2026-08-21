// ===== DOM REFERENCES =====
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ===== LOGIN HANDLER =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the form from reloading the page

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validation (HTML "required" already covers empty fields,
  // this is just an extra safety check)
  if (!email || !password) {
    showError("Please fill in both fields.");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }

  // ===== TEMPORARY "LOGIN" LOGIC =====
  // Right now there's no backend, so we just store the user's email
  // to simulate a logged-in session, then redirect to the home page.
  // Later you can replace this block with a real fetch() call to your
  // login API and only redirect on a successful response.
  localStorage.setItem("loggedInUser", email);

  // Redirect to the home page (the library page with the book grid)
  window.location.href = "index.html";
});

// ===== HELPERS =====
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function showError(message) {
  // Remove any existing error message first
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