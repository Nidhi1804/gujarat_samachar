var express = require('express');
var async = require('async');
var router = express.Router();

var commonService = require('../services/shared/common.service');
var videoGalleryService = require('../services/videoGallery.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');

router.post('/video-gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addVideoGallery);
router.put('/video-gallery/:galleryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editVideoGallery);
router.get('/video-gallery/:galleryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getGalleryByID);
router.delete("/video-gallery", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteGallery);
router.get('/video-gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getGalleryList);
router.put('/video-gallery/:galleryId/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeGalleryStatus);
router.put('/video-gallery/change-status/:idList', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);
function addVideoGallery(req, res) {
    var document = {
        galleryName: req.body.galleryName,
        metaTitle: req.body.metaTitle,
        metaDescriptions: req.body.metaDescriptions,
        metaKeywords: req.body.metaKeywords,
        metaTag: req.body.metaTag,
        publishVideoGallery: req.body.publishVideoGallery,
        publishScheduleTime: req.body.publishScheduleTime
    }
    var required = {
        galleryName: req.body.galleryName,
        //metaTitle: req.body.metaTitle,
        //metaDescriptions: req.body.metaDescriptions,
        //metaKeywords: req.body.metaKeywords,
        //metaTag: req.body.metaTag,
        galleryVideos: req.body.galleryVideos,
        publishVideoGallery: req.body.publishVideoGallery
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    var videoArr = [];
    if (req.body.galleryVideos.length > 0) {
        document['galleryVideos'] = req.body.galleryVideos;
    }
    else {
        document['galleryVideos'] = [];
    }
    if (req.body.publishVideoGallery == 'false') {
        document['publishScheduleTime'] = req.body.publishScheduleTime;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    videoGalleryService.addVideoGallery(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function editVideoGallery(req, res) {
    var document = {
        galleryId: req.params.galleryId,
        galleryName: req.body.galleryName,
        metaTitle: req.body.metaTitle,
        metaDescriptions: req.body.metaDescriptions,
        metaKeywords: req.body.metaKeywords,
        metaTag: req.body.metaTag,
        publishVideoGallery: req.body.publishVideoGallery,
        publishScheduleTime: req.body.publishScheduleTime
    }
    var required = {
        galleryId: req.body.galleryId,
        galleryName: req.body.galleryName,
        publishVideoGallery: req.body.publishVideoGallery
    }

    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    if (req.params.galleryId !== undefined) {
        document['galleryId'] = commonService.convertIntoObjectId(req.params.galleryId);
    }

    if (req.body.galleryVideos.length > 0) {
        document['galleryVideos'] = req.body.galleryVideos;
    }
    else {
        document['galleryVideos'] = [];
    }
    if (req.body.publishVideoGallery == 'false') {
        document['publishScheduleTime'] = req.body.publishScheduleTime;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    videoGalleryService.updateVideoGallery(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });

}

function getGalleryByID(req, res) {
    var galleryId = req.params.galleryId;
    var required = {
        "galleryId": req.params.galleryId
    };
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    videoGalleryService.getGalleryByID(galleryId).then(function (resObj) {
        if (resObj) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }
        else {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function deleteGallery(req, res) {
    var document = {
        'galleryIds': req.query.galleryIds
    }
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document["galleryIds"] = JSON.parse(document["galleryIds"]);
    videoGalleryService.deleteGallery(document.galleryIds).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getGalleryList(req, res) {
    var document = {
        searchText: req.query.searchText,
        category: req.query.category,
        pageIndex: req.query.pageIndex
    };
    if (req.query.category)
        document['category'] = commonService.convertIntoObjectId(document.category);
    videoGalleryService.getGalleryList(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function changeGalleryStatus(req, res) {
    var document = {
        'galleryId': req.params.galleryId,
        'galleryStatus': req.body.galleryStatus
    }
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }

    videoGalleryService.changeGalleryStatus(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function changeStatus(req, res) {
    var document = {
        'idList': req.params.idList,
        'isActive': req.body.isActive
    }
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testingif (document['city'])

    commonService.changeDocumentsStatus('VideoGallery', document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

module.exports = router;
