const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');

const app = express()
const port = process.env.PORT || 3009

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const dbConn = 'mongodb://localhost/clientportal'
const authRoutes = require('./routes/auth_routes')

app.use( express.urlencoded( {extended: false }) )
app.use( express.json() )

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

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
var whitelist = ['http://localhost:3000']

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}));
app.use(bodyParser.json());
app.use(session({
    // resave and saveUninitialized set to false for deprecation warnings
    secret: "Express is awesome",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000
    }
}));

require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
app.use(express.static('public'));

app.get('/', (req, res) => {
res.render('pages/dashboard')
})

app.use('/user', authRoutes)

app.listen(port, () => {
    console.log('listening on port:' + port)
})