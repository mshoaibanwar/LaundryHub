const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: [true, "Please provide Chat ID!"],
    unique: true,
  },
  chat: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
