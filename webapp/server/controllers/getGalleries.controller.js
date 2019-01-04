var express = require('express');
var router = express.Router();
var cache = require('express-redis-cache')();
var commonService = require('../services/shared/common.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var async = require('async');
var mongoClient = require('../mongoClient');
var moment = require('moment');
var mongoClient = require('../mongoClient');
var galleryService = require('../services/getGalleries.service')


router.get('/video-gallery/:url/:Id',cache.route({ expire: 120 }), getVideoGalleryDetails);
router.get('/video-gallery',cache.route({ expire: 120 }), getVideoGalleryList);

router.get('/photo-gallery',cache.route({ expire: 120 }), getPhotoGalleryList);
router.get('/photo-gallery/home',cache.route({ expire: 120 }), getHomePhotoGalleryList);
function getPhotoGalleryList(req, res) {
    var document = {};
    if (req.query.pageIndex && parseInt(req.query.pageIndex) > 0) {
        document['pageIndex'] = req.query.pageIndex;
    }
    else {
        document['pageIndex'] = 0;
    }
    galleryService.getPhotoGalleryList(document).then(function (galleryList) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Gallery List: ", galleryList.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getHomePhotoGalleryList(req, res) {
    var findQuery = {
        isActive: true,
        publishDate: {
            $lte: new Date(moment())
        }
    };
    var sortQuery = {
        publishDate: -1
    };
    var pageSize = 0;
    var returnFileds = {
        title: 1,
        publishDate: 1,
        image: 1
    };
    commonService.getDocuments(appConfig.COLLECTION_NAME.galleryImage, findQuery, sortQuery, pageSize, returnFileds).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Get Gallery List Success.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getVideoGalleryList(req, res) {
    var document = {};
    if (req.params.galleryId) {
        document['galleryId'] = commonService.convertIntoObjectId(req.params.galleryId);
    }
    if (req.query.pageIndex && parseInt(req.query.pageIndex) > 0) {
        document['pageIndex'] = req.query.pageIndex;
    }
    if (req.query.location) {
        document['location'] = req.query.location;
    }
    else {
        document['pageIndex'] = 0;
    }
    galleryService.getVideoGallery(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Get Video Gallery Success', resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}

function getVideoGalleryDetails(req, res) {
    var document = {};
    if (req.params.Id) {
        document['Id'] = parseInt(req.params.Id);
    }
    if (req.params.url) {
        document['url'] = req.params.url;
    }
    galleryService.getVideoGalleryDetails(document).then(function (resObj) {
        if(resObj.response && resObj.response.videos.length > 0)
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Get Video Gallery Success', resObj.response);
        else
            var apiSuccessResponse = apiResponse.setSuccessResponse(404, 'Page not fund', []);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}
module.exports = router;