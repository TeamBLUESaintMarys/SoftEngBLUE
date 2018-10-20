/* REPLACE PLACEHOLDER DATA WITH SERVER CREDENTIALS BEFORE UPLOADING */
//var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');


//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = PORT;//replace with your own port
var user = 'USER';
var password = 'PW';
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
var NAME_OF_COLLECTION = "NAME"; //NAME OF COLLECTION
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
    
    if (error) {
        throw error;
    }else console.log("Connection with mongo established");//end if

   	//#############################################
    userCollection = db.collection(NAME_OF_COLLECTION);
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

app.post('/verifyUser', 
    function(request, response)
    {
    	console.log("Request made");
        var searchKey = request.body.userName;
    	var pw = request.body.passcode;
    	console.log("Checking record for At Host: " + searchKey.toString() );
    	userCollection.find({"users" : searchKey},
    		function (err, result)
    		{
    			if (err)
    			{
    				console.log(err);
                    return response.send(400, "Password or username incorrect");
    			}
    			result.next(function (err, foundUser)
    			{
                    if(err) throw err;
                    if(!foundUser)
                    {
                        console.log("User fail: " + searchKey);
                        console.log("Password: " + pw);
        				return response.send(400, "Password or username incorrect");
                    }
                    if(pw != foundUser.password) 
                    {
                        console.log("PW FAIL : " + result.password);
                        return(400,  "Password or username incorrect");
                    }
                    return response.send(200, foundUser);
    			})
    		});
    }
);

