
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

// Routes

// domain routes

// return all domains
server.get(RESOURCES.DOMAINS, function (req, res, next) {
    // Uncomment for authorization
    console.log("GET " + RESOURCES.DOMAINS);
    if (!req.user) { res.sendUnauthorized(); }
    //res.send({err: null, domains: {}}); 
    pdns.domains.list({}, {}, function (err, domains) {
        /*
        * This is hack agains weird bug when using testing script (oauth2.js) restify "sends" headers and prevents actual data to be sent
        * This don't happen with browser or curl
        */
        if (res.headersSent) {
            res.end({err: err, domains: domains});
        } else {
            res.send({err: err, domains: domains});
        }
        return next();
    });
});


// records routes
server.get(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, function (req, res, next) {
    // Uncomment for authorization
    if (!req.user) { res.sendUnauthorized(); }

    // return all records of domain
    res.send({p: "domains/" + req.params.domainid + "/records"});
    next();
});


// Server start
server.listen(config.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
