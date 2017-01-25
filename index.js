"use strict";
var path = require("path");
var slashes = require("connect-slashes");

exports.staticDir = path.join(__dirname, "static");

function initApp(app, config) {
	app.set("view engine", "ejs");
	app.set("views", __dirname + "/views");
	app.get("/", function(req, res){
		var visitId = req.query.visit_id;
		console.log(visitId);
		if( visitId === undefined || visitId === "" ){
			res.render("error", { message: "visit_id が指定されていません。"});
			return;
		}
		res.render("preview", {
			data: {x:10, y:20}
		})
	});
	
	// app.get("/preview", function(req, res){
	// 	res.render("preview", {
	// 		data: {x:10, y:20}
	// 	});
	// });
	
    app.get("/config", function (req, res) {
        res.set({
            "Content-Type": "text/javascript"
        });
        res.send("var config = " + JSON.stringify(config) + ";");
    });

    app.use(slashes());
}
exports.initApp = initApp;
