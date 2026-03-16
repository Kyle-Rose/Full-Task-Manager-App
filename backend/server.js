const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");

const app = express();

app.use(cors()); // <--- allow all origins
app.use(express.json());

// routes
app.use("/users", usersRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});