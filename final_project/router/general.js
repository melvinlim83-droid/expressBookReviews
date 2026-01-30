const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Username or password is missing"});
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});
*/
public_users.get('/',function (req, res) {
    const promise = new Promise(resolve => {
        setTimeout(() => resolve(books), 0);
    })
    promise.then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({message: "Error getting book list", error: error.message}));
});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = {};
    if (isbn) {
        book[isbn] = books[isbn];
    }
    res.status(200).send(book);
 });
 */
 public_users.get('/isbn/:isbn',function (req, res) {  
    const isbn = req.params.isbn;
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            let book = {};
            
            if (isbn) {
                book[isbn] = books[isbn];
                resolve(book);
            }

            reject(new Error("Book is not found"));
        }, 0);
    })
    promise.then(data => res.status(200).json(data))
        .catch(error => res.status(404).json({message: `Cannot find ISBN ${isbn}`, error: error.message}));
 });
  
// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filteredBooks = {};

    for (const key in books) {
        if(books[key].author === author) {
            filteredBooks[key] = books[key];
        }
    }

    res.status(200).send(filteredBooks);
});
*/
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            let filteredBooks = {};
        
            for (const key in books) {
                if(books[key].author === author) {
                    filteredBooks[key] = books[key];
                }
            } 
            resolve(filteredBooks);
        }, 0);
    })
    promise.then(data => res.status(200).json(data))
        .catch(error => res.status(404).json({message: `Cannot find author ${author}`, error: error.message}));
});

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filteredBooks = {};

    for (const key in books) {
        if(books[key].title === title) {
            filteredBooks[key] = books[key];
        }
    }

    res.status(200).send(filteredBooks);
});
*/
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const promise = new Promise(resolve => {
        setTimeout(() => {
            let filteredBooks = {}; 

            for (const key in books) {
                if(books[key].title === title) {
                    filteredBooks[key] = books[key];
                }
            }
            resolve(filteredBooks);
        }, 0);
    })
    promise.then(data => res.status(200).json(data))
        .catch(error => res.status(404).json({message: `Cannot find title ${title}`, error: error.message}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let review = {};
    if (isbn) {
        review = books[isbn].reviews;
    }
    res.status(200).send(review);
});

module.exports.general = public_users;
