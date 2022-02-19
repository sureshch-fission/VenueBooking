const express = require('express');
const User = require('../models/userModel');
const auth = require('../middleware/auth')



const router = express.Router();



//Create A Customer Account

router.post('/users', async (req, res) => {

    const user = new User(req.body);
    try {

        const token = await user.getAuthToken()
        await user.save();

        res.send({ user, token })

    } catch (error) {

        res.status(400).send(error)


    }
});


//coustmer Login


router.post('/users/login', auth, async (req, res) => {

    try {

        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken()
        res.send({ user: user.toPublicprofile(), token })

    } catch (error) {
        res.status(404).send(error)

    }
})

module.exports = router