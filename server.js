
// Dependencies
var restify = require('restify');

// Init
var server = restify.createServer();

//server.get('/hello/:name', respond);
//server.head('/hello/:name', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});