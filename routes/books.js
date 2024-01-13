const express = require("express");
const Book = require("../models/book");

const router = new express.Router();
const validate = require("../middleware/validate");
const bookSchema = require("../schemas/bookSchema.json");


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", validate(bookSchema), async function (req, res, next) {
  console.log("POST /books called");
  try {
    console.log("Creating book with data:", req.body);
    const book = await Book.create(req.body);
    console.log("Book created:", book);
    return res.status(201).json({ book });
  } catch (err) {
    console.error("Error creating book:", err);
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", validate(bookSchema), async function (req, res, next) {
  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;