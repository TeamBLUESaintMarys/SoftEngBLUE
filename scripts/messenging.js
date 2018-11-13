var socket ;
var messageHandlierSystem;
var connected = false;
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();

}
document.getElementById("btnLogout").addEventListener("click", function(){
    if (!socket);
    else {
        socket.disconnect();
    }
})
document.addEventListener("DOMContentLoaded", function(event) {
    setUpSocketio();

    //////Test//
   
  });

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1.0;
	speech.rate = 1.0;
	speech.pitch = 1.0;
  
	window.speechSynthesis.speak(speech);
}


function setUpSocketio(){
    console.log("The Set up");
    socket = io();
    requestUsers();
    socket.on('message',function(data) {
        console.log(data[0].messagebody);
        messageHandlierSystem.receiveMessage(data[0]);
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
     });
     socket.on('connectToRoom',function(data) {
        connected = true;
        console.log(data);
     });
     socket.io.on('connect_error', function(err) {
        // handle server error here
        connected = false;
        console.log('Error connecting to server');
      });
    
};


function setUpMessagesEvents(){
    var textMessage = document.getElementById("inputMessage");
    var textMessageButton = document.getElementById("SendButton");
    textMessageButton.addEventListener("click", function (event){
            // var key = event.which || event.keyCode;
            // if (key == 13){
                if (connected == false){
                    alert("Cannot Send MEssage: Check Your Connection Please");
                }
                else {
                    processText(textMessage);
                }
                 
             //}
        }
    );

}
function sendMessage(){

}
function receiveMessage(){
    
}
function processText(inputBoxiD){
    if (inputBoxiD.value == ""){
    }
    else {
        var text = inputBoxiD.value;
        inputBoxiD.value = "";
        messageHandlierSystem.sendMessage(text);
    }

}
function requestUsers(){ 

    
        var xhr = new XMLHttpRequest();
        //console.log(jsonDataField);
        var url = "/getUsers";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //console.log(document.cookie['sessionId']);
                var json = JSON.parse(xhr.responseText);
                console.log(json);
                messageHandlierSystem = new MessageHandlier(json);
                requestMessages();
            }
             
             else if (xhr.readyState === 4 && xhr.status === 401){
                 alert("Session Not Found: Redirecting To Log In Page");
             }
             
             
            
        };
        xhr.send();
    
    
    

}
function requestMessages(){ 

    
    var xhr = new XMLHttpRequest();
    //console.log(jsonDataField);
    var url = "/getMessages";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(document.cookie['sessionId']);
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            messageHandlierSystem.setMessages(json);
        }
         
         else if (xhr.readyState === 4 && xhr.status === 401){
             alert("Session Not Found: Redirecting To Log In Page");
         }
         
         
        
    };
    console.log(xhr);
    xhr.send();
}





setUpMessagesEvents();


