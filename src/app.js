const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const app = express();

const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const payRoute = require("./routes/payment");



// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/", taskRoute);
app.use("/", authRoute);
// Use the payment routes
app.use("/", payRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.listen(3000);
