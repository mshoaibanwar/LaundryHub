const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a Name!"],
        unique: false,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Already Exist!"],
        trim: true,
        minlength: 5
    },
    phone: {
        type: Number,
        required: [true, "Please provide Phone number!"],
        unique: [true, "Mobile Number already Registered!"],
        trim: true,
        minlength: 10
    },
    profile: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    pswrd: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
        trim: true,
        minlength: 8
    },
    confirmed: {
        type: Boolean,
        required: false,
        unique: false,
        default: false
    },
    token: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
}, {
    timestamps: true,
});

userSchema.method({
     authenticate(password) {
       return bcrypt.compare(password, this.pswrd);
    },
  });

const User = mongoose.model('User', userSchema);

module.exports = User;