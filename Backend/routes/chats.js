const router = require("express").Router();
let Chat = require("../models/chat.model");

router.route("/").get((req, res) => {
  Chat.find()
    .then((chats) => {
      res.json(chats);
    })
    .catch((err) => res.status(404).json("Shops not found" + err));
});

router.route("/get/:chatid").get((req, res) => {
  Chat.findOne({ chatId: req.params.chatid })
    .then((chat) => {
      res.json(chat);
    })
    .catch((err) => res.status(404).json("Chat not found" + err));
});

router.route("/add").post((req, res) => {
  Chat.findOne({ chatId: req.body.id }).then((chat) => {
    if (chat) {
      Chat.findOneAndUpdate({ chatId: req.body.id }, { chat: req.body.chat })
        .then((updated) => {
          res.json("Chat Updated!");
        })
        .catch((err) => res.status(404).json("Chat not found" + err));
    } else {
      const chatId = req.body.id;
      const chat = req.body.chat;

      const newChat = new Chat();
      newChat.chatId = chatId;
      newChat.chat = chat;

      newChat
        .save()
        .then(() => res.json("Chat Added!"))
        .catch((err) => res.status(404).send(err));
    }
  });
});

module.exports = router;
