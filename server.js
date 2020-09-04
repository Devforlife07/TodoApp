const express = require("express");
const app = express();
const dotenv = require("dotenv").config({
  path: "./config/.env",
});
const connectDB = require("./db/db")();
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use("/api/login", require("./routes/login"));
app.use("/api/register", require("./routes/register"));
app.use("/api/todo", require("./routes/todo"));
app.use("*", (req, res) => {
  res.send("Invalid URL")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server Is Up On Port " + PORT);
});