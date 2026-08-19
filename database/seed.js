const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mysql.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the Community Library Curriculum database.');
    }
});

db.serialize(() => {
    // Drop existing tables to start fresh
    db.run(`DROP TABLE IF EXISTS books`);
    db.run(`DROP TABLE IF EXISTS members`);

    // 1. Create Members Table
    db.run(`CREATE TABLE members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone_number TEXT,
        email_address TEXT,
        joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Create Books Table
    db.run(`CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        curriculum_level TEXT,
        subject TEXT,
        is_digital BOOLEAN DEFAULT 1,
        file_path TEXT,
        shelf_location TEXT
    )`);

    // --- SEED 10 MEMBERS ---
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

    const insertMember = db.prepare(`INSERT INTO members (full_name, phone_number, email_address) VALUES (?, ?, ?)`);
    members.forEach(member => {
        insertMember.run(member);
    });
    insertMember.finalize();

    // --- SEED EXPANDED BOOKS COLLECTION ---
    const books = [
        ['New Curriculum Grade 7 Computer Science', 'KICD', 'Junior Secondary', 'Computer Science', 1, '/assets/cs_g7.pdf', 'Digital Library'],
        ['CBC Mathematics Form 3', 'NEB', 'Senior Secondary', 'Mathematics', 1, '/assets/math_f3.pdf', 'Shelf C2'],
        ['Community Literacy Reader', 'Heritage Group', 'General Community', 'Literature', 1, '/assets/stories.epub', 'Shelf A4'],
        ['Biology Form 1', 'Longhorn', 'Secondary', 'Biology', 1, '/assets/bio_f1.pdf', 'Shelf B1'],
        ['History of Kenya', 'Historical Soc.', 'General Community', 'History', 1, '/assets/hist_kenya.pdf', 'Shelf A2'],
        ['Chemistry Practical Guide', 'KICD', 'Senior Secondary', 'Chemistry', 1, '/assets/chem_prac.pdf', 'Shelf C3'],
        ['Physics for Beginners', 'Oxford', 'Junior Secondary', 'Physics', 1, '/assets/phys_jr.pdf', 'Shelf B2'],
        ['English Literature Anthology', 'Pearson', 'Secondary', 'Literature', 1, '/assets/lit_anth.pdf', 'Shelf A3'],
        ['Geography Form 2', 'KICD', 'Secondary', 'Geography', 1, '/assets/geo_f2.pdf', 'Shelf B4'],
        ['Basic Financial Literacy', 'Central Bank', 'General Community', 'Business', 1, '/assets/fin_lit.pdf', 'Shelf D1']
    ];

    const insertBook = db.prepare(`INSERT INTO books (title, author, curriculum_level, subject, is_digital, file_path, shelf_location) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    books.forEach(book => {
        insertBook.run(book);
    });
    insertBook.finalize();

    console.log('Database successfully seeded with 10 members and 10 books!');
});

db.close();