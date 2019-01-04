var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var router = express.Router();

var commonService = require('../services/shared/common.service');
var staticPagesService = require('../services/staticPages.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');

router.post('/static-pages', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addStaticPage);
router.get('/static-pages', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getStaticPages);
router.delete("/static-pages/:pageId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deletePage);
router.get('/static-pages/:pageId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getPageByID);
router.put('/static-pages/:pageId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editPage);
router.put('/static-pages/:id/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);

function addStaticPage(req, res) {
	var document = {
		title: req.body.title,
		metaTitle: req.body.metaTitle,
		metaKeywords: req.body.metaKeywords,
		metaDescription: req.body.metaDescription,
		content: req.body.content
	}
	var required = {
		title: req.body.title,
		metaTitle: req.body.metaTitle,
		content: req.body.content
	}

	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	//document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing
	commonService.replaceContentImagePath(req.body.content, 'static_page').then(function (responseString) {
		document['content'] = responseString;
		staticPagesService.addStaticPage(document).then(function (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		}).catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
	}).catch(function (err) {
		return res.json(err).end();
	});
}

function getStaticPages(req, res) {
	staticPagesService.getStaticPages().then(function (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function deletePage(req, res) {
	var document = {
		'pageId': req.params.pageId
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	staticPagesService.deletePage(document.pageId).then(function (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function getPageByID(req, res) {
	var pageId = req.params.pageId;
	var required = {
		"pageId": req.params.pageId
	};
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	staticPagesService.getPageById(pageId).then(function (resObj) {
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
		'id': req.params.id,
		'status': req.body.status
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	commonService.changeStatus(document, 'StaticPages', 'Page').then(function (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function editPage(req, res) {
	var document = {
		pageId: req.params.pageId,
		title: req.body.title,
		metaTitle: req.body.metaTitle,
		metaKeywords: req.body.metaKeywords,
		metaDescription: req.body.metaDescription,
		content: req.body.content
	}
	var required = {
		title: req.body.title,
		metaTitle: req.body.metaTitle,
		content: req.body.content
	}

	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}

	//document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For Postman testing
	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	document['pageId'] = commonService.convertIntoObjectId(document.pageId);

	commonService.replaceContentImagePath(req.body.content, 'static_page').then(function (responseString) {
		document['content'] = responseString;
		staticPagesService.updatePage(document).then(function (resObj) {
				var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
				res.json(apiSuccessResponse).end();
			})
			.catch(function (err) {
				var apiFailureResponse = apiResponse.setFailureResponse(err);
				res.json(apiFailureResponse).end();
			});
	}).catch(function (err) {
		return res.json(err).end();
	});
}
module.exports = router