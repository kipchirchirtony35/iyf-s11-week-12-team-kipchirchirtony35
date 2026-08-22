// ===== AUTH CHECK =====
// If nobody is logged in, send them back to the login page.
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  window.location.href = "../../Login.html";
}

// ===== GREET THE USER (only if this page has the element) =====
const welcomeEl = document.getElementById("welcomeUser");
if (welcomeEl) {
  welcomeEl.textContent = `Welcome, ${loggedInUser}`;
}

// ===== LOGOUT (only if this page has a logout button) =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../../Login.html";
  });
}

// ===== SIDEBAR / MOBILE DRAWER TOGGLE =====
const sidebar = document.getElementById("sidebar");
const navBackdrop = document.getElementById("navBackdrop");

function isMobile() {
  return window.innerWidth <= 900;
}

function openMobileDrawer() {
  if (!sidebar) return;
  sidebar.classList.add("active");
  if (navBackdrop) navBackdrop.classList.add("active");
}

function closeMobileDrawer() {
  if (!sidebar) return;
  sidebar.classList.remove("active");
  if (navBackdrop) navBackdrop.classList.remove("active");
}

function toggleSidebar() {
  if (!sidebar) return;

  if (isMobile()) {
    // Mobile: hamburger opens/closes the single drawer
    // (categories + Weather/Post/About/Academic links together).
    if (sidebar.classList.contains("active")) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  } else {
    // Desktop: collapse sidebar and expand main content
    document.body.classList.toggle("sidebar-collapsed");
  }
}

function selectLink(link) {
  document.querySelectorAll(".sidebar a").forEach((a) => a.classList.remove("active"));
  link.classList.add("active");

  if (isMobile()) {
    closeMobileDrawer();
  }
}

// Tapping the dimmed backdrop closes the mobile drawer
if (navBackdrop) {
  navBackdrop.addEventListener("click", closeMobileDrawer);
}

// If the viewport crosses the mobile breakpoint while the drawer is open,
// reset state so nothing gets stuck in a half-open/half-desktop layout.
window.addEventListener("resize", () => {
  if (!isMobile()) {
    closeMobileDrawer();
  }
});

// ===== LOGOUT =====
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "../login.html";
  });
        }
