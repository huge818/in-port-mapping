
var tunnelServer=function(tunnelport){
	var self=this;

	self.tunnelList={};	
	self.firstMsg=function(socket,data){
		var str=data.toString();
		try{
			var obj=JSON.parse(str);
		}catch(e){
			console.log("JSON数据错误");
			return;
		}
		id=obj.id;
		console.log("id="+id);
		self.tunnelList[id]=socket;	
		return id;
	}

	this.run=function(signalServer,publicServer){
		var Server = require('net').createServer(function(socket){
			var flag=false;
			var id;
			console.log("tunnelServer 收到连接请求");
			socket.on("data",function(data){
				if(flag==false){
					id=self.firstMsg(socket,data);
					flag=true;
					return;
				}
				else{
					console.log("收到客户端数据");
					console.log(flag,"id="+id);
					if(publicServer().clientList[id]){
						console.log("发送clientList["+id+"]");
						publicServer().clientList[id].write(data);
					}
					else{
						console.log("clientList["+id+"]");
					}
				}
			});	

			socket.on("end",function(){
				console.log("tunnelServer socket end");
			});

			socket.on("close",function(){
				console.log("tunnelServer close end");
			});	

			socket.on("error",function(error){
				console.log("tunnelServer socket error",error);	
			});
		});

		Server.listen(tunnelport);
		console.log("tunnelServer",tunnelport);	
	}
}

module.exports = tunnelServer;


