const express = require("express");
const User = require("../models/user-model.js");
const router = express.Router();
const bcrypt = require("bcrypt");

function checkEmail(emailToCheck) {
  User.findOne({ email: { $eq: emailToCheck } })
    .then(userDoc => {
      if (userDoc) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => next(err));
}

function checkUsername(usernameToCheck) {
  User.findOne({ username: { $eq: usernameToCheck } })
    .then(userDoc => {
      if (userDoc) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => next(err));
}

function checkPassword(givenPassword) {
  const passwordToCheck = bcrypt.hashSync(givenPassword, 10);
  User.findOne({ encryptedPassword: { $eq: passwordToCheck } })
    .then(userDoc => {
      if (userDoc) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => next(err));
}

router.post("/process-email", (req, res, next) => {
  const { email } = req.body;

  if (checkEmail(email)) {
    next(new Error("That email is already associated with an account."));
    return;
  }
});

router.post("/process-username", (req, res, next) => {
  const { username } = req.body;

  if (checkUsername(username)) {
    next(new Error("That username is taken."));
    return;
  }
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, username, email, originalPassword } = req.body;
  // return console.log(fullName, username, email, originalPassword);

  // enforce password rules (can't be empty and MUST have a digit)
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    next(new Error("Password can't be blank and must contain a number."));
    return;
  }

  // return res.send(JSON.stringify(originalPassword));

  // encrypt the user's password before saving it
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  // return res.send(JSON.stringify(encryptedPassword));

  User.create({ fullName, username, email, encryptedPassword })
    .then(userDoc => {
      req.logIn(userDoc, () => {
        // hide encrypted password before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

// ************************
//          LOGIN
// ************************

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;
  console.log("Req.body from Log In", req.body);
  // return res.send("so far so good");

  // validate the email by searching the database for an account with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // User.findOne() will give us NULL in userDoc if it found nothing
      if (!userDoc) {
        // req.flash() sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        next(new Error("Email is incorrect."));

        return;
      }

      const { encryptedPassword } = userDoc;

      // validate the password by using bcrypt.compareSync()
      // (bcrypt.compareSync() will return FALSE if the passwords don't match)
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // req.flash() sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        next(new Error("Password is incorrect"));
        return;
      }

      // email & password are CORRECT!
      // if we MANUALLY managed the user session
      // req.session.userId = userDoc._id;

      // instead we'll use PASSPORT – an npm package for managing user sessions
      // req.logIn() is a Passport method that calls serializeUser()
      // (that saves the USER ID in the session which means we are logged-in)
      req.logIn(userDoc, () => {
        // hide encrypted password before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

// ************************
//          LOGOUT
// ************************

router.get("/logout", (req, res, next) => {
  // req.logOut() is a Passport method that removes the USER ID from the session
  req.logOut();

  // send some JSON to the client
  res.json({ message: "You are logged out!" });
});

module.exports = router;
