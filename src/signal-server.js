
/**
 * [SignalServer 信令服务，与中转服务只保持一个连接]
 * @param {[type]} signalport [信令服务端口]
 */
var signalServer=function(signalport){
	var self=this;
	self.connectList={};
	self.okList={};

	self.getSocketIO=function(){
		return self.socketIO;
	}

	self.run=function(){
		console.log("signalServer run");
		var io = require('socket.io').listen(signalport);
		io.sockets.on('connection',function(socket){
			console.log("socket.io客户端已连接");
			self.socketIO=socket;
			//var address = socket.handshake.address; 
			socket.on("initData",function(initData){
				var username=initData.username;
				self.connectList[username]=socket;
				console.log("initData",initData);
			});

			socket.on("disconnect",function(initData){
				console.log("disconnect",initData);
			});

			socket.on("connect",function(initData){
				console.log("connect");
			});

			socket.on("OK",function(obj){
				console.log("OK");
				self.okList[obj.id]=true;
			});
		});	

		console.log("signalport:"+signalport);	
	}
}


module.exports = signalServer;


