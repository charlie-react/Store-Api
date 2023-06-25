require("dotenv").config();
require("express-async-errors")

// async errors

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

const productRouter = require("./routes/products")

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

// middleware

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products</a>');
});

app.use("/api/v1/products",productRouter)

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`listenin on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
