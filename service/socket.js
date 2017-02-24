var socketIo = require('socket.io');
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
                var addSendMessage = {
                    room : online[data.id].room,
                    senderId : msgData.id,
                    senderName : msgData.name,
                    message : msgData.msg
                }
                messageDB.addSendMessage(addSendMessage);
                io.emit('chat message' + online[data.id].room, {name:msgData.name , msg :msgData.msg});
            });
            socket.on('disconnect', function(){
                io.emit('message' + online[data.id].room , {message: data.name + "离开聊天室"});
                var room = data.room;
                online[data.id] = {};
                updateOnlineUsers(room);
            });
        });
    });
}
module.exports = socketFun;
