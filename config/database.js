const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
//connect to database
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', function () {
    // we're connected!
    console.log('database connected');
    console.log('database name: ' + db.name);
});

module.exports = db;
