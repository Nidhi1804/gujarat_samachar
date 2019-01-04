var express = require('express');
var router = express.Router();
var cache = require('express-redis-cache')({ expire: 120 });
var commonService = require('../services/shared/common.service');
var getArticlesService = require('../services/getCategories.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var middlewares = require('../middleware');
var appConfig = require('../appConfig');
var async = require('async');

router.get('/categories',cache.route(), getCategories);
router.get('/menu/:isMobile', cache.route(), getMenuList);
router.get('/sub-categories',cache.route(), getSubCategories);

function getCategories(req, res) {
    let collectionName = "Categories";
    let findQuery = { isActive: true };
    let sortQuery = { _id: 1 };
    if (req.query.parentId) {
        if (req.query.parentId == "0")
            findQuery['parentId'] = parseInt(req.query.parentId);
        else
            findQuery['parentId'] = commonService.convertIntoObjectId(req.query.parentId);
    }
    if (req.query.type) {
        findQuery['type'] = req.query.type;
    }
    let returnFields = {
        _id: 0,
        Id: 1,
        parentId: 1,
        position: 1,
        slug: 1,
        type: 1,
        name:1
    }
    commonService.getDocuments(collectionName, findQuery, sortQuery, false, returnFields).then(function(resObj) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Categories found.", resObj.response);
            res.json(apiSuccessResponse).end();
        })
        .catch(function(err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
}

function getSubCategories(req, res) {
    var collectionName = "Categories";
    let findSubCategoryQuery = { isActive: true };
    let sortSubCatQuery = { position: 1 };
    var findQuery = { isActive: true };
    var sortQuery = { _id: 1 };
    if (req.query.name) {
        findQuery['name'] = req.query.name;
    }
    if (req.query.type) {
        findQuery['type'] = req.query.type;
    }
    let returnFields = {
        Id: 1,
        name: 1,
        slug: 1,
        _id: 0
    }
    commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
            if (resObj && resObj.response && resObj.response.length > 0) {
                findSubCategoryQuery['parentId'] = resObj.response[0]._id;
                commonService.getDocuments(collectionName, findSubCategoryQuery, sortSubCatQuery, false, returnFields).then(function(resObj) {
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Categories found.", resObj.response);
                    res.json(apiSuccessResponse).end();
                }).catch(function(err) {
                    console.log(err);
                    var apiFailureResponse = apiResponse.setFailureResponse(err);
                    res.json(apiFailureResponse).end();
                });
            } else {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Categories not found.", resObj.response);
                res.json(apiSuccessResponse).end();
            }
        })
        .catch(function(err) {
            console.log(err);
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
}

function getMenuList(req, res) {
    let collectionName = "Categories";
    let findQuery = { isActive: true };
    let sortQuery = {};
    findQuery['parentId'] = 0;
    findQuery['type'] = 'article';
    if (req.query.sortBy)
        sortQuery[req.query.sortBy] = 1;
    else
        sortQuery = { _id: 1 };

    let returnFields = {
        Id: 1,
        parentId: 1,
        position: 1,
        slug: 1,
        type: 1,
        name:1,
        _id: 1
    }
    if(req.params.isMobile == 'true'){
        returnFields['icon'] = 1;
    }
    commonService.getDocuments(collectionName, findQuery, sortQuery, false, returnFields).then(function(resObj) {
            if (resObj.response.length > 0) {
                async.forEachLimit(resObj.response, 1, function(result, callback) {
                    // Gujarat / Magazines menu items will be from separate collection, not from categories.
                    if (result.name !== "Magazines") {
                        var subMenuFindQuery = {
                            isActive: true,
                            parentId: commonService.convertIntoObjectId(result._id)
                        };
                        var subMenuSortQuery = {};
                        var subMenuReturnField = {
                            Id: 1,
                            isActive: 1,
                            listType: 1,
                            parentId: 1,
                            position: 1,
                            slug: 1,
                            type: 1,
                            name:1,
                            subCatSqlId: 1,
                            _id: 1  
                        };
                        if(req.params.isMobile == 'true'){
                            subMenuReturnField['icon'] = 1;
                        }
                        subMenuSortQuery[req.query.sortBy] = 1;
                        commonService.getDocuments(collectionName, subMenuFindQuery, subMenuSortQuery, false, subMenuReturnField).then(function(subMenuList) {
                            
                            if (subMenuList.response && subMenuList.response.length > 0) {
                               // resObj.response[resObj.response.indexOf(result)].submenu = subMenuList.response;
                                async.forEachLimit(subMenuList.response, 1, function(submenu, callback1) {
                                    var subToSubMenuFindQuery = {
                                        isActive: true,
                                        parentId: commonService.convertIntoObjectId(submenu._id)
                                    };
                                    var subToSubMenuSortQuery = {};
                                    var subToSubMenuReturnField = {
                                        Id: 1,
                                        isActive: 1,
                                        listType: 1,
                                        parentId: 1,
                                        position: 1,
                                        slug: 1,
                                        type: 1,
                                        name:1,
                                        subCatSqlId: 1,
                                        _id: 1  
                                    };
                                    if(req.params.isMobile == 'true'){
                                        subToSubMenuReturnField['icon'] = 1;
                                    }
                                    subToSubMenuSortQuery[req.query.sortBy] = 1;
                                    commonService.getDocuments(collectionName, subToSubMenuFindQuery, subToSubMenuSortQuery, false, subToSubMenuReturnField).then(function(subToSubMenuList) {
                                        if (subToSubMenuList.response && subToSubMenuList.response.length > 0) {
                                            subMenuList.response[subMenuList.response.indexOf(submenu)].submenu = subToSubMenuList.response;
                                        }
                                        callback1();
                                    }).catch(function(err) {
                                        callback1();
                                    });
                                },function(err) {
                                    if (err) console.error(err);
                                    resObj.response[resObj.response.indexOf(result)].submenu = subMenuList.response; 
                                    callback();
                                    /*var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Menu list found', resObj.response);
                                    res.json(apiSuccessResponse).end();*/
                                });
                            }else{
                                callback();
                            }
                            //callback();
                            
                        }).catch(function(err) {
                            callback();
                        });
                        // delete result._id;
                    } else {
                        // delete result._id;
                        callback();
                    }
                }, function(err) {
                    if (err) console.error(err);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Menu list found', resObj.response);
                    res.json(apiSuccessResponse);
                });
            } else {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Menu list found.", []);
                res.json(apiSuccessResponse);
            }
        })
        .catch(function(err) {
            console.error(err);
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse);
        });
}

module.exports = router;