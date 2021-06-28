const express = require('express')
const cors = require('cors')
const session = require('express-session')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const MongoStore = require('connect-mongo')
const passport = require('passport')

const app = express()
const port = process.env.PORT || 3009
let dbConn = ''

const authRoutes = require('./routes/auth_routes')
const ticketRoutes = require('./routes/ticket_routes')
const apiRoutes = require("./routes/api_routes")
const phoneRoutes = require('./routes/phone_routes')
const { Base64 } = require('js-base64')

require('dotenv').config()
//--------------------------------------------------Cors-----------------------------------------
// Install middleware
var whitelist = ['http://localhost:3000','https://zealous-mcnulty-b23006.netlify.app/']

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        const whitelistIndex = whitelist.findIndex((url) => url.includes(origin))
        // console.log("found whitelistIndex", whitelistIndex)
        callback(null,whitelistIndex > -1)
    }
}));

//---------------------------------------------------DB---------------------------------------------
if(process.env.NODE_ENV == 'test'){
    dbConn = 'mongodb://localhost/clientportal_test'
    console.log('testing database')
}
else{
    dbConn = process.env.MONGODB_URI  || 'mongodb://localhost/clientportal'
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

//-----------------------------------------------session----------------------------------------------
app.enable('trust proxy')

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy:true,
    cookie: {
        maxAge: 1800000,
        httpOnly: false
    },
    store: MongoStore.create({mongoUrl: dbConn})
}


if (process.env.NODE_ENV === 'production'){
    sessionConfig.cookie.sameSite = 'none'
    sessionConfig.cookie.secure = true
}
app.use(session(sessionConfig));

app.use(express.urlencoded({extended: false}))
app.use(express.json())

require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes)
app.use('/user', authRoutes)
app.use('/ticket', ticketRoutes)

// app.use('/phone', phoneRoutes)

const server = app.listen(port, () => {
    console.log('listening on port:' + port)
})

module.exports = {
    app,
    server
}