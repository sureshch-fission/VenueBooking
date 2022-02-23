const jwt = require('jsonwebtoken');
const Owner = require('../models/ownervenueModel');





const Ownerauth = async (req, res, next) => {


    try {

        const token = await req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, 'thisisvenueOwnerapp');

        const owner = await Owner.findOne({ id: decoded._id, 'tokens.token': token });
       



        if (!owner) {
            throw new Error('Please Authenticate')
        }

        req.owner = owner
        req.token = token

        next();


    } catch (error) {
        res.status(400).send(error.message);
        console.log(error)
  
    }

}
module.exports = Ownerauth