//Handle Each Resident
class Resident {
    constructor(userInfo /*messageInfo*/) {
      this.userInfo = userInfo;
      this.messageInfo;
      this.sidebar;
      this.MessageContainer;

    }
    generateUserSideBar(){
        //Create Tags With Attributes
        var list = document.createElement("li");
        list.setAttribute("id",this.userInfo.iD);
        list.setAttribute("class","ui-li-has-thumb ui-first-child ui-last-child");
        ///
        var atag = document.createElement("a");
        atag.setAttribute("class", "resident");
        atag.setAttribute("id", "resident"+this.userInfo.iD);
        ///
        var image= document.createElement("img");
        image.setAttribute("src","/css/images/"+this.userInfo.profilePic);
        image.setAttribute("alt","Avatar" );
        ///
        var h2 = document.createElement("h2");
        h2.setAttribute("id","name"+this.userInfo.iD );
        h2.innerText = this.userInfo.username.toUpperCase();
        ///
        var Newmessages = document.createElement("em");
        Newmessages.innerText = "NONE AT ALL";
        //Append Tags 
        list.appendChild(atag);
        atag.appendChild(image);
        atag.appendChild(h2);
        atag.appendChild(Newmessages);
        this.sidebar = list;
        //console.log(this.sidebar);

    }
    getSideBar(){
        return this.sidebar;
    }
    getMessageContainer(){
        return this.getMessageContainer;
    }
    generateMessageContain(messages){
        this.MessageContainer = document.createElement("div"); //This will contain our messages
        this.MessageContainer.setAttribute("id", "MessageContainer"+this.userInfo.iD);
        //console.log(this.MessageContainer);
        for (var i = 0 ; i < messages.length ; i++){
            if (messages[i].toID == this.userInfo.iD){
                //Message Received by this user//
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateSentMessage(messages[i]));
                jQuery("time.timeago").timeago();
            }
            else if (messages[i].fromID == this.userInfo.iD){
                //Message Sent By This user To logged in user
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateReceiveMessage(messages[i]));
                jQuery("time.timeago").timeago();
            }
            else {
                
                //This Messages Doest Pertain To This User
            }
        }
        console.log(this.MessageContainer);
    }
    newMessage(message){
        //this.MessageContainer = document.createElement("div"); //This will contain our messages
        //this.MessageContainer.setAttribute("id", "MessageContainer"+this.userInfo.iD);
        //console.log(this.MessageContainer);
        //for (var i = 0 ; i < messages.length ; i++){
            if (message.toID == this.userInfo.iD){
                //Message Received by this user//
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateSentMessage(message));
                jQuery("time.timeago").timeago();
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                
            }
            else if (message.fromID == this.userInfo.iD){
                //Message Sent By This user To logged in user
                var chatBox = document.getElementById("chatGroup");
                this.MessageContainer.appendChild(this.generateReceiveMessage(message));
                readOutLoud("You Have Received A Message That Says "+message.messagebody);
                jQuery("time.timeago").timeago();
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
            }
            
    }
    
    generateSentMessage(message){ //A Message That The User Sended 
        //Sameple
        //Create Sub Chat Container
        var divContainer = document.createElement("div");
        divContainer.setAttribute("class","container");
        //Create ProFile Image Contain
        var imgProPic = document.createElement("img");
        imgProPic.src = 'css/images/012-girl-11.png';;
        imgProPic.setAttribute("alt","Avatar");
        imgProPic.setAttribute("class","right");
        divContainer.appendChild(imgProPic);
        //H2 Tag for Message 
        var h2 = document.createElement("h2"); 
        h2.innerHTML = "YOU:";
        divContainer.appendChild(h2);
        //MessageBody
        var h4 = document.createElement("h4"); 
        h4.innerHTML = message.messagebody.toUpperCase();
        divContainer.appendChild(h4);
        //TIME StAMP
        var h4_2= document.createElement("h4"); 
        divContainer.appendChild(h4_2);
        //Time Stamp Inner 
        var time= document.createElement("time"); 
        time.setAttribute("class","timeago");
        var timeDateObj= new Date(message.dateTime);
        var timeDateStr = timeDateObj.toLocaleDateString() + " " + timeDateObj.toLocaleTimeString();
        time.setAttribute("datetime",timeDateStr);
        //time.setAttribute("class","time-right");
        h4_2.appendChild(time);
        ///
        var timmeHuman = document.createElement("p");
        timmeHuman.innerHTML ="<p><span class='time-right'>"+timeDateStr+"</span></<p>"
        divContainer.appendChild(timmeHuman);
        //console.log(divContainer);
        return divContainer;
    
    }
    generateReceiveMessage(message){ //A Message that the user Recived
         //Sameple
        //Create Sub Chat Container
        var divContainer = document.createElement("div");
        divContainer.setAttribute("class","container darker");
        //Create ProFile Image Contain
        var imgProPic = document.createElement("img");
        //imgProPic.setAttribute("scr",'/css/images/'+this.userInfo.profilePic);
        imgProPic.src = '/css/images/'+this.userInfo.profilePic;
        imgProPic.setAttribute("alt","Avatar");
        divContainer.appendChild(imgProPic);
        //H2 Tag for Message 
        var h2 = document.createElement("h2"); 
        h2.innerHTML = this.userInfo.username.toUpperCase()+":";
        divContainer.appendChild(h2);
        //MessageBody
        var h4 = document.createElement("h4"); 
        h4.innerHTML = message.messagebody.toUpperCase();
        divContainer.appendChild(h4);
        //TIME StAMP
        var h4_2= document.createElement("h4"); 
        divContainer.appendChild(h4_2);
        //Time Stamp Inner 
        var time= document.createElement("time"); 
        time.setAttribute("class","timeago");
        var timeDateObj= new Date(message.dateTime);
        var timeDateStr = timeDateObj.toLocaleDateString() + " " + timeDateObj.toLocaleTimeString();
        time.setAttribute("datetime",timeDateStr);
        //time.setAttribute("class","time-right");
        h4_2.appendChild(time);
        ///
        var timmeHuman = document.createElement("p");
        timmeHuman.innerHTML ="<p><span class='time-left'>"+timeDateStr+"</span></<p>"
        divContainer.appendChild(timmeHuman);
        ///console.log(divContainer);
        return divContainer;
    }
    setActiveMessageBox(){
        var myNode = document.getElementById("chatGroup");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        myNode.appendChild(this.MessageContainer);
    }
    
    
}
//Handles Message And Ui management
  class MessageHandlier{
      constructor(json){
            this.usersArray= [];
            this.users = json;
            this.messages;
            this.activeUser;
            this.setUpPanel();
      }
      setUpPanel(){
        var listViewSection = document.getElementById("listViewContact");
        while (listViewSection.firstChild) {
            listViewSection.removeChild(listViewSection.firstChild);

        }
        for (var  i = 0 ; i < this.users.length ; i++){
            this.usersArray.push(new Resident(this.users[i]));
            this.usersArray[i].generateUserSideBar();
            var sideBarWidget= document.getElementById("listViewContact");
            sideBarWidget.appendChild(this.usersArray[i].getSideBar());
            this.usersArray[i].getSideBar().addEventListener("click", function (){
                var toTop = document.getElementById(this.id);
                //
            
               // toTop.parentNode.removeChild(toTop);
                var sideBarWidget= document.getElementById("listViewContact");
                if (toTop == sideBarWidget.firstChild ){
                    return;
                }
                sideBarWidget.insertBefore(toTop, sideBarWidget.firstChild);
                $( "#listViewContact" ).listview("refresh");
                
                //
                messageHandlierSystem.activeUser= toTop.id;
                document.getElementById("activeUserH1").innerText =
                document.getElementById("name"+toTop.id).innerText.toUpperCase();
                $("#contactResidents").panel("close");
                console.log("Current Active User Is " + messageHandlierSystem.activeUser);
                messageHandlierSystem.setActiveUser();
                
            });
            $("#listViewContact").listview().listview('refresh');
            
            




        }
        this.activeUser = this.usersArray[0].getSideBar().id;
        document.getElementById("activeUserH1").innerText =
        document.getElementById("name"+this.activeUser).innerHTML.toUpperCase();
        console.log("Current Active User Is: " +this.activeUser);
        
      }
      sendMessage(messageToSend){
        var encodedMssg = {to:this.activeUser, message:messageToSend};
            console.log(connected);
            socket.emit("message",encodedMssg );
            console.log(encodedMssg);
      }
      receiveMessage(messageToReceive){
        for (var  i = 0 ; i < this.users.length ; i++){
            if (this.usersArray[i].userInfo.iD == messageToReceive.toID || 
                this.usersArray[i].userInfo.iD == messageToReceive.fromID ){
                this.usersArray[i].newMessage(messageToReceive);
            }
        }
         
      }
      setUpMessages(){
        for (var  i = 0 ; i <this.usersArray.length ; i++ ){
            this.usersArray[i].generateMessageContain(this.messages);
      }
      this.setActiveUser();
    }
      setMessages(messages){
          this.messages = messages;
          //console.log(this.messages);
          this.setUpMessages();
          //we'll need to sort though the messages here
      }
      setActiveUser(){
        for (var  i = 0 ; i < this.users.length ; i++){
            if (this.usersArray[i].userInfo.iD == this.activeUser){
                this.usersArray[i].setActiveMessageBox();
            }
        }
      }
}


///call just in case of 
  































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































