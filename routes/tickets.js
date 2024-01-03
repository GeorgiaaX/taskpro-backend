//require modules
const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticket')
// const { ensureAuth } = require('../middleware/auth')


//@desc get all tickets
//@Router /tickets
router.get('/', ticketController.getTickets)


//@desc get single ticket
//@router /tickets/:id
router.get('/:id', ticketController.getTicket)


//@desc create a new ticket
//@router /tickets
router.post('/', ticketController.createTicket)

// @desc Update a ticket
// @router PATCH /tickets/:id
router.patch('/:id', ticketController.updateTicket);

//@desc delete ticket
//@router /tickets/:id
router.delete('/:id',  ticketController.deleteTicket)

// @desc Get the current state of the timer for a specific ticket
// @router GET /tickets/timer/:id
router.get('/timer/:id', ticketController.getTimerState);


module.exports = router