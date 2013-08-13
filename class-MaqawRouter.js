(function Maqaw() {

  var options = { key: "51f16cc4e81a103b3c000001", name: "Maqaw" };
  var host = 'localhost';
  var port = 3001;

  this.maqawPeer =  {};
  var _this = this;

  var socketURL = 'http://' + host + ':' + port; 
  this.socket = io.connect(socketURL);

  this.socket.on('peer open', function(data) {
    _this.maqawPeer = data;   
    new ChatWindow();  
  });

  this.socket.on(event, function(data) {
    switch (event) {
      case 'connection open':
        // render connection open 
      break;
      case 'data':
        // send data where it needs to go
      break;
    };
  });

  this.socket.emit('init connect', { id: undefined, key: options.key});   
})();
