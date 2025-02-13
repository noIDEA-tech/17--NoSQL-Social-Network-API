import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/postDB');

export default mongoose.connection;


//line 3 wrap Mongoose around local connection to MongoDB
