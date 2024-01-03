const path = require('path');
const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors')
const connectDB = require('./config/db'); //database connection
const passport = require('passport'); //passport for user auth
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ticketRoutes = require('./routes/tickets')
const mainRoutes = require('./routes/main')


//load config
dotenv.config({ path: './config/config.env' })

// Passport config
require("./config/passport")(passport);

//connect to database
connectDB()

const app = express()


//Body Parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:3001', // Front-end domain
  credentials: true, // Allow credentials (cookies) to be sent
}));



//Session middleware


app.use(session({
  secret: 'keyboard cat', // Secret used to sign the session ID cookie
  resave: false, // Avoid resaving sessions that haven't changed
  saveUninitialized: false, // Don't save uninitialized sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
}),
  cookie: {
    httpOnly: true, // Makes the cookie inaccessible to client-side JS (enhances security)
    maxAge: 1000 * 60 * 60 * 24 // Sets the cookie's expiration time (e.g., one day here)
  }
}));


app.get('/db', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Number of views: ${req.session.views}`);
    console.log(req.session.views)
  } else {
    req.session.views = 1;
    res.send('Welcome to this page for the first time!');
  }
});


app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', mainRoutes)
app.use('/tickets', ticketRoutes); //tickets routes

//set PORT
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

