"use strict";

/*
* Converted from coffeescript. Original (https://github.com/freeformsystems/restify-oauth2-cc/blob/master/test/cc-integration.coffee)
*/

var accessToken, apiEasy, basicAuth, clientKey, clientSecret, suite;

apiEasy = require("api-easy");

require("chai").should();

clientKey = "powerfulClient";
clientSecret = "SOMETHINGVERYSECRET";

basicAuth = (new Buffer(clientKey + ":" + clientSecret)).toString("base64");

accessToken = null;

suite = apiEasy.describe("powerful-api oauth2 test");

suite.before("Set token if available", function (outgoing) {
    if (accessToken) {
        outgoing.headers.Authorization = "Bearer " + accessToken;
    }
    return outgoing;
});

suite.use("localhost", 8080).discuss("With no authorization header").get("/domains").expect(401).expect("should respond with WWW-Authenticate and Link headers", function (err, res, body) {
    var expectedLink;
    expectedLink = '</token>; rel="oauth2-token"; grant-types="client_credentials"; token-types="bearer"';
    res.headers.should.have.property("www-authenticate").that.equals('Bearer realm="Authenticated Realm"');
    return res.headers.should.have.property("link").that.equals(expectedLink);
}).undiscuss().next().path("/token").discuss("with valid client credentials").setHeader("Authorization", "Basic " + basicAuth).setHeader("Content-Type", "application/json").get().expect(200).expect("should respond with the token", function (err, res, body) {
    var result;
    result = JSON.parse(body);
    result.should.have.property("token_type", "Bearer");
    result.should.have.property("access_token");
    accessToken = result.access_token;
    return accessToken;
}).undiscuss().discuss("with invalid client credentials").setHeader("Authorization", "Basic MTIzOjQ1Ng==").setHeader("Content-Type", "application/json").get().expect(401).expect("should respond with error: invalid_client", function (err, res, body) {
    return JSON.parse(body).should.have.property("code", "UnauthorizedError");
}).undiscuss().unpath().next().get("/domains").expect(200).next()["export"](module);
