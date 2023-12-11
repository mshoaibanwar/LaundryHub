const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rideSchema = new Schema({
    uid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide User ID!"],
        unique: false,
        ref: 'User',
    },
    sid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide Shop ID!"],
        unique: false,
        ref: 'Shop',
    },
    rid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [false, "Please provide Rider ID!"],
        unique: false,
        ref: 'Rider',
    },
    pLoc: {
        type: String,
        required: [true, "Please provide Pickup Address!"],
        unique: false
    },
    dLoc: {
        type: String,
        required: [true, "Please provide Delivery Address!"],
        unique: false
    },
    pCord: {
        type: Schema.Types.Mixed,
        required: [true, "Please provide Pickup Coordinates!"],
        unique: false,
        default: {lati: '0', longi: '0'}
    },
    dCord: {
        type: Schema.Types.Mixed,
        required: [true, "Please provide Delivery Coordinates!"],
        unique: false,
        default: {lati: '0', longi: '0'}
    },
    oItems: {
        type: Schema.Types.Mixed,
        required: [true, "Please provide Order Items!"],
        unique: false
    },
    status: {
        type: String,
        required: [false, "Please provide Status!"],
        unique: false,
        default: 'Pending'
    },
    riderCords: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide Rider Location!"],
        unique: false,
        default: {lati: '0', longi: '0'}
    },
    pMethod: {
        type: String,
        required: [true, "Please provide Payment Method!"],
        unique: false
    },
    fare: {
        type: Number,
        required: [true, "Please provide Fare!"],
        unique: false,
        default: 0
    },
    bkdBy: {
        type: String,
        required: [true, "Please provide Booked By!"],
        unique: false,
        default: 'Customer'
    },
}, {
    timestamps: true,
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;