/* REPLACE PLACEHOLDER DATA WITH SERVER CREDENTIALS BEFORE UPLOADING */
//var bcrypt = require('bcrypt');
var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var config = require('config');
var ioSocket = require('socket.io');
//Secret Key For Session Encription
var session = require("client-sessions");
var clientSessions = require('./node_modules/client-sessions/lib/client-sessions');
var secretKey = config.get("secretKey");
//https
const https = require('https');
const http = require('http');
var fs = require('fs');
//var sticky = require('sticky-session');
var optionSSL =
{
    key: fs.readFileSync( 'encription/private.key' ),
    cert: fs.readFileSync( 'encription/certificate.crt' ),
    requestCert: false,
    rejectUnauthorized: false
};
//#############################################
// These const/vars should be changed to use your own
// ID, password, databse, and ports

const SERVER_PORT = config.get("port");//replace with your own port
var user = config.get("user");

var password = config.get("password");
var database = config.get("database");
var host = config.get("host");

//#############################################


//CORS Middleware, causes Express to allow Cross-Origin Requests
// Do NOT change anythinghere
var allowCrossDomain = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};


//set up the server variables
 //This ise use to salt our sessions encription
 //var http = require('http').Server(app);
var app = express();
app.use(cookieParser());
app.use(express.bodyParser());
var io ;///the socket.io object

//Set Up The Sessions Module
var options =
{
    cookieName: 'sessionId',
    secret: secretKey,
    duration: 2147483647,
    activeDuration: 2147483647,
};


var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));
app.use(session(options));

//app.use(express.cookie());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/', express.static(__dirname));
app.enable('trust proxy');


//var express-session-app = express-session();
var mydb = mysql.createConnection(
{
    host: host,
    user: user,
    password: password,
    database: database,
    charset : 'utf8mb4',
});

mydb.connect(function(err)
{
    if (err)
        throw err;
    console.log("Connected To mySQL");

    //Clean Up Server When Shut Down
    process.on('SIGTERM', function ()
    {
        console.log("Shutting server down.");
        app.close();
    });

    //now start the application server
    try
    {
        /** var serverHTTP= http.createServer(app).listen(8080,
            function(){
                console.log('Listening HTTP on port %d',
                serverHTTP.address().port);
                console.log(serverHTTP.address().address);
            }
        );**/

        var serverHTTPS = https.createServer(optionSSL, app).listen(8443,
            function()
            {
                console.log('Listening HTTPS on port %d',
                serverHTTPS.address().port);
                console.log(serverHTTPS.address().address);
            });
    }
    catch(error1)
    {
        console.log(error1)
        throw error1;
    }

    //Messaging Socket Stuff//

    io = ioSocket(serverHTTPS);
    io.on("connect", function (socket)
    {
        var sessionId = getSession(socket);
        if (!sessionId)
        {
	         console.log("This Socket Is Not A Valid User");
	         return;
     	}

       //console.log(typeof("2"));
       console.log("User Connected iD:" + sessionId);
       socket.join(sessionId);
       ///
       try
       {
        var clients = io.sockets.adapter.rooms[sessionId].sockets;
        console.log("User Connect To User Id: " + sessionId + " Room Count: " + Object.keys(clients).length);

    	}
    	catch(error)
    	{

    	}
    	socket.on("message", function(data)
    	{
			messageHandlier(socket,data);
    	})

         //will call function here to handle messages

	    socket.on("disconnect", function (socket)
	    {
	        console.log("User disconnected iD " + sessionId);
	    });
        io.sockets.in(sessionId).emit('connectToRoom', "You are in room no. "+ sessionId);
    });
});

app.get('/logout', function(req, res)
{
    try
    {
        req.sessionId.reset();
    }
    catch(error)
    {
        console.log("LOg out");
    }

    cookie = req.cookies;

    for (var prop in cookie)
    {
        if (!cookie.hasOwnProperty(prop))
        {
            continue;
        }
       // res.cookie(prop, 'sessionId', {expires: new Date(0)});
    }
    return res.redirect('/');
});//RV06
////////////////

