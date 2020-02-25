/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_titl   MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection('books').find().toArray((err,books)=>{
            if(err) throw err
            var bookArray = [];
            books.forEach((book,index, books)=>{
              bookArray[index] = {commentcount:book.comments.length, title: book.title, _id:book._id }
            })
            res.json(bookArray)
          })
        }
      })

  })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var book = {
        title: title,
        comments: [],
        commentcount: 0
      }
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          console.log('Successfull connection ')
          db.collection('books').insertOne(book,
            (err,doc)=>{
              if(err){
                console.log('next error occurred: ' + err)
              } else {
                console.log('created book with id - ' + book._id)
                res.json(book)
            }
          })
       }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      console.log('delete all books')
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection('books').remove({}, (err,doc)=>{
              if(err){
                console.log('next error occurred: ' + err)
              } else {
                console.log('All books removed')
                res.send('All books removed')
            }
          })
       }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      try{
        var bookid = ObjectId(req.params.id)
      } catch (err){
        res.send('no book exists')
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection('books').find({_id:bookid}).toArray((err,book)=>{
            if(err) {
              // res.send('no book exists')
              throw(err)
            } else {
              // res.send(book)
              res.json(book[0])
            }
          })
        }
      }) 
  })
    
    .post(function(req, res){
    try{
        var bookid = ObjectId(req.params.id||req.body.id)
      } catch (err){
        res.send('no book exists')
      }
      var comment = req.body.comment;
      //json res format same as .get.
      if(!comment) {
        res.send('Empty comment inappropriate')
      } else {
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection('books').findOneAndUpdate({_id:bookid}, {$push:{comments: comment}, $inc:{commentcount: 1}}, {new:true}, (err, book)=>{
         if(err) {
          console.log('unknown _id')
        } else {
          if(!book.value){
            res.send('no book exists')
          } else {
            console.log('comment added')
          }
          
          // console.log('comment: / ' + comment + ' / added successfully')
        }
      })
        }
      }) 
      }
    
    })
  
    .delete(function(req, res){
      var bookid = ObjectId(req.params.id);
      //if successful response will be 'delete successful'
      console.log('delete book with id: ' + bookid)

      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db)=>{
        var db = db.db('librarysystem')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection('books').findOneAndDelete({_id:bookid}, (err,book)=>{
            if(err) {
              console.log('error with finding and deleting')
            } else {
              console.log(book.value.title + ' delete successful')
            }
            
          })
        }
      })
    });
  
 
  
};



