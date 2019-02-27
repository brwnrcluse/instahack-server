require("dotenv").config();
const mongoose = require("mongoose");

const Post = require("../models/post-model.js");
const somePosts = [
  {
    // "Nizaroni"
    // username_id: "5c76cfd6dab4194575c542f9",
    image:
      "https://livekindlyproduction-8u6efaq1lwo6x9a.stackpathdns.com/wp-content/uploads/2017/07/dominospizza.png",
    caption: "Hmmmm cheese" //  hashtags, @users
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "Nizaroni"
    // username_id: "5c76cfd6dab4194575c542f9",
    image: "https://pics.me.me/when-pizza-is-life-28663342.png",
    caption: "This guy is right" //  hashtags, @users
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "Nizaroni"
    // username_id: "5c76cfd6dab4194575c542f9",
    image: "https://i.imgur.com/6KLwGC0.jpg",
    caption: "I want this one" //  hashtags, @users
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "ewnski"
    // username_id: "5c76cfd6dab4194575c542fa",
    image:
      "https://i.pinimg.com/originals/c5/45/2f/c5452fb991d502a765cfce6ad188eec2.jpg",
    caption: "How adorable... Love it"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "ewnski"
    // username_id: "5c76cfd6dab4194575c542fa",
    image:
      "https://i.pinimg.com/236x/94/2b/12/942b1272ba49e0495d2cf42636cb56c9--jack-russell-terriers-jack-russells.jpg?b=t",
    caption: "I want this dog in my bed"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "ewnski"
    // username_id: "5c76cfd6dab4194575c542fa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUSxHDEVGn9mZtfZxbtMKrBP5sk3YRg62zgCAd_gbMMxwQf8oZIg",
    caption: "Which one to choose?"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // brwncluse
    // username_id: "5c76cfd6dab4194575c542fb",
    image:
      "https://statics.sportskeeda.com/editor/2018/03/a4a7b-1520474015-800.jpg",
    caption: "This guy is just incredible"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // brwncluse
    // username_id: "5c76cfd6dab4194575c542fb",
    image:
      "https://statics.sportskeeda.com/editor/2018/03/a4a7b-1520474015-800.jpg",
    caption: "The best team ever"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // brwncluse
    // username_id: "5c76cfd6dab4194575c542fb",
    image: "https://i.ytimg.com/vi/y24BS1Lfjog/maxresdefault.jpg",
    caption: "WILD"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "frietpoune"
    // username_id: "5c76cfd6dab4194575c542fc",
    image: "https://cdn6.dissolve.com/p/D1062_1_518/D1062_1_518_1200.jpg",
    caption: "Basic is the best. White rice. Nothing else."
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "frietpoune"
    // username_id: "5c76cfd6dab4194575c542fc",
    image:
      "https://thewoksoflife.com/wp-content/uploads/2014/11/dan-dan-noodles-12.jpg",
    caption: "Need to go back to Sichuan for these dan dan mian..."
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
  },

  {
    // "frietpoune"
    // username_id: "5c76cfd6dab4194575c542fc",
    image:
      "https://cdn.cnn.com/cnnnext/dam/assets/160325033254-hk-dim-sum-fook-lam-moon.jpg",
    caption: "Look at these yummy dim sum... OMG"
    // likedBy: [{ liker: { type: Schema.Types.ObjectId }, ref: "User" }]
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

Post.insertMany(somePosts)
  .then(postResult => {
    console.log(`Inserted ${postResult.length} posts`);
  })
  .catch(err => {
    console.log("POST insert error", err);
  });
