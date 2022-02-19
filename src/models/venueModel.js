const mongoose = require('mongoose')


const venueSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,

    },
    Date: {
        type: Date,
        required: true

    },
    Time: {
        type: String,
        required: true,
        unique:false

    },
    isSlotAvailable: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true
});


venueSchema.methods.toPublicprofile = function () {
    const slot = this;

    const slotObject = slot.toObject();

    delete slotObject.isSlotAvailable;


    return slotObject
}

//find slots by SlotName

venueSchema.statics.findBySlotName = async (Name) => {


    const slot = await Slots.findOne({ Name });

    if (!slot) {
        throw new Error('Slot is Not Available')
    }

    return slot

}


venueSchema.statics.findByDate = async (Date) => {


    const slot = await Slots.find({ Date });
   
    if (!slot ) {
        throw new Error('Slot is Not Available')
    }

    return slot

}



const Slots = mongoose.model('Slots', venueSchema);


module.exports = Slots