var userquery = "SELECT * FROM Residents where  username = ?"; //Queries To Make
app.post('/verifyUser',
function(request, response)
{
	console.log("Request made by : " + request.connection.remoteAddress);

    var searchKey = request.body.userName;
    var pw = request.body.passcode;

    console.log("Checking record for At Host: " + searchKey);
    console.log(searchKey);

    mydb.query(userquery,[searchKey],
  	function (err, result,fields)
  	{
	    if (err)
	    {
	        console.log(err);
	        return response.send(200, "Password or username incorrect");
	    }
	    if(result.length == 0 )
	    {
            //foundUser.userFound = 0;
            console.log("User fail: " + searchKey);
            console.log("Password: " + pw);
            userNotFound = {userFound : 0};
            return response.send(200, userNotFound);
	    }
        if(pw != result[0].password)
        {
            userNotFound = {userFound : 0};
            console.log("PW FAIL : " + pw);
            return response.send(200,  userNotFound);
        }
        var userData = {userFound:1};
        request.sessionId.user = result[0].iD;
        //console.log(foundUser);
        console.log(request.sessionId.user);
        //console.log(request.session.user);
        return   response.send(200,userData);
    });
});

var searchUserdbyID = "SELECT * FROM Residents WHERE iD = ? "
app.post('/autoLogin',
function(request, response)
{
    console.log("Request made by to AutoLogIng  : " + request.connection.remoteAddress);
    var iD = request.sessionId.user;

    if (!iD)
    {
        return response.send(200, "No Sessions");
    }
    console.log("Checking record for At Host iD: " + iD);

    mydb.query(searchUserdbyID,[iD],
    function (err, result)
    {
        if (err)
        {
            console.log(err);
            return response.send(200, "Password or username incorrect");
        }

        if(err)
            throw err;
        if(result.length == 0 )
        {
            //foundUser.userFound = 0;
            console.log("User fail: " + iD);
            userNotFound = {userFound : 0};
            return response.send(200, userNotFound);
        }
        else
        {
            var userNotFound = {userFound:1};
            request.sessionId.user = result[0].iD;
            return   response.send(200,userNotFound );
        }
    });
});

// INSERT INTO `Events` (`id`, `Name`, `Type`, `Date`, `StartTime`, `EndTime`, `Description`) VALUES (NULL, 'Party at Kyles', 'Sport', '2018-11-08', '03:30:00', '07:00:00', 'Hey whats hows to it going lets party');
function messagingApi()
{

}
//This function takes a socket object and extract sessions information//
function getSession(socket)
{
    ///
    try
    {
        var cookies= socket.request.headers.cookie.split(';');
    }
    catch(error)
    {
        console.log(error);
        console.log("User No Cookies At All");
        return;
    }
    ////
    var  i;
    for (i= 0 ; i < cookies.length ;i++)
    {
        if (cookies[i].includes("sessionId"))
        {
            break;
        }
    }

    try
    {
        var cookieString = cookies[i].split('=');
    }
    catch(error)
    {
        console.log(error);
        console.log("User Probably doesnt have valid session");
        return;
    }

    var result = clientSessions.util.decode( options, cookieString[1] );
    ///Now To Verify if the user exist
    //Old Cookies Man
    try
    {
        return result.content.user;
    }
    catch(error)
    {
        return;
    }
}

var NOW = mysql.raw('NOW()');
var messageSqlinsert = "INSERT INTO Messaging SET ?  ";
function messageHandlier(socket, messageEncoded)
{
    var variablesArray=
    {
        messageId: null,
        toID: messageEncoded.to,
        fromID:getSession(socket),
        dateTime : NOW,
        messagebody:messageEncoded.message,
        isRead:0
    };

    mydb.query(messageSqlinsert,variablesArray, function(error,result,field)
    {
        if (error)
            throw error;

        var lastMessageId = result.insertId;
        console.log(lastMessageId);
        console.log(result);

        mydb.query("SELECT * FROM Messaging WHERE messageId =  ?",[lastMessageId], function(error,result,field)
        {
            if (error)
            {
                throw error;
            }
            console.log(result);
            io.sockets.in(messageEncoded.to).emit("message",result);
            io.sockets.in(getSession(socket)).emit("message",result);
        });
    })
}

var allUserQuery = "SELECT iD,username,profilePic  FROM Residents WHERE NOT iD = ?";
app.post('/getUsers',
function(request, response)
{
    console.log("Getting users For User");
    var iD = request.sessionId.user;
    if (!iD)
    {
        console.log("Couldn't Find Session");
        return response.send(401, "No Sessions Go Log In to fix error ");
    }
    mydb.query(searchUserdbyID,[request.sessionId.user],
    function (err, result)
    {
        if (err)
        {
            console.log(err);
            return;
        }
        if(result.length == 0 )
        {
            console.log("User Doesnt Not Exist Anymore");
            return;
        }
        else
        {
            console.log("Getting users For User: " + iD);
            mydb.query(allUserQuery,[iD], function(error, result1)
            {
                if (error)
                {
                    throw error;
                }
                return   response.send(200,result1);
            });
		}
    });
});

//Get User Profile
var getCurrentUSerProfile= "SELECT username,profilePic  FROM Residents WHERE iD = ?";
app.post('/getCurrentUserProfile',
function(request, response)
{
    console.log("Getting users For User");
    var iD = request.sessionId.user;
    if (!iD)
    {
        console.log("Couldn't Find Session");
        return response.send(401, "No Sessions Go Log In to fix error ");
    }
    mydb.query(searchUserdbyID,[request.sessionId.user],
    function (err, result)
    {
        if (err)
        {
            console.log(err);
            return;
        }
        if(result.length == 0 ){
            console.log("User Doesnt Not Exist Anymore");
            return;
        }
        else
        {
            console.log("Getting users For User: " + iD);
            mydb.query(getCurrentUSerProfile,[iD], function(error, result1)
            {
                if (error)
                {
                    throw error;
                }

                return   response.send(200,result1[0]);
            });
        }
    });
});

var allmessagesQuery = "SELECT * FROM Messaging WHERE toID = ? OR fromID = ? ";
app.post('/getMessages',
function(request, response)
{
    console.log("Getting messages For User");
    var toiD = request.sessionId.user;
    //var fromiD= request.body.toUser;
    console.log("----Get--MESSAGE----");
    console.log("----END_LOG----");

    if (!toiD)
    {
        return response.send(401, "No Sessions Go Log In to fix error ");
    }

    console.log("Getting message For User: " + toiD);
    mydb.query(allmessagesQuery,[toiD,toiD],
    function(error, result)
    {
        if (error)
        {
            throw error;
        }
        return   response.send(200,result);
    });
});

app.post('/pop',
function(req,res)
{
	console.log("1");
	try
	{
		console.log("2");
		var iD = req.sessionId.user;
		console.log(iD);

	    if (iD)
	    {
	        return res.send(200, "No Sessions");
			res.redirect('/');
			console.log("redirecting");
			console.log("3");
	    }
	    else
	    {
	    	console.log(iD);
	    	console.log("4");
	    	return res.redirect('/');
	    }
    }
    catch(error)
    {
        console.log("User Not Found Session");
        console.log(error);
    	console.log("5");
    }
	console.log("6");
});
//EVENTS START
//<!--==================    Event Page ~Tye TB:03 / TB:04   =================================-->
var allEventQuery = "SELECT * FROM Events";
app.post('/requestEvents',
    function(request, response)
    {
        console.log("Getting memos For User");
        var iD = request.sessionId.user;
        if (!iD)
        {
            console.log("Couldn't Find Session");
            return response.send(401, "No Sessions Go Log In to fix error ");
        }

        mydb.query(searchUserdbyID,[request.sessionId.user],
        function (err, result)
        {
            if (err)
            {
                console.log(err);
                return;
            }
            if(result.length == 0 )
            {
                console.log("User Doesnt Not Exist Anymore");
                return;
            }
            else
            {
                console.log("Getting events For User: " + iD);
                mydb.query(allEventQuery,[iD], function(error, result1)
                {
                    if (error)
                    {
                        console.log(error);
                        throw error;
                    }
                    console.log(result1);

                    return   response.send(200,result1);
                });
            }
        });
    });

var eventSQLInsert = "INSERT INTO Events SET ?  ";
app.post('/saveEvent',
function(request,response)
{
    try
    {

        console.log("Saving Event For " + request.sessionId.user );

        var variablesArray =
        {
            id: null,
            Name: request.body.eventTitle,
            Type: request.body.eventType,
            Date: request.body.eventDate,
            StartTime: request.body.eventStartA,
            EndTime: request.body.eventEndA,
            Location: request.body.location,
            Description: request.body.description
        };

        console.log(variablesArray);
    }
    catch(error)
    {
        console.log("User Not Found Session");
        console.log(error);
    }

    mydb.query(eventSQLInsert,variablesArray, function(error,result,field)
    {
        if (error)
           throw error;
        else
        {
            response.send(200, {eventSaved:1});
        }
    });
});


/*var testSQLInsert = "INSERT INTO test SET ?  ";
app.post('/testIns',
    function(request, response)
	{
	console.log(request.body);
        var variablesArray={
            Data:"bloop"
        };
		console.log(variablesArray);
        mydb.query(testSQLInsert,variablesArray, function(error,result,field){
            if (error)
                throw error;

    })
});

var testSQLInsert = "INSERT INTO Memos SET ?  ";
app.post('/testIns',
    function(request, response)
	{
		//console.log(request.body);
		var memId = request.sessionId.user;
		var memTitle = res.body.memoTitleInput;
		var memText = res.body.memoTextInput;
        var variablesArray={
			memoID: null,
			userID : memId,
            memoTitle: memTitle,
			memoText: memText,

        };
		console.log(variablesArray);
        mydb.query(testSQLInsert,variablesArray, function(error,result,field){
            if (error)
                throw error;
    })
}); */


/*===========================================  MEMO SCRIPTS  =======================================================*/
//GET MEMOS FOR DISPLAY
//KH:05
var allMemosQuery = "SELECT * FROM Memos WHERE userID = ?";
app.post('/requestMemos',
function(request, response)
{
  	console.log("Getting memos For User");
	var iD = request.sessionId.user;
	if (!iD)
  	{
	    console.log("Couldn't Find Session");
	    return response.send(401, "No Sessions Go Log In to fix error ");
	}
	mydb.query(searchUserdbyID,[request.sessionId.user],
    function (err, result)
    {
        if (err)
        {
            console.log(err);
            return;
        }
        if(result.length == 0 )
        {
            console.log("User Doesnt Not Exist Anymore");
            return;
        }
        else
        {
            console.log("Getting memos For User: " + iD);
            mydb.query(allMemosQuery,[iD], function(error, result1)
            {
                if (error)
                {
                    console.log(error);
                    throw error;
                }
                console.log(result1);

                return   response.send(200,result1);
            });
        }
    });
});

//SAVE MEMO SCRIPTS
//KH:06
var memoSQLInsertMEMO = "INSERT INTO Memos SET ?  ";
app.post('/saveMemo',
function(request, response)
{
    try
    {
    	console.log("Saving Meemo For " + request.sessionId.user );
        var variablesArray=
        {
            memoID: null,
            userID: request.sessionId.user,
            memoTitle: request.body.memoTitle,
            memoText: request.body.memoText

        };
    }
    catch(error)
    {
        console.log("User Not Found Session");
        console.log(error);
    }

    mydb.query(memoSQLInsertMEMO,variablesArray, function(error,result,field)
    {
        if (error)
             throw error;
         else
         {
            response.send(200, {memoSaved:1});
         }
    });
});

//DELETE MEMO SCRIPT
//KH:07
var memoSQLRemove = "DELETE FROM Memos WHERE memoID = ?";
app.post('/deleteMemo',
function(request, response)
{
	try
	{
        console.log("Deleting memo for " + request.sessionId.user);
        var memoId = request.body.memoID;
        console.log(memoId);
	}
	catch(error)
	{
		console.log("User Not Found Session");
		console.log(error);
	}

    mydb.query(memoSQLRemove, [memoId], function(error, result, field)
    {
		if(error)
			throw error;
		else
		{
			response.send(200, {memoDeleted:1});
		}
	});
});
