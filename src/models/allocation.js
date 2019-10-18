const mongoose = require ('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema ({
    checkin: Date,
    checkout: Date,
    price: Number,
    user:{
        name: String,
        pic: String
    }
});

const allocationSchema = new Schema({
    adress: String,
    type: String,
    pc: Number,
    owner: {
        name: String,
        pic: String
    },
    bookings: [ bookSchema ]
});
module.exports= mongoose.model('allocation', allocationSchema)

