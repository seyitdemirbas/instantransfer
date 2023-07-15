/* eslint-disable linebreak-style */

Parse.Cloud.beforeSaveFile(async (request) => {
  const axios = require('axios');
  const { file, user } = request;
  file.addMetadata('createdById', user.id);
  file.addTag('createdById', user.id);

  const query = await axios.get('https://www.google.com/recaptcha/api/siteverify', {
    params: {
      secret: process.env.CPATCHA_SECRET,
      response: file.metadata().cpatcha ? file.metadata().cpatcha : '00'
    }
  })
    .then(function (response) {
      // console.log(response.data.success);
      return response.data.success
    })
    .catch(function () {
      return false;
    })

  if(!query === true) {
    throw "Error Cpatcha is not true";
  }
  // console.log(file.metadata().cpatcha)
  // throw "Error Cpatcha is not true";
});

Parse.Cloud.beforeSave(Parse.User, async (req) => {
  const axios = require('axios');

  const cpatcha = await req.object.get("cpatcha")

  if(cpatcha) {
    const query = await axios.get('https://www.google.com/recaptcha/api/siteverify', {
      params: {
        secret: process.env.CPATCHA_SECRET,
        response: cpatcha ? cpatcha : '000'
      }
    })
      .then(function (response) {
        // console.log(response.data.success);
        return response.data.success
      })
      .catch(function () {
        return false;
      })

    if(!query === true) {
      throw "Error Cpatcha is not true";
    }

  }
});

Parse.Cloud.afterSave(Parse.User, async (req) => {
  const cpatcha = await req.object.get("cpatcha")
  if(cpatcha) {
    const parseQuery = new Parse.Query(Parse.User);
    parseQuery.equalTo("objectId", req.object.id);
    const object = await parseQuery.first({ useMasterKey: true });
    // console.log('OBJECCCC===' + JSON.stringify(object))
    object.set("cpatcha", undefined)
    object.save(null,{ useMasterKey: true })
  }
});


Parse.Cloud.define('contantUs', async req => {
  const axios = require('axios');
  const cpatcha = req.params.cpatcha
  const query = await axios.get('https://www.google.com/recaptcha/api/siteverify', {
    params: {
      secret: process.env.CPATCHA_SECRET,
      response: cpatcha ? cpatcha : '000'
    }
  })
    .then(function (response) {
      // console.log(response.data.success);
      return response.data.success
    })
    .catch(function () {
      return false;
    })

  if(!query === true) {
    throw "Error, Cpatcha is not true";
  }

  const { SMTPClient } = require('emailjs');

  const client = new SMTPClient({
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    ssl: true,
  });

  try {
    const senderEmailText = 'Original Sender Email: ' + req.params.email + '\n\n';

    await client.sendAsync({
      text:    senderEmailText + req.params.message,
      from:   process.env.APP_NAME + ' Contact Us',
      to: process.env.SMTP_CONTACT_US_PAGE_TO ,
      subject: req.params.subject
    });
    return 'Message has been sent.';
  } catch (err) {
    return 'Error, Failed to send message.';
  }
});


Parse.Cloud.define('getServerTime', async () => {
  const dateToday = new Date();
  return dateToday;
});

Parse.Cloud.define('changeFileRouteName', async (request) => {
  // throw "Every user must have an email address.";

  function onlyLettersAndNumbers(str) {
    return /^[A-Za-z0-9]*$/.test(str);
  }

  async function isHaveRouterName(word) {
    const query = new Parse.Query("routes");
    query.equalTo("routeName", word);
    return query.find({ useMasterKey: true });
  }

  const searchWordsQuery = await isHaveRouterName(request.params.newRouteName);
  if(!(searchWordsQuery.length === 0)){
    throw "This route has been taken by another user.";
  }

  if(request.params.newRouteName === '') {
    throw "No Empty name";
  }

  if (!onlyLettersAndNumbers(request.params.newRouteName)) {
    throw "Only letters and numbers";
  }

  const query = new Parse.Query("routes");
  query.equalTo("routeName", request.params.currentRouteName);
  const results = query.first({ useMasterKey: true }).then((res)=>{
    const createdBy = res.get("createdBy").id
    if(createdBy === request.user.id){
      res.set("routeName", request.params.newRouteName);
      return res.save(null,{ useMasterKey: true });
    }else{
      throw "This route have not yours.";
    }
  })

  return await results
});


