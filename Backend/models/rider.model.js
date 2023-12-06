const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const riderSchema = new Schema({
    uid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide User ID!"],
        unique: false,
        ref: 'User',
    },
    address: {
        type: String,
        required: [true, "Please provide Address!"],
        unique: false
    },
    img: {
        type: String,
        required: [false, "Please provide image!"],
        unique: false,
    },
    cnic: {
        type: String,
        required: [true, "Please provide CNIC!"],
        unique: [true, "CNIC already exists!"],
    },
    bikename: {
        type: String,
        required: [true, "Please provide Bike Name!"],
        unique: false,
    },
    bikenum: {
        type: String,
        required: [true, "Please provide Bike Number!"],
        unique: [true, "Bike Number already exists!"],
    },
    cnicimgs: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide CNIC image!"],
        unique: false,
    },
    licenseimg: {
        type: String,
        required: [false, "Please provide License image!"],
        unique: false,
    },
    status: {
        type: String,
        required: [false, "Please provide Status!"],
        unique: false,
        default: 'Unverified'
    },
    dutyStatus: {
        type: String,
        required: [false, "Please provide Duty Status!"],
        unique: false,
        default: 'Off'
    },
    currentLocation: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide Current Location!"],
        unique: false,
        default: {latitude: '0', longitude: '0'}
    },
}, {
    timestamps: true,
});

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;