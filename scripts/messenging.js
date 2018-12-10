
//D.B Devano Brown Index One 
console.log = function (log){
    
}
var socket ;
var messageHandlierSystem;
var connected = false;
var userProfile;
var getLastuserActive;

function scrollPageDown()
{
    if ($.mobile.activePage.attr("id") =='pageMessanger')
    {
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }

}

document.getElementById("btnLogout").addEventListener("click", function()
{
    if (!socket);
    else 
    {
        socket.disconnect();
        socket  = null;
    }
})

function onGranted() 
{
    console.log("Permission Granted ");
}

function onDenied() 
{
    console.log("Permission Not Granted");
}

document.addEventListener("DOMContentLoaded", function(event) 
{
    $(function() 
    {
        $.mobile.panel.prototype._positionPanel = function() 
        {
            var self = this,
                panelInnerHeight = self._panelInner.outerHeight(),
                expand = panelInnerHeight > $.mobile.getScreenHeight();
    
            if ( expand || !self.options.positionFixed ) 
            {
                if ( expand ) 
                {
                    self._unfixPanel();
                    $.mobile.resetActivePageHeight( panelInnerHeight );
                }
              //window.scrollTo( 0, $.mobile.defaultHomeScroll );
            } 
            else 
            {
                self._fixPanel();
            }
        };
    });

    setUpSocketio();
    
    jQuery("time.timeago").timeago();
    jQuery.timeago.settings.allowFuture = true;
    
    Push.Permission.request(onGranted, onDenied);

});

function readOutLoud(message) 
{
	var speech = new SpeechSynthesisUtterance();

	speech.text = message;
	speech.volume = 1.0;
	speech.rate = 1.00;
	speech.pitch = 1.0;
  
	window.speechSynthesis.speak(speech);
}


function setUpSocketio()
{
    
    requestUsers();  
};


function setUpMessagesEvents()
{
    var textMessage = document.getElementById("inputMessage");
    var textMessageButton = document.getElementById("SendButton");
    
    textMessageButton.addEventListener("click", function (event)
    {
        if (connected == false)
        {
            alert("Cannot Send MEssage: Check Your Connection Please");
        }
        else 
        {
            processText(textMessage);
        }

    });

    textMessage.addEventListener("keyup", function(event) 
    {
        if (event.key === "Enter") 
        {
            if (connected == false)
            {
                alert("Cannot Send MEssage: Check Your Connection Please");
            }
            else 
            {
                processText(textMessage);
            }
        }
    });

}

function sendMessage(){}

function receiveMessage(){}

function processText(inputBoxiD)
{
    if (inputBoxiD.value.trim() == ""){}
    else 
    {
        var text = inputBoxiD.value;
        inputBoxiD.value = "";
        messageHandlierSystem.sendMessage(text);
    }

}

function requestUsers()
{ 
    var xhr = new XMLHttpRequest();
    var url = "/getUsers";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () 
    {
        if (xhr.readyState === 4 && xhr.status === 200) 
        {
            var json = JSON.parse(xhr.responseText);

            messageHandlierSystem = new MessageHandlier(json);

            if (!socket)
            {
                socket = io();
                
                socket.on('message',function(data) 
                {
                    console.log(data[0].messagebody);
                    messageHandlierSystem.receiveMessage(data[0]);
                });
                
                socket.on('connectToRoom',function(data) 
                {
                    connected = true;
                    console.log(data);
                });

                socket.io.on('connect_error', function(err) 
                {
                    // handle server error here
                    connected = false;
                    console.log('Error connecting to server');
                });
            }
            requestUserProfile();
        }
         
         else if (xhr.readyState === 4 && xhr.status === 401){}            
    };
    xhr.send();
}

