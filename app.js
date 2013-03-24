var express = require('express');
var app = new express();
app.use(express.bodyParser());

var databaseUrl = "chainsaw"; // "username:password@example.com/mydb"
var collections = ["crashlogs"]
var db = require("mongojs").connect(databaseUrl, collections);

// db.crashlogs.find({sex: "female"}, function(err, users) {
//   if( err || !users) console.log("No female users found");
//   else users.forEach( function(femaleUser) {
//     console.log(femaleUser);
//   } );
// });

function postCrashlog(req, res) {
	var deviceFamily = req.body.deviceFamily;
	var crashlog = {deviceFamily:deviceFamily, stacktrace:req.body.stacktrace, description:req.body.description};
	if(deviceFamily == 'iOS' || deviceFamily == 'Android') {
		db.crashlogs.save(crashlog, function(err, saved) {
	  		if( err || !saved ) 
	  			console.log("Crashlog saved");
	  		else 
	  			console.log("Crashlog saved");
			});
		res.send({'result':'ok'});
	}
	else {
		res.send({result:'error'});
	}
}

function getCrashlogs(req, res) {
	var deviceFamily = req.query.deviceFamily;
	if(deviceFamily == 'iOS' || deviceFamily == 'Android') {
		db.crashlogs.find({deviceFamily:deviceFamily}, {_id:0, deviceFamily:0}, function (err, crashlogs) {
			res.send({result:'ok', deviceFamily:deviceFamily, crashlogs:crashlogs});
		});
	}
	else {
		res.send({result:'error'});
	}
}

app.get('/', function (req, res) {
	getCrashlogs(req, res);
});

app.post('/', function (req, res) {
	postCrashlog(req, res);
	// res.send(req.body.deviceFamily);
})

app.listen(8080);
