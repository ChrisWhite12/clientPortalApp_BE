const mongoose = require('mongoose');


const connectToDb = () => {
    // Connect to the database (same as we do in app.js)
    // mongoose.disconnect()
    mongoose.connect(process.env.MONGODB_URI_TEST, {
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

const disconnectFromDb = () => {
    mongoose.disconnect()
};

module.exports = {
    connectToDb,
    disconnectFromDb
};