const router = require('express').Router();
let Notification = require('../models/notification.model');

var admin = require("firebase-admin");

router.route('/count').get((req, res) => {
  Notification.find()
      .then((notis) => {
        Notification.countDocuments()
              .then((count)=> res.json({"Count": count}))
              .catch(err => res.status(404).json("Count Error: " + err));
      })
      .catch(err => res.status(404).json("Error: " + err));
});

router.route('/user/count/unread/:id').get((req, res) => {
        Notification.countDocuments({'userID': req.params.id, 'status': 'unread', 'to': 'user'})
              .then((count)=> res.json({"Count": count}))
              .catch(err => res.status(404).send("Count Error: " + err));
});

router.route('/seller/count/unread/:id').get((req, res) => {
        Notification.countDocuments({'userID': req.params.id, 'status': 'unread', 'to': 'seller'})
              .then((count)=> res.json({"Count": count}))
              .catch(err => res.status(404).send("Count Error: " + err));
});

router.route('/user/:id').get((req, res) => {
  Notification.find({ 'userID': req.params.id, 'to': 'user' })
      .then((notis) => {
              res.json(notis);
      })
      .catch(err => res.status(404).json(`Notis with user id: ${req.params.id} not found`));
});

router.route('/seller/:id').get((req, res) => {
  Notification.find({ 'userID': req.params.id, 'to': 'seller' })
      .then((notis) => {
              res.json(notis);
      })
      .catch(err => res.status(404).json(`Notis with seller id: ${req.params.id} not found`));
});

router.route('/add').post((req, res) => {

  const uid = req.body.uid;
  const title = req.body.title;
  const notibody = req.body.notibody;
  const to = req.body?.to || 'user';

  const newNoti = new Notification(); 
  newNoti.userID = uid;      
  newNoti.title = title;        
  newNoti.body = notibody;
  newNoti.to = to;
          
  newNoti.save()
      .then(() => res.json('Notification Added!'))
      .catch(err => res.status(404).send(err));

});

router.route('/user/setread/:id').post((req, res) => {
  Notification.updateMany({ 'userID': req.params.id, 'to': 'user' }, { $set: { 'status': 'read' } })
    .then(() => res.json('Notification Status Updated!'))
    .catch(err => res.status(404).send(err));
});

router.route('/seller/setread/:id').post((req, res) => {
  Notification.updateMany({ 'userID': req.params.id, 'to': 'seller' }, { $set: { 'status': 'read' } })
    .then(() => res.json('Notification Status Updated!'))
    .catch(err => res.status(404).send(err));
});


module.exports = router;