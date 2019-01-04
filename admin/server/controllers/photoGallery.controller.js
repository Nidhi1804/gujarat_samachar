const express = require('express');
const async = require('async');
const router = express.Router();
const commonService = require('../services/shared/common.service');
const photoGalleryService = require('../services/photoGallery.service');
const apiResponse = require('../apiResponse');
const validateFn = require('../validate');
const appConfig = require('../appConfig');
const middlewares = require('../middlewares');

router.post('/photo-gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addPhotoGallery);
router.put('/photo-gallery/:photoGalleryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editPhotoGallery);
router.get('/photo-gallery/:photoGalleryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getPhotoGalleryById);
router.delete("/photo-gallery", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deletePhotoGallery);
router.get('/photo-gallery', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getPhotoGalleryList);
router.put('/photo-gallery/:photoGalleryId/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changePhotoGalleryStatus);


async function addPhotoGallery(req, res) {
    const document = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
    };

    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    // document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    document['lastModifiedAt'] = new Date();
    document['publishDate'] = new Date();
    document['isGalleryImage'] = true;
    document['isActive'] = true;
    document['isFromPhotoGallery'] = true;

    try {
        const imageObj = {
            'image': req.body.image
        };
        
        const photoGalleryImageArr = await commonService.uploadSingleFiles(imageObj, [], 'slide_show');
        
        if (photoGalleryImageArr.length > 0) {
            document['image'] = photoGalleryImageArr[0].image;
        } else {
            document['image'] = '';
        }
        
        try {
            const doc = await photoGalleryService.addPhotoGallery(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo Gallery added successfully", {});
            res.json(apiSuccessResponse).end();
        } catch(e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}

async function getPhotoGalleryList(req, res) {
    const document = {
        searchText: req.query.searchText,
        pageIndex: req.query.pageIndex
    };
    
    try {
        const doc = await photoGalleryService.getPhotoGalleryList(document);
        if(doc && doc.photoGalleries) {
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo gallery found", doc);
            res.json(apiSuccessResponse).end();
        } else {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}

async function getPhotoGalleryById(req, res) {
    const photoGalleryId = req.params.photoGalleryId;
    const required = {
        "photoGalleryId": req.params.photoGalleryId
    };
    /* Document Fields Validation */
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }

    try {
        const doc = await photoGalleryService.getPhotoGalleryById(photoGalleryId);
        if(doc) {
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo gallery found", doc);
            res.json(apiSuccessResponse).end();
        } else {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}

async function editPhotoGallery(req, res) {
    const document = {
        photoGalleryId: req.params.photoGalleryId,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    };

    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['lastModifiedAt'] = new Date();
    // document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    
    try {
        const imageObj = {
            'image': req.body.image
        };
        
        const photoGalleryImageArr = await commonService.uploadSingleFiles(imageObj, [], 'slide_show');

        if (photoGalleryImageArr.length > 0) {
            document['image'] = photoGalleryImageArr[0].image;
        } else {
            document['image'] = '';
        }
        
        try {
            const doc = await photoGalleryService.editPhotoGallery(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo Gallery updated successfully", {});
            res.json(apiSuccessResponse).end();
        } catch(e) {
            const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
            res.json(apiSystemFailureResponse).end();
        }
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}

async function deletePhotoGallery(req, res) {
    const document = {
        'photoGalleryIds': req.query.photoGalleryIds
    }
    var validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document["photoGalleryIds"] = JSON.parse(document["photoGalleryIds"]);
    
    try {
        const doc = await photoGalleryService.deletePhotoGallery(document);
        let apiSuccessResponse;
        if(document["photoGalleryIds"].length > 1) {
            apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo Galleries removed successfully", {});
        } else {
            apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo Gallery removed successfully", {});
        }
        res.json(apiSuccessResponse).end();
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}

async function changePhotoGalleryStatus(req, res) {
    const document = {
        'photoGalleryId': req.params.photoGalleryId,
        'photoGalleryStatus': req.body.photoGalleryStatus
    }
    /* Document Fields Validation */
    const validation = validateFn.validate(req, res, document);
    if (!validation.success) {
        return res.json(validation).end();
    }

    try {
        const doc = await photoGalleryService.changePhotoGalleryStatus(document);
        const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Photo Gallery status changed successfully", {});
        res.json(apiSuccessResponse).end();
    } catch(e) {
        const apiSystemFailureResponse = apiResponse.setSystemFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}
module.exports = router;
