var socketIo = require('socket.io');
var fs = require('fs');
var path = require('path');
var messageDB = require('../dao/message');
var online = {};
var socketFun = function(server) {
    var io = socketIo.listen(server);
    io.sockets.on('connection', function (socket) {
        socket.on('user login', function(data){
            online[data.id] = online[data.id] || {};
            online[data.id].name = data.name;
            online[data.id].room = data.room;
            online[data.id].socketID = socket.id;
            io.emit('message' + online[data.id].room , {message: data.name + "加入聊天室"});
            function updateOnlineUsers(room) {
                var users = [];
                for(var i in online){
                    if(online[i].room == data.room){
                        users.push(online[i].name);
                    }
                }
                io.emit('updateOnlineUsers' + room, {users: users});
            }
            updateOnlineUsers(online[data.id].room);
            socket.on('chat message' + online[data.id].room, function(msgData){

                var msg = "";
                if (msgData.type && msgData.type == "pic"){
                    io.emit('chat message' + online[data.id].room, {name:msgData.name , msg :"<img src='" + msgData.msg + "'/>"});
                    msg = msgData.msg;
                    var base64Data = msg.replace(/^data:image\/\w+;base64,/, "");
                    var dataBuffer = new Buffer(base64Data, 'base64');
                    var imgName = new Date().getTime() + 'pic.jpg';
                    var imgUrl = path.join(__dirname, '../public/upload/' + imgName);
                    fs.writeFile(imgUrl, dataBuffer, function (err) {
                        if (err) throw err;
                        msg = "<img src='/upload/" + imgName + "'/>";
                        var addSendMessage = {
                            room : online[data.id].room,
                            senderId : msgData.id,
                            senderName : msgData.name,
                            message : msg
                        };
                        messageDB.addSendMessage(addSendMessage);
                    });
                }else{
                    msg = msgData.msg;
                    io.emit('chat message' + online[data.id].room, {name:msgData.name , msg :msg});
                    var addSendMessage = {
                        room : online[data.id].room,
                        senderId : msgData.id,
                        senderName : msgData.name,
                        message : msg
                    };
                    messageDB.addSendMessage(addSendMessage);
                }
            });
            socket.on('disconnect', function(){
                io.emit('message' + online[data.id].room , {message: data.name + "离开聊天室"});
                var room = data.room;
                online[data.id] = {};
                updateOnlineUsers(room);
            });
        });
    });
};
module.exports = socketFun;
