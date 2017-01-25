var web = require("myclinic-web");
var subapp = require("./index.js");

var sub = {
	name: "meisai",
	module: subapp,
	configKey: "meisai"
};

web.cmd.runFromCommand([sub], {port: 9004, usePrinter: true});
