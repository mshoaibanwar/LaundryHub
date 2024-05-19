const User = require("../models/user.model");
const sendEmail = require("./email.send");
const msgs = require("./email.msgs");
const templates = require("./email.templates");
const bcrypt = require("bcrypt");

// The callback that is invoked when the user submits the form on the client.
exports.ResendEmail = (req, res) => {
  const email = req.body.email;
  User.findOne({ email })
    .then((user) => {
      if (user && !user.confirmed) {
        sendEmail(user.email, templates.confirm(user._id));
      }
    })
    .catch((err) => console.log(err));
};

exports.SendCode = (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        sendEmail(user.email, templates.codeemail(code));
        res.json("Code Sent!");
      } else {
        res.status(400).send("Email Not Found!");
      }
    })
    .catch((err) => console.log(err));
};

// The callback that is invoked when the user submits the form on the client.
exports.collectEmail = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const pswrd = await bcrypt.hash(req.body.password, 10);
  let phoneUnique = false;
  User.findOne({ email })
    .then(async (user) => {
      await User.findOne({ phone: phone })
        .then((nphone) => {
          if (nphone) {
            phoneUnique = false;
          } else {
            phoneUnique = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // We have a new user! Send them a confirmation email.
      if (!user && phoneUnique) {
        User.create({ name, email, phone, pswrd })
          .then((newUser) =>
            sendEmail(newUser.email, templates.confirm(newUser._id))
          )
          .then(() => res.json(msgs.confirm))
          .catch((err) => console.log(err));
      }

      // We have already seen this email address. But the user has not
      // clicked on the confirmation link. Send another confirmation email.
      else if (user && !user.confirmed) {
        res
          .status(400)
          .send(
            "Email Already Registered but not confirmed. Login with your details, and confirmation email will be sent to you after login!"
          );
      } else if (user && user.confirmed) {
        res.status(400).send("Email Already Registered!");
      } else if (!user && !phoneUnique) {
        res.status(400).send("Phone Number Already Registered!");
      }

      // The user has already confirmed this email address
      else {
        res.status(400).send("Email Already Registered!");
      }
    })
    .catch((err) => console.log(err));
};

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
exports.confirmEmail = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      // A user with that id does not exist in the DB. Perhaps some tricky
      // user tried to go to a different url than the one provided in the
      // confirmation email.
      if (!user) {
        res.status(400).send(msgs.couldNotFind);
        // res.json({ msg: msgs.couldNotFind })
      }

      // The user exists but has not been confirmed. We need to confirm this
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        User.findByIdAndUpdate(id, { confirmed: true })
          .then(() => res.send(msgs.confirmed))
          .catch((err) => console.log(err));
      }

      // The user has already confirmed this email address.
      else {
        res.status(400).send(msgs.alreadyConfirmed);
      }
    })
    .catch((err) => console.log(err));
};

exports.forgetPswrd = (req, res) => {
  const email = req.body.email;

  User.findOne({ email })
    .then((user) => {
      // A user with that id does not exist in the DB. Perhaps some tricky
      // user tried to go to a different url than the one provided in the
      // confirmation email.
      if (!user) {
        res.status(400).send(msgs.emailNotFound);
        // res.json({ msg: msgs.couldNotFind })
      }

      // The user exists but has not been confirmed. We need to confirm this
      // user and let them know their email address has been confirmed.
      else if (user) {
        //console.log(user._id);
        sendEmail(email, templates.forget(user._id));
        res.send({
          msg: "Email with link to reset password is sent!",
          found: "true",
        });
      }

      // The user has already confirmed this email address.
      else {
        res.status(400).send(msgs.emailNotFound);
      }
    })
    .catch((err) => console.log(err));
};
