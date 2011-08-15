var sio = require('socket.io')
  , http = require('http')
  , index = require('fs').readFileSync(__dirname + '/index.html')
  , request = require('request')

var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  })
  , io = sio.listen(app);

setInterval(function () {
  request({
    url: 'http://search.twitter.com/search.json?q=today'
  }, function (err, res, data) {
    var obj = JSON.parse(data);
    io.sockets.emit('tweets', obj.results.map(function (v) { return v.text; }));
  });
}, 2000);

io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('someone connected');

  socket.on('some event', function () {
    console.log('I got an event');
  });
});

app.listen(3000);
