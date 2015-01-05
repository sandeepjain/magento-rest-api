var request = require('request');

var internals = function (client) {
    return request.defaults({
        oauth: client.oauth,
        json: true,
        followRedirect: true,
        followAllRedirects: true
    });
};

module.exports = internals;
