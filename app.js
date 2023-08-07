const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/WikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const article = new mongoose.model("article", articleSchema);

//Express chain routing is something that you will observe our route is same in all the get post or delete requests so we can reduces redundancy by chaining
app
  .route("/articles")
  .get(function (req, res) {
    article.find({}, function (err, results) {
      if (!err) {
        res.send(results);
      }
    });
  })
  //This post method can only be able to add using postman software as this API has no front-end
  .post(function (req, res) {
    const article1 = new article({
      title: req.body.title,
      content: req.body.content,
    });
    article1.save(function (err) {
      if (!err) {
        console.log("Succesfully added to the database");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    article.deleteMany({}, function (err) {
      if (!err) {
        console.log("Deleted Succesfully");
      } else {
        console.log("Error occured");
      }
    });
  });

app
  .route("/articles/:topic")
  .get(function (req, res) {
    const topicName = req.params.topic;
    article.findOne({ title: topicName }, function (err, result) {
      if (!err) {
        res.send(result);
      } else {
        console / log(err);
      }
    });
  })
  //Disadvantage of put is that if you have not given any attributes value to change it will remove it from the scene which we do not want example of if tyre is faulty , sending a whole new bicycle
  .put(function (req, res) {
    article.update(
      { title: req.params.topic },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          console.log("Succesfully updated");
        }
      }
    );
  })
  //patch is a better option than put you can see here we have set the variables to that value which we have received through the front-end/postman
  .patch(function (req, res) {
    article.update(
      { title: req.params.topic },
      { $set: req.body },
      function (err) {
        if (!err) {
          console.log("Succesfully updated the article");
        }
      }
    );
  })
  .delete(function (req, res) {
    article.deleteOne({ name: req.params.topic }, function (err) {
      if (!err) {
        console.log("Deleted Succesfully");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started at 3000");
});
