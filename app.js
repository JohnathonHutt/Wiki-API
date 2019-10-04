//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

//request targetting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })
  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Success");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//request targetting specific articles
  app.route("/articles/:articleTitle")
    .get(function(req,res){
      console.log(req.params.articleTitle);
      Article.findOne({title: req.params.articleTitle}, function(err, articleFound){
        if (articleFound) {
          res.send(articleFound);
        } else {
          res.send("No matching article");
        }
      });
    })

    .put(function(req,res){
      Article.update(
        //conditions
        {title: req.params.articleTitle},
        //updates
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err, results){
          if (!err) {
            res.send("Article updated successfully.");
          }
        });
    })

    .patch(function(req, res){
      Article.update(
        //conditions
        {title: req.params.articleTitle},
        //updates
        {$set: req.body},
        function(err, result){
          if (!err) {
            res.send("Article patched successfully.");
          } else {
            res.send(err);
          }
        }
      );
    })

    .delete(function(req, res){
      Article.deleteOne(
        //conditions
        {title: req.params.articleTitle},
        function(err){
          if (!err) {
            res.send("Successfully deleted item.");
          } else {
            res.send(err);
          }
        }
      );
    });


// app.get("/articles", );
//
// app.post("/articles", );
//
// app.delete("/articles", );

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
