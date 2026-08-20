// Sample database of Kenyan academic books
const books = [
  // Primary
  { title: "Primary Mathematics Grade 1", author: "KICD", level: "Primary", subject: "Mathematics", grade: "Grade 1", publisher: "Kenya Institute of Curriculum Development" },
  { title: "Primary English Grade 2", author: "Longhorn Publishers", level: "Primary", subject: "English", grade: "Grade 2", publisher: "Longhorn Publishers" },
  { title: "Kiswahili Darasa la 3", author: "Moran Publishers", level: "Primary", subject: "Kiswahili", grade: "Grade 3", publisher: "Moran Publishers" },
  { title: "Science and Technology Grade 4", author: "Oxford University Press", level: "Primary", subject: "Science", grade: "Grade 4", publisher: "Oxford University Press EA" },
  { title: "Social Studies Grade 5", author: "Storymoja", level: "Primary", subject: "Social Studies", grade: "Grade 5", publisher: "Storymoja Publishers" },
  { title: "Christian Religious Education Grade 6", author: "Evangel Publishing", level: "Primary", subject: "CRE", grade: "Grade 6", publisher: "Evangel Publishing House" },
  { title: "Islamic Religious Education Grade 6", author: "Islamic Foundation", level: "Primary", subject: "IRE", grade: "Grade 6", publisher: "Islamic Foundation" },
  { title: "Primary Mathematics Grade 7", author: "Moran Publishers", level: "Primary", subject: "Mathematics", grade: "Grade 7", publisher: "Moran Publishers" },
  { title: "English Grade 8 (CBC)", author: "Longhorn Publishers", level: "Primary", subject: "English", grade: "Grade 8", publisher: "Longhorn Publishers" },
  { title: "Integrated Science Grade 7", author: "KICD", level: "Primary", subject: "Science", grade: "Grade 7", publisher: "KICD" },

  // Secondary
  { title: "Secondary Mathematics Form 1", author: "Longhorn Publishers", level: "Secondary", subject: "Mathematics", grade: "Form 1", publisher: "Longhorn Publishers" },
  { title: "English Form 2", author: "Oxford University Press", level: "Secondary", subject: "English", grade: "Form 2", publisher: "Oxford University Press EA" },
  { title: "Kiswahili Kidato cha 3", author: "Moran Publishers", level: "Secondary", subject: "Kiswahili", grade: "Form 3", publisher: "Moran Publishers" },
  { title: "Biology Form 1", author: "Longhorn Publishers", level: "Secondary", subject: "Biology", grade: "Form 1", publisher: "Longhorn Publishers" },
  { title: "Chemistry Form 2", author: "Moran Publishers", level: "Secondary", subject: "Chemistry", grade: "Form 2", publisher: "Moran Publishers" },
  { title: "Physics Form 3", author: "Oxford University Press", level: "Secondary", subject: "Physics", grade: "Form 3", publisher: "Oxford University Press EA" },
  { title: "History and Government Form 4", author: "Longhorn Publishers", level: "Secondary", subject: "History", grade: "Form 4", publisher: "Longhorn Publishers" },
  { title: "Geography Form 3", author: "Moran Publishers", level: "Secondary", subject: "Geography", grade: "Form 3", publisher: "Moran Publishers" },
  { title: "Business Studies Form 2", author: "Longhorn Publishers", level: "Secondary", subject: "Business", grade: "Form 2", publisher: "Longhorn Publishers" },
  { title: "Agriculture Form 1", author: "KICD", level: "Secondary", subject: "Agriculture", grade: "Form 1", publisher: "KICD" },
  { title: "Computer Studies Form 3", author: "Longhorn Publishers", level: "Secondary", subject: "Computer", grade: "Form 3", publisher: "Longhorn Publishers" },
  { title: "CRE Form 4", author: "Evangel Publishing", level: "Secondary", subject: "CRE", grade: "Form 4", publisher: "Evangel Publishing House" },
  { title: "Secondary Mathematics Form 4", author: "Moran Publishers", level: "Secondary", subject: "Mathematics", grade: "Form 4", publisher: "Moran Publishers" },
  { title: "English Form 4", author: "Oxford University Press", level: "Secondary", subject: "English", grade: "Form 4", publisher: "Oxford University Press EA" },
  { title: "Biology Form 4", author: "Longhorn Publishers", level: "Secondary", subject: "Biology", grade: "Form 4", publisher: "Longhorn Publishers" }
];

const searchInput = document.getElementById('searchInput');
const levelFilter = document.getElementById('levelFilter');
const subjectFilter = document.getElementById('subjectFilter');
const booksGrid = document.getElementById('booksGrid');
const resultsInfo = document.getElementById('resultsInfo');

function renderBooks(filteredBooks) {
  booksGrid.innerHTML = '';

  if (filteredBooks.length === 0) {
    booksGrid.innerHTML = `
      <div class="no-results">
        <h3>No books found</h3>
        <p>Try changing your search or filters</p>
      </div>
    `;
    resultsInfo.textContent = 'No books found';
    return;
  }

  resultsInfo.textContent = `Showing ${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''}`;

  filteredBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-header">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
      </div>
      <div class="book-body">
        <div>
          <span class="badge ${book.level.toLowerCase()}">${book.level}</span>
          <span class="badge subject">${book.subject}</span>
        </div>
        <div class="meta"><strong>Level:</strong> ${book.grade}</div>
        <div class="publisher">${book.publisher}</div>
      </div>
    `;
    booksGrid.appendChild(card);
  });
}

function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const level = levelFilter.value;
  const subject = subjectFilter.value;

  const filtered = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.subject.toLowerCase().includes(searchTerm) ||
      book.grade.toLowerCase().includes(searchTerm) ||
      book.publisher.toLowerCase().includes(searchTerm);

    const matchesLevel = level === 'all' || book.level === level;
    const matchesSubject = subject === 'all' || book.subject === subject;

    return matchesSearch && matchesLevel && matchesSubject;
  });

  renderBooks(filtered);
}

// Event listeners
searchInput.addEventListener('input', filterBooks);
levelFilter.addEventListener('change', filterBooks);
subjectFilter.addEventListener('change', filterBooks);

// Initial render
renderBooks(books);