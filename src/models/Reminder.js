// models/Reminder.js
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true }
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
