const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Required')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password doesnot match password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    bookedSlot: []



});


//Public Profile

userSchema.methods.toPublicprofile = function () {
    const user = this;

    const userObject = user.toObject();

    delete userObject.bookedSlot;
    delete userObject.tokens;


    return userObject
}

//user Login function

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });


    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to Login')
    }
    return user
};


//Token generation

userSchema.methods.getAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisvenueapp');

    user.tokens = user.tokens.concat({ token });

    await user.save()
    return token
}


//password hashing

userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User