/* REPLACE PLACEHOLDER DATA WITH SERVER CREDENTIALS BEFORE UPLOADING */
//var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

var cookieParser = require('cookie-parser');
var session = require('client-sessions');
var secretKey = "FFAF##$#$#@$BDF12*&^%3"


//var session = require('express-session');

//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 34567;//replace with your own port
var user = 'project3428b';
var password = 'project3428b';
var database = 'project3428b';

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
var NAME_OF_COLLECTION = "test1"; //NAME OF COLLECTION
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
 //This ise use to salt our sessions encription 
var app = express();
app.use(cookieParser());
app.use(express.bodyParser());
//Set Up The Sessions Module 
app.use(session({
  cookieName: 'sessionId',
  secret: 'random_string_goes_here',
  duration: 7 * 24 * 60 * 60 * 10000,
  activeDuration: 5 * 60 * 1000,
}));

//app.use(express.cookie());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));
//var express-session-app = express-session();

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
    	console.log("Request made by : " + request.connection.remoteAddress);
        var searchKey = request.body.userName;
    	var pw = request.body.passcode;
    	console.log("Checking record for At Host: " + searchKey);
    	userCollection.find({"users" :  searchKey},
    		function (err, result)
    		{
    			if (err)
    			{
    				console.log(err);
                    return response.send(200, "Password or username incorrect");
    			}
    			result.next(function (err, foundUser)
    			{
                     //flag indicating the user has been found
                    if(err) throw err;
                    if(!foundUser)
                    {
                        //foundUser.userFound = 0; 
                        console.log("User fail: " + searchKey);
                        console.log("Password: " + pw);
                        userNotFound = {userFound : 0};
        				return response.send(200, userNotFound);
                    }
                    if(pw != foundUser.password) 
                    {
                        userNotFound = {userFound : 0};
                        return response.send(200, userNotFound);
                        console.log("PW FAIL : " + pw);
                        return(200,  foundUser);
                    }
                    var userData = {userFound:1};
                    request.sessionId.user = foundUser._id;
                    //console.log(foundUser);
                    console.log(request.sessionId.user);
                    //console.log(request.session.user);
                    return   response.send(200,userData);
    			})
    		});
    }
);

app.post('/autoLogin', 
    function(request, response)
    {
        console.log("Request made by to AutoLogIng  : " + request.connection.remoteAddress);
        var iD = request.sessionId.user;
        console.log("Checking record for At Host iD: " + iD);
        var idObj = new ObjectId(iD);
        userCollection.find({'_id' : idObj},
            function (err, result)
            {
                if (err)
                {
                    console.log(err);
                    return response.send(200, "Password or username incorrect");
                }
                result.next(function (err, foundUser)
                {
                     console.log(foundUser);
                    if(err) throw err;
                    if(!foundUser)
                    {
                        //foundUser.userFound = 0; 
                        console.log("User fail: " + iD);
                        userNotFound = {userFound : 0};
                        return response.send(200, userNotFound);
                    }
                    else {
                        var userNotFound = {userFound:1};
                        //console.log(request.session.user);
                        return   response.send(200,userNotFound );
                    }
                })
            });
    }
);


