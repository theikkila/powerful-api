
// Dependencies
var restify = require('restify');
var oauth2 = require('restify-oauth2-cc');


// oauth2 hooks
var oauthHooks = require('./lib/oauth_hooks');

// Config
var config = require('./config');

var utils = require('./lib/utils');

// PDNS
var pdns = require('pdns')(config.pdns);

// API Paths
var api_static = require('./lib/api_static');
var RESOURCES = api_static.resources;

// Routes
var domains = require('./routes/domains');
var records = require('./routes/records');


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

// return all domains (READ)
server.get(RESOURCES.DOMAINS, domains.all);
// return specific domain (READ)
server.get(RESOURCES.DOMAINS + '/:domainid', domains.one);
// create new domain (CREATE)
server.post(RESOURCES.DOMAINS, domains.create);
// update domain (UPDATE)
server.post(RESOURCES.DOMAINS + '/:domainid', domains.update);
// delete domain (DELETE)
server.del(RESOURCES.DOMAINS + '/:domainid', domains.delete);



// return all records of domain (READ)
server.get(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, records.read);
// create new record for domain (CREATE)
server.post(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, records.create);
// update record for domain (UPDATE)
server.post(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS + '/:recordid', records.update);
// update record for domain (DELETE)
server.del(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS + '/:recordid', records.delete);


// Server start
server.listen(config.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