function requestUserProfile()
{     
    var xhr = new XMLHttpRequest();
    var url = '/getCurrentUserProfile';
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () 
    {
        if (xhr.readyState === 4 && xhr.status === 200) 
        {

            var json = JSON.parse(xhr.responseText);

            userProfile = json;
            try 
            {
                getLastuserActive = localStorage.getItem(userProfile.username);
            }
            catch(error)
            {
                console.log(error);
            }

            requestMessages();
        }
         else if (xhr.readyState === 4 && xhr.status === 401)
         {
             alert("Session Not Found: Redirecting To Log In Page");
         }
    };
    xhr.send();
}

function requestMessages()
{ 
    var xhr = new XMLHttpRequest();
    var url = "/getMessages";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () 
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var json = JSON.parse(xhr.responseText);
            messageHandlierSystem.setMessages(json);
        }
        else if (xhr.readyState === 4 && xhr.status === 401)
        {
            alert("Session Not Found: Redirecting To Log In Page");
        }
    };
    xhr.send();
}

setUpMessagesEvents();


//Handle Each Resident
class Resident 
{
    constructor(userInfo /*messageInfo*/) 
    {
        this.userInfo = userInfo;
        this.messageInfo;
        this.sidebar;
        this.MessageContainer;
        this.newMessagesCount = 0;
    }

    generateUserSideBar()
    {
        //Create Tags With Attributes
        var list = document.createElement("li");
        list.setAttribute("id",this.userInfo.iD);
        list.setAttribute("class","ui-li-has-thumb ui-first-child ui-last-child");
        list.style.wordWrap = 'break-word';

        var atag = document.createElement("a");
        atag.setAttribute("class", "resident");
        atag.setAttribute("id", "resident"+this.userInfo.iD);

        var image= document.createElement("img");
        image.setAttribute("src","/css/images/"+this.userInfo.profilePic);
        image.setAttribute("alt","Avatar" );

        var h2 = document.createElement("h2");
        h2.setAttribute("id","name"+this.userInfo.iD );
        h2.innerText = this.userInfo.username.toUpperCase();
        
        var Newmessages = document.createElement("h1");
        Newmessages.innerHTML ="<h1><button type='button' class='btn btn-danger'> New <span class='badge btn-primary'>"+this.newMessagesCount+"</span></button></h1>"

        //Append Tags 
        list.appendChild(atag);
        atag.appendChild(image);
        atag.appendChild(h2);
        atag.appendChild(Newmessages);
        this.sidebar = list;
    }

    upDateNewMessages()
    {
            this.sidebar.getElementsByClassName("badge btn-primary")[0].innerText = this.newMessagesCount;
    }

    getSideBar()
    {
        return this.sidebar;
    }

    getMessageContainer()
    {
        return this.getMessageContainer;
    }
   
