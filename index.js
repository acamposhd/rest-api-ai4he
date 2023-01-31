const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const seedRoute = require("./routes/seed");
const userRoute = require("./routes/users");
const recordRoute = require("./routes/records");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use("/seed", seedRoute);
app.use("/users", userRoute);
app.use("/tab-records", recordRoute);

app.listen(process.env.PORT || 3333);
