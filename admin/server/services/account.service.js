var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var passwordHash = require('password-hash');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var jwt = require('jsonwebtoken');
var randomToken = require('random-token');
const async = require('async');

var db;
var service = {};
service.authenticateUser = authenticateUser;
service.forgotPassword = forgotPassword;
service.resetPassword = resetPassword;
service.verifyResetPwdLink = verifyResetPwdLink;
service.addUser = addUser;
service.getUsers = getUsers;
service.checkEmailAvailability = checkEmailAvailability;
service.getuserById = getuserById;
service.updateUser = updateUser;
service.changePassword = changePassword;
module.exports = service;

function authenticateUser(userInfo) {
	var deferred = Q.defer();
	db = mongoClient.getDb();

	db.collection("Users").findOne({
		email: userInfo.email
	}, function (err, user) {
		if (err) deferred.reject(err);
		if (user) {
			if (user.isActive) {
				/* Password for Supar Admin : tops?123 */
				var isPasswordMatched = passwordHash.verify(userInfo.password, user.password);
				if (isPasswordMatched) {
					var token = jwt.sign({
						sub: user._id
					}, appConfig.JWT_SECRET, {});
					var loggedInUser = {
						"userId": user._id,
						"firstName": user.firstName,
						"lastName": user.lastName,
						"email": user.email,
						"role": user.role,
						"token": token,
						"profileImage": user.profileImage,
						"userGroup": user.userGroup
					}
					deferred.resolve(loggedInUser);
				} else
					return deferred.reject("Invalid Password");
			} else {
				return deferred.reject("Inactive account");
			}
		} else
			return deferred.reject("No user found. Invalid Email Address");
	});
	return deferred.promise;
}

function checkEmailAvailability(email) {
	var deferred = Q.defer();
	db = mongoClient.getDb();
	db.collection("Users").findOne({
		email: email
	}, function (err, user) {
		if (err) deferred.reject(err);
		if (user) {
			return deferred.reject("User Email Already Taken");
		} else {
			return deferred.resolve(true);
		}
	});
	return deferred.promise;
}

function forgotPassword(email) {
	var deferred = Q.defer();
	var emailVerifyToken = randomToken(16);
	db = mongoClient.getDb();
	db.collection("Users").findOne({
		email: email
	}, function (err, user) {
		if (err) deferred.reject(err);
		if (user) {
			var userId = commonService.convertIntoObjectId(user._id);
			var userObject = {
				'email': email,
				'emailVerifyToken': emailVerifyToken,
				'userId': userId,
				'firstName': user.firstName
			}
			db.collection("Users").update({
				_id: userId
			}, {
				$set: {
					emailVerifyToken: emailVerifyToken
				}
			}, function (err, updatedUser) {
				if (err) deferred.reject(err);
				return deferred.resolve(userObject)
			})
		} else {
			return deferred.reject("No user found. Invalid Email Address");
		}
	});
	return deferred.promise;
}

function resetPassword(reqParam) {
	var deferred = Q.defer();
	var newPassword = reqParam.newPassword;
	db = mongoClient.getDb();
	var changePasswordCollection = db.collection("changePasswords");
	if (reqParam.newPassword !== reqParam.confirmPassword) {
		deferred.reject("Password and Confirm Password must be same.");
	}
	db.collection("Users").findOne({
		email: reqParam.email
	}, function (err, user) {
		if (err)
			deferred.reject(err);
		if (user) {
			var hashedPassword = passwordHash.generate(reqParam.newPassword);
			var userId = commonService.convertIntoObjectId(user._id);
			if (userId.Error) {
				deferred.reject(userId.Error);
				return deferred.promise;
			}
			db.collection("Users").update({
				"_id": userId
			}, {
				$set: {
					"password": hashedPassword
				},
				$unset: {
					emailVerifyToken: ''
				}
			}, {
				safe: true
			}, function (err, updatedUser) {
				if (err)
					deferred.reject(err);
				if (updatedUser) {
					deferred.resolve(updatedUser);
				}
			});
		} else {
			return deferred.reject("Email address is incorrect.");
		}
	});
	return deferred.promise;
}

function verifyResetPwdLink(email) {
	var deferred = Q.defer();
	var isExpired = true;
	db = mongoClient.getDb();
	db.collection("Users").findOne({
		'email': email
	}, function (err, doc) {
		if (err) deferred.reject(err);
		if (doc) {
			if (doc.emailVerifyToken) {
				isExpired = false;
				return deferred.resolve(isExpired);
			}
		} else {
			return deferred.resolve(isExpired);
		}
	});
	return deferred.promise;
}

