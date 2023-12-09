const router = require('express').Router();
let User = require('../models/user.model');
const emailController = require('../controllers/email.controller')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

router.route('/').get((req, res) => {
    User.find()
        .then((users) => {
            res.json(users);
        })
        .catch(err => res.status(404).json('Users not found'));
});

router.route('/getUser/:id').get((req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.json(user);
        })
        .catch(err => res.status(404).json('User not found'));
});

router.route('/count/').get((req, res) => {
    User.find()
        .then(() => {
                User.countDocuments()
                .then((count)=> res.json({"Count": count}))
                .catch(err => res.status(404).json("Count Error: " + err));
        })
        .catch(err => res.status(404).json("Error: " + err));
});

router.route('/delete/:id').post((req, res) => {
            
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User Deleted!'))
        .catch(err => res.status(404).json(err));

});

router.route('/:status').get((req, res) => {
    User.find({'confirmed': req.params.status})
        .then((users) => {
            res.json(users);
        })
        .catch(err => res.status(404).json('Users with status confirmed not found'));
});

router.route('/forgot').get((req, res) => {
    User.find({'email': req.params.email})
        .then(() => {
            res.json({"found": 'true'});
        })
        .catch(err => res.status(404).send('Users with status confirmed not found'));
});

router.route('/forgot').post(emailController.forgetPswrd);

router.route('/reset').post(async (req, res) => {
    const hpswrd = await bcrypt.hash(req.body.password, 10);
    User.findOneAndUpdate({ email: req.body.email }, {pswrd: hpswrd})
        .then(() => res.json('Password Reset Success!'))
        .catch(err => res.status(404).send(err));

});

router.route('/changepass').post(async (req, res) => {
    const newhpswrd = await bcrypt.hash(req.body.password, 10);
    User.findOne({ email: req.body.email })
        .then(async (user) => 
        {
            if(user)
            {
                if(await user.authenticate(req.body.opassword))
                {
                    if(await user.authenticate(req.body.password))
                    {
                        res.status(404).send('New Password is same as Old Password!');
                    }
                    else{
                        User.findOneAndUpdate({ email: req.body.email }, {pswrd: newhpswrd})
                            .then(() => res.json('Password Change Success!'))
                            .catch(err => res.status(404).send(err));
                    }
                }
                else
                {
                    res.status(404).send('Wrong Old Password!');
                }
            }
            else
            {
                res.json('Not Matched');
            }
        })
        .catch(err => res.status(404).send(err));

});

router.route('/login').post((req, res) => {
    User.findOne({ email: req.body.email })
        .then(async (user) => {
            if ( await user.authenticate(req.body.password))
            {
                if(user.confirmed)
                {
                    await User.findOneAndUpdate({ email: req.body.email }, { token: req.body.token })
                    const token = await jwt.sign(
                        { _id: user._id },
                        process.env.JWT_SECRET,{ expiresIn: "1d"});
                    res.json({token, user});
                }
                else
                {
                    emailController.ResendEmail(req);
                    res.status(404).send("Account Not Confirmed! An email with confirmation link has been sent to you.");
                }
            }
            else
            {
                res.status(404).send('Password not match!');
            }
        })
        .catch(err => res.status(404).send('User not found!'));
});

router.route('/update').post((req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, { name: req.body.name, phone: req.body.phone, profile: req.body.profile })
        .then((user) => {
            res.json("Accout Details Updated");
        })
        .catch(err => res.status(404).send('User not found!'));
});

router.route('/updateToken').post((req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, { token: req.body.token })
        .then((user) => {
            res.json("Token Updated");
        })
        .catch(err => res.status(404).send('User not found!'));
});

router.route('/register').post(emailController.collectEmail);

router.route('/sendcode').post(emailController.SendCode);

router.route('/confirm/:id').get(emailController.confirmEmail);

module.exports = router;