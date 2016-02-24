'use strict';
var AV = require('leanengine');

AV.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});

module.exports = AV.Cloud;
