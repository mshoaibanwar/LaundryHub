const router = require('express').Router();
let Rider = require('../models/rider.model');
var ObjectId = require('mongodb').ObjectID;

router.route('/').get((req, res) => {
    Rider.find()
        .then((Riders) => {
                res.json(Riders);
        })
        .catch(err => res.status(404).json('Riders not found' + err));
});

router.route('/count/').get((req, res) => {
    Rider.find()
        .then(() => {
                Rider.countDocuments()
                .then((count)=> res.json({"Count": count}))
                .catch(err => res.status(404).json("Count Error: " + err));
        })
        .catch(err => res.status(404).json("Error: " + err));
});

router.route('/user/:uid').get((req, res) => {
    Rider.find({uid : req.params.uid})
        .then((rider) => {
                res.json(rider);
        })
        .catch(err => res.status(404).json(`Rider with id: ${req.params.id} not found`));
});

router.route('/rider/:id').get((req, res) => {
        Rider.findById(req.params.id)
            .then((rider) => {
                    res.json(rider);
            })
            .catch(err => res.status(404).json(`Rider with id: ${req.params.id} not found`));
});

router.route('updateStatus/:id').post((req, res) => {
        Rider.findByIdAndUpdate(req.params.id,
                {status: req.body.status})
                .then(() => res.json('Rider Status Updated!'))
                .catch(err => res.status(404).send(err));
});

router.route('/add').post((req, res) => {
    const uid = req.body.uid;
    const address = req.body.address;
    const cnic = req.body.cnic;
    const bname = req.body.bikename;
    const bnum = req.body.bikenum;
    const cnicimages = req.body.cnicimgs;
    const licImg = req.body.licimg;
    const pimg = req.body.profileimg;
            
    const newRider = new Rider();
    newRider.uid = uid;
    newRider.address = address;
    newRider.cnic = cnic;
    newRider.bikename = bname;
    newRider.bikenum = bnum;
    newRider.cnicimgs = cnicimages;
    newRider.licenseimg = licImg;
    newRider.img = pimg;
            
    newRider.save()
        .then(() => res.json('Rider Added!'))
        .catch(err => res.status(404).send(err));

});

router.route('/edit/:id').post((req, res) => {
        const address = req.body.address;
    Rider.findByIdAndUpdate(req.params.id, 
        {address: address})
        .then(() => res.json('Rider Data Updated!'))
        .catch(err => res.status(404).send(err));

});

router.route('/update/images/:uid').post((req, res) => {
    Rider.findByIdAndUpdate(req.params.uid, 
        {cnicimgs: req.body.cnicimgs, licenseimg: req.body.licimg})
        .then(() => res.json('Documents Data Updated!'))
        .catch(err => res.status(404).send(err));

});

router.route('/update/bike/:uid').post((req, res) => {
        Rider.findByIdAndUpdate(req.params.uid, 
            {bikename: req.body.bikeName, bikenum: req.body.bikeNumber})
            .then(() => res.json('bike Data Updated!'))
            .catch(err => res.status(404).send(err));
    
});

router.route('/update/personal/:uid').post((req, res) => {
        Rider.findByIdAndUpdate(req.params.uid, 
            {address: req.body.address, cnic: req.body.cnic})
            .then(() => res.json('Personal Data Updated!'))
            .catch(err => res.status(404).send(err));
    
});
    
router.route('/delete/:id').post((req, res) => {
            
    Rider.findByIdAndDelete(req.params.id)
        .then(() => res.json('Rider Deleted!'))
        .catch(err => res.status(404).json(err));

});

module.exports = router;