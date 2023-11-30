const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    type: {
        type: String,
        required: [true, "Please provide Address Type!"],
        unique: false,
    },
    name: {
        type: String,
        required: [true, "Please provide Name!"],
        unique: false,
    },
    num: {
        type: Number,
        required: [true, "Please provide Mobile Number!"],
        unique: false,
    },
    add: {
        type: String,
        required: [true, "Please provide Address!"],
        unique: false,
    },
    cords: mongoose.Schema.Types.Mixed,
    uid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide User ID!"],
        unique: false,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;