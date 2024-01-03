module.exports = {
    ensureAuth: function (req, res, next) {
      console.log("Checking authentication...");
      if (req.isAuthenticated()) {
        console.log("user is authenticated")
        return next();
      } else {
        console.log('user is not authenticated. Redirecting to login')
        res.redirect('/login')
      }
    },
    ensureGuest: function (req, res, next) {
      console.log('checking guest access')
      if (!req.isAuthenticated()) {
        console.log("user is not authenticated, proceed as guest")
        return next();
      } else {
        console.log('user is authenticated. Redirecting to home..')
        res.redirect("/tickets");
      }
    },
  };