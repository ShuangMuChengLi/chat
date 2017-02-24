/**
 * Created by gequn06 on 2016/11/19.
 */
var mysql = require('mysql');
var x5 = mysql.createConnection({
    host:     'rm-bp1eof841pplxsndto.mysql.rds.aliyuncs.com',
    user:     'dev_hyzl',
    password: 'DEV_hyzl!@#$%@2016',
    database: 'x5-sys-dev'
});
var web = mysql.createConnection({
    host:     'rm-bp1eof841pplxsndto.mysql.rds.aliyuncs.com',
    user:     'dev_hyzl',
    password: 'DEV_hyzl!@#$%@2016',
    database: 'hyh-rmp-dev'
});
module.exports.x5 = x5;
module.exports.web = web;