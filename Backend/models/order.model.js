const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    uid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user id!"],
        unique: false,
        ref: 'User',
    },
    shopid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide Shop id!"],
        unique: false,
        ref: 'Shop',
    },
    items: Schema.Types.Mixed,
    address: Schema.Types.Mixed,
    ocollection: Schema.Types.Mixed,
    delivery: Schema.Types.Mixed,
    delFee: {
        type: Number,
        required: [true, "Please provide Delivery Fee!"],
    },
    orderDate: {
        type: String,
        required: [true, "Please provide Order Date!"],
    },
    pMethod: {
        type: String,
        required: [true, "Payment Method Required"],
        unique: false
    },
    prices: Schema.Types.Mixed,
    tprice: {
        type: Number,
        required: [true, "Amount Required!"],
        unique: false,
        minlength: 1
    },
    status: {
        type: String,
        required: false,
        default: "Pending",
        unique: false,
    },
    ride: {
        type: Boolean,
        required: false,
        default: true,
        unique: false,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;