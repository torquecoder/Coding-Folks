var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.static('node_modules'));

app.set('views', path.join(__dirname + '/views'));

var server = app.listen(port, function () {
  console.log('server listening on port ' + port);
});

var io = require('socket.io')(server);

// Socket.io listener
io.on('connection', function(client) {
    console.log('a user connected');
    client.on('disconnect', function() {
        console.log('a user disconnected');
    });
});

app.get('/', function(req, res) {
    res.sendFile(app.get('views') + '/index.html');
})
