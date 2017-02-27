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
    $.get("/history?room=" + room + "&time=" + new Date().getTime(),function (data) {

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
fnCompressImg = function (imgData , maxWidth , maxHeight, callback) {

    if (!imgData) return;

    callback = callback || function() {};

    maxHeight = maxHeight || 200; //默认最大高度200px

    maxWidth = maxWidth || 266; //默认最大宽度266px

    var canvas = document.createElement('canvas');

    var img = new Image();

    img.onload = function() {
        if (img.height > maxHeight) { //按最大高度等比缩放
            img.width *= maxHeight / img.height;
            img.height = maxHeight;
        }
        if (img.width > maxWidth) { //按最大宽度等比缩放
            img.height *= maxWidth / img.width;
            img.width = maxWidth;
        }
        var ctx = canvas.getContext("2d");
        canvas.width = img.width ;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏
        //重置canvans宽高 canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height); // 将图像绘制到canvas上
        callback(canvas.toDataURL("image/jpeg")); //必须等压缩完才读取canvas值，否则canvas内容是黑帆布
    };

    // 记住必须先绑定事件，才能设置src属性，否则img没内容可以画到canvas
    img.src = imgData;

}
var fnGetBase64  = function(obj,fn){
    var file = obj.files[0];
    //防止空指针
    if(typeof(file) == "undefined"){
        return false;
    }
//		    //判断类型是不是图片
    if(!file.type){
        alert("该款手机不支持相册上传，请使用拍照上传。或者窗口提交");
        return false;
    }
    if(!/image\/\w+/.test(file.type)){
        alert("请上传正确图片类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        fn(this.result);;
    };
}
$("#imageIcon").on("click",function () {
    $("#image").trigger("click");
});
$("#image").on("change",function () {
    fnGetBase64(this,function (data) {
        // fnCompressImg(data , 300 , 300, function (data2) {
            socket.emit('chat message' + room, {
                msg :data,
                name : name,
                id : id,
                room : room,
                type : "pic",
                // minpic :"<img src='" + data2 + "'/>"
            });
        // })
    });
})