Magento Rest API Client
=====

> Node.js based client to interact with Magento REST Api.

##Usage Guide

    var magentoRestApi = require('magento-rest-api');

    // Create api object
    var api = magentoRestApi.createClient({
        consumerKey: '<Your consumer key>',
        consumerSecret: '<Your consumer secret>',
        token: '<Token>',
        tokenSecret: '<Token secret>'
    }, {
        host: 'magentosite.com'
    });

    // Add product

    api.products.add({
        <product hash>
    }, { <options - not used yet> }, function (err, httpResponse, response) {
        // callback
    }, <optional remote product id - in case of product update>);

Currently only `Products` resource is implemented with possibility to add product images, add and remove product categoroies. Please check the source code [products.js](https://github.com/sandeepjain/magento-rest-api/blob/master/products.js) to get better understanding of available API's and how to use them. 

You are free to add code for other api end points and send pull request for same.

All parameters are validated using [joi](https://github.com/hapijs/joi) before being sent to API.

##Links

- [Magento Rest API Documentation](http://www.magentocommerce.com/api/rest/introduction.html)
