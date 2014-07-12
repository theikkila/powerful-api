// Config
var config = require('../config');
// Deps
var validator = require('validator');
var api_static = require('../lib/api_static');
var pdns = require('pdns')(config.pdns);

// read
module.exports.read = function (req, res, next) {
    // return all records of domain
    var domain = (validator.matches(req.params.domainname, api_static.regexps.fqdn)) ? req.params.domainname : (function () { throw new Error("Domain is must be FQDN"); }());
    pdns.records.list(domain, {}, {}, function (err, records) {
        if (err) { throw new Error(err); }
        res.send(records);
        return next();
    });
};

// create
module.exports.create = function (req, res, next) {
    res.send("create");
    return next();
};

// update
module.exports.update = function (req, res, next) {
    res.send("update");
    return next();
};

// delete
module.exports.delete = function (req, res, next) {
    res.send("delete");
    return next();
};