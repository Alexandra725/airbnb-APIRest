const mongoose = require ('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema ({
    name: String,
    password: {
        type: String,
        select: false
    },
    email: {
        type: String,
        require: true
    },
    pic: String
});

module.exports= mongoose.model('user', userSchema);