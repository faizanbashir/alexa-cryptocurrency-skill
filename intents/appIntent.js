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
        let response = '';
        let cryptoData = [];
        let currency = '';
        
        if (!cryptocurrency) {
            this.response.speak(config.ENTER_CRYPTOCURRENCY);
            this.response.listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
        }

        try {
            cryptoData = JSON.parse(fs.readFileSync('cryptocurrency.json'));
            currency = cryptoData[cryptocurrency];
            if (typeof(currency) === 'undefined') {
                throw TypeError;
            }
            console.log('cryptoprice: Currency, ' + currency);
        } catch (e) {
            response = config.CURRENCY_NOT_FOUND.replace('{cryptocurrency}', cryptocurrency);
            this.response.speak(response);
            this.response.listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
            console.log('cryptoprice: Could not find currency: ' + cryptocurrency);
        }

        response = config.CURRENCY_NOT_FOUND.replace('{cryptocurrency}', cryptocurrency);

        rp(config.COINMARKET_V2_API + currency.id)
            .then(body => {
                console.log(body);
                
                const result = JSON.parse(body);

                if (result.metadata.error) {
                    this.response.speak(config.ERROR_MSG);
                    this.response.listen(config.HELP_REPROMPT);
                    this.emit(':responseReady');
                }

                let price = result.data.quotes.USD.price;
                console.log('cryptoprice: Price of ' + currency.name + ' is ' + result.data.quotes.USD.price);

                response = config.CURRENCY_PRICE.replace('{cryptocurrency}', cryptocurrency).replace('{price}', price);
                this.response.cardRenderer(response);
                this.response.speak(response);
                this.emit(':responseReady');
            })
            .catch(err => {
                console.error("cryptoprice: Error, " + err);
                this.response.cardRenderer(config.ERROR_MSG);
                this.response.speak(config.ERROR_MSG);
                this.emit(':responseReady');
            });
    },

    'Unhandled': function () {;
		this.response.speak(config.OBSCURE);
        this.response.listen(config.HELP_REPROMPT);
		this.emit(':responseReady');
    }
};

module.exports = appIntent;