function addUser(reqParam) {
	var deferred = Q.defer();
	db = mongoClient.getDb();
	if (reqParam.dateOfBirth !== 'object') {
		var dateOfBirth = reqParam.dateOfBirth.split("-");
		reqParam['dateOfBirth'] = new Date(dateOfBirth[0], dateOfBirth[1] - 1, dateOfBirth[2]);
	}
	reqParam.password = passwordHash.generate(reqParam.password);
	db.collection("Users").findOne({
		email: reqParam.email
	}, function (err, user) {
		if (err) deferred.reject(err);
		if (user) {
			deferred.reject('User already registered with this email.');
		} else {
			db.collection("Users").insertOne(reqParam, function (err, newUser) {
				if (err) deferred.reject(err);
				if (newUser) {
					deferred.resolve({
						email: reqParam.email
					});
				} else {
					deferred.resolve('Unable to add new user.');
				}
			});
		}
	})
	return deferred.promise;
}

function getUsers(reqParam) {
	var deferred = Q.defer();
	db = mongoClient.getDb();
	commonService.getPageSize().then(function (pageSize) {
		if (reqParam.pageIndex) {
			var page = parseInt(reqParam.pageIndex),
				size = pageSize,
				skip = page > 0 ? ((page - 1) * size) : 0;
		} else {
			var skip = 0,
				limit = 0;
		}
		if (reqParam.isActive == 'true') {
			var findQuery = {
				isActive: true
			};
		} else {
			var findQuery = {};
		}
		if (reqParam.searchText) {
			findQuery.email = {
				'$regex': reqParam.searchText,
				'$options': 'i'
			}
		}
		if (reqParam.userGroup) {
			findQuery.userGroup = {
				'$regex': reqParam.userGroup,
				'$options': 'i'
			}
		}
		db.collection("Users").count(findQuery, function (err, count) {
			if (err) deferred.reject(err);
			db.collection("Users").find(findQuery, {
				skip: skip,
				limit: size
			}).sort({
				"firstName": 1
			}).toArray(function (err, users) {
				if (err) deferred.reject(err);
				if (users) {
					var resObj = {
						totalItem: count,
						perPage: (reqParam.pageIndex) ? size : count,
						userList: []
					}
					users.forEach(function (user) {
						var userObj = {
							_id: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							mobileNo: user.mobileNo,
							isActive: user.isActive,
							userGroup: user.userGroup
						}
						resObj.userList.push(userObj);
					});
					deferred.resolve(resObj);
				} else {
					deferred.reject('No user found.');
				}
			});
		})
	});
	return deferred.promise;
}

function getuserById(reqParam) {
	var deferred = Q.defer();
	db = mongoClient.getDb();
	var findQuery = {};
	if (reqParam.userId) {
		findQuery._id = commonService.convertIntoObjectId(reqParam.userId)
	}

	db.collection("Users").findOne(findQuery, function (err, user) {
		if (err) deferred.reject(err);
		if (user) {
			return deferred.resolve({
				'message': 'User found.',
				'response': user
			});
		} else {
			return deferred.resolve({
				'message': 'User not found.',
				'response': []
			});
		}
	});
	return deferred.promise;
}

function updateUser(userId, reqParam) {
	var deferred = Q.defer();
	db = mongoClient.getDb();
	db.collection("Users").update({
		'_id': commonService.convertIntoObjectId(userId)
	}, {
		'$set': reqParam
	}, {
		'safe': true
	}, function (err, doc) {
		if (err) deferred.reject(err);
		if (doc.result.n > 0) {
			deferred.resolve({
				userId: userId
			});
		} else {
			deferred.reject("User not found");
		}
	});
	return deferred.promise;
}

async function changePassword(userObj){
	const db = mongoClient.getDb();

	const findQuery = {
		'_id': commonService.convertIntoObjectId(userObj.userId)
	}

	const user = await db.collection("Users").findOne(findQuery);
	if(!user) {
		throw "User not found";
	}
	const userPassWord = user.password;

	const verifyCurrentPass = passwordHash.verify(userObj.currentPassword, userPassWord);
	
	if(verifyCurrentPass) {
		const objUpdate = {
			'password': passwordHash.generate(userObj.newPassword)
		}
		
		const doc = await db.collection("Users").findOneAndUpdate(findQuery, {'$set':objUpdate}, { safe: true });
		return doc;
	} else {
		throw "Current password is wrong";
	}
}