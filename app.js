var express = require('express'),
    app = express.createServer(),
    st = require('node-static'),
    jquery = require('jquery'),
    io = require('socket.io').listen(app),
    sys = require('util'),
    exec = require('child_process').exec,
    platform = process.platform,
    click_script = null;

app.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// detect OS and use appropriate script
switch(platform){
  case 'darwin':
    click_script = 'OS/mac';
    break;
  case 'linux':
    click_script = 'OS/linux';
    break;
}

function puts(error, stdout, stderr) {
    sys.puts(stdout) 
}

io.sockets.on('connection', function (socket) {  
  socket.on('move', function(data){
      x = data['x']
      y = data['y']
      exec(click_script + " " + x + " " + y + " 0", puts);
  })
  
  socket.on('tap', function(data){
      exec(click_script + " 0 0 1", puts);
  })
});