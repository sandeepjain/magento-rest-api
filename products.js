var querystring = require('querystring');
var Joi = require('joi');

var internals = {
    client: null,
    path: 'products'
};

internals.updateProductSchema = internals.productSchema = {
    type_id: Joi.string().allow('simple'),
    attribute_set_id: Joi.number(),
    sku: [Joi.string(), Joi.number()],
    name: Joi.string(),
    url_key: Joi.string(),
    custom_design: Joi.string(),
    meta_title: Joi.string(),
    meta_description: Joi.string(),
    page_layout: Joi.string(),
    options_container: Joi.string(),
    country_of_manufacture: Joi.string(),
    msrp_enabled: Joi.number(),
    msrp_display_actual_price_type: Joi.number(),
    gift_message_available: Joi.number(),
    price: [Joi.string(), Joi.number()],
    special_price: Joi.string(),
    weight: Joi.string(),
    msrp: Joi.string(),
    status: Joi.number().allow([1, 2]),
    visibility: Joi.number().allow([1,2,3,4]),
    tax_class_id: Joi.number(),
    description: Joi.string(),
    short_description: Joi.string(),
    meta_keyword: Joi.string(),
    custom_layout_update: Joi.string()
};

// Product schema
internals.productSchema.type_id = internals.productSchema.type_id.required();
internals.productSchema.sku = [Joi.string().required(), Joi.number().required()];
internals.productSchema.name = internals.productSchema.name.required();
internals.productSchema.price = [Joi.string().required(), Joi.number().required()];
internals.productSchema.status = internals.productSchema.status.required();
internals.productSchema.visibility = internals.productSchema.visibility.required();
internals.productSchema.description = internals.productSchema.description.required();
internals.productSchema.short_description = internals.productSchema.short_description.required();

// get product
internals.get = function (id, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    internals.client.request.get(this.fullPath + '/' + id, function (error, httpResponse, body) {
        return callback(error, httpResponse, body);
    });
};

internals.add = function (product, options, callback, remoteProductId) {
    var self = this,
        isEdit = !!remoteProductId;

    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }

    Joi.validate(product, internals[isEdit ? 'updateProductSchema': 'productSchema'], {
        allowUnknown: true, 
        skipFunctions: true
    }, function (err, value) {
        if (err) {
            return callback(err, null);
        }
        internals.client.request[isEdit ? 'put' : 'post']({
            url: self.fullPath + (isEdit ? '/' + remoteProductId : ''),
            body: product
        }, function (err, httpResponse, body) {
            if (err) {
                return callback(err, httpResponse, body);
            }
            // Probably request was successful
            if (httpResponse.statusCode === 200) {
                // httpResponse return the url of the product under header location
                var productId = isEdit ? remoteProductId : parseInt(path.basename(httpResponse.headers.location), 10);
                if (productId) {
                    internals.get(productId, function (err, httpResponse1, body1) {
                        if (err) {
                            return callback(err, httpResponse, body);
                        }
                        return callback(null, httpResponse, body1);
                    });
                    return;
                } else {
                    return callback('Unable to get remote product id.', httpResponse, body);
                }
            }

            if (body.messages && body.messages.error) {
                return callback(body.messages.error, httpResponse, undefined);
            }
            return callback('Undetermined error.', httpResponse, body);
        });
    });
};

internals.update = function (remoteId, product, options, callback) {
    internals.add(product, options, callback, remoteId);
};

internals.addImage = function (id, productImage, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }

    internals.client.request.post({
        url: this.fullPath + '/' + id + '/images',
        body: productImage
    }, function (err, httpResponse, body) {
        if (err) {
            return callback(err, httpResponse, body);
        }
        if (httpResponse.statusCode === 200) {
            var imageId = parseInt(path.basename(httpResponse.headers.location), 10);
            if (imageId) {
                return callback(null, httpResponse, {
                    id: imageId
                });
            } else {
                return callback('Unable to get remote image id.', httpResponse, body);
            }
        }
        if (body.messages && body.messages.error) {
            return callback(body.messages.error, httpResponse, undefined);
        }
        return callback('Undetermined error.', httpResponse, body);
    });
};

internals.assignCategory = function (id, categoryId, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }

    internals.client.request.post({
        url: this.fullPath + '/' + id + '/categories',
        body: {
            category_id: categoryId
        }
    }, function (err, httpResponse, body) {
        if (err) {
            return callback(err, httpResponse, body);
        }
        if (httpResponse.statusCode === 200) {
            return callback(null, httpResponse, body)
        }
        if (body.messages && body.messages.error) {
            return callback(body.messages.error, httpResponse, undefined);
        }
        return callback('Undetermined error.', httpResponse, body);
    });
};

internals.removeCategory = function (id, categoryId, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }

    internals.client.request.del({
        url: this.fullPath + '/' + id + '/categories/' + categoryId
    }, function (err, httpResponse, body) {
        if (err) {
            return callback(err, httpResponse, body);
        }
        if (httpResponse.statusCode === 200) {
            return callback(null, httpResponse, body)
        }
        if (body.messages && body.messages.error) {
            return callback(body.messages.error, httpResponse, undefined);
        }
        return callback('Undetermined error.', httpResponse, body);
    });
};

internals.getCategories = function (id, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }

    internals.client.request.get({
        url: this.fullPath + '/' + id + '/categories'
    }, function (err, httpResponse, body) {
        if (err) {
            return callback(err, httpResponse, body);
        }
        if (httpResponse.statusCode === 200) {
            return callback(null, httpResponse, body)
        }
        if (body.messages && body.messages.error) {
            return callback(body.messages.error, httpResponse, undefined);
        }
        return callback('Undetermined error.', httpResponse, body);
    });
};

module.exports = function (client) {
  internals.client = client;
  internals.fullPath = client.makePath(internals.path);
  return internals;
};
