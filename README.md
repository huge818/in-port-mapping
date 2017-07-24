
# Intranet port mapping

## How to use

The following example attaches tcp-tunnel to a plain Node.JS
tcp server listening on port `9093`.

```client.js
var remotClient= require("./src/remot-client");
remotClient({
  "signal":{
    "ip":"127.0.0.1",
    "port":9091
  },
  "source":{
    "ip":"127.0.0.1",
    "port":3000
  },
  "tunnel":{
    "ip":"127.0.0.1",
    "port":9092
  }
});

server.js

var signalServer= require("./src/signal-server");
var tunnelServer= require("./src/tunnel-server");
var publicServer= require("./src/public-server");

var signal= new signalServer(9091);
var tunnel= new tunnelServer(9092);
var master= new publicServer(9093);

signal.run();

tunnel.run(null,function(){
  return master;
});

master.run(function(){
  return signal;
},function(){ 
  return tunnel;
});

```

## License


