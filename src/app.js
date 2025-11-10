import express from "express";
import serverless from "serverless-http";

import routes from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  console.log("path: ", req.path);
  next();
});

app.use("/", routes);

app.use((req, res, next) => {
  res.status(404).send({ message: "Not FOUND" });
});

export const handler = serverless(app);
