const router = require('express').Router();
let Ride = require('../models/ride.model');
const Rider = require('../models/rider.model');
var ObjectId = require('mongodb').ObjectID;

router.route('/').get((req, res) => {
    Ride.find()
        .then((Rides) => {
                res.json(Rides);
        })
        .catch(err => res.status(404).json('Rides not found' + err));
});

router.route('/count/').get((req, res) => {
    Ride.find()
        .then(() => {
                Ride.countDocuments()
                .then((count)=> res.json({"Count": count}))
                .catch(err => res.status(404).json("Count Error: " + err));
        })
        .catch(err => res.status(404).json("Error: " + err));
});

router.route('/user/count/:uid').get((req, res) => {
        Ride.countDocuments({ rid: req.params.uid})
        .then((count)=> res.json({"Count": count}))
        .catch(err => res.status(404).send("Count Error: " + err));
    });

router.route('/user/cancelled/count/:uid').get((req, res) => {
        Ride.countDocuments({ rid: req.params.uid, status: 'Cancelled'})
        .then((count)=> res.json({"Count": count}))
        .catch(err => res.status(404).send("Count Error: " + err));
    });

router.route('/user/:uid').get((req, res) => {
        Ride.find({ uid: req.params.uid, status: { $in: ['Pending', 'Accepted', 'Pickedup', 'Droppedoff'] } })
        .then((Ride) => {
                res.json(Ride);
        })
        .catch(err => res.status(404).json(`Ride with id: ${req.params.id} not found`));
});

router.route('/requests/').get((req, res) => {
    Ride.find({status : 'Pending'})
        .then((rides) => {
                res.json(rides);
        })
        .catch(err => res.status(404).json(`No Pending Rides`));
});

router.route('/ride/:id').get((req, res) => {
        Ride.findById(req.params.id)
            .then((ride) => {
                    res.json(ride);
            })
            .catch(err => res.status(404).json(`Ride with id: ${req.params.id} not found`));
});

router.route('/updateLoc/:id').post((req, res) => {
        Ride.findOneAndUpdate({ uid :req.params.id}, {riderCords: req.body})
                .then((result) => 
                {
                        res.json('Rider Location Updated to: ' + req.body.latitude + " | " + req.body.longitude + " | " + result);
                })
                .catch(err => res.status(404).send(err));
});

router.route('/updateStatus/:id').post((req, res) => {
        Ride.findByIdAndUpdate(req.params.id,
                {status: req.body.status})
                .then((ride) => 
                {
                        const wss = req.app.get("wss")
                        wss.clients.forEach((client) => {
                                wss.clients.forEach(function each(client) {
                                        if(client.id && JSON.parse(client.id).userId == ride.uid)
                                                client.send(JSON.stringify({rideStatus: req.body.status}));
                                      });
                              })
                        res.json('Ride Status Updated!');
                })
                .catch(err => res.status(404).send(err));
});

router.route('/acceptRide/:id').post((req, res) => {
    Ride.findByIdAndUpdate(req.params.id,
            {rid: req.body.rid, status: req.body.status})
            .then((ride) => {
                const wss = req.app.get("wss")
                        wss.clients.forEach((client) => {
                                wss.clients.forEach(function each(client) {
                                        if(client.id && JSON.parse(client.id).userId == ride.uid)
                                                client.send(JSON.stringify({rideStatus: req.body.status}));
                                      });
                              })
                res.json('Ride Accepted!')
            })
            .catch(err => res.status(404).send(err));
});

router.route('/add').post((req, res) => {
    const uid = req.body.uid;
    const sid = req.body.sid;
    const pLoc = req.body.pLoc;
    const dLoc = req.body.dLoc;
    const pCord = req.body.pCord;
    const dCord = req.body.dCord;
    const oItems = req.body.oItems;
    const pMethod = req.body.pMethod;
    const fare = req.body.fare;
    const bkdBy = req.body.bkdBy;
            
    const newRide = new Ride();
    newRide.uid = uid;
    newRide.sid = sid;
    newRide.pLoc = pLoc;
    newRide.dLoc = dLoc;
    newRide.pCord = pCord;
    newRide.dCord = dCord;
    newRide.oItems = oItems;
    newRide.pMethod = pMethod;
    newRide.fare = fare;
    newRide.bkdBy = bkdBy;
            
    newRide.save()
        .then(() => 
        {
                Rider.find({}, 'uid') // Assuming 'uid' is the field you want to retrieve
                .then((riders) => {
                        const riderIds = riders.map(rider => rider.uid.toString());
                        // Assuming you have access to the object you want to send to riders
                        const wss = req.app.get("wss")
                        // Iterate over WebSocket clients and send the message to riders
                        wss.clients.forEach((client) => {
                        if (client.id && riderIds.includes(JSON.parse(client.id).userId)) {
                                console.log("Sending message to a connected rider");
                                client.send(JSON.stringify({newRide: "New Ride Request!"}));
                        }
                        });
                })
                .catch((error) => {
                        console.error('Error fetching riders:', error);
                });
                res.json('Ride Added!')
        })
        .catch(err => res.status(404).send(err));

});

    
router.route('/delete/:id').post((req, res) => {
            
    Ride.findByIdAndDelete(req.params.id)
        .then(() => res.json('Ride Deleted!'))
        .catch(err => res.status(404).json(err));

});

module.exports = router;