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
// When updating you don't need to validate type because you can't change it
function validateRecord(req) {
    // validating
    var domain = (validator.matches(req.params.domainname, api_static.regexps.fqdn)) ? req.params.domainname : (function () { throw new Error("Domain is must be FQDN"); }());

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
    return {domain: domain, content: content, name: name, type: type, ttl: ttl};
}

// create
module.exports.create = function (req, res, next) {
    var valid = validateRecord(req);
    // Add record to database
    pdns.records.add(valid.domain, {name: valid.name, type: valid.type, content: valid.content, ttl: valid.ttl}, {}, function (err, retr) {
        if (err) { throw new Error(err); }
        var ret = {};
        ret[valid.type] = 1;
        res.send(ret);
        return next();
    });
};

// update
module.exports.update = function (req, res, next) {
    pdns.records.get({id: req.params.recordid}, {}, function (err, record) {
        req.body.type = record.type;
        var valid = validateRecord(req);
        pdns.records.update(valid.domain, {id: req.params.recordid, name: valid.name, content: valid.content}, {}, function (err, result) {
            if (err) { throw new Error(err); }
            var ret = {};
            ret[valid.type] = 1;
            res.send(ret);
            return next();
        });
    });
};

// delete
module.exports.delete = function (req, res, next) {
    var domain = (validator.matches(req.params.domainname, api_static.regexps.fqdn)) ? req.params.domainname : (function () { throw new Error("Domain is required and must be FQDN"); }());
    pdns.records.removeById(domain, {id: req.params.recordid}, {}, function (err, result) {
        if (err) { throw new Error(err); }
        res.send({record: result.affectedRows});
        return next();
    });
};
