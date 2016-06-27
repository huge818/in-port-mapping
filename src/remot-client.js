
var remotClient=function(pobj){
	var self=this;

	this.count=0;
	this.connectList={
		"source":{},
		"tunnel":{}
	}

	var _signal=pobj.signal;
	var _tunnel=pobj.tunnel;
	var _source=pobj.source;

	var url="http://"+_signal.ip+":"+_signal.port;
	var io = require("socket.io-client");
	var socket = this.socketIO = io.connect(url);

	socket.on("connect", function(){
		console.log("connect");
		var userData={
			username:"username"
		};
		socket.emit("initData",userData);
	});

	socket.on("disconnect", function(){
		console.log("disconnect");
	});

	socket.on("END",function(obj){
		self.removeList(obj.id);
	});	

	socket.on("NEW",function(obj){
		self.newConnect(obj,_source,_tunnel);
	});		

	this.removeList=function(id){
		var csource=this.connectList["source"][id];
		var ctunnel=this.connectList["tunnel"][id];
		csource&&csource.end();
		ctunnel&&ctunnel.end();
		setTimeout(function(){
			delete csource;
			delete ctunnel;
		},500);
	}


	this.newConnect=function(obj,sourceobj,tunnelobj){
		var id=obj.id;
		var sendCount={count:0};
		var sendOK=function(sendCount){
			sendCount.count++;
			if(sendCount.count==2){
				console.log("count="+sendCount.count);
				socket.emit("OK",obj);
			}
		}
		console.log("newConnect");
		var sourceConnect = self.singleConnect(id,"source",sourceobj,function(){
			sendOK(sendCount);
			return tunnelConnect;
		});

		var tunnelConnect = self.singleConnect(id,"tunnel",tunnelobj,function(){
			sendOK(sendCount);
			return sourceConnect;
		});
	}

	this.singleConnect=function(id,type,pobj,target){
		console.log("singleConnect");
		var Connect = self.ClientConnect(pobj.ip,pobj.port,{
			id:id,
			type:type,
			onConnect:function(socket){
				socket.pipe(target());
			},
			onEnd:function(error){
				target().end();
				self.removeList(id);
			}
		});
		self.connectList[type][id]=Connect;
		return Connect;
	}

	this.ClientConnect=function(ip,port,obj){

		var client = new require('net').Socket();
		client.connect(port,ip, function() {
			if(obj.type=="tunnel"){
				var str=JSON.stringify({id:obj.id});
				client.write(str);			
			}
			obj.onConnect&&obj.onConnect(client);
		});

		client.on("data",function(data){
			console.log(data.toString());
		});

		client.on("end",function(){
			obj.onEnd&&obj.onEnd();
		});

		client.on("error",function(error){
			obj.onEnd&&obj.onEnd(error);
		});

		client.on("close",function(){
			obj.onEnd&&obj.onEnd();
		});

		return client;
	}
}

module.exports = remotClient;