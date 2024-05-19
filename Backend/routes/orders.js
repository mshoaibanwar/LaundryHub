const router = require("express").Router();
let Order = require("../models/order.model");
const User = require("../models/user.model");
const Shop = require("../models/shop.model");
const Notification = require("../models/notification.model");

const sendEmail = require("../controllers/email.send");
const msgs = require("../controllers/email.msgs");
const templates = require("../controllers/email.templates");

var admin = require("firebase-admin");

router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => res.status(404).json("Orders not found" + err));
});

router.route("/count/").get((req, res) => {
  Order.find()
    .then((orders) => {
      Order.countDocuments()
        .then((count) => res.json({ Count: count }))
        .catch((err) => res.status(404).json("Count Error: " + err));
    })
    .catch((err) => res.status(404).json("Error: " + err));
});

router.route("/count/pending/").get((req, res) => {
  Order.find()
    .then((orders) => {
      Order.countDocuments({ status: "Pending" })
        .then((count) => res.json({ Count: count }))
        .catch((err) => res.status(404).json("Count Error: " + err));
    })
    .catch((err) => res.status(404).json("Error: " + err));
});

router.route("/shop/dashValuesCount/:id").get(async (req, res) => {
  try {
    let counts = {};

    const totalOrdersCount = await Order.countDocuments({
      shopid: req.params.id,
    });
    counts.orders = totalOrdersCount;

    const activeOrdersCount = await Order.countDocuments({
      shopid: req.params.id,
      status: { $nin: ["Delivered", "Cancelled"] },
    });
    counts.ordersActive = activeOrdersCount;

    const orders = await Order.find({ shopid: req.params.id });
    const totalEarnings = orders.reduce((totalEarnings, order) => {
      const orderEarnings = order.tprice - order.delFee * 2;
      return totalEarnings + orderEarnings;
    }, 0);
    counts.earnings = totalEarnings;

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.route("/user/:id").get((req, res) => {
  Order.find({ uid: req.params.id })
    .then((order) => {
      order.reverse();
      res.json(order);
    })
    .catch((err) =>
      res.status(404).json(`Order with id: ${req.params.id} not found`)
    );
});

router.route("/shop/:id").get((req, res) => {
  Order.find({ shopid: req.params.id })
    .then((order) => {
      order.reverse();
      res.json(order);
    })
    .catch((err) =>
      res.status(404).json(`Order with id: ${req.params.id} not found`)
    );
});

router.route("/order/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      res.json(order);
    })
    .catch((err) =>
      res.status(404).json(`Order with id: ${req.params.id} not found`)
    );
});

router.route("/add").post((req, res) => {
  const uid = req.body.uid;
  const shopid = req.body.shopid;
  const items = req.body.items;
  const address = req.body.address;
  const ocollection = req.body.ocollection;
  const delivery = req.body.delivery;
  const delFee = req.body.delFee;
  const orderDate = req.body.orderDate;
  const pMethod = req.body.pMethod;
  const prices = req.body.prices;
  const tprice = req.body.tprice;
  const status = req.body.status;
  const ride = req.body.ride;

  const newOrder = new Order();
  newOrder.uid = uid;
  newOrder.shopid = shopid;
  newOrder.items = items;
  newOrder.address = address;
  newOrder.ocollection = ocollection;
  newOrder.delivery = delivery;
  newOrder.delFee = delFee;
  newOrder.orderDate = orderDate;
  newOrder.pMethod = pMethod;
  newOrder.prices = prices;
  newOrder.tprice = tprice;
  newOrder.status = status;
  newOrder.ride = ride;

  newOrder
    .save()
    .then((order) => {
      User.findById(order.uid)
        .then(async (user) => {
          if (user.token != "") {
            admin.messaging().sendToDevice(user.token, {
              notification: {
                title: `Your Order is Placed!`,
                body: `Your order # ${order._id} is placed successfully. It will be picked on ${orderDate} at ${order.ocollection} and will be delivered on ${order.delivery.date} at ${order.delivery.time}.`,
              },
            });
          }
          await Notification.create({
            userID: order.uid,
            title: `Your Order is Placed!`,
            body: `Your order # ${order._id} is placed successfully. It will be picked on ${orderDate} at ${order.ocollection} and will be delivered on ${order.delivery.date} at ${order.delivery.time}.`,
            to: "user",
          });
          const wss = req.app.get("wss");
          wss.clients.forEach((client) => {
            wss.clients.forEach(function each(client) {
              if (client.id && JSON.parse(client.id).userId == order.uid)
                client.send(JSON.stringify({ notification: "Order Placed!" }));
            });
          });

          Shop.findById(order.shopid)
            .then((shop) => {
              User.findById(shop.uid)
                .then(async (user) => {
                  if (user.token != "") {
                    admin.messaging().sendToDevice(user.token, {
                      notification: {
                        title: `You got a new Order!`,
                        body: `You received a new order request. View order to accept or reject.`,
                      },
                    });
                  }
                  await Notification.create({
                    userID: user._id,
                    title: `You got a new Order!`,
                    body: `You received a new order request. View order to accept or reject.`,
                    to: "seller",
                  });
                  const wss = req.app.get("wss");
                  wss.clients.forEach((client) => {
                    wss.clients.forEach(function each(client) {
                      if (client.id && JSON.parse(client.id).userId == user._id)
                        client.send(
                          JSON.stringify({ notification: "New Order!" })
                        );
                    });
                  });

                  User.findById(order.uid)
                    .then(async (user) => {
                      sendEmail(user.email, templates.newOrder(uid));
                    })
                    .catch((err) => console.log(err));

                  res.json({ id: order._id, msg: "Order Placed!" });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(404).send(err));
});

router.route("/update/:id").post((req, res) => {
  Order.findByIdAndUpdate(req.params.id, { status: req.body.status })
    .then((order) => {
      const wss = req.app.get("wss");
      wss.clients.forEach((client) => {
        wss.clients.forEach(function each(client) {
          if (client.id && JSON.parse(client.id).userId == order.uid)
            client.send(
              JSON.stringify({ orderStatus: req.body.status, oid: order._id })
            );
        });
      });
      User.findById(order.uid)
        .then((user) => {
          if (user.token != "") {
            admin.messaging().sendToDevice(user.token, {
              notification: {
                title: `Your Order is ${req.body.status}!`,
                body: `Your order # ${order._id} is set to ${req.body.status}!`,
              },
            });
          }
          Notification.create({
            userID: user._id,
            title: `Your Order is ${req.body.status}!`,
            body: `Your order # ${order._id} is set to ${req.body.status}!`,
            to: "user",
          });
          res.json("Order Status Updated!");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.status(404).send("error occured" + err);
      console.log(err);
    });
});

router.route("/reschedule/delivery/:id").post((req, res) => {
  Order.findByIdAndUpdate(req.params.id, { delivery: req.body.delivery })
    .then(() => res.json("Order ReScheduled!!"))
    .catch((err) => res.status(404).json(err));
});

router.route("/reschedule/collection/:id").post((req, res) => {
  Order.findByIdAndUpdate(req.params.id, { ocollection: req.body.collection })
    .then(() => res.json("Order ReScheduled!!"))
    .catch((err) => res.status(404).json(err));
});

router.route("/:status").get((req, res) => {
  // let obid = `ObjectId('${req.params.id}')`;
  Order.find({ status: req.params.status })
    .then((order) => {
      res.json(order);
    })
    .catch((err) =>
      res.status(404).json(`No Order with status: ${req.params.id} found`)
    );
});

router.route("/delete/:id").post((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json("Order Deleted!"))
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
