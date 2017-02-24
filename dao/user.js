var db = require('../db');
exports.getUserById = function (id,fn){
	var sSql = "SELECT * FROM  sa_opperson WHERE sID='" + id + "'";
	db.x5.query(
        sSql,
		[],
		function(err , rows){
			if (err) throw err;
			fn(rows[0]);
		}
	);
};