'use strict';

const Alexa = require('alexa-sdk');
const config = require('./config.js');

module.exports.handler = (event, context, callback) => {
  console.log("Alexa.main handler");
  console.log(event);
  var alexa = Alexa.handler(event, context);
  alexa.appId = config.APP_ID;

  console.log("Alexa.main: registerHandlers");

  alexa.registerHandlers(
    require('./intents/defaultIntent'),
    require('./intents/appIntent')
  );
  
  console.log("Alexa.main: registerHandlers completed");
  alexa.execute();
  console.log("Alexa.main: registerHandlers executed");
};