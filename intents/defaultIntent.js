const config = require('../config.js');

const defaultIntent = {
    'AMAZON.FallbackIntent': function () {
        this.response.speak(config.FALLBACK_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = config.HELP_MESSAGE;
        const reprompt = config.HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(config.STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(config.STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

module.exports = defaultIntent;