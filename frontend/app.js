// Sidebar toggle (mobile) 
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

// Highlight clicked link, update heading, fetch books 
function selectLink(link) {
 
  const links = document.querySelectorAll(".sidebar a");
  links.forEach(l => l.classList.remove("active"));

  link.classList.add("active");
 
  document.getElementById("pageTitle").innerText = link.innerText;

  fetchBooks(link.innerText);

  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("show");
}

// Fetch books from Google Books API
async function fetchBooks(category) {
  const content = document.querySelector(".main-content");

  // Show a loading message while we wait for the API
  content.innerHTML = `<h2 id="pageTitle">${category}</h2><p>Loading books...</p>`;

  try {
    // OPTIONAL: If you get a free Google Cloud API key later, uncomment below
    // const API_KEY = "YOUR_KEY_HERE";
    // const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}&key=${API_KEY}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Rebuild content area
    content.innerHTML = `<h2 id="pageTitle">${category}</h2>`;

    if (!data.items || data.items.length === 0) {
      content.innerHTML += `<p>No books found for "${category}".</p>`;
      return;
    }

    const list = document.createElement("div");
    list.className = "book-list";

    data.items.forEach(book => {
      const info = book.volumeInfo || {};
      const title = info.title || "Untitled";
      const authors = info.authors ? info.authors.join(", ") : "Unknown author";
      const thumbnail = info.imageLinks?.thumbnail || "";
      const description = info.description
        ? info.description.substring(0, 120) + "..."
        : "No description available.";

      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
        ${thumbnail ? `<img src="${thumbnail}" alt="${title}" class="book-cover">` : `<div class="book-cover placeholder">📖</div>`}
        <div class="book-info">
          <h3>${title}</h3>
          <p class="book-author">${authors}</p>
          <p class="book-desc">${description}</p>
        </div>
      `;
      list.appendChild(bookCard);
    });

    content.appendChild(list);

  } catch (error) {
    console.error("Error fetching books:", error);
    content.innerHTML = `<h2 id="pageTitle">${category}</h2><p>Sorry, something went wrong loading books. Please try again.</p>`;
  }
}

// Search bar functionality 
function setupSearch() {
  const searchInput = document.querySelector(".header input[type='text']");
  if (!searchInput) return;

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      fetchBooks(searchInput.value.trim());

      const links = document.querySelectorAll(".sidebar a");
      links.forEach(l => l.classList.remove("active"));
    }
  });
}

// Run on page load
window.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  fetchBooks("Fiction");
});
// ===== SIGN UP =====

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const existingUser = localStorage.getItem("libraryUser");

    if (existingUser) {
      const user = JSON.parse(existingUser);

      if (user.email === email) {
        alert("An account with this email already exists.");
        return;
      }
    }

    const newUser = {
      name: name,
      email: email,
      password: password
    };

    localStorage.setItem("libraryUser", JSON.stringify(newUser));

    alert("Account created successfully, " + name + "!");

    window.location.href = "components/home.html";
  });
}


// ===== LOGIN =====

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const savedUser = localStorage.getItem("libraryUser");

    if (!savedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

     if (email === user.email && password === user.password) {
  alert("Login successful! Welcome, " + user.name + "!");

  localStorage.setItem("loggedIn", "true");

  window.location.href = "components/home.html";
}
     }  else {
        alert("Incorrect email or password.");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("There is a problem with the saved account. Please sign up again.");
    }
  });
}
const logoutBtn = document.getElementById("logoutBtn");



