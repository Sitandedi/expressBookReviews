const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user => {
        return (user.username === username && user.password === password);
    }));

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username|| !password) {
    return res.status(404).json({ messge: "Error logging in"});
  }
  // Athenticate user
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', {expiresIn: 60 * 60});

    // Store access token and username in session
    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract isbn parameter from request URL
  const isbn = req.params.isbn;
  // review comes from query
  const review = req.query.review;
  // logged-in username
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json( { mesage: "Review query is required" });
  }

  // If reviews object doesn't exist, initialize it
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review for this username
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/modified successfully", reviews: books[isbn].reviews});
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    // review comes from query
    const review = req.query.review;
    // logged-in username
    const username = req.session.authorization?.username;
    if (!books[isbn].reviews) {
        return res.status(404).json({ message: "No reviews available for this book" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(403).json({ message: "You have not posted a review for this book" });
    }
    // Delete this user's review
    delete books[isbn].reviews[username];
    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
