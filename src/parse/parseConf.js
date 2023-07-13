import Parse from "parse";

// import { initializeParse } from '@parse/react';

// initializeParse(
//   'http://localhost:1337/parse',
//   '123456',
//   '123456'
// );

Parse.serverURL = 'http://192.168.1.108:1337/parse'
Parse.initialize('123456', '123456')
Parse.enableLocalDatastore();