var express = require('express');
var path = require('path');
var r = require('rethinkdb');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.set('views', path.join(__dirname + '/views'));

var server = app.listen(port, function() {
    console.log('server listening on port ' + port);
});

// Connection with rethinkdb
r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err)
        throw err;
    r.db('test').tableList().run(conn, function(err, response) {
        if (response.indexOf('edit') > -1) {
            // Table exists
            console.log('Table exists, skipping create...');
            console.log('Tables - ' + response);
        } else {
            // Create table
            console.log('Table does not exist. Creating');
            r.db('test').tableCreate('edit').run(conn);
        }
    });
});

// Socket.io listener
var io = require('socket.io')(server);
io.on('connection', function(client) {
    console.log('a user connected');
    client.on('disconnect', function() {
        console.log('a user disconnected');
    });

    socket.on('document-update', function(msg) {
        console.log(msg);
        r.table('edit').insert({
            id: msg.id,
            value: msg.value,
            user: msg.user
        }, {
            conflict: "update"
        }).run(conn, function(err, res) {
            if (err)
                throw err;
        });
    });

    r.table('edit').changes().run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.each(function(err, row) {
            if (err) throw err;
            io.emit('doc', row);
        });
    });

});




app.get('/', function(req, res) {
    res.sendFile(app.get('views') + '/index.html');
})
