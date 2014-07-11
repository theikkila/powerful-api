
// Dependencies
var restify = require('restify');
var oauth2 = require('restify-oauth2-cc');

// oauth2 hooks
var oauthHooks = require('./lib/oauth_hooks');

// Config
var config = require('./config');

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
server.get(RESOURCES.DOMAINS, function (req, res, next) {
    //if (!req.user) { res.sendUnauthorized(); }
    // return all domains
    res.send({p: "domains"});
    next();
});

// records routes
server.get(RESOURCES.DOMAINS + '/:domainid' + RESOURCES.RECORDS, function (req, res, next) {
    //if (!req.user) { res.sendUnauthorized(); }
    // return all records of domain
    res.send({p: "domains/(domain)/records"});
    next();
});


// Server start
server.listen(config.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
