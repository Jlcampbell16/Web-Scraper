// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// var handlebars = require("express-handlebars");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });


//Routes
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
    axios.get("https://gazette.com/news/").then(function(response) {
    var $ = cheerio.load(response.data);

    // Now, we grab every from the website and do the following:
      $("h3").each(function(i, element) {
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      // result.title = $(this).children("p").text();
      result.link = $(this).children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({}).then(function(articles){
    res.json(articles)
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
  .populate("")
  .then(function(article){
    res.json(article)
  })
  .catch(function(err){
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment){
      return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    }).then(function(dbArticle){
      res.json(dbArticle)
    })
    .catch(function(err){
      res.json(err);
    })
});

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
