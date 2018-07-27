const config = require('../config.js');

const defaultIntent = {
    'AMAZON.FallbackIntent': function () {
        console.info('cryptoprice: Fallback intent');
        this.response.speak(config.FALLBACK_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        console.info('cryptoprice: Help intent');
        const speechOutput = config.HELP_MESSAGE;
        const reprompt = config.HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        console.info('cryptoprice: Cancel intent');
        this.response.speak(config.STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        console.info('cryptoprice: Stop intent');
        this.response.speak(config.STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

module.exports = defaultIntent;