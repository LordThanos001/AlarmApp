const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
require("./db/mongoose");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Reminder = require("./models/Reminder"); // Import the Reminder model
const path = require("path");
const port = process.env.PORT || 4040;

const partialsPath = path.join(__dirname, "../public");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.set("view engine", "hbs");
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(partialsPath));

// User registration
app.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect(`/dashboard/${user._id}`);
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

// User dashboard
app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/dashboard/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById({ _id: _id });
  res.render("dashboard", {
    name: user.name,
    regNo: user.regNo, 
    email: user.email,
  });
});

// Admin registration
app.post("/admin", async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.redirect(`/lectdash/${admin._id}`);
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

// Admin dashboard
app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/lectdash/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const admin = await Admin.findById(_id);
    res.render("lectdash", {
        name: admin.name,
        email: admin.email
    });
  } catch (err) {
    res.status(500).send("Error finding user: " + err.message);
  }
});

// Timetable route
app.get('/time-table', async (req, res) => {
    res.render('time-table');
});

// Route to create a new reminder
app.post("/api/reminders", async (req, res) => {
  try {
    const { title, description, dateTime } = req.body;
    const reminder = new Reminder({ title, description, dateTime });
    await reminder.save();
    res.status(201).json({ message: "Reminder created", reminder });
  } catch (err) {
    res.status(500).send("Error saving reminder: " + err.message);
  }
});

// Route to retrieve all reminders
app.get("/api/reminders", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).send("Error retrieving reminders: " + err.message);
  }
});

// Route to delete inactive reminders
app.delete("/api/reminders/:id", async (req, res) => {
  try {
    const reminderId = req.params.id;
    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);
    if (!deletedReminder) {
      return res.status(404).send("Reminder not found");
    }
    res.status(200).send({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting reminder: " + error.message);
  }
});


// Test route
app.get("/testing", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("server listening on port " + port);
});
