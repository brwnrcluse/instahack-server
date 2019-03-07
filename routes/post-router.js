const express = require("express");
const User = require("../models/user-model.js");
const Post = require("../models/post-model.js");
const Comment = require("../models/comment-model.js");

const router = express.Router();

// ##################################################################################
// GET DETAILS OF THE POST (LIKES, COMMENTS, PICTURE, USER, DATE POSTED)
// WITH THE USER OBJECT THROUGH POPULATE ("username_id") in the field "username_id"
// ##################################################################################

router.get("/p/:postId", (req, res, next) => {
  const { postId } = req.params;
  // return res.send(currentUser);
  Post.findById(postId)
    .populate("username_id", "profilePic username")
    .populate("likedBy", "profilePic followers")
    .then(postDoc => {
      Comment.find({ post_id: { $eq: postId } })
        .sort({ createdAt: 1 })
        .populate("username_id", "username")
        .then(commentResults => {
          res.json({ post: postDoc, comments: commentResults });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// router.get("/p/:postId", (req, res, next) => {
//   const { postId } = req.params;
//   // return res.send(currentUser);
//   Post.findById(postId)
//     .populate("username_id")
//     .then(postDoc => {
//       Comment.find({ post_id: { $eq: postId } })
//         .sort({ createdAt: -1 })
//         .populate("username_id")
//         .then(commentResults => {
//           res.json({ post: postDoc, comments: commentResults });
//         })
//         .catch(err => next(err));
//     })
//     .catch(err => next(err));
// });

// ##################################################################################
// ADD COMMENT (NEW COLLECTION -- TAKES COMMENTER, POST, AND COMMENT CONTENT)
// ##################################################################################

router.post("/process-comment", (req, res, next) => {
  const { username_id, post_id, content } = req.body;

  Comment.create({ username_id, post_id, content })
    .then(commentDoc => {
      Comment.findById(commentDoc._id)
        .populate("username_id")
        .then(newComment => res.json(newComment))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// ##################################################################################
// ADD A LIKE TO THE POST'S LIKEDBY ARRAY
// ##################################################################################

router.post("/process-like", (req, res, next) => {
  const { post, liker } = req.body;

  // return res.send(post);
  // return res.send(liker);

  console.log("LIKE: REQBODY in BACK: ", req.body);

  Post.findByIdAndUpdate(post, { $push: { likedBy: liker } }, { new: true })
    .then(postDoc => {
      console.log("LIKE: POSTDOC in BACK: ", postDoc);
      res.json(postDoc);
    })
    .catch(err => next(err));
});

// ##################################################################################
// REMOVE A LIKE FROM A POST'S LIKEDBY ARRAY
// ##################################################################################

router.post("/process-unlike", (req, res, next) => {
  const { post, unliker } = req.body;

  console.log("UNLIKE: REQBODY in BACK: ", req.body);

  // return res.send(post);
  // return res.send(liker);

  Post.findByIdAndUpdate(post, { $pull: { likedBy: unliker } }, { new: true })
    .then(postDoc => {
      console.log("LIKE: POSTDOC in BACK: ", postDoc);
      res.json(postDoc);
    })
    .catch(err => next(err));
});

// ##################################################################################
// RENDER ALL POSTS IN NEWSFEED
// ##################################################################################

router.post("/process-newsfeed", (req, res, next) => {
  console.log("BEGINNING OF PROCESS NEWSFEED");

  // get following from currentUser (sent in req.body)
  const { following, _id } = req.body;

  // add currentUser's id to show currentUser's posts as well
  following.push(_id);

  // return console.log(following);

  // find all Posts for each user in the following array
  Post.find({ username_id: { $in: following } })
    .sort({ createdAt: -1 })
    .limit(10)
    .then(postDocs => {
      // ***********************************
      // returns an array with all Posts from all users currentUser follows
      // need only the IDs to inform PostDetailPage
      // ***********************************
      const postIds = [];
      postDocs.forEach(onePost => {
        postIds.push({ match: { params: { postId: onePost._id } } });
      });

      // ***********************************
      // send array of post IDs
      // ***********************************
      res.json(postIds);
    });
});

// ##################################################################################
// CREATE A POST
// ##################################################################################

router.post("/process-post", (req, res, next) => {
  const { username_id, image, caption } = req.body;
  console.log("REQ.BODY", req.body);
  Post.create({ username_id, image, caption })
    .then(postDoc => {
      res.json(postDoc);
    })
    .catch(err => next(err));
});

// export function newPost(newPost) {
//   return backendApi.post("/api/process-post", newPost).catch(errorHandler);
// }

module.exports = router;
