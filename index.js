var client = require('./client');

exports.version = require('./package.json').version;
exports.products = require('./products');

exports.createClient = function (config, options) {
	return new client.create(config, options);
};
