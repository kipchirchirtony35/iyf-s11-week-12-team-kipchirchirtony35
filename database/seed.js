// backend/database/seed.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Allow overriding DB path via env; default to backend/database/library.db
const dbDir = path.resolve(__dirname);
const dbFile = process.env.DB_PATH || path.join(dbDir, 'library.db');

// ensure directory exists
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
  console.log('Connected to database:', dbFile);
});

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'adminpass'; // change after seed

db.serialize(() => {
  // Drop existing tables to start fresh (useful during development)
  db.run(`PRAGMA foreign_keys = OFF;`);
  db.run(`DROP TABLE IF EXISTS loans;`);
  db.run(`DROP TABLE IF EXISTS users;`);
  db.run(`DROP TABLE IF EXISTS books;`);
  db.run(`PRAGMA foreign_keys = ON;`);

  // Users / members table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    password TEXT, -- hashed password (nullable for non-auth member records)
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // Books table (expanded fields for curriculum)
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    curriculum_level TEXT,
    grade TEXT,
    subject TEXT,
    isbn TEXT,
    is_digital INTEGER DEFAULT 1,
    file_path TEXT,
    shelf_location TEXT,
    copies_total INTEGER DEFAULT 1,
    copies_available INTEGER DEFAULT 1,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // Loans table
  db.run(`CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    borrowed_at TEXT NOT NULL,
    due_at TEXT NOT NULL,
    returned_at TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(book_id) REFERENCES books(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`);

  // Seed admin user (if not exists)
  const hashed = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  db.get(`SELECT COUNT(*) AS c FROM users WHERE role = 'admin'`, (err, row) => {
    if (err) {
      console.error('Error checking admin user', err);
      return;
    }
    if (row.c === 0) {
      db.run(`INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, 'admin', ?)`,
        ['Admin', ADMIN_EMAIL, null, hashed], function (err) {
          if (err) console.error('Error inserting admin', err);
          else console.log(`Seeded admin user: ${ADMIN_EMAIL} / password: ${ADMIN_PASSWORD}`);
        });
    } else {
      console.log('Admin user already exists — skipping admin seed.');
    }
  });

  // Seed members (non-authenticated users)
  const members = [
    ['Gladwell Muthoni', '0712345678', 'gladwell@example.com'],
    ['Kipchirchir Tonny', '0723456789', 'tonny@example.com'],
    ['Amina Hassan', '0734567890', 'amina@example.com'],
    ['John Otieno', '0711111111', 'john@example.com'],
    ['Sarah Wanjiku', '0722222222', 'sarah@example.com'],
    ['David Mwangi', '0733333333', 'david@example.com'],
    ['Faith Chebet', '0744444444', 'faith@example.com'],
    ['Brian Omondi', '0755555555', 'brian@example.com'],
    ['Lucy Njeri', '0766666666', 'lucy@example.com'],
    ['Samuel Kamau', '0777777777', 'samuel@example.com']
  ];

  const insertUser = db.prepare(`INSERT INTO users (name, phone, email, role) VALUES (?, ?, ?, 'student')`);
  members.forEach(m => insertUser.run(m[0], m[1], m[2]));
  insertUser.finalize();

  // Seed books
  const books = [
    ['New Curriculum Grade 7 Computer Science', 'KICD', 'Junior Secondary', 'Grade 7', 'Computer Science', 'ISBN-CS-G7', 1, '/assets/cs_g7.pdf', 'Digital Library', 3, 3, 'KICD-aligned CS textbook.'],
    ['CBC Mathematics Form 3', 'NEB', 'Senior Secondary', 'Form 3', 'Mathematics', 'ISBN-MATH-F3', 1, '/assets/math_f3.pdf', 'Shelf C2', 4, 4, 'Mathematics for Form 3.'],
    ['Community Literacy Reader', 'Heritage Group', 'General Community', null, 'Literature', 'ISBN-LIT-01', 1, '/assets/stories.epub', 'Shelf A4', 2, 2, 'Collection of graded readers.'],
    ['Biology Form 1', 'Longhorn', 'Secondary', 'Form 1', 'Biology', 'ISBN-BIO-F1', 1, '/assets/bio_f1.pdf', 'Shelf B1', 3, 3, 'Introductory Biology.'],
    ['History of Kenya', 'Historical Soc.', 'General Community', null, 'History', 'ISBN-HIST-KE', 1, '/assets/hist_kenya.pdf', 'Shelf A2', 2, 2, 'History of Kenya.'],
    ['Chemistry Practical Guide', 'KICD', 'Senior Secondary', 'Form 4', 'Chemistry', 'ISBN-CHEM-PRAC', 1, '/assets/chem_prac.pdf', 'Shelf C3', 2, 2, 'Practical chemistry guide.'],
    ['Physics for Beginners', 'Oxford', 'Junior Secondary', 'Grade 8', 'Physics', 'ISBN-PHY-JR', 1, '/assets/phys_jr.pdf', 'Shelf B2', 3, 3, 'Physics basics.'],
    ['English Literature Anthology', 'Pearson', 'Secondary', null, 'Literature', 'ISBN-LIT-ANT', 1, '/assets/lit_anth.pdf', 'Shelf A3', 2, 2, 'Selected works for study.'],
    ['Geography Form 2', 'KICD', 'Secondary', 'Form 2', 'Geography', 'ISBN-GEO-F2', 1, '/assets/geo_f2.pdf', 'Shelf B4', 3, 3, 'Geography for Form 2.'],
    ['Basic Financial Literacy', 'Central Bank', 'General Community', null, 'Business', 'ISBN-FIN-01', 1, '/assets/fin_lit.pdf', 'Shelf D1', 2, 2, 'Financial literacy for community.']
  ];

  const insertBook = db.prepare(`INSERT INTO books 
    (title, author, curriculum_level, grade, subject, isbn, is_digital, file_path, shelf_location, copies_total, copies_available, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  books.forEach(b => {
    insertBook.run(...b);
  });
  insertBook.finalize();

  console.log('Seed: inserted members and books.');
});

// Finish and close after a moment (allow async inserts to complete)
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing DB', err.message);
    else console.log('Database closed. Seeding complete.');
  });
}, 500);