'use strict';
var AV = require('leanengine');
var User = AV.Object.extend('User');

AV.Cloud.define('login', function (request, response) {
    var username = request.params.username;
    var password = request.params.password;
    AV.User.logIn(username, password).then(function (user) {
        response.success({
            "userid": user.id,
            "sessionToken": user._sessionToken,
            "userinfo": user.attributes
        });
    }, function (error) {
        response.error({
            "statusCode": 200,
            "code": error.code,
            "message": error.message
        });
    });
});

AV.Cloud.define('register', function (request, response) {
    var username = request.params.username;
    var password = request.params.password;
    var phone = request.params.phone;

    var user = new User();
    user.set('username', username);
    user.set('password', password);
    user.set('phone', phone);

    user.signUp().then(function (user) {
        console.log("register:" + username + ' ' + 'ok');
        response.success({
            "stats": "success"
        });
    }, function (error) {
        console.log('Error: ' + error.code + ' ' + error.message);
        response.error({
            "statusCode": 200,
            "code": error.code,
            "message": error.message
        });
    });

});

AV.Cloud.define('logout', function (request, response) {
    var sessionToken = request.params.sessionToken;
    AV.User.become(sessionToken).then(function (user) {
        AV.User.logOut();
        response.success({
            "stats": "success"
        });
    }, function (error) {
        response.error({
            "statusCode": 200,
            "code": error.code,
            "message": error.message
        });
    });

});

AV.Cloud.define('userinfo', function (request, response) {
    var userid = request.params.userid;
    var query = new AV.Query(User);

    query.get(userid).then(function (user) {
        response.success({
            "userid": user.id,
            "userinfo": user.attributes
        });

    }, function (error) {
        response.error({
            "statusCode": 200,
            "code": error.code,
            "message": error.message
        });
    });
});

module.exports = AV.Cloud;
