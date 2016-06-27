var net=require('net');
var tcpServer1 = net.createServer(function(socket){
	console.log("tcpServer1 收到连接请求");

    console.log('CONNECTED1: ' +socket.remoteAddress + ':' + socket.remotePort);
    // socket.end();

	socket.on("data",function(data){
		console.log('CONNECTED1: ' +socket.remoteAddress + ':' + socket.remotePort);
	});	

	socket.on("end",function(){
		console.log("end");
	});

	socket.on("close",function(){
		console.log("close end");
	});	

	socket.on("error",function(error){
		console.log("error",error);	
	});
});

tcpServer1.listen(8081);
console.log("tcpServer1 8081");


var tcpServer2 = net.createServer(function(socket){
	console.log("tcpServer2 收到连接请求");
    console.log('CONNECTED2: ' +socket.remoteAddress + ':' + socket.remotePort);

   // socket.end();
	socket.on("data",function(data){

	});	

	socket.on("end",function(){
		console.log("end");
	});

	socket.on("close",function(){
		console.log("close end");
	});	

	socket.on("error",function(error){
		console.log("error",error);	
	});
});

tcpServer2.listen(8082);
console.log("tcpServer1 8082");