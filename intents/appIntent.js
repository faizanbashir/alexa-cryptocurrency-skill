const config = require('../config.js');

const rp = require('request-promise');

const appIntent = {
    'LaunchRequest': function () {
        this.response.cardRenderer(config.HELP_MESSAGE);
        this.response.speak(config.HELP_MESSAGE);
        this.response.listen(config.HELP_REPROMPT);
        this.emit(':responseReady');
    },

    'GetCryptoPriceIntent': function(){
    	const cryptocurrency = this.event.request.intent.slots.cryptocurrency.value;

        let RESPONSE_TEXT = "You have asked for the prices of "+ cryptocurrency;
        
        if (!cryptocurrency) {
            RESPONSE_TEXT = "You need to provide the crypto currency name. Please try again!";
            this.response.speak(RESPONSE_TEXT);
            this.response.listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
        }

        rp(config.URL)
            .then(body => {
                console.log(body);
                
                const result = JSON.parse(body);
                let response_coin = null;
                for(let  i = 0; i < result.length; i++){
                    if(result[i].name.toLowerCase() == cryptocurrency.toLowerCase()){
                        response_coin = result[i];
                    }
                }

                if (!response_coin) {
                    RESPONSE_TEXT = "Sorry we were not able to find your coin. Can you please say that again?";
                    this.response.speak(RESPONSE_TEXT);
                    this.response.listen(config.HELP_REPROMPT);
                    this.emit(':responseReady');
                }

                RESPONSE_TEXT = "The current price of "+ cryptocurrency + " is $"+ response_coin.price_usd + " per "+ cryptocurrency;

                this.response.cardRenderer(RESPONSE_TEXT);
                this.response.speak(RESPONSE_TEXT);
                this.emit(':responseReady');
            })
            .catch(err => {
                console.log("There was an error  during the request. Please try again! "+ err);
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