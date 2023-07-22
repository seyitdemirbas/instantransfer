/* eslint-disable linebreak-style */
// Example express application adding the parse-server module to expose Parse
// compatible API routes.

import express from 'express';
import http from 'http';
import ParseDashboard from 'parse-dashboard';
import { ParseServer } from 'parse-server';
import path from 'path';
import 'dotenv/config'
const __dirname = path.resolve();


export const config = {
  databaseURI:
    process.env.DATABASE_URI || process.env.MONGODB_URI ,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.cjs',
  appId: process.env.APP_ID ,
  appName: process.env.APP_NAME,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  javascriptKey: process.env.JAVASCRIPT_KEY ,
  serverURL: process.env.SERVER_URL , // Don't forget to change to https if needed
  publicServerURL: process.env.PUBLIC_SERVER_URL,
  allowClientClassCreation: false,
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },
  fileUpload: {
    enableForAnonymousUser: true,
    // fileExtensions: true
  },
  enableAnonymousUsers: true,
  rateLimit: {
    requestPath: '/functions/changeFileRouteName|/login|/requestPasswordReset',
    requestTimeWindow: 5 * 60 * 1000,
    requestCount: 10,
    // includeInternalRequests: true,
    // includeMasterKey:true,
    errorResponseMessage: 'Too Many Requests, Try again later.'
  },
  // Enable email verification
  verifyUserEmails: true,

  // Set email verification token validity to 2 hours
  emailVerifyTokenValidityDuration: 2 * 60 * 60,
  emailAdapter: {
    module: 'parse-smtp-template',
    options: {
      port: process.env.SMTP_PORT,
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
      fromAddress: process.env.SMTP_FROM_ADRESS,
      template: true,
      templatePath: "views/templates/template.html",

      // Custome options to your emails
      // You can add more options if you need
      passwordOptions: {
        subject: "Password recovery",
        body: "Custome pasword recovery email body",
        btn: "Recover your password",
        others: {
          clientUrl: process.env.CLIENT_URL
        }
      },
      confirmOptions: {
        subject: "E-mail confirmation",
        body: "Custome email confirmation body",
        btn: "Confirm your email"
      },
    }
  }
};
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const options = { allowInsecureHTTP: false };

const dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": process.env.SERVER_URL,
      "appId": process.env.APP_ID,
      "masterKey": process.env.MASTER_KEY,
      "appName": process.env.APP_NAME,
      "iconName": "",
      "primaryBackgroundColor": "",
      "secondaryBackgroundColor": ""
    }
  ],
  "users": [
    {
      "user": process.env.PARSEDASHBOARD_USERNAME,
      "pass": process.env.PARSEDASHBOARD_PASSWORD
    }
  ]
}, options);

export const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
if (!process.env.TESTING) {
  const mountPath = process.env.PARSE_MOUNT || '/parse';
  const server = new ParseServer(config);
  await server.start();
  app.use(mountPath, server.app);
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});


if (!process.env.TESTING) {
  const port = process.env.PORT || 1337;
  const httpServer = http.createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  await ParseServer.createLiveQueryServer(httpServer);
}
