const router = require('express').Router();
let Rating = require('../models/rating.model');

router.route('/').get((req, res) => {
    Rating.find()
        .then((ratings) => {
                res.json(ratings);
        })
        .catch(err => res.status(404).send('Categories not found' + err));
});

router.route('/count/').get((req, res) => {
    Rating.find()
        .then(() => {
                Rating.countDocuments()
                .then((count)=> res.json({"Count": count}))
                .catch(err => res.status(404).json("Count Error: " + err));
        })
        .catch(err => res.status(404).send("Error: " + err));
});

router.route('/user/count/:uid').get((req, res) => {
        Rating.countDocuments({ shopid: req.params.uid})
        .then((count)=> res.json({"Count": count}))
        .catch(err => res.status(404).send("Count Error: " + err));
    });

router.route('/shop/:id').get((req, res) => {
    Rating.find({ 'shopid': req.params.id })
        .then((ratings) => {
                res.json(ratings);
        })
        .catch(err => res.status(404).send(`Ratings with shopid: ${req.params.id} not found`));
});

router.route('/user/avg/:id').get((req, res) => {
        Rating.find({ 'shopid': req.params.id })
          .then((ratings) => {
            if (ratings.length === 0) {
              // No ratings found for the shop
              res.json(0);
            } else {
              // Calculate average rating
              const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
              const averageRating = totalRating / ratings.length;
      
              res.json(averageRating);
            }
          })
          .catch(err => res.status(500).send(`Error fetching ratings: ${err.message}`));
      });

router.route('/ride/:id').get((req, res) => {
        Rating.find({ 'orderid': req.params.id })
            .then((ratings) => {
                    res.json(ratings);
            })
            .catch(err => res.status(404).send(`Ratings with rideid: ${req.params.id} not found`));
    });

router.route('/order/:sid/:oid').get((req, res) => {
        Rating.find({ 'shopid': req.params.sid, 'orderid': req.params.oid })
            .then((ratings) => {
                    res.json(ratings);
            })
            .catch(err => res.status(404).send(`Ratings with shopid: ${req.params.sid} and orderid: ${req.params.oid} not found`));
    });

router.route('/add').post((req, res) => {

    const rating = req.body.rating;
    const review = req.body.review;
    const uid = req.body.uid;
    const shopid = req.body.shopid;
    const orderid = req.body.oid;
    const uname = req.body.uname;
    const services = req.body.services;

    const newRating = new Rating();       
    newRating.rating = rating;
    newRating.review = review;
    newRating.uid = uid;
    newRating.shopid = shopid;
    newRating.orderid = orderid;
    newRating.uname = uname;
    newRating.services = services;
            
    newRating.save()
        .then(() => res.json('Rating Added!'))
        .catch(err => res.status(404).send({error: err}));

});

router.route('/delete/:id').post((req, res) => {
            
    Rating.findByIdAndDelete(req.params.id)
        .then(() => res.json('Rating Deleted!'))
        .catch(err => res.status(404).send(err));

});

router.route('/feedback/:id').post((req, res) => {
            
        Rating.findByIdAndUpdate(req.params.id, {'feedback': req.body.feedback})
            .then(() => res.json('Feedback Added!'))
            .catch(err => res.status(404).send(err));
    
    });

module.exports = router;