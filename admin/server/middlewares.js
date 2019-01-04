// var apiResponse    = require('../apiResponse');
var middleware = {};
var mongoClient = require('./mongoClient');
var commonService = require('./services/shared/common.service');
middleware.sessionHandler = sessionHandler;
middleware.ipHandler = ipHandler;
middleware.isActiveUser = isActiveUser;
module.exports = middleware;

function sessionHandler(req, res, next) {
	var objSession = {
		'SESSION_TIMED_OUT': false
	};
	if (!req.session.userInfo) {
		objSession.SESSION_TIMED_OUT = true;
		res.send(objSession);
	}
	else {
		next();
	}
}

/* Admin Panel will open from allowed ip addresses only
 * Check config setting for allow all users or not 
 * if config.ipConfig : true Allow all user
 * if config.ipConfig : false Allow users only from 'AllowIP' collectiom
 */

function ipHandler(req, res, next) {
	var ipObj = {
		'USER_UNAUTHORIZED': true
	};
	if (req.connection.remoteAddress) {
		var userIp = req.connection.remoteAddress.split(':')[3]
		db = mongoClient.getDb();
		db.collection('Configuration').findOne({}, function (err, config) {
			if (err) deferred.reject(err);
			if (config.ipConfig === true) {
				ipObj.USER_UNAUTHORIZED = false;
				next();
			} else {
				var findQuery = {
					ip: userIp,
					isActive: true
				};
				db.collection('AllowIP').findOne(findQuery, function (err, allowIp) {
					if (err) deferred.reject(err);
					if (allowIp) {
						next();
					} else {
						req.session.destroy();
						ipObj.USER_UNAUTHORIZED = true;
						res.send(ipObj);
					}
				});
			}
		});
	}
	else {
		next();
	}
}

/* Check If loggedInUserId Active */
function isActiveUser(req, res, next) {
	var ipObj = {
		'USER_INACTIVE': false
	};	
	if (req.session.userInfo) {
		var loggedInUserId = commonService.convertIntoObjectId(req.session.userInfo.userId);
		db = mongoClient.getDb();
		db.collection("Users").findOne({_id : loggedInUserId}, function (err, userInfo) {
			if (err) deferred.reject(err);
			if(userInfo.isActive){
				next();
			} else {
				req.session.destroy();
				ipObj.USER_INACTIVE = true;
				res.send(ipObj);
			}
		})
	}
	else {
		req.session.destroy();
	}
}