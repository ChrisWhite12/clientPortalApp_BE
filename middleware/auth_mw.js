const authRedirect = (req, res, next) => {              //if user already exists redirect to dashboard
    if (req.user) {
        res.redirect('/dashboard')
    } else {
        // Next points to the next piece of code that should be executed, another middleware maybe
        // or controller for the route
        return next()
    }
}

function authorise(req, res, next) {                //if not logged in redirect to login, otherwise continue
    if (req.user) {
        return next();
    } else {
        return res.redirect("/user/login");
    }
}

module.exports = {
    authRedirect,
    authorise
}