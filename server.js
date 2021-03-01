const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
// Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect Database

connectDB();

// Routes
const events = require("./routes/events");
const users = require("./routes/users");
const app = express();

//Body parser
app.use(express.json());

//Dev Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/events", events);
app.use("/api/v1/users", users);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

//Handle unhandeled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server
  server.close(() => process.exit(1));
});
