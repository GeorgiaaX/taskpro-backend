const User = require("../models/User")
const validator = require('validator') //validation library
const passport = require("passport");

module.exports = {
    //post login form
    postLogin: async (req, res, next) => {
        // Log the incoming request body for debugging
        console.log('Login request body:', req.body);
    
        // Normalize email address
        req.body.email = validator.normalizeEmail(req.body.email, {
            gmail_remove_dots: false,
        });
        // Authenticate user using Passport's local strategy
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                // Log any authentication error
                console.error("Authentication error:", err);
                return res.status(500).send("Error during authentication");
            }
            if (!user) {
                // Log if user not found or invalid credentials
                console.log("Authentication failed: Invalid Username or Password");
                return res.status(401).send("Invalid Username or Password");
            }
    
            // Log the user object if authentication is successful
            console.log("Authentication successful, user:", user);
    
            // If auth succeeds, log in user
            req.logIn(user, (err) => {
                if (err) {
                    // Log any error during the login process
                    console.error("Error logging in:", err);
                    return res.status(500).send("Error logging in");
                }
    
                // Log success message and user information
                console.log("User logged in successfully:", user);
    
                // Send the user information as a response
                res.send(user);
            });
        })(req, res, next);
    },
    
    
    //post sign up form
    postSignup: async (req, res, next) => {
        // Normalize the email address, remove dots from Gmail address
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
    
        try {
            // Check for an existing user in the database
            const existingUser = await User.findOne({
                $or: [{ email: req.body.email.toLowerCase() }, { userName: req.body.userName }],
            });
    
            if (existingUser) {
                // If user already exists, send an appropriate response
                return res.status(409).send('User already exists, proceed to login');
            }
    
            // Create a new User using the User model
            const user = new User({
                userName: req.body.userName,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
            });
    
            // Save the user to the database
            await user.save();
    
            // Log in the user
            req.logIn(user, (err) => {
                if (err) {
                    // If error in logging in, return error response
                    return res.status(500).send("Error logging in user");
                }
                // On successful login, send success response
                res.send('success');
            });
        } catch (err) {
            console.error(err);
            // Return a server error response
            return res.status(500).send("Server error occurred");
        }
    },
    //log user out and destroy session
    postLogout: (req, res, next) => {
        // Call the logout method provided by passport.js to logout the user
        req.logout((err) => {
            if (err) {
                console.error("Error during logout process:", err);
                return next(err);
            }
            console.log("User logged out successfully");
    
            // Destroy the user session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error: Failed to destroy the session during logout.', err);
                    return next(err);
                }
    
                // Log that the session has been successfully destroyed
                console.log("User session destroyed successfully");
    
                // Set the user property to null to indicate the user is no longer authenticated
                req.user = null
                // Redirect to landing page after logout
                res.send("User successfully logged out");
            });
        });
    }
}