var express            = require('express');
var router             = express.Router();
var commonService      = require('../services/shared/common.service');
var apiResponse        = require('../apiResponse');
var validateFn         = require('../validate');
var appConfig          = require('../appConfig');
var async              = require('async');
var moment             = require('moment');

router.get('/static-page/:pageType', getContactUsData);
router.get('/subscribe/:emailId', addSubscribeEmail);

function getContactUsData(req, res){
	var findQuery = { slug: req.params.pageType };
	commonService.getDocuments(appConfig.COLLECTION_NAME.staticPages, findQuery).then(function(resObj) {
		if(resObj && resObj.response && resObj.response.length > 0) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Page content found.", resObj.response);
			res.json(apiSuccessResponse).end();
		} else {
			var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page not fund", []);
			res.json(apiSuccessResponse).end();
		}
	})
	.catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function addSubscribeEmail(req, res){
	var document = {
		emailId: req.params.emailId,
	}
	commonService.saveScribeEmail(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

module.exports = router;
