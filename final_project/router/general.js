const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req. body.username;
  const password = req.body.password;

  // check if usernme and password are provided
  if (username && password) {
    // Check if the user doest not already exist
    if (!isValid(username)) {
        // add the new user to the users array
        users.push({"username": username, "password": password})
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(res.send(JSON.stringify(books, null, 4)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;

  // Validate ISBN is a number
  if (isNaN(isbn)) {
    return res.status(400).json({
        message: "Invalid ISBN format. ISBN must be a number"});
  }
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
        message: "Book not found"
    });
  }
  // Return book details
  return res.status(200).json(res.send(JSON.stringify({[isbn]: books[isbn]})));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author parameter from the request URL 
  const author = req.params.author;
  // Create an object to store matching books with their IDs
  const booksByAuthor = {};
  // Iterate through books to find matches while preserving book IDs
  for (let [id, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor[id] = book;
    }
  }
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(res.send(JSON.stringify(booksByAuthor, null, 4)));
  }
  return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title parameter from the request URL 
  const title = req.params.title;
  // Create an object to store matching books with their IDs
  const booksByTitle = {};
  // Iterate through books to find matches while preserving book IDs
  for (let [id, book] of Object.entries(books)) {
    if (book.title.toLowerCase() === title.toLowerCase()) {
        booksByTitle[id] = book;
    }
  }
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(res.send(JSON.stringify(booksByTitle, null, 4)));
  }
  return res.status(404).json({message: "No books found for this author"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  // Validate ISBN is a number
  if (isNaN(isbn)) {
    return res.status(400).json({
        message: "Invalid ISBN format. ISBN must be a number"});
  }
  // Check if book exists
  if (!book) {
    return res.status(404).json({
        message: "Book not found"
    });
  }
  // Return isbn and book review
  return res.status(200).json(res.send(JSON.stringify({isbn: isbn, reviews: book.reviews}, null, 4)));
});

module.exports.general = public_users;
