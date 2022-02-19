const express = require('express')
const router = express.Router();
const Venu = require('../models/venueModel');
const auth = require('../middleware/auth');
const Slots = require('../models/venueModel');
const User = require('../models/userModel');



//creating Slots

router.post('/slots/createslot', async (req, res) => {

    const slot = new Venu(req.body)

    try {
        await slot.save();
        res.send(slot)
    } catch (error) {
        res.status(400).send(error)
    }

});


//Modify/update the Slot

router.patch('/slots/:id', async (req, res) => {



    try {

        const slot = await Venu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        await slot.save();
        res.send(slot)
    } catch (error) {
        res.status(400).send(error)
    }

});

//get All slots

router.get('/slots', auth, async (req, res) => {

    try {

        const slots = await Slots.find({});

        res.send(slots)
    } catch (error) {
        res.status(400).send(error)

    }

});


//Delete the Slots
router.delete('/slots/:id', auth, async (req, res) => {

    const id = req.params.id

    try {

        const slot = await Slots.findById(id);
        slot.remove()
        await slot.save()
        res.send('Slot removed')

    } catch (error) {
        res.status(404).send(error)
    }
})

//get Slots by ParticularDate

router.get('/slots/date', auth, async (req, res) => {

    try {
        const slots = await Slots.findByDate(req.body.Date)

        if (!slots) {
            res.send('Slots are Not Available For this Date')
        }
        res.status(200).send(slots)
    } catch (error) {
        res.status(400).send(error)

    }
})

//slots booking with Authentication

router.post('/slots/slotbooking', auth, async (req, res) => {

    try {

        const Selectedslot = await Slots.findBySlotName(req.body.Name)
        const user = await User.find({})

        user.forEach(user => {
            user.bookedSlot.push(Selectedslot.toPublicprofile());

            user.save()
        })


        if (!Selectedslot.isSlotAvailable === false) {
            Selectedslot.isSlotAvailable = false

            res.status(200).send('Your Slot is Booked')
        }




    } catch (error) {
        res.status(400).send('slot is not Available ')

    }

});







module.exports = router