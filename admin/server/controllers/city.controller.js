var express = require('express');
var router = express.Router();
var commonService = require('../services/shared/common.service');
var cityService = require('../services/city.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');

router.put('/cities/sort', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, sortCities);
router.put('/cities/:cityId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, updateCity);
router.get('/cities/:cityId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getCityById);
router.get('/cities', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getCities);
router.put('/cities/change-status/:idList', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeCityStatus);
router.post('/cities', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addCities);
function getCities(req, res) {
	var document = {
		searchText: req.query.searchText,
		isActive: req.query.isActive,
		sort: req.query.sort
	}
	document.sort = {}
	if(!req.query.sort)
		document.sort = { name: 1 }
	else
		document.sort[req.query.sort] = 1;
	cityService.getCities(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});	
}

function changeCityStatus(req, res) {
	var document = {
		'idList': req.params.idList,
		'isActive': req.body.isActive
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	commonService.changeDocumentsStatus(appConfig.COLLECTION_NAME.cities, document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
	.catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function addCities(req, res) {
	var document = {
		name: req.body.name
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	document.isActive = true;
	document.slug = commonService.slugify(req.body.name);
	cityService.addCity(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});	
}

function updateCity(req, res) {
    var required = {
        cityId: req.params.cityId
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    var findQuery = {_id : commonService.convertIntoObjectId(req.params.cityId)};
	var updateQuery = { name : req.body.name };
    updateQuery['slug'] = commonService.slugify(req.body.name);
    commonService.updateOneDocument(appConfig.COLLECTION_NAME.cities, findQuery, updateQuery).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "City updated successfully", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getCityById(req, res) {
    var findQuery = {};
    if (req.params.cityId !== undefined && req.params.cityId !== "" && req.params.cityId !== null) {
        findQuery['_id'] = commonService.convertIntoObjectId(req.params.cityId);
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.cities, findQuery).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Get City Info Success.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function sortCities(req, res) {
    let cityList = req.body.cityList
    commonService.sortDocuments(appConfig.COLLECTION_NAME.cities, cityList).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "City list order changed successfully", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}
module.exports = router;