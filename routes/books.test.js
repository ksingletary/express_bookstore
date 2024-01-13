const request = require("supertest");
const app = require("../app");
const db = require("../db");

process.env.NODE_ENV = "test";

// Mock book data
const testBook = {
  isbn: "0691161518",
  amazon_url: "http://a.co/eobPtX2",
  author: "Matthew Lane",
  language: "english",
  pages: 264,
  publisher: "Princeton University Press",
  title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
  year: 2017
};

// Add a book to the database before each test
beforeEach(async function() {
  await db.query(
    `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [testBook.isbn, testBook.amazon_url, testBook.author, testBook.language, testBook.pages, testBook.publisher, testBook.title, testBook.year]
  );
});

// Remove all books from the database after each test
afterEach(async function() {
  await db.query("DELETE FROM books");
});

// Tests for GET /books
describe("GET /books", function() {
  test("Gets a list of books", async function() {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body.books).toHaveLength(1);
    const book = response.body.books[0];
    expect(book).toHaveProperty("isbn");
    expect(book).toHaveProperty("amazon_url");
    expect(book).toHaveProperty("author");
    expect(book).toHaveProperty("language");
    expect(book).toHaveProperty("pages");
    expect(book).toHaveProperty("publisher");
    expect(book).toHaveProperty("title");
    expect(book).toHaveProperty("year");
  });
});

// Tests for GET /books/:id
describe("GET /books/:id", function() {
  test("Gets a single book", async function() {
    const response = await request(app).get(`/books/${testBook.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toEqual(testBook);
  });

  test("Responds with 404 for invalid book id", async function() {
    const response = await request(app).get("/books/999");
    expect(response.statusCode).toBe(404);
  });
});

// Tests for POST /books
describe("POST /books", function() {
  test("Creates a new book", async function() {
    const newBook = {
        isbn: "1234567890",
        amazon_url: "https://a.co/d/eobPtX2",
        author: "John Doe",
        language: "english",
        pages: 300,
        publisher: "Test Publisher",
        title: "Test Book",
        year: 2021
      };
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toEqual(newBook);
  });
});

// Tests for PUT /books/:id
describe("PUT /books/:id", function() {
  test("Updates a single book", async function() {
    const updatedBookData = {
      isbn: testBook.isbn,
      amazon_url: "http://a.co/d/eobPtX3",
      author: "John Doe Updated",
      language: "spanish",
      pages: 350,
      publisher: "Test Publisher Updated",
      title: "Test Book Updated",
      year: 2022
    };
    const response = await request(app).put(`/books/${testBook.isbn}`).send(updatedBookData);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toEqual({isbn: testBook.isbn, ...updatedBookData});
  });

  test("Responds with 404 for invalid book id", async function() {
    const response = await request(app).put("/books/999").send(testBook);
    expect(response.statusCode).toBe(404);
  });
});

// Tests for DELETE /books/:id
describe("DELETE /books/:id", function() {
  test("Deletes a single book", async function() {
    const response = await request(app).delete(`/books/${testBook.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("Responds with 404 for invalid book id", async function() {
    const response = await request(app).delete("/books/999");
    expect(response.statusCode).toBe(404);
  });
});



// After all tests have run, close the database connection
afterAll(async function() {
  await db.end();
});