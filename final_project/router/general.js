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


// Using Promise callbacks
public_users.get('/promise', (req, res) => {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books data not available");
    }
  })
  .then((bookList) => {
    return res.status(200).json(bookList);
  })
  .catch((err) => {
    return res.status(500).json({ message: err });
  });
});



// Using async/await with Axios
public_users.get('/async', async (req, res) => {
  try {
    // Simulate an asynchronous fetch (like a DB/API call)
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject("Books data not available")
            }
        });
    };
    const bookList = await getBooks();  // Await the promise
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books with async/await" });
  }
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


 // Using Promises (callbacks) to Get book details based on ISBN
public_users.get('/isbn-promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    new Promise((resolve, reject) => {
      if (!books[isbn]) {
        reject("Book not found");
      } else {
        resolve({ [isbn]: books[isbn] });
      }
    })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Using async/await to Get book details based on ISBN
public_users.get('/isbn-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    const getBookByIsbn = (isbn) => {
      return new Promise((resolve, reject) => {
        if (!books[isbn]) {
          reject("Book not found");
        } else {
          resolve({ [isbn]: books[isbn] });
        }
      });
    };
  
    try {
      const book = await getBookByIsbn(isbn);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
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

// Using Promises (callbacks) to Get book details based on author
public_users.get('/author-promise/:author', (req, res) => {
    const author = req.params.author;
  
    new Promise((resolve, reject) => {
      const booksByAuthor = {};
      for (let [id, book] of Object.entries(books)) {
        if (book.author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor[id] = book;
        }
      }
  
      if (Object.keys(booksByAuthor).length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found for this author");
      }
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Using async/await to Get book details based on author
// =============================
public_users.get('/author-async/:author', async (req, res) => {
    const author = req.params.author;
  
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = {};
        for (let [id, book] of Object.entries(books)) {
          if (book.author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor[id] = book;
          }
        }
  
        if (Object.keys(booksByAuthor).length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("No books found for this author");
        }
      });
    };
  
    try {
      const result = await getBooksByAuthor(author);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
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

// Using Promises (callbacks) to Get book details based on title
public_users.get('/title-promise/:title', (req, res) => {
    const title = req.params.title;
  
    new Promise((resolve, reject) => {
      const booksByTitle = {};
      for (let [id, book] of Object.entries(books)) {
        if (book.title.toLowerCase() === title.toLowerCase()) {
          booksByTitle[id] = book;
        }
      }
  
      if (Object.keys(booksByTitle).length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found for this title");
      }
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Using async/await to Get book details based on author
// =============================
public_users.get('/title-async/:title', async (req, res) => {
    const title = req.params.title;
  
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const booksByTitle = {};
        for (let [id, book] of Object.entries(books)) {
          if (book.title.toLowerCase() === title.toLowerCase()) {
            booksByTitle[id] = book;
          }
        }
  
        if (Object.keys(booksByTitle).length > 0) {
          resolve(booksByTitle);
        } else {
          reject("No books found for this author");
        }
      });
    };
  
    try {
      const result = await getBooksByTitle(title);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
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