    generateMessageContain(messages)
    {
        this.newMessagesCount = 0;
        this.MessageContainer = document.createElement("div"); //This will contain our messages
        this.MessageContainer.setAttribute("id", "MessageContainer"+this.userInfo.iD);

        for (var i = 0 ; i < messages.length ; i++)
        {
            if (messages[i].toID == this.userInfo.iD)
            {
                //Message Received by this user//
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateSentMessage(messages[i]));
                
            }
            else if (messages[i].fromID == this.userInfo.iD)
            {
                //Message Sent By This user To logged in user
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateReceiveMessage(messages[i]));
            }
            else {} //This Messages Doest Pertain To This User 
            
        }
        this.upDateNewMessages();
        //console.log(this.MessageContainer);
    }

    newMessage(message)
    {
        if (message.toID == this.userInfo.iD)
        {
            //Message Received by this user//
            var chatBox = document.getElementById("chatGroup");
            this.MessageContainer.appendChild(this.generateSentMessage(message));
            scrollPageDown();
            
        }
        else if (message.fromID == this.userInfo.iD)
        {
            //Message Sent By This user To logged in user
            var chatBox = document.getElementById("chatGroup");
            this.MessageContainer.appendChild(this.generateReceiveMessage(message));
            
            var newMessageaudio = new Audio("/audio/NewMessage.mp3");
            this.generateNotification(message); // this generate a new message notificaition for the user
            newMessageaudio.play();
           // readOutLoud("You Have Received A Message That Says "+message.messagebody);
            
            scrollPageDown();
            this.upDateNewMessages();
        }

        jQuery("time.timeago").timeago();
    }

    generateNotification(message)
    {
        Push.create("New Message From " + this.userInfo.username.toUpperCase(), 
        {
            body: message.messagebody.toUpperCase(),
            icon: '/css/images/'+this.userInfo.profilePic,
            timeout: 15000,
            onClick: () =>
            {
               
                
                console.log(document.getElementById("name"+this.userInfo.iD).innerText.toUpperCase());
                this.sidebar.click();
                
                
               
                
                messageHandlierSystem.setActiveUser();
                document.getElementById("activeUserH1").innerText = this.userInfo.username;
                if ($.mobile.activePage.attr("id") !='pageMessanger'){
                    document.location.href = "/#pageMessanger";
                }
            }
        });
    }

    generateSentMessage(message) //A Message That The User Sended 
    {    
        //Create Sub Chat Container
        var divContainer = document.createElement("div");
        divContainer.setAttribute("class","container");
        
        //Create ProFile Image Contain
        var imgProPic = document.createElement("img");
        imgProPic.src = 'css/images/'+userProfile.profilePic;
        imgProPic.setAttribute("alt","Avatar");
        imgProPic.setAttribute("class","right");
        divContainer.appendChild(imgProPic);
        
        //H2 Tag for Message 
        var h2 = document.createElement("h2"); 
        h2.innerHTML = userProfile.username.toUpperCase()+" (YOU):";
        divContainer.appendChild(h2);
        
        //MessageBody
        var h4 = document.createElement("h4"); 
        h4.setAttribute("class","messageBody");
        h4.innerHTML = message.messagebody.toUpperCase();
        divContainer.appendChild(h4);
        
        //TIME StAMP
        var h4_2= document.createElement("h4"); 
        divContainer.appendChild(h4_2);
        
        //Time Stamp Inner 
        var time= document.createElement("time"); 
        time.setAttribute("class","timeago");
        var timeDateObj= new Date(message.dateTime);
        var timeDateStr = timeDateObj.toDateString() + " " + timeDateObj.toLocaleTimeString();
        time.setAttribute("datetime",timeDateStr);
 
        h4_2.appendChild(time);

        return divContainer;
    }

    generateReceiveMessage(message)//A Message that the user Recived
    { 
        //Create Sub Chat Container
        if (message.isRead == 0)
        {
            this.newMessagesCount++;
        }
        var divContainer = document.createElement("div");
        divContainer.setAttribute("class","container darker");
        
        //Create ProFile Image Contain
        var imgProPic = document.createElement("img");
        imgProPic.src = '/css/images/'+this.userInfo.profilePic;
        imgProPic.setAttribute("alt","Avatar");
        divContainer.appendChild(imgProPic);
        
        //H2 Tag for Message 
        var h2 = document.createElement("h2"); 
        h2.innerHTML = this.userInfo.username.toUpperCase()+": ";
        divContainer.appendChild(h2);
        
        //MessageBody
        var h4 = document.createElement("h4"); 
        h4.setAttribute("class","messageBody");
        h4.innerHTML = message.messagebody.toUpperCase();
        divContainer.appendChild(h4);
        
        //TIME StAMP
        var h4_2= document.createElement("h4"); 
        divContainer.appendChild(h4_2);
        
        //Time Stamp Inner 
        var time= document.createElement("time"); 
        time.setAttribute("class","timeago");
        var timeDateObj= new Date(message.dateTime);
        var timeDateStr = timeDateObj.toDateString() + " " + timeDateObj.toLocaleTimeString();
        time.setAttribute("datetime",timeDateStr);

        h4_2.appendChild(time);

        return divContainer;
    }

    setActiveMessageBox()
    {
        var myNode = document.getElementById("chatGroup");
        
        while (myNode.firstChild) 
        {
            myNode.removeChild(myNode.firstChild);
        }
        
        myNode.appendChild(this.MessageContainer);
        jQuery("time.timeago").timeago();  
    }
}

