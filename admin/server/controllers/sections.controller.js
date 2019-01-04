var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var router = express.Router();

var commonService = require('../services/shared/common.service');
var sectionsService = require('../services/sections.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');
const async = require('async');

router.post('/sections', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addSection);
router.get('/sections', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSections);
router.get('/sections/:sectionId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSectionByID);
router.delete("/sections/:sectionId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteSection);
router.put('/sections/:sectionId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editSection);
router.put('/sections/:sectionId/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);
router.post('/sections/associate-articles', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, associateArticlesToSection);

function addSection(req, res) {
	var document = {
		title: req.body.title,
		metaTags: req.body.metaTags,
		description: req.body.description
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	//document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing
	sectionsService.addSection(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function getSections(req, res) {
	var document = {
		searchText: req.query.searchText,
		pageIndex: req.query.pageIndex,
		isActive: req.query.isActive
	};
	sectionsService.getSections(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function getSectionByID(req, res) {
	var sectionId = req.params.sectionId;
	var required = {
		"sectionId": req.params.sectionId
	};
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	sectionsService.getSectionById(sectionId).then(function (resObj) {
		if (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		}
		else {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		}
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function deleteSection(req, res) {
	var document = {
		'sectionId': req.params.sectionId
	}

	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}

	sectionsService.deleteSection(document.sectionId).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}
function changeStatus(req, res) {
	var document = {
		'sectionId': req.params.sectionId,
		'sectionStatus': req.body.sectionStatus
	}

	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}

	sectionsService.changeStatus(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}
function editSection(req, res) {
	var document = {
		sectionId: req.params.sectionId,
		title: req.body.title,
		metaTags: req.body.metaTags,
		description: req.body.description
	}

	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}

	document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For Postman testing
	//document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	document['sectionId'] = commonService.convertIntoObjectId(document.sectionId);

	sectionsService.updateSection(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

async function associateArticlesToSection(req, res) {
	const document = {
		'sectionId': req.body.sectionId,
		'articles': req.body.articles
	}
	
	/* Document Fields Validation */
	const validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}

	try {
		const doc = await sectionsService.associateArticlesToSection(document);
		let message;
		if(req.body.articles.length > 1) {
			message = "Articles associated successfully";
		} else {
			message = "Article associated successfully";
		}
		const apiSuccessResponse = apiResponse.setSuccessResponse(200, message, {});
		res.json(apiSuccessResponse).end();
	} catch(err) {
		const apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	}
}
module.exports = router;