var socket = io("https://jesmine-chat-socket.herokuapp.com");

socket.on("server-send-register-fail", function(){
    alert("Anyone registed");
});

socket.on("server-send-list-users", function(data){
    $("#boxContent").html("");
    data.forEach(function(i) {
        $("#boxContent").append("<div class='user'>" + i + "</div>");
    });
});

socket.on("server-send-register-success", function(data){
    $("#currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
});

socket.on("server-send-message", function(data){
    $("#listMessages").append("<div class='ms'>"+ data.un + ":" + data.nd+ "</div>");
});

socket.on("someone-is-writing", function(data){
    $("#annonce").html(data);
});

socket.on("someone-stop-write", function(data){
    $("#annonce").html("");
});

$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();

    // afficher quelqu'un etre train d'entrer un message
    $("#textMessage").focusin(function(){
        socket.emit("be-writing");
    });

    // non afficher
    $("#textMessage").focusout(function(){
        socket.emit("stop-write");
    });

    // client envoie Username
    $("#btnRegister").click(function(){
        socket.emit("client-send-Username", $("#txtUsername").val());
    });

    // Log out
    $("#btnLogout").click(function(){
       socket.emit("logout");
    });

    // chat, send message
    $("#btnSendMessage").click(function(){
       socket.emit("user-send-message", $("#textMessage").val());
    });
});