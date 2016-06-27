
var signalServer= require("./src/signal-server");
var tunnelServer= require("./src/tunnel-server");
var publicServer= require("./src/public-server");

var signal= new signalServer(9091);
var tunnel= new tunnelServer(9092);
var master= new publicServer(9093);

signal.run();
tunnel.run(function(){return signal;},function(){return master;});
master.run(function(){return signal;},function(){ return tunnel;});