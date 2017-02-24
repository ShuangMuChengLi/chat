var socket = io();
var $messages = $('#messages');
var $m = $('#m');
var $winHeight = $(window).height();
var $document = $(document);
socket.emit('user login', {
    name : name,
    id : id,
    room : room
});
$('form').submit(function(){
    socket.emit('chat message' + room, {
        msg :$m.val(),
        name : name,
        id : id,
        room : room
    });
    $m.val('');
    return false;
});
socket.on('chat message' + room, function(data){
    var sLi = "";
    if(data.name == name){
        sLi = "<li class='my'><span class='who'>我:</span>" + data.msg + "</li>";
    }else{
        sLi = "<li><span class='who'>" + data.name + ":</span>" + data.msg + "</li>";
    }
    $messages.append(sLi);
    var h = $document.height() - $winHeight;
    $document.scrollTop(h);
});
socket.on('message' + room, function(data){
    var message = data.message;
    $messages.append('<li ><span class="info">系统提示：</span>' + message + "</li>");

});
socket.on('updateOnlineUsers' + room, function(data){
    var users = data.users;
    var html = "";
    for(var i = 0; i < users.length ; i++){
        html += '<li>' + users[i] + "</li>";
    }
    $('#userList').html(html);
});
$("#showHistory").on("click",function () {
    $.get("http://172.16.36.156:3000/history?room=" + room + "&time=" + new Date().getTime(),function (data) {

        var sLi = "";
        for (var i=0 ; i<data.length ; i++){
            if(data[i].SenderName == name){
                sLi += "<li class='my'><span class='who'>我:</span>" + data[i].MessageContext + "</li>";
            }else{
                sLi += "<li><span class='who'>" + data[i].SenderName + ":</span>" + data[i].MessageContext + "</li>";
            }
        }
        $messages.html(sLi);
    });
});