require("dotenv").config(); 

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");
const isProduction = process.env.NODE_ENV === "production";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.set("trust proxy", 1);


app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,           
    sameSite: isProduction ? "none" : "lax", 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


app.use(express.static(path.join(__dirname, "..", "front-end")));


app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);


app.get("/", (req, res) => {
  res.redirect("/login/login.html");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});