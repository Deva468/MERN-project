const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/helpdesk")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Routes
const ticketRoutes = require("./routes/ticketRoutes");
app.use("/tickets", ticketRoutes);

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});