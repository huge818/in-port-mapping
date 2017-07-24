
# Intranet port mapping

## How to use

The following example attaches in-port-mapping to a plain Node.JS
tcp server listening on port `9093`.

这是一个内网端口映射的基础程序，可以实现类似花生壳的软件，
只要拥有一个可以部署server程序公网IP和端口，就可以通过公网ip和端口访问部署在内网机器上的服务(tcp server)

```client.js 运行在内网机器上
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

server.js 运行在公网机器上

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


