const config = {
    APP_ID : 'amzn1.ask.skill.50c4c4ec-f5b3-449a-bf43-5aaa496779d7',
    SKILL_NAME : 'Crypto Price',
    GET_COIN_PRICE_MESSAGE : "Here's the latest update: ",
    FALLBACK_MESSAGE: 'I am sorry, I could not process your request',
    HELP_MESSAGE : ' You can ask me things like, What is the latest price for bitcoin or current price of ethereum... What can I help you with?',
    HELP_REPROMPT : 'What can I help you with?',
    STOP_MESSAGE : 'Goodbye!',
    COINMARKET_V2_API: "https://api.coinmarketcap.com/v2/ticker/",
    ENTER_CRYPTOCURRENCY: "You need to provide the crypto currency name. Please try again!",
    ERROR_MSG: "There was an error processsing your request. Can you please say that again?",
    OBSCURE: "Sorry I didnt understand that. Say help if you need any assistance.",
    CURRENCY_NOT_FOUND: "Sorry we were not able to find {cryptocurrency}. Can you please say that again?",
    CURRENCY_PRICE: "The current price of {cryptocurrency} is ${price}",
}
module.exports = config;