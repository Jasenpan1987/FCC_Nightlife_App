module.exports = {
    yelp: {
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        token: process.env.token,
        token_secret: process.env.token_secret
    },
    db: {
        url: process.env.mongourl
    },
    facebookAuth: {
        'clientID': process.env.clientID,
        'clientSecret': process.env.clientSecret,
        'callbackURL': process.env.callbackURL
    }
};