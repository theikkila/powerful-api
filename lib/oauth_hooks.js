/*
* Original from restify-oauth2 ropc example (https://github.com/domenic/restify-oauth2/blob/master/examples/ropc/hooks.js)
*/

var _ = require("lodash");
var crypto = require("crypto");
// Config
var config = require('../config');

var database = require('./oauth_database')();


function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + config.secret + timestamp);

    return sha256.update(data).digest("base64");
}

exports.grantClientToken = function (user, clientSecret, cb) {
    var isValid = _.has(database.clients, user) && database.clients[user].secret === clientSecret;
    if (isValid) {
        // If the client authenticates, generate a token for them and store it so `exports.authenticateToken` below
        // can look it up later.

        var token = generateToken(user + ":" + clientSecret);
        database.tokensToClientIds[token] = user;

        // Call back with the token so Restify-OAuth2 can pass it on to the client.
        return cb(null, token);
    }

    // Call back with `false` to signal the username/password combination did not authenticate.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
};

exports.authenticateToken = function (token, cb) {
    if (_.has(database.tokensToClientIds, token)) {
        // If the token authenticates, call back with the corresponding client ID. Restify-OAuth2 will put it in the
        // request's `user` property.
        var username = database.tokensToClientIds[token];
        return cb(null, username);
    }

    // If the token does not authenticate, call back with `false` to signal that.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
};