// ===== Sidebar toggle (mobile) =====
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

// ===== Highlight clicked link, update heading, fetch books =====
function selectLink(link) {
  // remove "active" class from all links
  const links = document.querySelectorAll(".sidebar a");
  links.forEach(l => l.classList.remove("active"));

  // add "active" class to the clicked link
  link.classList.add("active");

  // update the main heading text
  document.getElementById("pageTitle").innerText = link.innerText;

  // fetch books matching this category
  fetchBooks(link.innerText);

  // close sidebar on mobile after selecting
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("show");
}

// ===== Fetch books from Google Books API =====
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

// ===== Search bar functionality =====
function setupSearch() {
  const searchInput = document.querySelector(".header input[type='text']");
  if (!searchInput) return;

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      fetchBooks(searchInput.value.trim());

      // clear active sidebar link since this is a custom search
      const links = document.querySelectorAll(".sidebar a");
      links.forEach(l => l.classList.remove("active"));
    }
  });
}

// ===== Run on page load =====
window.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  fetchBooks("Fiction"); // load default category
});