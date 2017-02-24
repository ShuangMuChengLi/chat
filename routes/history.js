var express = require('express');
var router = express.Router();
var url=require('url');
var qs=require('querystring');//解析参数的库
var messageDB = require('../dao/message');

/* GET home page. */
router.get('/', function(req, res, next) {
  var arg = url.parse(req.url).query;
  //把参数转换成键值对，再从中拿值
  var room = qs.parse(arg)['room'];
  res.writeHead(200, {'Content-Type': 'application/json'});
  messageDB.showHis(room,function (data) {
    res.end(JSON.stringify(data));
  })

});
module.exports = router;
