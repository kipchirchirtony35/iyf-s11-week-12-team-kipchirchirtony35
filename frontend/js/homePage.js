// ===== SAMPLE BOOK DATA =====
// Replace this with data from an API/backend later if needed
const booksByCategory = {
  Fiction: [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { title: "1984", author: "George Orwell", cover: "https://covers.openlibrary.org/b/id/7222161-L.jpg" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg" },
  ],
  Science: [
    { title: "A Brief History of Time", author: "Stephen Hawking", cover: "https://covers.openlibrary.org/b/id/8406786-L.jpg" },
    { title: "Cosmos", author: "Carl Sagan", cover: "https://covers.openlibrary.org/b/id/8235116-L.jpg" },
  ],
  Technology: [
    { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg" },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", cover: "https://covers.openlibrary.org/b/id/8406878-L.jpg" },
  ],
  History: [
    { title: "Sapiens", author: "Yuval Noah Harari", cover: "https://covers.openlibrary.org/b/id/8406795-L.jpg" },
  ],
  Biography: [
    { title: "Steve Jobs", author: "Walter Isaacson", cover: "https://covers.openlibrary.org/b/id/8235115-L.jpg" },
  ],
  Romance: [
    { title: "Pride and Prejudice", author: "Jane Austen", cover: "https://covers.openlibrary.org/b/id/8091019-L.jpg" },
  ],
  Mystery: [
    { title: "Gone Girl", author: "Gillian Flynn", cover: "https://covers.openlibrary.org/b/id/8235117-L.jpg" },
  ],
};

// DOM REFERENCES 
const sidebar = document.getElementById("sidebar");
const pageTitle = document.getElementById("pageTitle");
const mainContent = document.querySelector(".main-content");
const searchInput = document.querySelector(".search-box input");

let currentCategory = "Fiction";

// SIDEBAR TOGGLE 
function toggleSidebar() {
  // Works for both desktop (collapsed) and mobile (open) states.
  // See the CSS notes: mobile uses .open, desktop uses .collapsed.
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
  } else {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("full-width");
  }
}

//  CATEGORY SELECTION 
function selectLink(link) {
  // Remove "active" from all sidebar links
  document.querySelectorAll(".sidebar a").forEach((a) => a.classList.remove("active"));

  // Mark the clicked link as active
  link.classList.add("active");

  // Update page title and current category
  currentCategory = link.textContent.trim();
  pageTitle.textContent = currentCategory;

  // Close sidebar automatically on mobile after selecting
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("open");
  }

  renderBooks(currentCategory);
}

// RENDER BOOKS
function renderBooks(category, searchTerm = "") {
  const books = booksByCategory[category] || [];

  const filtered = searchTerm
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : books;

  // Remove any existing book grid or "loading/empty" message
  const existingGrid = mainContent.querySelector(".book-grid");
  const existingMsg = mainContent.querySelector(".empty-msg");
  if (existingGrid) existingGrid.remove();
  if (existingMsg) existingMsg.remove();

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-msg";
    emptyMsg.textContent = "No books found.";
    mainContent.appendChild(emptyMsg);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "book-grid";

  filtered.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title} cover" onerror="this.src='https://via.placeholder.com/160x220?text=No+Cover'">
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
      </div>
    `;

    mainContent.appendChild(card);
    grid.appendChild(card);
  });

  mainContent.appendChild(grid);
}

//  SEARCH 
searchInput.addEventListener("input", (e) => {
  renderBooks(currentCategory, e.target.value);
});

//  INITIAL LOAD 
document.addEventListener("DOMContentLoaded", () => {
  // Remove the static "Loading books..." paragraph
  const loadingMsg = mainContent.querySelector("p");
  if (loadingMsg) loadingMsg.remove();

  renderBooks(currentCategory);
});