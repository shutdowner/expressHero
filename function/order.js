'use strict';
var AV = require('leanengine');

var User = AV.Object.extend('User');
var Order = AV.Object.extend('Order');
var Location = AV.Object.extend('Location');

AV.Cloud.define('orderHello', function (request, response) {
    response.success('Hello world!');
});

AV.Cloud.define('orderPublish', function (request, responese) {
    var sessionToken = request.params.sessionToken;
    var expressID = request.params.expressID;
    var expressTime = request.params.expressTime;
    expressTime = new Date(expressTime);
    var expressCompany = request.params.expressCompany;
    var orderScore = request.params.orderScore;
    var orderInfo = request.params.orderInfo;
    var locationID = request.params.locationID;

    AV.User.become(sessionToken).then(function (user) {
        var order = new Order();
        var location = new Location();

        var query = new AV.Query(Location);
        query.get(locationID).then(function (location) {
            return location;
        }).then(function (location) {
            order.set("expressID", expressID);
            order.set("expressTime", expressTime);
            order.set("expressCompany", expressCompany);

            order.set("orderScore", orderScore);
            order.set("orderInfo", orderInfo);

            order.set("publisher", user);
            order.set("location", location);
            return order.save();
        }).then(function (order) {
            responese.success({
                "ret": "success",
                "order": order.id
            });
        }, function (error) {
            responese.error({
                "statusCode": 200,
                "code": error.code,
                "message": error.message
            });
        });
    });
});

AV.Cloud.define('orderCarrier', function (request, responese) {
    var sessionToken = request.params.sessionToken;
    var orderID = request.params.orderID;

    AV.User.become(sessionToken).then(function (user) {
        var order = new Order();
        var query = new AV.Query(Order);
        query.get(orderID).then(function (order) {
            console.log(order);
            order.set("expressCarrierID", user);
            return order.save();
        }).then(function (order) {
            responese.success({
                "ret": "success",
                "order": order.id
            });
        }, function (error) {
            responese.error({
                "statusCode": 200,
                "code": error.code,
                "message": error.message
            });
        });
    });
});

AV.Cloud.define('orderComplete', function (request, responese) {
    var sessionToken = request.params.sessionToken;
    var orderID = request.params.orderID;

    console.log({
        "token": sessionToken,
        "orderId": orderID
    });

    AV.User.become(sessionToken).then(function (user) {
        var order = new Order();
        var query = new AV.Query(Order);

        query.equalTo("publisher", user);
        query.equalTo("orderStatus", false);

        query.get(orderID).then(function (order) {
            order.set("orderStatus", true);
            return order.save();
        }).then(function (order) {
            var point = user.attributes.bonusPoint + order.attributes.orderScore;
            user.set("bonusPoint", point);
            return user.save();
        }).then(function (order) {
            responese.success({
                "ret": "success",
                "order": order.id
            });
        }, function (error) {
            responese.error({
                "statusCode": 200,
                "code": error.code,
                "message": error.message
            });
        });
    });
});


module.exports = AV.Cloud;
