const serverless = require("serverless-http");
const express = require("express");
const app = express();
app.use(express.json()); // <--- ADD THIS

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!asdf",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Foundasdf",
  });
});

exports.handler = serverless(app);
