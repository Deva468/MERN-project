require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const Ticket = require("./models/Ticket");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "tickets.json");

let isMongoConnected = false;

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readTicketsFromFile() {
  ensureDataFile();
  const content = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(content);
}

function writeTicketsToFile(tickets) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2), "utf8");
}

async function connectToDatabase() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set. Using file storage instead.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.warn("MongoDB unavailable. Using file storage instead.");
    console.warn(error.message);
  }
}

async function getAllTickets() {
  if (isMongoConnected) {
    return Ticket.find().sort({ _id: -1 });
  }

  return readTicketsFromFile();
}

async function createTicket(payload) {
  const ticketData = {
    name: payload.name || "",
    department: payload.department || "",
    issue: payload.issue || "",
    priority: payload.priority || "Low",
    status: payload.status || "Open",
  };

  if (isMongoConnected) {
    const ticket = new Ticket(ticketData);
    await ticket.save();
    return ticket;
  }

  const tickets = readTicketsFromFile();
  const ticket = {
    _id: new Date().toISOString(),
    ...ticketData,
  };

  tickets.unshift(ticket);
  writeTicketsToFile(tickets);
  return ticket;
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", storage: isMongoConnected ? "mongo" : "file" });
});

app.get("/tickets", async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch tickets" });
  }
});

app.post("/tickets", async (req, res) => {
  try {
    const ticket = await createTicket(req.body);
    res.status(201).json({
      message: "Ticket Added",
      ticket,
      storage: isMongoConnected ? "mongo" : "file",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to add ticket" });
  }
});

app.delete("/tickets/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      await Ticket.findByIdAndDelete(req.params.id);
    } else {
      const tickets = readTicketsFromFile().filter((ticket) => ticket._id !== req.params.id);
      writeTicketsToFile(tickets);
    }

    res.json({ message: "Ticket Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to remove ticket" });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });