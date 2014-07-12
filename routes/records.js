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
    var domain = (validator.matches(req.params.domainname, api_static.regexps.fqdn)) ? req.params.domainname : (function () { throw new Error("Domain is must be FQDN"); }());
    // validating
    var name = (validator.matches(req.body.name, api_static.regexps.fqdn)) ? req.body.name : (function () { throw new Error("Record name must be valid"); }());
    var type = (validator.matches(req.body.type.toUpperCase(), api_static.regexps.recordtype)) ? req.body.type : (function () { throw new Error("Record type must be supported by PoweDNS"); }());
    var content = "";
    // ToDo: get the default ttl from config
    var ttl = (validator.isNumeric(req.body.ttl)) ? req.body.ttl : "10800";
    if (type === "A") {
        content = (validator.isIP(req.body.content, 4)) ? req.body.content : (function () { throw new Error("Not a valid IPv4 IP"); }());
    } else if (type === "AAAA") {
        content = (validator.isIP(req.body.content, 6)) ? req.body.content : (function () { throw new Error("Not a valid IPv6 IP"); }());
    } else if (new RegExp("/(MX|PTR|NS|CNAME)/i").test(type)) {
        content = (validator.matches(req.body.content, api_static.regexps.fqdn)) ? req.body.content : (function () { throw new Error("Record content must be valid"); }());
    } else {
        content = req.body.content;
    }
    // Add record to database
    pdns.records.add(domain, {name: name, type: type, content: content, ttl: ttl}, {}, function (err, retr) {
        if (err) { throw new Error(err); }
        var ret = {};
        ret[type] = 1;
        res.send(ret);
        return next();
    });
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