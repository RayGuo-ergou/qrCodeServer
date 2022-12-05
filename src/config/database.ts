import mongoose, { ConnectOptions } from 'mongoose';

const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/express-ts';

void mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .catch((err) => {
        console.log('Error connecting to database', err);
    });

const db = mongoose.connection;
//connect to database
db.on('error', function (err) {
    console.log('Database error');
    console.log(err);
});
db.once('open', function () {
    // we're connected!
    console.log('database connected');
    console.log('database name: ' + db.name);
});

export default db;
