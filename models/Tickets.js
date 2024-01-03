const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    // creator: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User", //reference user model
    // //     required: true,
    // },
    task: {
        type: String,
        required: true,
    },
    startCost: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    timer: {
        type: String,
    },
    auctions: {
        type: String,
    },
    cycleCount: {
        type: String,
    },
    maxReward: {
        type: String,
        required: true,
    },
    increment: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date
    },
    duration: {
       type: Number,
    },
    currentValue: {
        type: String,
    }
})


module.exports = mongoose.model("Ticket", ticketSchema, "Tickets")