Parse.Cloud.define('deleteFile', async (request) => {

  if(request.params.id === '') {
    throw "Cannot empty Id.";
  }

  const query = new Parse.Query("routes");
  query.equalTo("routeName", request.params.routeName);
  query.include("fileObjectRelation")
  const results = query.first({ useMasterKey: true }).then(async (res)=>{
    const createdBy = res.get("createdBy").id
    if(createdBy === request.user.id){
      const file = res.get("fileObjectRelation").get('file')
      const fileObject = res.get("fileObjectRelation")
      const routeObject = res
      await file.destroy({ useMasterKey: true });
      await fileObject.destroy({ useMasterKey: true })
      await routeObject.destroy({ useMasterKey: true })
      return 'File Deleted.'
    }else{
      throw "This file is not yours.";
    }
  })
  return await results
});

Parse.Cloud.afterSaveFile(async (request) => {
  const randomWords = require('random-words');
  const { file, fileSize, user} = request;

  async function isHaveRouterName(word) {
    const query = new Parse.Query("routes");
    query.equalTo("routeName", word);
    return query.find({ useMasterKey: true });
  }

  async function getUniqueRouteName () {
    let exit = false;
    while (!exit) {
      // eslint-disable-next-line no-var
      var word = randomWords()
      // eslint-disable-next-line no-await-in-loop
      const searchWordsQuery = await isHaveRouterName(word);
      // console.log(word)
      // console.log(searchWords)
      if(searchWordsQuery.length === 0) {
        exit = true;
        return word
      }
    }
  }

  const uniqueRouteName = await getUniqueRouteName()

  Date.prototype.addDays = function(days) {
    // eslint-disable-next-line no-var
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  const date = new Date() // +1 minutes

  const fileObject = new Parse.Object('files');
  fileObject.set("expiresAt", date.addDays(3));
  fileObject.set('file', file);
  fileObject.set('fileSize', fileSize);
  fileObject.set('createdBy', user);
  fileObject.set("routerFileName", file.name());
  fileObject.set("FirstRouteName", uniqueRouteName);
  fileObject.set("publicStatus", true);
  fileObject.set("fileTypeMime", file._source.type);
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setWriteAccess(user.id, true)
  fileObject.setACL(acl);
  const token = { sessionToken: user.getSessionToken() };
  const test = fileObject.save(null, token).then((res)=>{
    const routeObject = new Parse.Object('routes');
    routeObject.set("routeName", uniqueRouteName);
    routeObject.set("fileObjectRelation", res)
    routeObject.set("createdBy", user)
    routeObject.set("expiresAt", date.addDays(3));
    const aclR = new Parse.ACL();
    aclR.setPublicReadAccess(true);
    routeObject.setACL(aclR);
    routeObject.save(null,{ useMasterKey: true })
  })

  await test
});

Parse.Cloud.job("removeExpiredFiles", async () => {
  const date = new Date() // +1 minutes

  // The query object
  const query = new Parse.Query("routes");
  query.include("fileObjectRelation")
  query.lessThanOrEqualTo("expiresAt", date);

  const results = await query.find({useMasterKey:true});

  results.forEach(res => {
    const file = res.get("fileObjectRelation").get('file')
    const fileObject = res.get("fileObjectRelation")
    const routeObject = res
    file.destroy({ useMasterKey: true });
    fileObject.destroy({ useMasterKey: true })
    routeObject.destroy({ useMasterKey: true })
  });

  return ("Successfully deleted " + results.length + " expire files.");
});
