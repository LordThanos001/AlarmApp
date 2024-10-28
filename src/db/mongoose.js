// const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://alarm-app:0000@alarm-app.cftsb.mongodb.net/?retryWrites=true&w=majority&appName=Alarm-app', {
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});