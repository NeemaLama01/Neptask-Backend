const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const app = express();

const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const payRoute = require("./routes/payment");
const imageRoute = require("./routes/image");

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/", taskRoute);
app.use("/", authRoute);
// Use the payment routes
app.use("/", payRoute);
app.use("/", imageRoute); // Updated path for clarity
app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.listen(3000, () => {
    console.log("Server running on port 3000");
  });