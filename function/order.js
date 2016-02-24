'use strict';
var AV = require('leanengine');

var User = AV.Object.extend('User');
var Order = AV.Object.extend('Order');
var Location = AV.Object.extend('Location');
var School = AV.Object.extend('School');

AV.Cloud.define('orderList', function (request, responese) {
    var sessionToken = request.params.sessionToken;
    var status = request.params.status;
    var schoolid = request.params.school;

    var orderStatus;
    var carrierStatus;
    if (status < 0) {
        orderStatus = false;
        carrierStatus = false;
    } else if (status > 0) {
        orderStatus = true;
        carrierStatus = true;
    } else {
        orderStatus = false;
        carrierStatus = true;
    }

    AV.User.become(sessionToken).then(function (user) {
        var query = new AV.Query(School);
        query.get(schoolid).then(function (school) {
            return school;
        }).then(function (school) {
            var orderQuery = new AV.Query(Order);
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            orderQuery.addAscending('expressTime');
            orderQuery.equalTo("school", school);
            orderQuery.greaterThan("expressTime", yesterday);
            orderQuery.equalTo("orderStatus", orderStatus);
            if (carrierStatus) {
                orderQuery.notEqualTo("expressCarrierID", null)
            } else {
                orderQuery.equalTo("expressCarrierID", null)
            }
            return orderQuery;
        }).then(function (orderQuery) {
            return orderQuery.find();
        }).then(function (orders) {
            var results = new Array();
            for (var i = 0; i < orders.length; i++) {
                var object = orders[i];
                results.push({
                    "orderid": object.id,
                    "time": object.get("expressTime"),
                    "com": object.get("expressCompany"),
                    "reward": object.get("orderScore")
                });
            }
            return results;
        }).then(function (result) {
            responese.success(result);
        })
    }, function (error) {
        responese.error({
            "statusCode": 200,
            "code": error.code,
            "message": error.message
        });
    });
});


AV.Cloud.define('orderInfo', function (request, responese) {
    var sessionToken = request.params.sessionToken;
    var orderID = request.params.orderID;
    AV.User.become(sessionToken).then(function (user) {
        var order = new Order();
        var query = new AV.Query(Order);
        query.get(orderID).then(function (order) {
            var expressCarrier = order.get("expressCarrier");
            var publisher = order.get("publisher");
            var school = order.get("school");
            var location = order.get("location");

            expressCarrier.fetch().then(function (resExpressCar) {
                return publisher.fetch().then(function (resPublisher) {
                    return school.fetch().then(function (resSchool) {
                        return location.fetch().then(function (resLocation) {
                            return {
                                "expressCarrier": {
                                    "userid": resExpressCar.id,
                                    "username": resExpressCar.get("username")
                                },
                                "publisher": {
                                    "userid": resPublisher.id,
                                    "username": resPublisher.get("username")
                                },
                                "school": {
                                    "schoolid": resSchool.id,
                                    "schoolName": resSchool.get("schoolName")
                                },
                                "location": {
                                    "locationid": resLocation.id,
                                    "spot": resLocation.get("spot")
                                }
                            };
                        });
                    });
                });
            }).then(function (datas) {
                return [{
                    "order": {
                        "orderid": order.id,
                        "expressID": order.get("expressID"),
                        "expressCompany": order.get("expressCompany"),
                        "expressTime": order.get("expressTime"),
                        "orderInfo": order.get("orderInfo"),
                        "orderScore": order.get("orderScore"),
                        "orderStatus": order.get("orderStatus"),
                        "other": datas
                    }
                }];
            }).then(function (result) {
                responese.success(result);
            })
        }, function (error) {
            responese.error({
                "statusCode": 200,
                "code": error.code,
                "message": error.message
            });
        });
    });
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
            order.set("expressCarrier", user);
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
