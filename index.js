const express = require("express");

//importing database
const database = require("./database");

//intializing express
const booky = express();

booky.use(express.urlencoded({extended:true}));
booky.use(express.json());


/*
    Route        /
    Description  Get all the books
    Access       PUBLIC
    Parameter    NONE
    Methods      GET

*/

booky.get("/", (req, res)=>{
    return res.json({Books: database.books});
});

/*
    Route        /is
    Description  Get specific book with ISBN
    Access       PUBLIC
    Parameter    isbn
    Methods      GET

*/

booky.get("/is/:isbn", (req, res)=>{
    const getSpecificBook = database.books.filter(
        (book)=>book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length !== 0){
        return res.json({book:getSpecificBook});
    }
    return res.json({error:`The Book with ISBN: ${req.params.isbn} has not found in the database`});
    
});


/*
    Route        /c
    Description  Get specific book on category
    Access       PUBLIC
    Parameter    category   
    Methods      GET

*/

booky.get("/c/:category", (req, res)=>{
    const getSpecificBook  = database.books.filter(
        (book) => book.category.includes(req.params.category)

    );

    if(getSpecificBook.length !== 0){
        return res.json({book:getSpecificBook});
    }
    return res.json({error:`Book with category '${req.params.category}' has not found in the database`});

});

/*
    Route        /l
    Description  Get specific book on language
    Access       PUBLIC
    Parameter    lang 
    Methods      GET

*/

booky.get("/l/:lang", (req, res)=>{
    const getSpecificBook  = database.books.filter(
        (book) => book.language.includes(req.params.lang)

    );

    if(getSpecificBook.length !== 0){
        return res.json({book:getSpecificBook});
    }
    return res.json({error:`Book with Language '${req.params.lang}' has not found in the database`});

});



/*
    Route        /author
    Description  Get all  authors
    Access       PUBLIC
    Parameter    NONE
    Methods      GET

*/

booky.get("/author", (req, res)=>{
    return res.json({authors : database.author});
});

/*
    Route        /author/book
    Description  Get all authors based on Book
    Access       PUBLIC
    Parameter    isbn
    Methods      GET

*/

booky.get("/author/book/:isbn", (req, res)=>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length !== 0){
        res.json({author : getSpecificAuthor});
    }
    return res.json({error:`No Author found for the book with ISBN:${req.params.isbn} `});

});


/*
    Route        /author/id
    Description  Get authors based on id
    Access       PUBLIC
    Parameter    id
    Methods      GET

*/
booky.get("/author/id/:id", (req, res)=>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id) 
    );

    if(getSpecificAuthor.length !== 0){
        return res.json({Author : getSpecificAuthor});
    }
    return res.json({error : `No author Found with ID : ${req.params.id}`});

});

/*
    Route        /publications
    Description  Get all publications
    Access       PUBLIC
    Parameter    NONE
    Methods      GET

*/

booky.get("/publications", (req, res)=> {
    return res.json({publications: database.publication});
});


/*
    Route        /publications/id
    Description  Get Specific publications
    Access       PUBLIC
    Parameter    id
    Methods      GET

*/
booky.get("/publications/id/:id", (req, res)=>{
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id == parseInt(req.params.id) 
    );

    if(getSpecificPublication.length !== 0){
        return res.json({publication: getSpecificPublication});
    }
    return res.json({error : `No Publication found with id : ${req.params.id}`});
});

/*
    Route        /publications/book
    Description  Get Specific publications based on a book
    Access       PUBLIC
    Parameter    isbn
    Methods      GET

*/

booky.get("/publications/book/:isbn", (req, res)=>{
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn) 
    );
    
    if(getSpecificPublication.length !== 0){
        return res.json({publications : getSpecificPublication});
    }
    return res.json({error : `No Publication found based on Book with ISBN : ${req.params.isbn}`});
});



//POST
/*
    Route        /book/new
    Description  Add new books
    Access       PUBLIC
    Parameter    NONE
    Methods      POST

*/

booky.post("/book/new", (req, res)=>{
    const newBook =  req.body;
    database.books.push(newBook);
    return res.json({updatedBooks : database.books});
});


/*
    Route        /author/new
    Description  Add new authors
    Access       PUBLIC
    Parameter    NONE
    Methods      POST

*/

booky.post("/author/new", (req, res)=>{
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return  res.json({udatedAuthors : database.author});
});


/*
    Route        /publications/new
    Description  Add new publications
    Access       PUBLIC
    Parameter    NONE
    Methods      POST

*/

booky.post("/publications/new", (req, res)=>{
    const newPub = req.body;
    database.publication.push(newPub);
    return res.json({updatedPublications : database.publication});
});

/*
    Route        /publications/update/Book
    Description  Update or Add new publications
    Access       PUBLIC
    Parameter    isbn
    Methods      PUT

*/

booky.put("/publications/update/book/:isbn", (req, res)=>{
    
    //Update the Publication Database
    database.publication.forEach((pub) =>{
        if(pub.id === req.body.pubId){
            pub.books.push(req.params.isbn);
            return;
        }
    });

    //Update the Books database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json({
        Books: database.books,
        Publication: database.publication,
        message: "Successfully updated publications"
    });

});


/*
    Route        /book/delete
    Description  Delete a Book
    Access       PUBLIC
    Parameter    isbn
    Methods      DELETE

*/

booky.delete("/book/delete/:isbn", (req, res)=>{
    //Whichever book that doesn't match with the isbn , send it to an updatedBookDatabse array
    //and rest which doesn't match will be filtered

    const updatedBookDatabse = database.books.filter(
        (book) => book.ISBN !== req.params.isbn  
    );
    database.books = updatedBookDatabse;
    return res.json({
        books:database.books
    });

});

/*
    Route        /book/del/author
    Description  Delete author from book
    Access       PUBLIC
    Parameter    isbn, authorId
    Methods      DELETE

*/

booky.delete("/book/del/author/:isbn/:authorId", (req, res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const newAuthorsList = book.author.filter(
            (eachAuthor)=> eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorsList;
            return;
        }
        
    });

    return res.json({
        book : database.books
    });

});



//extended version of the above api
/*
    Route        /book/delete/author
    Description  Delete author from book and related book from author
    Access       PUBLIC
    Parameter    isbn, authorId
    Methods      DELETE

*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res)=>{
    //Update the book database
    database.books.forEach((book)=> {   
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
            (eachAuthor)=> eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    //Update the Author database
    database.author.forEach((author)=>{
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
            (eachBook)=> eachBook !== req.params.isbn );
            author.books =  newBookList;
            return ;
        };
    });

    return res.json({
        book : database.books,
        author: database.author,
        message: "Author was deleted !!"
    });

}); 




//service listening on port 3000
booky.listen(3000, ()=>{
    console.log("Server is UP and RUNNING on PORT 3000");
});