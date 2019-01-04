var express = require('express');
var router = express.Router();
var commonService = require('../services/shared/common.service');
var getArticlesService = require('../services/googleAd.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var async = require('async');
var moment = require('moment');

router.get('/ad-header', getHeaderAdvertise);
router.get('/ad-middle', getMiddleAdvertise);
router.get('/ad-right-panel', getRightPanelAdvertise);
router.get('/ad-left-panel', getLeftPanelAdvertise);
router.get('/ad-bottom', getBottomAdvertise);
router.get('/ad-mobile', getMobileAdvertise);

function getHeaderAdvertise(req, res) {
    let categoryCollectionName = appConfig.COLLECTION_NAME.categories;
    let collectionName = "Advertise";
    let findQuery = { isActive: true, userAgent:'web', position: 'Header' };
    if(req.query.isArticle == 'true')
        findQuery['isArticle'] = true;
    let findCategoryQuery = {  };
    let returnFileds = {
        _id: 1,
        adLink1: 1,
        adLink2: 2,
        description1: 1,
        description2:1,
        fileType: 1,
        image1: 1,
        image2: 1,
        pageType: 1,
        title: 1
    }
    if (req.query.position) {
        findQuery['position'] = req.query.position; // Ad position
    }
    if (req.query.slug) {
        findCategoryQuery['slug'] = req.query.slug // Id of cateory will be unique no. 
        findCategoryQuery['isActive'] = true // Id of cateory will be unique no. 
    } else {
        categoryCollectionName = "";
    }
    if (req.query.magazineSlug) {
        findCategoryQuery['slug'] = req.query.magazineSlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Magazines';
    } 
    if (req.query.citySlug) {
        findCategoryQuery['slug'] = req.query.citySlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Cities';
        findCategoryQuery['isActive'] = true;
    }
    if (req.query.pageType) {
        findQuery['pageType'] = req.query.pageType;
    }
    var sortQuery = { lastModifiedAt: -1 };
    var adLimit = 1;
    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    /* Get category '_id' based on category 'Id'. Categories collection field '_id'  is saved as reference in Advertise collection */
    commonService.getDocuments(categoryCollectionName, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length > 0) {
            if (req.query.citySlug) 
                findQuery['city'] = categoryObj.response[0]._id;
            else if (req.query.magazineSlug) 
                findQuery['magazines'] = categoryObj.response[0]._id;
            else{
                if(categoryObj.response[0].parentId == 0)
                    findQuery['categories'] = categoryObj.response[0]._id;
                else
                    findQuery['subCategories'] = categoryObj.response[0]._id;
            }
                
        }else{
            findQuery['categories'] = [];
        }
        commonService.getDocuments(collectionName, findQuery, sortQuery, adLimit, returnFileds).then(function(resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObj.response);
                res.json(apiSuccessResponse).end();
            })
            .catch(function(err) {
                console.log(err);
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getMiddleAdvertise(req, res) {
    let collectionName = "Advertise";
    let findQuery = { isActive: true,userAgent:'web', position: req.query.position };
    let sortQuery = { lastModifiedAt: -1 };
    if(req.query.isArticle == 'true')
        findQuery['isArticle'] = true;
    let adLimit = 1;
    let returnFileds = {
        _id: 1,
        adLink: 1,
        fileType: 1,
        image: 1,
        pageType: 1,
        title: 1,
        description: 1
    }
    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    commonService.getDocuments(collectionName, findQuery, sortQuery, adLimit, returnFileds).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObj.response);
        res.json(apiSuccessResponse).end();
    })
    .catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getRightPanelAdvertise(req, res) {
    let categoryCollectionName = appConfig.COLLECTION_NAME.categories;
    let collectionName = "Advertise";
    let findQuery = { isActive: true,userAgent:'web' };
    let findCategoryQuery = { };
    if(req.query.isArticle == 'true')
        findQuery['isArticle'] = true;
    if (req.query.position) {
        findQuery['position'] = req.query.position;
    }
    if (req.query.slug) {
        findCategoryQuery['slug'] = req.query.slug // Id of cateory will be unique no. 
        findCategoryQuery['isActive'] = true // Id of cateory will be unique no. 
    } else {
        categoryCollectionName = '';
    }
    if (req.query.magazineSlug) {
        findCategoryQuery['slug'] = req.query.magazineSlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Magazines';
    } 
    if (req.query.citySlug) {
        findCategoryQuery['slug'] = req.query.citySlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Cities';
        findCategoryQuery['isActive'] = true;
    }
    if (req.query.pageType) {
        findQuery['pageType'] = req.query.pageType;
    }

    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    var sortQuery = { lastModifiedAt: -1 };
    var adLimit = 1;

    /* Get category '_id' based on category 'Id'. Categories collection field '_id'  is saved as reference in Advertise collection */
    commonService.getDocuments(categoryCollectionName, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length > 0) {
            if (req.query.citySlug) 
                findQuery['city'] = categoryObj.response[0]._id;
            else if (req.query.magazineSlug) 
                findQuery['magazines'] = categoryObj.response[0]._id;
            else{
                if(categoryObj.response[0].parentId == 0)
                    findQuery['categories'] = categoryObj.response[0]._id;
                else
                    findQuery['subCategories'] = categoryObj.response[0]._id;
            }
        }else{
            findQuery['categories'] = [];
        }
        commonService.getDocuments(collectionName, findQuery, sortQuery, adLimit).then(function(resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObj.response);
                res.json(apiSuccessResponse).end();
            })
            .catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getLeftPanelAdvertise(req, res) {
    let categoryCollectionName = appConfig.COLLECTION_NAME.categories;
    let collectionName = "Advertise";
    let findQuery = { isActive: true, userAgent:'web', position:{$in:['Header2','Header3','List','Header4']} };
    let findCategoryQuery = {};
    if(req.query.isArticle == 'true'){
        findQuery['isArticle'] = true;
    }
    if (req.query.slug) {
        findCategoryQuery['slug'] = req.query.slug // Id of cateory will be unique no. 
        findCategoryQuery['isActive'] = true // Id of cateory will be unique no. 
    } else {
        categoryCollectionName = '';
    }
    if (req.query.magazineSlug) {
        findCategoryQuery['slug'] = req.query.magazineSlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Magazines';
    } 
    if (req.query.citySlug) {
        findCategoryQuery['slug'] = req.query.citySlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Cities';
        findCategoryQuery['isActive'] = true;
    }
    if (req.query.pageType) {
        findQuery['pageType'] = req.query.pageType;
    }

    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    var sortQuery = { lastModifiedAt: -1 };

    /* Get category '_id' based on category 'Id'. Categories collection field '_id'  is saved as reference in Advertise collection */
    commonService.getDocuments(categoryCollectionName, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length > 0) {
            if (req.query.citySlug) 
                findQuery['city'] = categoryObj.response[0]._id;
            else if (req.query.magazineSlug) 
                findQuery['magazines'] = categoryObj.response[0]._id;
            else{
                if(categoryObj.response[0].parentId == 0)
                    findQuery['categories'] = categoryObj.response[0]._id;
                else
                    findQuery['subCategories'] = categoryObj.response[0]._id;
            }
        }else{
            findQuery['categories'] = [];
        }
        commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObj.response);
                res.json(apiSuccessResponse).end();
            })
            .catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

