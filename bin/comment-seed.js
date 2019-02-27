require("dotenv").config();
const mongoose = require("mongoose");

const Comment = require("../models/comment-model.js");
const someComments = [
  {
    // username_id: "5c76cfd6dab4194575c542f9",
    // post_id: "5c76d13806973146129e7960",
    content: "Me too I want to go to Sichuan and eat all food"
  }
];

mongoose
  .connect("mongodb://localhost/instahack-server", {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

Comment.insertMany(someComments)
  .then(commentResult => {
    console.log(`Inserted ${commentResult.length} comments`);
  })
  .catch(err => {
    console.log("COMMENT insert error", err);
  });
