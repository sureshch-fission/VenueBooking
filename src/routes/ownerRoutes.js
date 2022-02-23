const express = require('express');
const Owner = require('../models/ownervenueModel');
const venueBookingModel = require('../models/slotbookingModel');
const OwnerAuth = require('../middleware/ownerauth');
const User = require('../models/userModel');

const router = express.Router();




//Owner Rigister

router.post('/owner/register', async (req, res) => {


    try {
        const ownerData = new Owner(req.body)

        await ownerData.save();
        res.send({ ownerData: ownerData.toPublicprofile() })


    } catch (error) {
        res.status(400).send(error.message)
    }
});



//Login

router.post('/owner/login', async (req, res) => {

    try {
        const OwnerData = await Owner.findByCredentials(req.body.OwnerEmail, req.body.OwnerPassword);

        const token = await OwnerData.getAuthToken();

        res.status(200).send(`Login Success token:${token}`)
    } catch (error) {
        res.status(400).send(error.message)


    }
});



//update order Confirmation
router.patch('/owner/confirmation/:id', OwnerAuth, async (req, res) => {
    try {

        const slotConfirmation = await venueBookingModel.findByIdAndUpdate(req.params.id, {
            confirmation: true
        }, {
            new: true,
            runValidators: true
        });
        await slotConfirmation.save();


        if (slotConfirmation) {
            const user = await User.find({});
            user.forEach(user => {

                user.bookedSlot.push(slotConfirmation)
                user.save();
            })
        }
        res.send(slotConfirmation)
    } catch (error) {
        res.status(400).send(error.message)
    }

});


//To cancel Slot booking Request
router.patch('/owner/request/:id', OwnerAuth, async (req, res) => {
    try {

        const slotConfirmation = await venueBookingModel.findByIdAndUpdate(req.params.id, {
            request: false
        }, {
            new: true,
            runValidators: true
        });
        await slotConfirmation.save();
        res.send(slotConfirmation)
    } catch (error) {
        res.status(400).send(error.message)

    }

});


module.exports = router