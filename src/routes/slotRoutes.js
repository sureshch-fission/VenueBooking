const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const venueBookingModel = require('../models/slotbookingModel')
const ownerModel = require('../models/ownervenueModel')

const moment = require('moment')


//Slot Booking

router.post('/:id/slotbooking', auth, async (req, res) => {


    const { bookingDate, name, reqSlot } = req.body;

    try {


        const bookings = await venueBookingModel.find({ bookingDate });

        const venue = await ownerModel.findById(req.params.id);

        const venueIdValidating = venue._id.valueOf() === req.params.id


        const isBooked = bookings.some((booking) => booking.slot === reqSlot);
        if (!isBooked && venueIdValidating) {
            const newBooking = new venueBookingModel({
                bookingDate,
                name,
                slot: reqSlot,
                venuId: venue._id.valueOf()
            });

            //saving to database
            await newBooking.save();


            res.status(201).send(newBooking);
        } else {
            res.status(406).send(`${reqSlot} is already booked `);
        }
    } catch (err) {

        res.status(500).send("Error: " + err.message);
    }
});



//get Slots by DATE
router.get('/getAllSlots', auth, async (req, res) => {

    const { date } = req.body;

    const bookingDate = moment(new Date(date));
    const currentDate = moment(new Date());


    let slots = ["MorningSlot", "AfternoonSlot", "EveningSlot"];
    try {
        // checking givendate should be greater then current date
        if (bookingDate > currentDate) {
            const bookings = await venueBookingModel.find({ bookingDate });



            //filtering out available slots
            let arr = [];
            for (let slot of slots) {

                let count = 0;
                for (let booking of bookings) {
                    console.log(booking)
                    if (slot === booking.slot) {
                        count++;
                        break;
                    }
                }
                if (count === 0) {
                    arr.push(slot);
                }
            }
            res.status(200).send({ message: "Available slots", data: arr });
        } else {
            res.status(406).send({ message: "Please enter valid date" });
        }
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
});


//UPDATE BOOKED SLOT
router.patch('/updateBookedslots/:id', auth, async (req, res) => {
    try {

        const slot = await venueBookingModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        await slot.save();
        res.send(slot)
    } catch (error) {
        res.status(400).send(error)
    }

});

//User can DELETE the Booked Slot
router.delete('/bookedslots/:id', auth, async (req, res) => {

    const id = req.params.id

    try {

        const slot = await venueBookingModel.findById(id);
        //console.log(slot)
        slot.remove()
        await slot.save()
        res.send('Slot removed')

    } catch (error) {
        res.status(200).send('Deleted')
    }
});






module.exports = router