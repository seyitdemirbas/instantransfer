var express = require('express');
var router = express.Router();
const User = require("../models/UserDbModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const auth = require("../middleware/auth");

router.get('/getCurrentUser', auth ,function(req, res ,next) {
  res.status(200).json(req.user);
});


/* GET users listing. */
router.post('/register', async function(req, res, next) {
   // Our register logic starts here
   try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({error : "All input is required"});
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).json({error : "User Already Exist. Please Login"});
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email, isanon: user.isanon },
      process.env.JWT_TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
  // Our register logic ends here
});

/* GET users listing. */
router.get('/registerAnon', async function(req, res, next) {
  // Our register logic starts here
  try {

   // Create user in our database
   const user = await User.create({
     password: null,
     isanon: true
   });

   // Create token
   const token = jwt.sign(
     { user_id: user._id, isanon : user.isanon},
     process.env.JWT_TOKEN_KEY,
     {
       expiresIn: "24h",
     }
   );
   // save user token
   user.token = token;

   // return new user
   res.status(201).json(user);
 } catch (err) {
  console.log(err)
  res.status(400).json({error: 'Error occured'});
 }
 // Our register logic ends here
});

router.post('/login', async function(req, res, next) {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).json({error : "All input is required"});
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.JWT_TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }else{
        res.status(404).json({error : "Invalid Credentials"});
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({error: 'Error occured'});
    }
    // Our register logic ends here
});

module.exports = router;
