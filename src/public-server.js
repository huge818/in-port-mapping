
var publicServer=function(publicport){
	var self=this;
	self.clientList={};
	self.watchok=function(id,fn,callback){
		var isOK=fn.okList[id];
		if(isOK){
			callback&&callback(true);
		}
		else{
			setTimeout(function(){
				self.watchok(id,fn,callback);
			},10);
		}
	}

	self.uuid=function(){
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		s[8] = s[13] = s[18] = s[23] = "-";
		var uuid = s.join("");
		return uuid;
	}

	self.run=function(signalServer,tunnelServer){
		var Server=require('net').createServer(function(socket){
			console.log("收到浏览器/用户请求连接");
			var id=self.uuid();
			self.clientList[id]=socket;

			var socketIO=signalServer().getSocketIO();
			socketIO.emit("NEW",{id:id});

			self.watchok(id,signalServer(),function(){
				console.log(true);
				socket.on("data",function(data){
					console.log("收到用户浏览器发来数据");
					if(tunnelServer().tunnelList[id]){
						console.log("找到发送句柄id="+id);
						tunnelServer().tunnelList[id].write(data);
					}
					else{
						console.log("未找到发送句柄");
					}
				});
			});

			var fn=function(error){
				socketIO.emit("END",{id:id});
				console.log("publicServer socket end",error);	
			}
			socket.on("end",fn);
			socket.on("error",fn);
			socket.on("close",fn);
		});

		Server.listen(publicport);
		console.log("publicServer",publicport);			
	}
}

module.exports = publicServer;


