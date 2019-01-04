var express = require('express');
var async = require('async');
var fileManager = require('easy-file-manager')
var router = express.Router();

var commonService = require('../services/shared/common.service');
var slideShowService = require('../services/slideShow.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');
var fs = require('fs');
router.delete('/slide-show/gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, removeGalleryImage);
router.post('/slide-show', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addSlideShow);
router.put('/slide-show/add-image-gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addImagePhotoGallery);
router.put('/slide-show/:slideShowId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editSlideShow);
router.get('/slide-show/:slideShowId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSlideShowByID);
router.delete("/slide-show", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteSlideShow);
router.get('/slide-show', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSlideShowList);
router.put('/slide-show/:slideShowId/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeSlideShowStatus);


function addSlideShow(req, res) {
    var document = {
        slideShowName: req.body.slideShowName,
        metaTitle: req.body.metaTitle,
        metaDescriptions: req.body.metaDescriptions,
        metaKeywords: req.body.metaKeywords,
        metaTag: req.body.metaTag,
        publishSlideShow: req.body.publishSlideShow,
        publishScheduleTime: req.body.publishScheduleTime
    }
    var required = {
        slideShowName: req.body.slideShowName,
        metaTitle: req.body.metaTitle,
        slideShowImages: req.body.slideShowImages,
        publishSlideShow: req.body.publishSlideShow
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    if (req.body.publishSlideShow == 'false') {
        document['publishScheduleTime'] = req.body.publishScheduleTime;
    }
    var imageArr = [];
    if (req.body.slideShowImages.length > 0) {
        var arrayImage = req.body.slideShowImages;
        commonService.uploadMultipleFiles(arrayImage, []).then(function (imageArr) {
            if (imageArr.length > 0) {
                imageArr.map(function (array) {
                    array.isGalleryImage = false;
                    array.isActive = true;
                    return array;
                })
                document['slideShowImages'] = imageArr;
            }
            else {
                document['slideShowImages'] = [];
            }

            slideShowService.addSlideShow(document).then(function (resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
                res.json(apiSuccessResponse).end();
            }).catch(function (err) {
                console.log("err ---- ", err);
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
        }).catch(function (err) {
            console.log("err ---- ", err);
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }
    else {
        slideShowService.addSlideShow(document).then(function (resObj) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }).catch(function (err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }


}

function editSlideShow(req, res) {
    var document = {
        slideShowId: req.params.slideShowId,
        slideShowName: req.body.slideShowName,
        metaTitle: req.body.metaTitle,
        metaDescriptions: req.body.metaDescriptions,
        metaKeywords: req.body.metaKeywords,
        metaTag: req.body.metaTag,
        publishSlideShow: req.body.publishSlideShow,
        publishScheduleTime: req.body.publishScheduleTime
    }
    var required = {
        slideShowId: req.body.slideShowId,
        slideShowName: req.body.slideShowName,
        publishSlideShow: req.body.publishSlideShow
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    if (req.params.slideShowId !== undefined) {
        document['slideShowId'] = commonService.convertIntoObjectId(req.params.slideShowId);
    }
  
    if (req.body.publishSlideShow == 'false') {
        document['publishScheduleTime'] = req.body.publishScheduleTime;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    if (req.body.slideShowImages.length > 0) {
        var arrayImage = req.body.slideShowImages;
        commonService.uploadMultipleFiles(arrayImage, []).then(function (imageArr) {

            if (imageArr.length > 0) {
                imageArr.map(function (array) {
                    if (array.isGalleryImage === undefined) {
                        array.isGalleryImage = false;
                        array.isActive = true;
                    }
                })
                document['slideShowImages'] = imageArr;
            }
            else {
                document['slideShowImages'] = [];
            }

            slideShowService.updateSlideShow(document).then(function (resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
                res.json(apiSuccessResponse).end();
            }).catch(function (err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
        }).catch(function (err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }
    else {
        slideShowService.updateSlideShow(document).then(function (resObj) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }).catch(function (err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }
}

function getSlideShowByID(req, res) {
    var slideShowId = req.params.slideShowId;
    var required = {
        "slideShowId": req.params.slideShowId
    };
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    slideShowService.getSlideShowByID(slideShowId).then(function (resObj) {
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

function deleteSlideShow(req, res) {
    var document = {
        'slideShowIds': req.query.slideShowIds
    }
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document["slideShowIds"] = JSON.parse(document["slideShowIds"]);
    slideShowService.deleteSlideShow(document.slideShowIds).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getSlideShowList(req, res) {
    var document = {
        searchText: req.query.searchText,
        category: req.query.category,
        pageIndex: req.query.pageIndex
    };
    if (req.query.category)
        document['category'] = commonService.convertIntoObjectId(document.category);
    slideShowService.getSlideShowList(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    })
        .catch(function (err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
}

function changeSlideShowStatus(req, res) {
    var document = {
        'slideShowId': req.params.slideShowId,
        'slideShowStatus': req.body.slideShowStatus
    }
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }

    slideShowService.changeSlideShowStatus(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}
function addImagePhotoGallery(req, res) {
    var document = {};
    if (req.body.slideShowId) {
        document['slideShowId'] = commonService.convertIntoObjectId(req.body.slideShowId);
    }
    if (req.body.imageId) {
        document['imageId'] = req.body.imageId;
    }

    if (req.body.isGalleryImage !== undefined) {
        document['isGalleryImage'] = req.body.isGalleryImage;
    }

    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    slideShowService.addImagePhotoGallery(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}
function removeGalleryImage(req, res) {
    commonService.removeDocuments(appConfig.COLLECTION_NAME.galleryImage, JSON.parse(req.query.galleryImageIds), JSON.parse(req.query.pathArr)).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Gallery Image Removed.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}
module.exports = router;
