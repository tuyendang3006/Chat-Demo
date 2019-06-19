var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var arrayUsers=[""];

io.on("connection", function(socket){
    console.log("Someone connected: " + socket.id);

    // client envoie Username
    socket.on("client-send-Username", function(data){
       if(arrayUsers.indexOf(data)>=0){
           // fail
           socket.emit("server-send-register-fail");
       }else{
           // success
           arrayUsers.push(data);
           socket.Username = data;
           socket.emit("server-send-register-success", data);
           io.sockets.emit("server-send-list-users", arrayUsers);
       }

    });

    socket.on("logout", function(){
        arrayUsers.splice(
            arrayUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-list-users", arrayUsers);
    });

    socket.on("user-send-message", function(data){
        io.sockets.emit("server-send-message", {un:socket.Username, nd:data});
    });

    socket.on("be-writing", function(){
        var s = socket.Username + " be writing...";
        io.sockets.emit("someone-is-writing", s);
    });

    socket.on("stop-write", function(){
        io.sockets.emit("someone-stop-write");
    });
});

app.get("/",function(req, res){
    res.render("acceuil");
})