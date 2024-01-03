//require modules
const mongoose = require('mongoose')
const Ticket = require('../models/Tickets') //Ticket Schema
const User = require('../models/User') //Ticket Schema

const calculateTimeLeft = (ticket) => {
    const startTime = new Date(ticket.startTime);
    const duration = ticket.duration;

    const endTime = new Date(startTime.getTime() + duration * 60000); // Convert duration to milliseconds
    const currentTime = new Date();
    const timeLeft = endTime - currentTime; // Time left in milliseconds

    if (timeLeft <= 0 || timeLeft === undefined) {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalMilliseconds: 0
        };
    }

    // Convert milliseconds into hours, minutes, and seconds
    let seconds = Math.floor((timeLeft / 1000) % 60);
    let minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    let hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        totalMilliseconds: timeLeft
    };
};

module.exports = {
    //get all tickets
    getTickets: async (req, res) => {
        try {
            console.log('Session:', req.session);
            const tickets = await Ticket.find().sort({ createdAt: 'desc'})
            res.send(tickets)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    //get user profile with tickets
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            const tickets = await Ticket.find({ user: req.user.id });
            res.send({ user, tickets });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error fetching user profile");
        }
    },
    //create new ticket
    createTicket: async (req, res) => {
        try {
            console.log(req.sessionID)
            const newTicket = new Ticket(req.body)
                // creator: req.user.id
            const savedTicket = await newTicket.save()
            res.send(savedTicket)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    //get single ticket with id
    getTicket: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id)
            res.send(ticket)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    //delete ticket
    deleteTicket: async (req, res) => {
        try {
            await Ticket.findByIdAndDelete(req.params.id)
            res.status(200).send("Ticket Deleted")
        } catch (error) {
            res.status(500).send(error)
        }
    },
    updateTicket: async (req, res) => {
        try { 
            const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
            
            if (!updatedTicket) {
                return res.status(404).send({ message: 'Ticket not found' });
            }
    
            res.status(200).send({ message: "Ticket updated successfully", data: updatedTicket });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getTimerState: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                return res.status(404).send('Ticket not found');
            }

            const timeLeft = calculateTimeLeft(ticket);
            res.json(timeLeft);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}







