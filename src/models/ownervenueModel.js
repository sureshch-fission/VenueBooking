
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator')


const OwnerSchema = new mongoose.Schema({
   
    OwnerName:{
        type:String,
        required:true
    },
    OwnerEmail:{
        type:String,
        required:true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Required')
            }
        }
    },
    OwnerPassword:{
        type:String,
        required:true,
        minlength:6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password doesnot match password')
            }
        }
    },
    VenueName:{
        type:String,
        required:true
    },
    VenueDetail:{
        type:String,
        required:true
    },
    VenuePrice:{
        type:String,
        required:true
    },
    VenueRating:{
       type:Number,
       required:true,
       min:0,
       max:5
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

});


//Public Profile

OwnerSchema.methods.toPublicprofile = function () {
    const owner = this;

    const ownerObject = owner.toObject();

    delete ownerObject.tokens;


    return ownerObject
}


//Owner Login Function
OwnerSchema.statics.findByCredentials = async (  OwnerEmail, OwnerPassword) => {

    const owner = await Owner.findOne({  OwnerEmail });
         console.log(owner)

    if (!owner) {
        throw new Error('Unable to login')
    }

    const isMatch = bcrypt.compare( OwnerPassword, owner. OwnerPassword);

    if (!isMatch) {
        throw new Error('Unable to Login')
    }
    return owner
};



//Token generation

OwnerSchema.methods.getAuthToken = async function () {
    const owner = this
    const token = jwt.sign({ _id: owner._id.toString() }, 'thisisvenueOwnerapp');

    owner.tokens = owner.tokens.concat({ token });

    await owner.save()
    return token
}


//password hashing

OwnerSchema.pre('save', async function (next) {

    const owner = this

    if (owner.isModified('password')) {
        owner.password = await bcrypt.hash(owner.password, 8)
    }
    next()
})

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner