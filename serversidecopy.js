/* REPLACE PLACEHOLDER DATA WITH SERVER CREDENTIALS BEFORE UPLOADING */
//var bcrypt = require('bcrypt');
var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var config = require('config');
var ioSocket = require('socket.io');
//Secret Key For Session Encription
var clientSessions = require('./node_modules/client-sessions/lib/client-sessions');
var secretKey = config.get("secretKey");
const cluster = require('cluster');
var session = require('client-sessions');

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
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};


//set up the server variables
 //This ise use to salt our sessions encription
 var app = express();
 var http = require('http').Server(app);
 app.use(cookieParser());
 app.use(express.bodyParser());
var io ;///the socket.io object
//Set Up The Sessions Module
var options = {
    cookieName: 'sessionId',
    secret: secretKey,
    duration: 4294967295,
    activeDuration: 4294967295 ,
};
app.use(session(options));

//app.use(express.cookie());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));


//var express-session-app = express-session();
var mydb = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
mydb.connect(function(err) {
    if (err)
        throw err;
    console.log("Connected To mySQL");

    //Clean Up Server When Shut Down
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        app.close();
    });


    //now start the application server
    try {
        var server = app.listen(SERVER_PORT, function () {
            console.log('Listening on port %d',
                server.address().port);
            console.log(server.address().address);
        });
    }
    catch(error1){
        console.log(error1)
        throw error1;
    }

    //Messaging Socket Stuff//

    io = ioSocket(server);
    io.on("connect", function (socket){

        ///
        var sessionId = getSession(socket);
        if (!sessionId){
         console.log("This Socket Is Not A Valid User");
         return;
     }

       //console.log(typeof("2"));
       console.log("User Connected iD:" + sessionId);
       socket.join(sessionId); 
       ///
       try {
        var clients = io.sockets.adapter.rooms[sessionId].sockets;
        console.log("User Connect To User Id: " + sessionId + " Room Count: " + Object.keys(clients).length);
        
    }
    catch(error){

    }
    socket.on("message", function(data){

        messageHandlier(socket,data);
    })
    
           //will call function here to handle messages 

           socket.on("disconnect", function (socket){
            console.log("User disconnected iD " + sessionId);
        });
           io.sockets.in(sessionId).emit('connectToRoom', "You are in room no. "+ sessionId);
       });

    

});


/*app.get('/logout', function(req, res){
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, 'sessionId', {expires: new Date(0)});
    }
    res.redirect('/');
});*/

var userquery = "SELECT * FROM Residents where BINARY username = ?"; //Queries To Make
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

            }
            );
    });
var searchUserdbyID = "SELECT * FROM Residents WHERE iD = ? "
app.post('/autoLogin',
    function(request, response)
    {
        console.log("Request made by to AutoLogIng  : " + request.connection.remoteAddress);
        var iD = request.sessionId.user;
        if (!iD){
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
                else {
                    var userNotFound = {userFound:1};
                    request.sessionId.user = result[0].iD;
                    return   response.send(200,userNotFound );
                }

            });
    }
    );

var allMemosQuery = "SELECT * FROM Memos WHERE userID = ?";
app.post('/requestMemos',
    function(request, response)
    {
      console.log("Getting memos For User");
      var iD = request.sessionId.user;
      if (!iD){
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
                console.log("Getting memos For User: " + iD);
                mydb.query(allMemosQuery,[iD], function(error, result1){
                    if (error)
                    {
                        console.log(error);
                        throw error;
                    }
                    console.log(result1);

                    return   response.send(200,result1);
                }

                );

            }
        }
        );

}
);

var memoSQLInsert = "INSERT INTO Memos SET ?  ";
app.post('/saveMemo',
    function(request, response)
	{
        var variablesArray={
            memoId: null,
            memoTitle: request.body.title,
            memoText: request.body.text,
            userID: request.sessionId.user,
        };
        mydb.query(memoSQLInsert,variablesArray, function(error,result,field){
            if (error) 
                throw error;
            else {
                //send response here 
            }
            console.log(variablesArray);
        })

    })

// INSERT INTO `Events` (`id`, `Name`, `Type`, `Date`, `StartTime`, `EndTime`, `Description`) VALUES (NULL, 'Party at Kyles', 'Sport', '2018-11-08', '03:30:00', '07:00:00', 'Hey whats hows to it going lets party');
function messagingApi(){

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
        ////
        try
        {
            var cookieString = cookies[i].split('=');
        }
        catch(error){
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
function messageHandlier(socket, messageEncoded){
    var variablesArray={
        messageId: null,
        toID: messageEncoded.to,
        fromID:getSession(socket),
        dateTime : NOW,
        messagebody:messageEncoded.message,
        isRead:0
    };
    mydb.query(messageSqlinsert,variablesArray, function(error,result,field){
        if (error) 
            throw error;
        var lastMessageId = result.insertId;
        console.log(lastMessageId);
        console.log(result);
        mydb.query("SELECT * FROM Messaging WHERE messageId =  ?",[lastMessageId], function(error,result,field){
            if (error){
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
    function(request, response){
        console.log("Getting users For User");
        var iD = request.sessionId.user;
        if (!iD){
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
                else {
                    console.log("Getting users For User: " + iD);
                    mydb.query(allUserQuery,[iD], function(error, result1){
                        if (error){
                            throw error;
                        }
                        return   response.send(200,result1);
                    }

                    );

                }
            }
            );



    }
    );

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
            }
        );
    }
);