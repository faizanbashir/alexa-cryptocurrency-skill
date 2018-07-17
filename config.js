const config = {
    APP_ID : 'amzn1.ask.skill.50c4c4ec-f5b3-449a-bf43-5aaa496779d7',
    SKILL_NAME : 'Crypto Price',
    GET_COIN_PRICE_MESSAGE : "Here's the latest update: ",
    FALLBACK_MESSAGE: 'I am sorry, I could not process your request',
    HELP_MESSAGE : ' You can ask me things like, What is the latest price for bitcoin or current price of ethereum... What can I help you with?',
    HELP_REPROMPT : 'What can I help you with?',
    STOP_MESSAGE : 'Goodbye!',
    COINMARKET_V2_API: "https://api.coinmarketcap.com/v2/ticker/"
}
module.exports = config;