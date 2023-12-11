const express = require('express');
const router = express.Router();
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();
const shortid = require("shortid");
const Razorpay = require("razorpay");
const tokens = [];
const { WebSocket, WebSocketServer } = require("ws");

const app = express();

router.use(express.json());
app.use(cors());
app.use(express.json({ type: ['application/json'] }));

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

//Firbase Notification
var admin = require("firebase-admin");
var serviceAccount = require("./laundryhub-acc7b-firebase-adminsdk-dgh19-262bb84130.json");
admin.initializeApp({
 credential: admin.credential.cert(serviceAccount)
});

// const razorpay = new Razorpay({
//   key_id: "rzp_test_hE2NsqW3oAhWNq",
//   key_secret: "WE2yRUyGV4gnQyWeFtv6oTBU",
// });

//Mongo DB Start
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true} );
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongo db connection established successfully!");
})

const usersRouter = require('./routes/users');
const shopsRouter = require('../Backend/routes/shops');
const ridersRouter = require('../Backend/routes/riders');
const ridesRouter = require('./routes/rides');
const ratingsRouter = require('./routes/ratings');
const ordersRouter = require('./routes/orders');
const addressesRouter = require('./routes/addresses');
const notificationsRouter = require('./routes/notifications');

app.use('/users', usersRouter);
app.use('/shops', shopsRouter);
app.use('/riders', ridersRouter);
app.use('/rides', ridesRouter);
app.use('/ratings', ratingsRouter);
app.use('/orders', ordersRouter);
app.use('/addresses', addressesRouter);
app.use('/notifications', notificationsRouter);
//Mongo DB End

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

//  app.get("/razorpay/:p", async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     const payment_capture = 1;
//     const amount = req.params.p;
//     const currency = "PKR";
  
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: shortid.generate(),
//       payment_capture,
//     };
  
//     try {
//       const response = await razorpay.orders.create(options);
//       console.log(response);
//       res.status(200).json({
//         id: response.id,
//         currency: response.currency,
//         amount: response.amount,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   });

  //Notifications
    app.post("/registernot", (req, res) => {
      tokens.push(req.body.token);
      console.log(req.body.token)
      res.status(200).json({ message: "Successfully registered FCM Token!" });
    });

    console.log(tokens);

    app.post("/sendnoti", async (req, res) => {
      try {
        const { title, body } = req.body;

        await admin.messaging().sendMulticast({
          tokens,
          notification: {
          title: 'New Order',
          body: 'You have a new order!',
          },
        });
        res.status(200).json({ message: "Successfully sent notifications!" });
      } catch (err) {
        res
          .status(500)
          .json({ message: err.message || "Something went wrong!" });
      }
    });
    
    console.log("LaundryHub app listening at http://", host, port)
 
  })

  //WebSocket

  function verifyUserAndAddUserIdToSocket(ws, userId) {
    // Verify user exists, or if a JWT is sent instead of user ID, verify that JWT here...
      ws.id = JSON.stringify({ userId })  
  }

  function removeOtherUserLocationSockets(wss, userId) {
    // Iterate through all connected clients
    wss.clients.forEach((client) => {
        // Check if the client has an 'id' property and it matches the specified userId
        if (client.id && JSON.parse(client.id).userId === userId) {
            // Close the WebSocket connection for other users
            client.close();
            console.log(`Closed WebSocket connection for user ID ${JSON.parse(client.id).userId}`);
            wss.clients.delete(client);
        }
    });
}

  const wss = new WebSocketServer({server});
  wss.on("connection", (ws) => {
    console.log("Client connected")
  // Executed when server receives message from the app
    ws.on("message", async (message) => {
      const received = JSON.parse(message)

      console.log(received)

      if(received && received.to) {
        wss.clients.forEach(function each(client) {
          if (client.id && JSON.parse(client.id).userId == received.to) {
            if(received.msg)
              client.send(JSON.stringify({msg: received.msg}));
            else if(received.riderLocation)
              client.send(JSON.stringify({riderLocation: received.riderLocation}));
            else if(received.rideStatus)
              client.send(JSON.stringify({rideStatus: received.rideStatus}));
            // else if(received.orderStatus)
            //   client.send(JSON.stringify({orderStatus: received.orderStatus}));
          }
        });
      }

      if (received && received.userId) {
        removeOtherUserLocationSockets(wss, received.userId)
        verifyUserAndAddUserIdToSocket(ws, received.userId)
      }
      console.log(wss.clients.size)
    })
  })

  app.set("wss", wss)

  module.exports = router;