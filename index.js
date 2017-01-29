"use strict";
var path = require("path");

exports.staticDir = path.join(__dirname, "static");

function initApp(app, config) {
	app.set("view engine", "ejs");
	app.set("views", __dirname + "/views");
	app.get("/", function(req, res){
		var visitId = +req.query.visit_id;
		res.render("preview", {
			data: { visitId: visitId },
			baseUrl: req.baseUrl + "/"
		})
	});
	
    app.get("/config", function (req, res) {
        res.set({
            "Content-Type": "text/javascript"
        });
        res.send("var config = " + JSON.stringify(config) + ";");
    });

}
exports.initApp = initApp;
