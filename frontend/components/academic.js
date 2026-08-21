// Verified against KICD's official approved CBC materials lists
    // (Nov 2024 PP1-Grade 4 & 9 approvals; kicd.ac.ke/cbc-materials).
    // This is a sample list, not the full catalogue.
    const books = [
      { title: "KLB Skillgrow Environmental Activities Learner's Book", author: "Maurice Saka, Dorcas Mwangi, Musungu Mugoha, Charles Mwaniki", level: "Pre-Primary", subject: "Environmental Activities", grade: "Pre-Primary 2", publisher: "Kenya Literature Bureau (KLB)" },
      { title: "Mentor Language Activities Learner's Book", author: "Violet Ochieng', Justine S. Ochieng'", level: "Primary", subject: "Language Activities", grade: "Lower Primary", publisher: "Mentor Publishers" },
      { title: "Longhorn English Language Activities Learner's Book", author: "Tom Olang, Beatrice Mwebi, Immaculate Oundo, Joseph Ouma, Naomi Kanyiri", level: "Primary", subject: "English", grade: "Grade 1", publisher: "Longhorn Publishers" },
      { title: "Oxford New Progressive Primary English Learner's Book", author: "Leah Kariuki, Elizabeth Ndua, Bancy Malandi, Evans Sore", level: "Primary", subject: "English", grade: "Grade 1", publisher: "Oxford University Press EA" },
      { title: "Oxford New Progressive Primary English Learner's Book", author: "Leah Kariuki, Elizabeth Ndua, Bancy Malandi, Evans Sore", level: "Primary", subject: "English", grade: "Grade 2", publisher: "Oxford University Press EA" },
      { title: "Skills in English Language Activities Learner's Book", author: "Diane Omondi, Beth Chege, Judith Onywany", level: "Primary", subject: "English", grade: "Grade 2", publisher: "Moran Publishers" },
      { title: "Oxford New Progressive Primary English Learner's Book", author: "Leah Kariuki, Elizabeth Ndua, Bancy Malandi, Evans Sore", level: "Primary", subject: "English", grade: "Grade 3", publisher: "Oxford University Press EA" },
      { title: "Oxford Head Start English Learner's Book", author: "Oxford University Press EA", level: "Junior School", subject: "English", grade: "Grade 9", publisher: "Oxford University Press EA" },
      { title: "Top Scholar Social Studies Learner's Book", author: "Top Scholar", level: "Junior School", subject: "Social Studies", grade: "Grade 9", publisher: "Top Scholar Publishers" },
      { title: "Moran Agriculture Learner's Book", author: "Moran Publishers", level: "Junior School", subject: "Agriculture", grade: "Grade 9", publisher: "Moran Publishers" },
      { title: "Hummingbird Creative Arts and Sports Learner's Book", author: "Hummingbird", level: "Junior School", subject: "Creative Arts and Sports", grade: "Grade 9", publisher: "Hummingbird Publishers" },
      { title: "Comprehensive Integrated Science Learner's Book", author: "Comprehensive", level: "Junior School", subject: "Integrated Science", grade: "Grade 9", publisher: "Longhorn Publishers" },
      { title: "Spotlight Integrated Science Learner's Book", author: "Spotlight", level: "Junior School", subject: "Integrated Science", grade: "Grade 9", publisher: "Oxford University Press EA" }
    ];

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
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

        const coverClass = book.level === 'Primary' ? 'primary' : 'secondary';

        card.innerHTML = `
          <div class="book-cover ${coverClass}">
            📖
          </div>
          <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author} • ${book.grade}</div>
            <button class="download-btn">
              View Details
            </button>
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

    searchInput.addEventListener('input', filterBooks);
    searchBtn.addEventListener('click', filterBooks);
    levelFilter.addEventListener('change', filterBooks);
    subjectFilter.addEventListener('change', filterBooks);

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') filterBooks();
    });

    renderBooks(books);