//import modules and dependencies
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

//export a function that handles a local strategy for authorisation using passport.js
module.exports = function (passport) {
  //create a new User model
  passport.use(new LocalStrategy({ 
    usernameField: 'email' }, 
    async (email, password, done) => {
      console.log(`Attempting to authenticate user with email: ${email}`);

      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
          console.log(`User with email ${email} not found.`);
          return done(null, false, { msg: `Email ${email} not found.` });
        }

        const isMatch = await user.comparePassword(password);
        console.log("Password match:", isMatch ? "Yes" : "No");

        if (isMatch) {
          console.log(`User ${email} authenticated successfully.`);
          return done(null, user);
        } else {
          console.log("Invalid password entered.");
          return done(null, false, { msg: 'Invalid email or password.' });
        }
      } catch (err) {
        console.error("Error during authentication process", err);
        return done(err);
      }
  }));

passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user.id}`);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log(`Deserializing user by ID: ${id}`);
    try {
      const user = await User.findById(id);
      console.log("User found during deserialization:", user ? "Yes" : "No");
      done(null, user);
    } catch (err) {
      console.error("Error in deserialization", err);
      done(err, null);
    }
  });
}