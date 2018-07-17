const config = require('../config.js');

const rp = require('request-promise');
const fs = require('fs');

const appIntent = {
    'LaunchRequest': function () {
        this.response.cardRenderer(config.HELP_MESSAGE);
        this.response.speak(config.HELP_MESSAGE);
        this.response.listen(config.HELP_REPROMPT);
        this.emit(':responseReady');
    },

    'GetCryptoPriceIntent': function(){
        const cryptocurrency = this.event.request.intent.slots.cryptocurrency.value;
        let RESPONSE_TEXT = '';
        let cryptoData = [];
        let currency = '';
        
        if (!cryptocurrency) {
            RESPONSE_TEXT = "You need to provide the crypto currency name. Please try again!";
            this.response.speak(RESPONSE_TEXT);
            this.response.listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
        }

        try {
            cryptoData = JSON.parse(fs.readFileSync('cryptocurrency.json'));
            currency = cryptoData[cryptocurrency];
        } catch (e) {
            RESPONSE_TEXT = "Sorry we were not able to find " + cryptocurrency + ". Can you please say that again?";
            this.response.speak(RESPONSE_TEXT);
            this.response.listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
            console.log('Could not find currency: ' + cryptocurrency);
        }

        RESPONSE_TEXT = "You have asked for the prices of " + cryptocurrency;

        rp(config.COINMARKET_V2_API + currency.id)
            .then(body => {
                console.log(body);
                
                const result = JSON.parse(body);

                if (result.metadata.error) {
                    RESPONSE_TEXT = "There was an error processsing your request. Can you please say that again?";
                    this.response.speak(RESPONSE_TEXT);
                    this.response.listen(config.HELP_REPROMPT);
                    this.emit(':responseReady');
                }

                let price = result.data.quotes.USD.price;
                console.log(result.data.quotes.USD.price);

                RESPONSE_TEXT = "The current price of "+ cryptocurrency + " is $"+ price;

                this.response.cardRenderer(RESPONSE_TEXT);
                this.response.speak(RESPONSE_TEXT);
                this.emit(':responseReady');
            })
            .catch(err => {
                console.log("There was an error processsing your request. Please try again! " + err);
                this.response.cardRenderer(RESPONSE_TEXT);
                this.response.speak(RESPONSE_TEXT);
                this.emit(':responseReady');
            });
    },

    'Unhandled': function () {;
		this.response.speak("Sorry I didnt understand that. Say help if you need any assistance.");
        this.response.listen(config.HELP_REPROMPT);
		this.emit(':responseReady');
    }
};

module.exports = appIntent;