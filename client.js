var url = require('url');
var internals = {};

internals.getOAuth = function (config) {
    return {
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        token: config.token,
        token_secret: config.tokenSecret
    };
};

internals.create = function (config) {
    if (!config.baseUrl) {
        throw new Error('options.host required (example: www.mymagentosite.com)');
    }

    this.oauth = internals.getOAuth(config);
    this.options = config;
    this.makePath = internals.makePath.bind(this);

    this.request = require('./request')(this);
    this.products = require('./products')(this);
    return this;
};

internals.makePath = function (section) {
    return url.resolve(this.options.baseUrl, section);
};

module.exports = internals;
