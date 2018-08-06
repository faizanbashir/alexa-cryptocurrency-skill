const config = require('../config.js');

const rp = require('request-promise');
const fs = require('fs');

const appIntent = {
    'LaunchRequest': function () {
        console.info('cryptoprice: Launch intent');
        this.response.cardRenderer(config.HELP_MESSAGE);
        this.response.speak(config.HELP_MESSAGE).listen(config.HELP_REPROMPT);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        console.info('cryptoprice: Unhandeled intent');
		this.response.speak(config.OBSCURE).listen(config.HELP_REPROMPT);
		this.emit(':responseReady');
    },
    'GetCryptoPriceIntent': function(){
        console.info('cryptoprice: GetCryptoPriceIntent intent');
        if (!isCurrencySlotValid(this.event.request.intent)) {
            console.error('cryptoprice: No value provided for cryptocurrency');
            this.response.cardRenderer(config.ENTER_CRYPTOCURRENCY + ' ' + config.HELP_REPROMPT);
            this.response.speak(config.ENTER_CRYPTOCURRENCY + ' ' + config.HELP_REPROMPT).listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
        }

        let cryptocurrency = this.event.request.intent.slots.cryptocurrency.value;
        let response = '';
        let cryptoData = [];
        let currency = '';

        console.info('cryptoprice: Input slot value => "' + cryptocurrency + '"');

        try {
            cryptoData = JSON.parse(fs.readFileSync('cryptocurrency.json'));
            currency = cryptoData[cryptocurrency];
            if (typeof(currency) === 'undefined') throw TypeError;
            console.log('cryptoprice: Currency info, ' + JSON.stringify(currency));
        } catch (e) {
            console.error('cryptoprice: Could not find currency: ' + cryptocurrency);
            response = config.CURRENCY_NOT_FOUND.replace('{cryptocurrency}', cryptocurrency);
            this.response.speak(response + ' ' + config.HELP_REPROMPT).listen(config.HELP_REPROMPT);
            this.emit(':responseReady');
        }

        response = config.CURRENCY_NOT_FOUND.replace('{cryptocurrency}', cryptocurrency);

        rp(config.COINMARKET_V2_API + currency.id)
            .then(body => {
                
                const result = JSON.parse(body);

                if (result.metadata.error) {
                    console.error('cryptoprice: response error, ' + JSON.stringify(result));
                    this.response.speak(config.ERROR_MSG + ' ' + config.HELP_REPROMPT).listen(config.HELP_REPROMPT);
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
                this.response.cardRenderer(config.ERROR_MSG + ' ' + config.HELP_REPROMPT);
                this.response.speak(config.HELP_REPROMPT);
                this.emit(':responseReady');
            });
    },
    'EmptyCryptoPriceIntent': function () {
        console.error('cryptoprice: No value provided for cryptocurrency');
        this.response.cardRenderer(config.ENTER_CRYPTOCURRENCY + ' ' + config.HELP_REPROMPT);
        this.response.speak(config.ENTER_CRYPTOCURRENCY + ' ' + config.HELP_REPROMPT).listen(config.HELP_REPROMPT);
        this.emit(':responseReady');
    }
};

function isCurrencySlotValid(intent) {
    var currencySlotFilled = intent && intent.slots &&
        intent.slots.cryptocurrency && intent.slots.cryptocurrency.value.trim();
    return currencySlotFilled && isNaN(parseInt(currencySlotFilled));
}

module.exports = appIntent;