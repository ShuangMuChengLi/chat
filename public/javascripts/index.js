var socket = io();
var $messages = $('#messages');
var $m = $('#m');
var $winHeight = $(window).height();
var $document = $(document);
var $faceContentList = $("#faceContentList");
var $faceContent = $("#faceContent");
var oFace = new QQFace("images/face/");

// 初始化布局
$("#left").add("#right").css("height",$winHeight + "px");
$(window).resize(function () {
    var $winHeight = $(window).height();
    $("#left").add("#right").css("height",$winHeight + "px");
});

//socket.io 通讯
//进入
socket.emit('user login', {
    name : name,
    id : id,
    room : room
});
// 发送消息
function submitMsg() {
    socket.emit('chat message' + room, {
        msg :$m.val(),
        name : name,
        id : id,
        room : room
    });
    $m.val('');
}
$('#submit').on("click",function(){
    submitMsg();
    return false;
});
$m.on("keydown",function (e) {
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        //回车执行查询
        submitMsg();
        return false;
    }
});
// 显示消息
function show(SenderName,MessageContext,type) {
    MessageContext = oFace.replace(MessageContext);
    var sLi = '';
    if (type == "me"){
        sLi += '<li class="clearfix me">';
    }else{
        sLi += '<li class="clearfix">';
    }
    sLi += '<div class="dialogue-user">';
    sLi += '<img src="images/user.png"/>';
    sLi += '<div class="who">' + SenderName + '</div>';
    sLi += '</div>';
    sLi += '<div class="dialogue-content">';
    sLi += '<div class="bubble">';
    sLi += '<div>' + MessageContext + '</div>';
    sLi += '<div class="tail"></div>';
    sLi += '</div>';
    sLi += '</div>';
    sLi += '</li>';
    return sLi;
}
socket.on('chat message' + room, function(data){
    var sLi = "";
    if(data.name == name){
        sLi += show(data.name,data.msg,"me");
    }else{
        sLi += show(data.name,data.msg,"he");
    }
    $messages.append(sLi);
    var h = $document.height() - $winHeight;
    $document.scrollTop(h);
});
// 系统提示
socket.on('message' + room, function(data){
    var message = data.message;
    $messages.append('<li class="sys-info"><span class="info">系统提示：</span>' + message + "</li>");

});
// 更新用户列表
socket.on('updateOnlineUsers' + room, function(data){
    var users = data.users;
    var html = "";
    for(var i = 0; i < users.length ; i++){
        html += '<li>';
        html += '<img src="images/user.png" class="photo"/>';
        html += '<span>' + users[i] + '</span>';
        html += '<div class="fr state">';
        html += '</div>';
        html += '</li>';
    }
    $('#userList').html(html);
});

//显示历史记录
$("#showHistory").on("click",function () {
    $.get("/history?room=" + room + "&time=" + new Date().getTime(),function (data) {
        var sLi = "";
        for (var i=0 ; i<data.length ; i++){
            if(data[i].SenderName == name){
                sLi += show(data[i].SenderName,data[i].MessageContext,"me");
            }else{
                sLi += show(data[i].SenderName,data[i].MessageContext,"he");
            }
        }
        $messages.html(sLi);
    });
});

// 上传图片
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

};
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
    reader.onload = function(){
        fn(this.result);
    };
};
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
                type : "pic"
                // minpic :"<img src='" + data2 + "'/>"
            });
        // })
    });
});


// 表情
var sHtmlFace = "";
for(var i = 0;i<105 ; i++){
    var sData =  oFace.data[i][1];
    sHtmlFace += '<li><img title="' + sData +'" data-code="[' + sData +']" src="images/face/faceIcon/' + i + '.png"></li>';
}
$faceContentList.html(sHtmlFace);
$("#faceIcon").on("click",function (e) {
    if (e || e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.CancelBubble = true;
    }
    $faceContent.show();
});
$faceContent.on("click",function (e) {
    if (e || e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.CancelBubble = true;
    }
});
$(document).on("click",function () {
    $faceContent.hide();
});
function insertText(obj,str) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }
}
$faceContentList.on("click","li",function () {
    $this = $(this);
    var code = $this.find("img").data("code");
    insertText($m[0],code);
    $faceContent.hide();
});