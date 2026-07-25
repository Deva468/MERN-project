const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");

// Get All Tickets
router.get("/", async (req, res) => {

    const tickets = await Ticket.find();

    res.json(tickets);

});

// Add Ticket
router.post("/", async (req, res) => {

    const ticket = new Ticket(req.body);

    await ticket.save();

    res.json({
        message: "Ticket Added"
    });

});

module.exports = router;