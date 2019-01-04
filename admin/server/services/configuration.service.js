var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');

var service = {};
service.editConfig = editConfig;
service.insertConfigIfNotFound = insertConfigIfNotFound;
service.getAllowIpList = getAllowIpList;
service.saveAllowIp = saveAllowIp;
service.editAllowIp = editAllowIp;
service.allowAll = allowAll;
service.changeStatus = changeStatus;
module.exports = service;


function insertConfigIfNotFound(reqParam) {
	var deferred = Q.defer();
	// Basic settings
	var insertObj = {
		config: [
			{ name: 'Top Story Slide Limit', key: 'top-story-slide-limit', value: 10 },
			{ name: 'Top Read News Slide Limit', key: 'top-read-news-slide-limit', value: 10 },
			{ name: 'Latest News Slide Limit', key: 'lates-news-slide-limit', value: 10 }
		],
		createdBy: reqParam.loggedInUserId,
		createdAt: new Date(),
		lastModifiedBy: reqParam.loggedInUserId,
		lastModifiedAt: new Date()
	}
	var db = mongoClient.getDb();
	db.collection("Configuration").insertOne(insertObj, function (err, newConfig) {
		if (err) deferred.reject(err);
		if (newConfig) {
			deferred.resolve({ message: "Get document successfully.", response: newConfig.ops });
		}
		else
			deferred.resolve('Unable to add get configuration.');
	});
	return deferred.promise;
}
function editConfig(configObj) {
	var deferred = Q.defer();
	var updatedConfigObj = {
		config: configObj.config,
		lastModifiedAt: new Date(),
		lastModifiedBy: configObj.loggedInUserId
	}
	var db = mongoClient.getDb();
	var configObjId = commonService.convertIntoObjectId(configObj.configId);
	db = mongoClient.getDb();
	db.collection("Configuration").findOneAndUpdate({ '_id': configObjId }, { '$set': updatedConfigObj }, { safe: true }, function (err, doc) {
		if (err) deferred.reject(err);
		if (doc.ok === 1) {
			deferred.resolve({ message: "Configuration updated successfully.", response: { _id: configObj.configId } });
		}
		else {
			deferred.reject("Configuration not found.");
		}
	});
	return deferred.promise;
}

function getAllowIpList(configObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findQuery = {};
	commonService.getPageSize().then(function (pageSize) {
		var pageSize = pageSize;
		var pageIndex;
		if (configObj.pageIndex && parseInt(configObj.pageIndex) > 0) {
			pageIndex = (configObj.pageIndex - 1) * pageSize;
		}
		else {
			pageIndex = 0;
		}
		var sortQuery = {
			_id: -1
		}
		db.collection(appConfig.COLLECTION_NAME.allowIp).find(findQuery).sort(sortQuery).skip(pageIndex).limit(pageSize).toArray(function (err, doc) {
			db.collection(appConfig.COLLECTION_NAME.allowIp).find(findQuery).count(function (err, totalCount) {
				if (err) deferred.reject(err);

				deferred.resolve({
					message: "Get Allow IP List successfully.", response: {
						totalCount: totalCount,
						documentPerPage: pageSize,
						document: doc
					}
				});

			});
		});
	});
	return deferred.promise;
}

function saveAllowIp(allowIpObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var insertObj = {
		ip: allowIpObj.ip,
		name: allowIpObj.name,
		isActive: true
	};
	var findQuery = {
		ip: allowIpObj.ip,
	}
	commonService.getDocuments(appConfig.COLLECTION_NAME.allowIp, findQuery).then(function (resObj) {
		if (resObj.response === undefined || resObj.response === "" || resObj.response === null || resObj.response.length === 0) {
			db.collection(appConfig.COLLECTION_NAME.allowIp).insertOne(insertObj, function (err, newAllowIp) {
				if (err) deferred.reject(err);
				if (newAllowIp) {
					deferred.resolve({
						message: "Ip added Success.", response: newAllowIp.ops
					});
				} else {
					deferred.resolve('Unable to add Ip Address');
				}

			});
		}
		else {
			deferred.reject("Ip Alreday Available.");
		}

	}).catch(function (err) {
		deferred.reject("Unable to add Ip Address.");
	});
	return deferred.promise;
}

function editAllowIp(allowIpObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var ipIdObj = commonService.convertIntoObjectId(allowIpObj.allowIpId)
	var updatedAllowIpObj = {
		$set: {
			ip: allowIpObj.ip,
			name: allowIpObj.name
		}
	};
	var findQuery = {
		_id: ipIdObj
	}
	var findIpQuery = {
		ip: allowIpObj.ip
	}
	db.collection(appConfig.COLLECTION_NAME.allowIp).find(findIpQuery).toArray(function (err, ipResObj) {
		if (err) deferred.reject(err);
		var ipCount = 0;
		var ipIdCount = 0;
		ipResObj.forEach(function (obj) {
			if (obj.ip.toString() == allowIpObj.ip.toString()) {
				ipCount++;
				if (obj._id.toString() == ipIdObj.toString()) {
					ipIdCount++;
				}
			}
		})
		if ((ipCount == 1 && ipIdCount == 1) || (ipCount == 0 && ipIdCount == 0)) {
			db.collection(appConfig.COLLECTION_NAME.allowIp).findOneAndUpdate(findQuery, updatedAllowIpObj, { safe: true }, function (err, allowIp) {
				if (err) deferred.reject(err);
				if (allowIp.ok === 1) {
					deferred.resolve({
						message: "Ip updated Success.", response: findQuery._id
					});
				} else {
					deferred.resolve('Unable to add Ip Address');
				}

			});
		}
		else {
			deferred.reject("Ip Alreday Available.");
		}
	})
	return deferred.promise;
}

function allowAll(allowIpObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var updatedAllowIpObj = {
		$set: {
			ipConfig: allowIpObj.isAllowAll
		}
	};
	var findQuery = {};
	db.collection(appConfig.COLLECTION_NAME.configuration).update(findQuery, updatedAllowIpObj, function (err, allowAll) {
		if (err) deferred.reject(err);
		if (allowAll.result.ok === 1) {
			if (allowIpObj.isAllowAll === true) {
				deferred.resolve({
					message: "All Ips Allowed Success.", response: allowIpObj.isAllowAll
				});
			} else {
				deferred.resolve({
					message: "All Ips are restricted success.", response: allowIpObj.isAllowAll
				});
			}

		} else {
			deferred.resolve('Unable to change Ip Address status');
		}

	});
	return deferred.promise;
}

function changeStatus(allowIpObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	if (allowIpObj.isActive === 1) {
		allowIpObj.isActive = true
	}
	else {
		allowIpObj.isActive = false
	}
	var updatedAllowIpObj = {
		$set: {
			isActive: allowIpObj.isActive
		}
	};
	var findQuery = {
		_id: commonService.convertIntoObjectId(allowIpObj.allowIpId)
	}
	db.collection(appConfig.COLLECTION_NAME.allowIp).findOneAndUpdate(findQuery, updatedAllowIpObj, { safe: true }, function (err, allowIp) {
		if (err) deferred.reject(err);
		if (allowIp.ok === 1) {
			if (allowIpObj.isActive === true) {
				deferred.resolve({
					message: "Ip Activated Success.", response: findQuery._id
				});
			} else {
				deferred.resolve({
					message: "Ip Inactivated Success.", response: findQuery._id
				});
			}

		} else {
			deferred.resolve('Unable to add Ip Address');
		}

	});
	return deferred.promise;
}