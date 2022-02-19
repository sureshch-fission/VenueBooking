const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Slots = require('../models/venueModel');




const auth = async (req, res, next) => {


    try {

        const token = await req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, 'thisisvenueapp');

        const user = await User.findOne({ id: decoded._id, 'tokens.token': token });
        const slot = await Slots.findOne({ id: decoded._id });



        if (!user) {
            throw new Error('Please Authenticate')
        }

        req.user = user
        req.slot = slot
        req.token = token

        next()


    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }

}
module.exports = auth