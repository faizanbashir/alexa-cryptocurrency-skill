'use strict';

const Alexa = require('alexa-sdk');
const config = require('./config.js');

module.exports.handler = (event, context, callback) => {
    console.log("cryptoprice: entrypoint");
    console.log(JSON.stringify(event));

    var alexa = Alexa.handler(event, context);
    alexa.appId = config.APP_ID;

    console.log("cryptoprice: registering intents");

    alexa.registerHandlers(
        require('./intents/defaultIntent'),
        require('./intents/appIntent')
    );
  
    console.log("cryptoprice: intent registration completed");
    alexa.execute();
    console.log("cryptoprice: intents executed");
};