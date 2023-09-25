var express = require('express');
var router = express.Router();
const upload = require('../multer');
const FileDbModel = require('../models/FileDbModel')
const getUniqueRouteName = require('../utils/getuniqueroutename')
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');


router.post('/upload', async function (req, res, next) {
  const captchaValue = req.headers.captchavalue

  const query = await axios.get('https://www.google.com/recaptcha/api/siteverify', {
    params: {
      secret: process.env.CAPTCHA_SECRET_KEY,
      response: captchaValue ? captchaValue : '0'
    }
  })
  .then(function (response) {
    return response.data.success
  })
  .catch(function () {
    return false;
  })

  if(!(query === true)) {
    res.status(400).json({ error: 'Cpatcha is not true'})
    return 0;
  }

  upload(req, res, async function (err) {

    if(!req.file) {
      res.status(400).json({ error: 'In form data, file is not found'})
      return 0;
    }

    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err})
    } else if (err) {
      res.status(500).json({ error: err})
    } else {
      // Defining userSchema model
      const routeName = await getUniqueRouteName();
      const fileDbConnect = new FileDbModel({
        originalname: req.file.originalname,
        mimetype : req.file.mimetype,
        filename : req.file.filename,
        route : routeName,
        path : req.file.path,
        size : req.file.size,
        isPrivate : req.body.isPrivate
      });
      fileDbConnect.save().then((dbRes) =>{
        res.status(201).json({ 
          id: dbRes.id,
          originalname: req.file.originalname,
          mimetype : req.file.mimetype,
          filename : req.file.filename,
          size : req.file.size,
          route : dbRes.route,
          path : dbRes.path,
          date: dbRes.date,
          expiredate: dbRes.expiredate
        })
      });
    }
  })
})

router.use(function customErrorHandler(err, req, res, next) {
  res.status(400).json({error: err.toString()});
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/getServerTime', async function(req, res, next) {
  const dateNow = new Date();
  res.status(200).json({dateNow})
});

router.delete('/deleteFile', async function(req, res, next) {
  FileDbModel.findByIdAndRemove({ _id: req.body.id })
  .then((response)=>{
    console.log(response)
    fs.unlink(response.path, (err) => {
      if (err) {
        res.status(404).json({ error: 'File Not Found' })
        return 0;
      }
      res.status(200).json({success: 'File deleted successfully'})
    });
  })
  .catch((err)=> {
    res.status(404).json({ error: 'File Not Found' })
    return 0;
  })
});

router.get('/getFiles', async function(req, res, next) {
  const filter = {}
  await FileDbModel.find(filter).then((dbRes)=>{
    res.status(200).json(dbRes)
  })
});

router.post('/changeRouteName', async function(req, res, next) {
  const currentRoute = {route: req.body.currentRoute}
  const newRoute = {route: req.body.newRoute}

  if(req.body.currentRoute === req.body.newRoute) {
    res.status(400).json({error: 'Do not enter the current same route.'})
    return 0;
  }

  await FileDbModel.findOneAndUpdate(currentRoute, newRoute, { runValidators: true })
  .then((response)=>{
    if(!(response === null)) {
      res.status(200).json({
        oldRoute : req.body.currentRoute,
        newRoute : req.body.newRoute
      })
    }else {
      res.status(404).json({error: 'Route Not Found'})
    }
  })
  .catch((err)=>{
    if(err.code === 11000) {
      res.status(400).json({error: 'This route has been taken by another user.'})
      return 0;
    }
    res.status(400).json({error: err.errors.route.message})
  });

});

router.post('/getFile', async function(req, res, next) {
  const filter = {route: req.body.route}
  await FileDbModel.findOne(filter).then((dbRes)=>{
    if(!(dbRes === null)) {
      res.status(200).json(dbRes)
    }else{
      res.status(404).json({ error: 'Route Not Found' })
    }
  })
});

module.exports = router;
