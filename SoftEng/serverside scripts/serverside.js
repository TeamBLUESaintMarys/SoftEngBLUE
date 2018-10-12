/* REPLACE PLACEHOLDER DATA WITH SERVER CREDENTIALS BEFORE UPLOADING */
var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');


//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = PORT;//replace with your own port
var user = 'USER';
var password = 'PASSWORD';
var database = 'DATABASE';

//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port


// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
        host + ':' + port + '/' + database;


//#############################################
//the var for the university collections
var userCollection;
var memoCollection;
var NAME_OF_COLLECTION = "User"; //NAME OF COLLECTION
//#############################################


//CORS Middleware, causes Express to allow Cross-Origin Requests
// Do NOT change anythinghere
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};


//set up the server variables
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));



//now connect to the db
mongodb.connect(connectionString, function (error, db) {
    
    //if something is wrong, it'll crash
    //you could add a try-catch block to handle it, 
    //but not needed for the assignment
    if (error) {
        throw error;
    }//end if

   	//#############################################
    userCollection = db.collection(NAME_OF_COLLECTION);
    memoCollection = db.collection(MEMO_COLLECTION);
    //#############################################



    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    //now start the application server
    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});

app.post('/verifyUser', function(request, response)
{
	var searchKey = new RegExp(request.body.User, "i");
	var pw = new RegExp(request.body.Password, "i");
	console.log("Checking record for: " + searchKey.toString() );

	userCollection.find({"User" : searchKey},
		function (err, result)
		{
			if (err)
			{
				return response.send(400, "Password or username incorrect");
			}
			else if (result.password != pw)
			{
				return response.send(400, "Password or username incorrect");
			}

			NAME_OF_COLLECTION = searchKey;
			return response.send(200, true);
		});

});

