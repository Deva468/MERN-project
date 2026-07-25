const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({

    name: String,

    department: String,

    issue: String,

    priority: String,

    status: {
        type: String,
        default: "Open"
    }

});

module.exports = mongoose.model("Ticket", TicketSchema);