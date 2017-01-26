"use strict";
var path = require("path");
//var slashes = require("connect-slashes");

exports.staticDir = path.join(__dirname, "static");

function initApp(app, config) {
	app.set("view engine", "ejs");
	app.set("views", __dirname + "/views");
	app.get("/", function(req, res){
		var visitIdSrc = req.query.visit_id;
		console.log(visitIdSrc);
		if( visitIdSrc === undefined || visitIdSrc === "" ){
			res.render("error", { message: "visit_id が指定されていません。"});
			return;
		}
		var visitId = +visitIdSrc;
		if( !(visitId > 0) ){
			res.render("error", { message: "visit_id の値が不適切です。"});
			return;
		}
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

    //app.use(slashes());
}
exports.initApp = initApp;
