const mongoose = require('mongoose');

// set up connection for test database
const dbConn = 'mongodb://localhost/clientportal_test'

const connectToDb = async() => {
    // Connect to the database (same as we do in app.js)
    // mongoose.disconnect()
    await mongoose.connect(dbConn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            // userCreateIndex: true
        },
        (err) => {
            if (err) {
                console.log('Error connecting to database', err);
            } else {
                console.log('Connected to database!');
            }
        });
};

const disconnectFromDb = async() => {
    await mongoose.disconnect()
};

module.exports = {
    connectToDb,
    disconnectFromDb
};