//Handles Message And Ui management
class MessageHandlier
{
    constructor(json)
    {
        this.usersArray= [];
        this.users = json;
        this.messages;
        this.activeUser;
        this.setUpPanel();
    }

    setUpPanel()
    {
        var listViewSection = document.getElementById("listViewContact");
        while (listViewSection.firstChild) 
        {
            listViewSection.removeChild(listViewSection.firstChild);

        }

        for (var  i = 0 ; i < this.users.length ; i++)
        {
            this.usersArray.push(new Resident(this.users[i]));
            this.usersArray[i].generateUserSideBar();
            var sideBarWidget= document.getElementById("listViewContact");
            sideBarWidget.appendChild(this.usersArray[i].getSideBar());
            
            this.usersArray[i].getSideBar().addEventListener("click", function ()
            {
                var toTop = document.getElementById(this.id);

                var sideBarWidget= document.getElementById("listViewContact");
                if (toTop == sideBarWidget.firstChild )
                {
                    $("#contactResidents").panel("close");
                    return;
                }

                sideBarWidget.insertBefore(toTop, sideBarWidget.firstChild);

                messageHandlierSystem.activeUser= toTop.id;
                localStorage.setItem(userProfile.username, toTop.id);
                
                document.getElementById("activeUserH1").innerText =
                document.getElementById("name"+toTop.id).innerText.toUpperCase();
                
                $("#contactResidents").panel("close");
                console.log("Current Active User Is " + messageHandlierSystem.activeUser);
                
                messageHandlierSystem.setActiveUser();
                
            });
            
            $("#listViewContact").listview().listview('refresh');
            $( "#contactResidents" ).trigger( "updatelayout" );
            
            jQuery("time.timeago").timeago();
            this.activeUser = this.usersArray[0].getSideBar().id;
            
            document.getElementById("activeUserH1").innerText =
            document.getElementById("name"+this.activeUser).innerHTML.toUpperCase();
           
            console.log("Current Active User Is: " +this.activeUser);
        }
        

        
    }
      
    sendMessage(messageToSend)
    {
        var encodedMssg = {to:this.activeUser, message:messageToSend};
        console.log(connected);
        socket.emit("message",encodedMssg );
        console.log(encodedMssg);
    }

    receiveMessage(messageToReceive)
    {
        for (var  i = 0 ; i < this.users.length ; i++)
        {
            if (this.usersArray[i].userInfo.iD == messageToReceive.toID || 
                this.usersArray[i].userInfo.iD == messageToReceive.fromID )
            {
                this.usersArray[i].newMessage(messageToReceive);
            }
        }    
    }
      
    setUpMessages()
    {
        for (var  i = 0 ; i <this.usersArray.length ; i++ )
        {
            this.usersArray[i].generateMessageContain(this.messages);
        }
    
        this.setActiveUser();  
    }

    setMessages(messages)
    {
          this.messages = messages;
          this.setUpMessages();
    }
    
    setActiveUser()
    {
        for (var  i = 0 ; i < this.users.length ; i++)
        {
            if (this.usersArray[i].userInfo.iD == this.activeUser)
            {
                this.usersArray[i].setActiveMessageBox();   
            }
        }

        if ($.mobile.activePage.attr("id") =='pageMessanger')
        {
            $('html, body').scrollTop( $(document).height() );
        };
        
      }
}
 
$(document).on("pageshow","#pageMessanger",function() { $('html, body').scrollTop($(document).height()); } );
//D.B Index 1
$('body').on('swiperight', function () { $('#contactResidents').panel('open', ''); });