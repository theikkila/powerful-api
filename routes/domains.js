// Deps
var validator = require('validator');
var async = require('async');

// Config
var config = require('../config');
// Utils
var utils = require('../lib/utils');
var pdns = require('pdns')(config.pdns);
var api_static = require('../lib/api_static');


// Read (all)
module.exports.read = function (req, res, next) {
    pdns.domains.list({}, {}, function (err, domains) {
        if (err) { return next(err); }
        /*
        * This is hack agains weird bug when using testing script (oauth2.js) restify "sends" headers and prevents actual data to be sent
        * This don't happen with browser or curl
        */
        if (res.headersSent) {
            res.end(domains);
        } else {
            res.send(domains);
        }
        return next();
    });
};

// Create
module.exports.create = function (req, res, next) {
    // Validation
    if (!req.body || !req.body.soa || !req.body.domain) {
        return next(new Error('Domain and SOA-record required'));
    }
    // Domain validation
    var domain = (validator.matches(req.body.domain, api_static.regexps.fqdn)) ? req.body.domain : (function () { throw new Error("Domain is required and must be FQDN"); }());
    // SOA validation
    var soa = {
        primaryns: (validator.matches(req.body.soa.primaryns, api_static.regexps.fqdn)) ? req.body.soa.primaryns : (function () { throw new Error("Primary name server must be FQDN"); }()),
        hostmaster: (validator.isEmail(req.body.soa.hostmaster)) ? req.body.soa.hostmaster : (function () { throw new Error("Hostmasters email address is required and it must be valid"); }()),
        refresh: (validator.isNumeric(req.body.soa.refresh)) ? req.body.soa.refresh : '10800',
        retry: (validator.isNumeric(req.body.soa.retry)) ? req.body.soa.retry : '7200',
        expire: (validator.isNumeric(req.body.soa.expire)) ? req.body.soa.expire : '604800',
        ttl: (validator.isNumeric(req.body.soa.ttl)) ? req.body.soa.ttl : '10800'
    };

    // SOA serial
    soa.serial = utils.soaSerial();
    // Nameserver validation
    var ns = [];
    if (req.body.ns && Array.isArray(req.body.ns)) {
        // User wants to set nameservers at the same time
        // Validate
        ns = req.body.ns.map(function (hostname) {
            return (validator.matches(hostname, api_static.regexps.fqdn)) ? hostname : (function () { throw new Error("Nameserver '" + hostname + "' must be FQDN"); }());
        });
    }
    // Everythings validated lets add new domain
    // join soa
    var soa_string = [soa.primaryns, soa.hostmaster, soa.serial, soa.refresh, soa.retry, soa.expire, soa.ttl].join(' ');
    // add domain to database

    pdns.domains.add({name: domain}, {soa: soa_string}, function (err, ret) {
        if (err) { throw new Error(err); }
        if (ns.length <= 0) {
            // Easy job, domain added return that
            res.send({domain: 1, ns: 0});
            return next();
        }

        // If there is nameservers, process them
        async.each(ns, function (server, cb) {
            // add nameserver to database
            pdns.records.add(domain, {name: domain, type: "NS", content: server}, {}, function (err, ret) {
                if (err) {
                    cb(err);
                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) { throw new Error(err); }
            // domain and n number of nameservers added
            res.send({domain: 1, ns: ns.length});
            return next();
        });
    });
};

// Delete
module.exports.delete = function (req, res, next) {
    // Domain validation
    var domain = (validator.matches(req.params.domainname, api_static.regexps.fqdn)) ? req.params.domainname : (function () { throw new Error("Domain is required and must be FQDN"); }());
    pdns.domains.remove({name: domain}, {}, function (err, ret) {
        if (err) { throw new Error(err); }
        res.send({domain: 1});
        return next();
    });
};
