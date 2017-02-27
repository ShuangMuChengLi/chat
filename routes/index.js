var express = require('express');
var router = express.Router();
var url=require('url');
var qs=require('querystring');//解析参数的库
var users = require('../dao/user');
router.get('/message', function(req, res, next) {
  res.render('server-sent');
});
/* GET home page. */
router.get('/', function(req, res, next) {
  var arg = url.parse(req.url).query;
  //把参数转换成键值对，再从中拿值
  var id = qs.parse(arg)['id'];
  var room = qs.parse(arg)['room'];
  users.getUserById(id,function (user) {
    if(user){
      res.render('index',{
        name : user.sName,
        id : id,
        room: room
      });
    }else{
      res.render('error');
    }
  });
});

module.exports = router;