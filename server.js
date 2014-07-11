
// Dependencies
var restify = require('restify');

// Config
var config = require('./config');
// Init
var server = restify.createServer({
	name: "PowerfulAPI"
});

//server.get('/hello/:name', respond);
//server.head('/hello/:name', respond);

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
