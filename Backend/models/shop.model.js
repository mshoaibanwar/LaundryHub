const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopSchema = new Schema({
    uid: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide User ID!"],
        unique: false,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, "Please provide a Title!"],
        unique: [true, "Title already exists!"],
        minlength: 3
    },
    address: {
        type: String,
        required: [true, "Please provide Address!"],
        unique: false
    },
    lati: {
        type: String,
        required: [true, "Please provide Location!"],
        unique: false,
    },
    longi: {
        type: String,
        required: [true, "Please provide Location!"],
        unique: false,
    },
    prices: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide Prices!"],
        unique: false,
        default: [
            {"services": [{ serv: "Wash", pri: 40 }, { serv: "Dry Clean", pri: 80 }, { serv: "Iron", pri: 20 }], "title": "Kurta"}, 
            {"services": [{ serv: "Wash", pri: 30 }, { serv: "Dry Clean", pri: 60 }, { serv: "Iron", pri: 10 }], "title": "Shalwar"}, 
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 } ], "title": "Shalwar Kameez"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Shawl"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Sweater"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Hoodie"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Coat"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Track Suit"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Jacket"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Tie"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Trousers"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Jeans"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Pants"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Shorts"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Cap"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Scarf"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Gloves"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Socks"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Shirt"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Under Garments"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Bed Sheet"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Pillow Cover"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Curtains"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Single Blanket"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Towel"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Double Blanket"},
            {"services": [{ serv: "Wash", pri: 70 }, { serv: "Dry Clean", pri: 180 }, { serv: "Iron", pri: 10 }], "title": "Metress Cover"},
        ] 
    },
    img: {
        type: String,
        required: [false, "Please provide image!"],
        unique: false,
    },
    cnic: {
        type: String,
        required: [true, "Please provide CNIC!"],
        unique: true,
    },
    cnicimgs: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide CNIC image!"],
        unique: false,
    },
    status: {
        type: String,
        required: [false, "Please provide Status!"],
        unique: false,
        default: 'Unverified'
    },
    contact: {
        type: String,
        required: [true, "Please provide Contact!"],
        unique: false,
    },
    timing: {
        type: Schema.Types.Mixed,
        required: [false, "Please provide Timing!"],
        unique: false,
        default: [
            { day: 'Monday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Tuesday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Wednesday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Thursday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Friday', status: 'off', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Saturday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
            { day: 'Sunday', status: 'on', time: { start: '8:00 AM', end: '10:00 PM' } },
        ]
    },
    minDelTime: {
        type: Number,
        required: [false, "Please provide Minimum Delivery Time!"],
        unique: false,
        default: 2
    },
    minOrderPrice: {
        type: Number,
        required: [false, "Please provide Minimum Order Price!"],
        unique: false,
        default: 100
    },
}, {
    timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;