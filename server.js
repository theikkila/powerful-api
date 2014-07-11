
// Dependencies
var restify = require('restify');
var oauth2 = require('restify-oauth2-cc');

// oauth2 hooks
var oauthHooks = require('./lib/oauth_hooks');

// Config
var config = require('./config');

// PDNS
var pdns = require('pdns')(config.pdns);

// API Paths
var RESOURCES = require('./lib/api_paths');



// Init
var server = restify.createServer({
        name: require('./package.json').name,
        version: require('./package.json').version
    });

server.use(restify.authorizationParser());
server.use(restify.bodyParser({mapParams: false}));
oauth2.cc(server, {endpoint: RESOURCES.TOKEN, hooks: oauthHooks});


// Authorization middleware
server.use(function (req, res, next) {
    // Un/comment for authorization
    if (req.path !== RESOURCES.TOKEN && !req.user) { res.sendUnauthorized(); }
    return next();
});

// Routes

// domain routes

// return all domains (READ)
server.get(RESOURCES.DOMAINS, function (req, res, next) {
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
});

// create new domain (CREATE)
server.post(RESOURCES.DOMAINS, function (req, res, next) {
    return next();
});

// return specific domain (READ)
server.get(RESOURCES.DOMAINS + '/:domainid', function (req, res, next) {
    return next();
});

// records routes

// return all records of domain (READ)
server.get(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, function (req, res, next) {
    // return all records of domain
    res.send({p: "domains/" + req.params.domainid + "/records"});
    return next();
});

// create new record for domain (CREATE)
server.post(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, function (req, res, next) {
    return next();
});


// Server start
server.listen(config.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
