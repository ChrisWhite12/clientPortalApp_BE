const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const fetch = require('node-fetch')

const app = express()
const port = process.env.PORT || 3009
let dbConn = ''

const authRoutes = require('./routes/auth_routes')
const ticketRoutes = require('./routes/ticket_routes')
const apiRoutes = require("./routes/api_routes")
const phoneRoutes = require('./routes/phone_routes')
const { Base64 } = require('js-base64')

require('dotenv').config()

if(process.env.NODE_ENV == 'test'){
    dbConn = 'mongodb://localhost/clientportal_test'
    console.log('testing database')
}
else{
    // dbConn = 'mongodb://localhost/clientportal'
    dbConn = process.env.MONGODB_URI 
    console.log('normal database')
}


mongoose.connect(dbConn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},
(err) => {
    if (err) {
        console.log('Error connecting to database', err);
    } else {
        console.log('Connected to database!');
    }
});

// Install middleware
var whitelist = ['http://localhost:3000','https://zealous-mcnulty-b23006.netlify.app/']

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        const whitelistIndex = whitelist.findIndex((url) => url.includes(origin))
        console.log("found whitelistIndex", whitelistIndex)
        callback(null,whitelistIndex > -1)
    }
}));

app.use(session({
    secret:'express',
    resave: true,
    saveUninitialized: true,
    proxy:true,
    cookie: {
        maxAge: 1800000,
        secure: true,
        sameSite: 'none',
        httpOnly: false
    }
}));

app.use(express.urlencoded({extended: false}))
app.use(express.json())

require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('session ',req.session)
    console.log('user ',req.user)
    next()
})

app.get("/", (req,res) => {
    res.sendStatus(200)
})

app.get("/test", (req,res) => {
    fetch(`https://api.au2.cliniko.com/v1/patients`, {
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
    .then(response => response.json())
    .then(data => {
        res.send(data)
        res.status(200)
    })
    .catch(err => console.log(err))
    console.log('test route')
    // res.send({message: "test"})
    // res.status(200)
})

app.use('/api', apiRoutes)
app.use('/user', authRoutes)
app.use('/ticket', ticketRoutes)
app.use('/phone', phoneRoutes)

const server = app.listen(port, () => {
    console.log('listening on port:' + port)
})

module.exports = {
    app,
    server
}