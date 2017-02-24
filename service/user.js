/**
 * Created by gequn06 on 2017/2/22.
 */
var users = require('../dao/user');
module.exports.getUser = function (id) {
    users.getUserById(id,function (data) {
        
    });
};