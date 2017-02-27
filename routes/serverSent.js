/**
 * Created by gequn06 on 2017/2/27.
 */
var express = require('express');
var router = express.Router();
var url=require('url');

/* GET home page. */
router.get('/', function(req, res){
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    });
    res.write('data: {"msg": '+ new Date().getTime() +'}\n\n');
});
module.exports = router;