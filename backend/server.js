const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const cors = require('cors');
const webSocketServer = require('websocket').server;

const customer = require('./models/customer.model.js');
const analytic = require('./models/analytics.model.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

require('./routes/customer.route')(app);
require('./routes/album.route')(app);
require('./routes/artist.route')(app);
require('./routes/track.route')(app);
require('./routes/setting.route')(app);
require('./routes/logs.route')(app);
require('./routes/api.route')(app);
require('./routes/library.route')(app);
require('./routes/creditcard.route')(app);
require('./routes/analytic.route')(app);

// set port, listen for requests
app.listen(3002, () => {
  console.log("Server is running on port 3002.");
});

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(3015, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});
const wsServer = new webSocketServer({
  httpServer: server
});

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active bots in this object
const bots = {};

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept('echo-protocol', request.origin);
  clients[userID] = connection;
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);
      const id = dataFromClient.id;
      bots[userID] = { id };
      
      // analytic.increaseActiveAccount(function(err, result) {});
      customer.updateStatus({id: id, status: 1}, function(err, result) {
        if(err) {
          console.log(err);
        }
        customer.updateError({id: id, message: ''}, function(error, result) {
          if(error) {
            console.log(error);
          }
        })
      });
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    analytic.decreaseActiveAccount(function(err, result) {});
    try {
      customer.updateStatus({id: bots[userID].id, status: 0}, function(err, result) {
        if(err) {
          console.log(err);
        }
        customer.updateError({id: bots[userID].id, message: 'Server or bot shut down unexpectedly!'}, function(err, result) {
          delete clients[userID];
          delete bots[userID];
        });
      });
    } catch(e) {
      console.log('error on closing ws bot ', userID);
    }
  });
});
