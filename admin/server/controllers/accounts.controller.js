var express = require('express');
var router = express.Router();
var mailService = require('../services/shared/mail.service');
var accountService = require('../services/account.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var emailTemplate = require('../emailTemplate');
var randomToken = require('random-token');
var middlewares = require('../middlewares');
var multer = require('multer');
var fs = require('fs-extra');
var profileImageName = '';
var commonService = require('../services/shared/common.service');
const async = require('async');
var profileImageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		var dir = './static/users_profile';
		fs.ensureDir(dir, function (err) { //Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.
			if (err) console.log("Error while creating " + dir + " directory : ", err);
			cb(null, dir);
		})
	},
	filename: function (req, file, cb) {
		var n = file.originalname.lastIndexOf(".");
		fileExtension = file.originalname.substr(n);
		profileImageName = 'user' + '-' + Date.now() + fileExtension;
		cb(null, profileImageName);
	}
})

var profileImage = multer({ storage: profileImageStorage });

router.post("/login", middlewares.ipHandler, login);
router.get('/logout', logout);
router.get('/getToken', getToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-pwd-link", verifyResetPasswordLink);
router.get("/", getUsers);
router.post("/check-email-availablity", checkEmailAvailability);
router.put("/change-status", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);
router.post("/add", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, profileImage.single('profileImage'), addUser);
router.delete("/:userId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteUser);
router.get("/:userId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getuserById);
router.put("/:userId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, profileImage.single('profileImage'), editUser);
router.post("/change-password", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changePassword);


function login(req, res) {
	//get user info
	var userInfo = {
		"email": req.body.email,
		"password": req.body.password
	};

	// parameters validation
	var required = {
		"email": req.body.email,
		"password": req.body.password
	}

	var validation = validateFn.validate(req, res, required);

	if (!validation.success) {
		return res.json(validation).end();
	}

	accountService.authenticateUser(userInfo).then(function (objLoggedInUser) {

		//Setting session in reqest object.
		if (req.session) {
			req.session.token = objLoggedInUser.token;
			req.session.userInfo = objLoggedInUser;
		}
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Logged in successfully.", objLoggedInUser);

		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

// Make JWT token available to angular app
function getToken(req, res) {
	res.send(req.session.token);
}

function logout(req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		}
		else {
			res.sendStatus(200);
		}
	});
}

function forgotPassword(req, res) {
	var userEmail = req.body.email;
	var required = {
		"email": userEmail
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.forgotPassword(userEmail).then(function (resObj) {
		var reqHost = req.get('host');
		//var generatedEmailVerifyToken = randomToken(16);
		var link = "http://" + reqHost + '/#/reset-password?email=' + resObj.email + '&verifyToken=' + resObj.emailVerifyToken;
		mailService.sendNotificationMail(
			userEmail,
			"Password Change Notification",
			"Your password has been successfully changed.",
			"Hi " + resObj.firstName + ",<br><br>We got a request to reset your password. <br><br> <b><a href=" + link + "> Reset your password </a></b> <br><br> If you ignore this message, your password won't be changed. <br> If you didn't request a password reset, let us know. <br/><br/><b>Regards,</b><br><b>The Gujarat Samachar Team<b/>")
			.then(function (mailResponse) {
				if (mailResponse.success) {
					var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Please check your registered email for the new password.", { "Email": req.body.email });
					res.json(apiSuccessResponse).end();
				}
			});
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function resetPassword(req, res) {
	var document = {
		"email": req.body.email,
		//"currentPassword":req.body.currentPassword,
		"newPassword": req.body.newPassword,
		"confirmPassword": req.body.confirmPassword
	};
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.resetPassword(document).then(function (success) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Password changed successfully.", {});
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function verifyResetPasswordLink(req, res) {
	var email = req.query.email;
	accountService.verifyResetPwdLink(email).then(function (isExpired) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Password change link expire info", { "isExpired": isExpired });
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function checkEmailAvailability(req, res) {
	var email = req.body.email;
	var required = {
		"email": email
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.checkEmailAvailability(email).then(function (isAvailable) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "User Email Available", { "isAvailable": isAvailable });
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function addUser(req, res) {
	var document = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		gender: (req.body.gender) ? req.body.gender : '',
		mobileNo: req.body.mobileNo,
		phoneNo: (req.body.phoneNo) ? req.body.phoneNo : '',
		dateOfBirth: (req.body.dateOfBirth) ? req.body.dateOfBirth : '',
		userGroup: req.body.userGroup,
		aboutAuthor: (req.body.aboutAuthor) ? req.body.aboutAuthor : '',
		address: req.body.address,
		city: (req.body.city) ? req.body.city : '',
		state: (req.body.state) ? req.body.state : '',
		postCode: (req.body.postCode) ? req.body.postCode : '',
		country: (req.body.country) ? req.body.country : '',
		isActive: true
	}
	if (req.file) {
		document.profileImage = 'users_profile/' + profileImageName;
	}
	var required = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		mobileNo: req.body.mobileNo,
		dateOfBirth: req.body.dateOfBirth,
		userGroup: req.body.userGroup,
		address: req.body.address
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.addUser(document).then(function (resObj) {
		var reqHost = req.get('host');
		var mailSenTo = req.body.email;
		var link = "http://" + reqHost + '/#/login';
		var userInfo = {
			firstName: req.body.firstName,
			email: req.body.email,
			password: req.body.password,
			loginLink: link
		};
		mailService.sendNotificationMail(mailSenTo, 'Created account in Gujarat Samachar', '', emailTemplate.ACCOUNT_VERIFICATION_EMAIL_TEMPLATE(userInfo)).then(function (mailResponse) {
			if (mailResponse.success) {
				console.log("mailResponse", mailResponse.message);
				var apiSuccessResponse = apiResponse.setSuccessResponse(200, "User added successfully", resObj);
				res.json(apiSuccessResponse).end();
			}
		}).catch(function (err) {
			console.log("err : ", err);
			err = "SMTP BadCredentials: Username and Password not accepted."
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getUsers(req, res) {
	var document = {
		'pageIndex': req.query.pageId,
		'isActive': req.query.isActive,
		'userGroup': req.query.userGroup
	}
	if (req.query.searchText !== undefined && req.query.searchText !== null && req.query.searchText !== "") {
		document.searchText = req.query.searchText;
	}
	if (req.query.group !== undefined && req.query.group !== null && req.query.group !== "") {
		document.group = req.query.group;
	}
	accountService.getUsers(document).then(function (userList) {
		var userInfo = {};
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "User list found.", userList);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function changeStatus(req, res) {
	var document = {
		'idList': req.query.userIds,
		'isActive': req.body.userStatus
	}
	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	commonService.changeDocumentsStatus(appConfig.COLLECTION_NAME.users, document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function deleteUser(req, res) {
	commonService.removeDocuments(appConfig.COLLECTION_NAME.users, JSON.parse(req.params.userId)).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "User Removed Successfully.", resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getuserById(req, res) {
	var document = {
		userId: req.params.userId
	}

	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.getuserById(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function editUser(req, res) {
	var document = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		gender: (req.body.gender) ? req.body.gender : '',
		mobileNo: req.body.mobileNo,
		phoneNo: (req.body.phoneNo) ? req.body.phoneNo : '',
		dateOfBirth: (req.body.dateOfBirth) ? req.body.dateOfBirth : '',
		userGroup: req.body.userGroup,
		aboutAuthor: (req.body.aboutAuthor) ? req.body.aboutAuthor : '',
		address: req.body.address,
		city: (req.body.city) ? req.body.city : '',
		state: (req.body.state) ? req.body.state : '',
		postCode: (req.body.postCode) ? req.body.postCode : '',
		country: (req.body.country) ? req.body.country : '',
		isActive: true
	}
	if (req.file) {
		document.profileImage = 'users_profile/' + profileImageName;
	}
	var required = {
		userId: req.params.userId,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		mobileNo: req.body.mobileNo,
		dateOfBirth: req.body.dateOfBirth,
		userGroup: req.body.userGroup,
		address: req.body.address
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	accountService.updateUser(req.params.userId, document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "User updated successfully", resObj);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

async function changePassword(req, res) {
	const document = {
		'userId': req.body.userId,
		'currentPassword': req.body.currentPassword,
		'newPassword': req.body.newPassword,
		'confirmNewPassword': req.body.confirmNewPassword
	}

	const validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	// body...
	try {
		const doc = await accountService.changePassword(document);
		if(req.body.isSendMail) {
			const email = doc.value.email;
			const subject = "Password Change Notification";
			const mailText = "Your password has been successfully changed.";
			const mailHtml = "Hi " + doc.value.firstName + ",<br><br>Your password has been changed. <br><br><p>Use the following credentials to login to your account</p><br><b>Username : " + doc.value.email + "</b><br><b>Password : " + req.body.newPassword + "</b><br><br><b>Regards,</b><br><b>The Gujarat Samachar Team<b/>";
			const emailDoc = await mailService.sendNotificationMail(email, subject, mailText, mailHtml);
		}
		const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Password updated successfully", {});
		res.json(apiSuccessResponse).end();
	} catch(e) {
		const apiFailureResponse = apiResponse.setFailureResponse(e);
		res.json(apiFailureResponse).end();
	}
}
module.exports = router;