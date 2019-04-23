// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

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
mongoose.connect("mongodb://localhost/webScraper", { useNewUrlParser: true });

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
