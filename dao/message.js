var db = require('../db');
exports.addSendMessage = function(addSendMessage){
	var date = new Date();
	var time = date.getTime();
	db.web.query(
		"INSERT INTO t_web_sendmessage (Id , RoomId,SenderId,SenderName,MessageContext,CreateTime) VALUES (?,?,?,?,?,?)",
		[time , addSendMessage.room , addSendMessage.senderId ,addSendMessage.senderName , addSendMessage.message , date],
		function(err){
			if (err) throw err;
		}
	);
}
exports.showHis = function(room , fn){
	var sSql = "SELECT * FROM  t_web_sendmessage WHERE RoomId='" + room + "'";
	db.web.query(
		sSql,
		[],
		function(err , rows){
			if (err) throw err;
			fn(rows);
		}
	);
}