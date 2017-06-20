var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('views', path.join(__dirname + '/views'));



app.get('/', function(req, res) {
    res.sendFile(app.get('views') + '/index.html');
})

app.listen(port, function () {
    console.log('app listening on port ' + port);
})
