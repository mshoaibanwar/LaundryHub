const router = require('express').Router();
let Address = require('../models/address.model');

router.route('/').get((req, res) => {
    Address.find()
        .then((ads) => {
                res.json(ads);
        })
        .catch(err => res.status(404).send('Addresss not found' + err));
});

router.route('/count/').get((req, res) => {
    Address.find()
        .then(() => {
                Address.countDocuments()
                .then((count)=> res.json({"Count": count}))
                .catch(err => res.status(404).json("Count Error: " + err));
        })
        .catch(err => res.status(404).send("Error: " + err));
});

router.route('/:id').get((req, res) => {
    // let obid = `ObjectId('${req.params.id}')`;
    Address.findById(req.params.id)
        .then((ad) => {
                res.json(ad);
        })
        .catch(err => res.status(404).send(`Address with id: ${req.params.id} not found`));
});

router.route('/user/:id').get((req, res) => {
        // let obid = `ObjectId('${req.params.id}')`;
        Address.find({uid: req.params.id})
            .then((ads) => {
                    res.json(ads);
            })
            .catch(err => res.status(404).send(`Address with id: ${req.params.id} not found`));
    });

router.route('/update/:id').post((req, res) => {
        // let obid = `ObjectId('${req.params.id}')`;
        Address.findByIdAndUpdate(req.params.id, { type:  req.body.type, name: req.body.name, num: req.body.num, add: req.body.add, cords: req.body.cords })
            .then((ad) => {
                    res.status(200).send('Address Updated!')
            })
            .catch(err => res.status(404).send(`Address with id: ${req.params.id} not found`));
});

router.route('/add').post((req, res) => {

    const type = req.body.type;
    const name = req.body.name;
    const num = req.body.num;
    const add = req.body.add;
    const cords = req.body.cords;
    const uid = req.body.uid;

    const newAddress = new Address();          
    newAddress.type = type;
    newAddress.name = name;
    newAddress.num = num;
    newAddress.add = add;
    newAddress.cords = cords;
    newAddress.uid = uid;
            
    newAddress.save()
        .then(() => res.json('Address Added!'))
        .catch(err => res.status(404).send(err));

});

router.route('/delete/:id').post((req, res) => {
            
    Address.findByIdAndDelete(req.params.id)
        .then(() => res.json('Address Deleted!'))
        .catch(err => res.status(404).send(err));

});

module.exports = router;