/* Get latest Advertise  for position Bottom 1, Bottom 2 or Bottom 1 + Bottom 2*/
function getBottomAdvertise(req, res) {
    let categoryCollectionName = appConfig.COLLECTION_NAME.categories;
    let collectionName = "Advertise";
    let findQuery = { isActive: true,userAgent:'web', position: { $in: ['Bottom 1', 'Bottom 2', 'Bottom 1 + Bottom 2'] } };
    let findCategoryQuery = {  };
    if(req.query.isArticle == 'true')
        findQuery['isArticle'] = true;
    let sortQuery = { lastModifiedAt: -1 };
    let adLimit = 1;
    if (req.query.slug) {
        findCategoryQuery['slug'] = req.query.slug; // Id of cateory will be unique no. 
        findCategoryQuery['isActive'] = true;
    } else {
        categoryCollectionName = '';
    }
    if (req.query.magazineSlug) {
        findCategoryQuery['slug'] = req.query.magazineSlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Magazines';
    } 
    if (req.query.citySlug) {
        findCategoryQuery['slug'] = req.query.citySlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Cities';
        findCategoryQuery['isActive'] = true;
    }
    if (req.query.pageType) {
        findQuery['pageType'] = req.query.pageType;
    }
    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    let returnFileds = {
        _id: 1,
        adLink: 1,
        description: 1,
        fileType: 1,
        image: 1,
        pageType: 1,
        position: 1,
        title: 1
    }

    /* Get category '_id' based on category 'Id'. Categories collection field '_id'  is saved as reference in Advertise collection */
    commonService.getDocuments(categoryCollectionName, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length > 0) {
            if (req.query.citySlug) 
                findQuery['city'] = categoryObj.response[0]._id;
            else if (req.query.magazineSlug) 
                findQuery['magazines'] = categoryObj.response[0]._id;
            else{
                if(categoryObj.response[0].parentId == 0)
                    findQuery['categories'] = categoryObj.response[0]._id;
                else
                    findQuery['subCategories'] = categoryObj.response[0]._id;
            }
        }else{
            findQuery['categories'] = [];
        }
        /* Get latest first document with bottom position. If first document with found with 'Bottom 1' or 'Bottom 2' position than find next advertise with reverse position
         * If first document with 'Bottom 1 + Bottom 2' position than return only one document.
         * At a time either 'Bottom 1 + Bottom 2' Advertise as big image will show or Individual Ad('Bottom 1' & 'Bottom 2') will show side by side
         */
        commonService.getDocuments(collectionName, findQuery, sortQuery, adLimit, returnFileds).then(function(resObjOfMiddle1) {
                if (resObjOfMiddle1.response && resObjOfMiddle1.response.length > 0) {
                    var firstDocPosition = resObjOfMiddle1.response[0].position;
                    if (firstDocPosition == 'Bottom 1' || firstDocPosition == 'Bottom 2') {
                        if (firstDocPosition == 'Bottom 1') {
                            findQuery['position'] = 'Bottom 2';
                        } else if (firstDocPosition == 'Bottom 2') {
                            findQuery['position'] = 'Bottom 1';
                        }
                        commonService.getDocuments(collectionName, findQuery, sortQuery, adLimit, returnFileds).then(function(resObjOfMiddle2) {
                                resObjOfMiddle1.response = resObjOfMiddle1.response.concat(resObjOfMiddle2.response)
                                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObjOfMiddle1.response);
                                res.json(apiSuccessResponse).end();
                            })
                            .catch(function(err) {
                                console.log(err)
                                var apiFailureResponse = apiResponse.setFailureResponse(err);
                                res.json(apiFailureResponse).end();
                            });
                    } else {
                        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObjOfMiddle1.response);
                        res.json(apiSuccessResponse).end();
                    }
                } else {
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObjOfMiddle1.response);
                    res.json(apiSuccessResponse).end();
                }
            })
            .catch(function(err) {
                console.log(err)
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getMobileAdvertise(req, res){

  let categoryCollectionName = appConfig.COLLECTION_NAME.categories;
    let collectionName = "Advertise";
    let findQuery = { isActive: true,userAgent:'mobile' };
    let findCategoryQuery = {};
    if(req.query.isArticle == 'true'){
        findQuery['isArticle'] = true;
    }
    if (req.query.slug) {
        findCategoryQuery['slug'] = req.query.slug // Id of cateory will be unique no. 
        findCategoryQuery['isActive'] = true // Id of cateory will be unique no. 
    } else {
        categoryCollectionName = '';
    }
    if (req.query.magazineSlug) {
        findCategoryQuery['slug'] = req.query.magazineSlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Magazines';
    } 
    if (req.query.citySlug) {
        findCategoryQuery['slug'] = req.query.citySlug; // Id of cateory will be unique no. 
        categoryCollectionName = 'Cities';
        findCategoryQuery['isActive'] = true;
    }
    if (req.query.pageType) {
        findQuery['pageType'] = req.query.pageType;
    }

    findQuery['startDate'] = { $lte: new Date(req.query.startDate) };
    findQuery['endDate'] = { $gte: new Date(req.query.endDate) };
    var sortQuery = { lastModifiedAt: -1 };
    /* Get category '_id' based on category 'Id'. Categories collection field '_id'  is saved as reference in Advertise collection */
    commonService.getDocuments(categoryCollectionName, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length > 0) {
            if (req.query.citySlug) 
                findQuery['city'] = categoryObj.response[0]._id;
            else if (req.query.magazineSlug) 
                findQuery['magazines'] = categoryObj.response[0]._id;
            else{
                if(categoryObj.response[0].parentId == 0)
                    findQuery['categories'] = categoryObj.response[0]._id;
                else
                    findQuery['subCategories'] = categoryObj.response[0]._id;
            }
        }else{
            findQuery['categories'] = [];
        }
        commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise found.", resObj.response);
                res.json(apiSuccessResponse).end();
            })
            .catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });  

}
module.exports = router;