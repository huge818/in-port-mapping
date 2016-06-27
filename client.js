
var remotClient= require("./src/remot-client");
remotClient({
	"signal":{
		"ip":"127.0.0.1",
		"port":9091
	},
	"source":{
		"ip":"192.168.12.129",
		"port":22
	},
	"tunnel":{
		"ip":"127.0.0.1",
		"port":9092
	}
});
