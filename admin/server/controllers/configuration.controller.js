var express = require('express');
var router = express.Router();

var commonService = require('../services/shared/common.service');

var configService = require('../services/configuration.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');

router.put('/configuration/allow-all', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, allowAll);
router.get('/configuration/allow-ip', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAllowIpByID);
router.get('/configuration/allow-all/status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAllowAllStatus);
router.get('/configuration', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getConfig);
router.get('/subscriberList', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSubscriberList);
router.put('/configuration/allow-ip', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editAllowIp);
router.put('/configuration/:configId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editConfig);
router.get('/configuration/allow-ip/list', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAllowIpList);
router.delete('/configuration/allow-ip', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteAllowIp);
router.post('/configuration/allow-ip', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, saveAllowIp);
router.put('/configuration/allow-ip/change-status/:allowIpId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);

function getConfig(req, res) {
    var findQuery = {};
    commonService.getDocuments("Configuration", findQuery).then(function (resObj) {
        /* If cconfig not foun than insert basic config */
        if (resObj.response.length == 0) {
            var document = {};
            document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
            configService.insertConfigIfNotFound(document).then(function (resObj) {
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
                res.json(apiSuccessResponse).end();
            }).catch(function (err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
        } else {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getSubscriberList(req,res){
    var findQuery = {};
    commonService.getDocuments("Subscribe", findQuery).then(function (resObj) {
        /* If cconfig not foun than insert basic config */
        if (resObj.response.length == 0) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        } else {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse).end();
        }
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function editConfig(req, res) {
    var document = {
        configId: req.params.configId,
        config: req.body.config
    }
    var required = {
        configId: req.params.configId
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    // document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    configService.editConfig(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getAllowIpList(req, res) {
    var document = {};
    if (req.query.pageIndex !== undefined && req.query.pageIndex !== "" && req.query.pageIndex !== null) {
        document['pageIndex'] = req.query.pageIndex;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    // document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testing

    configService.getAllowIpList(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function deleteAllowIp(req, res) {
    var document = [];
    commonService.removeDocuments(appConfig.COLLECTION_NAME.allowIp, JSON.parse(req.query.allowIpId)).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Ip Removed Success.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function saveAllowIp(req, res) {
    var document = {};

    if (req.body.ip !== undefined && req.body.ip !== null && req.body.ip !== "") {
        document['ip'] = req.body.ip;
    }
    if (req.body.name !== undefined && req.body.name !== null && req.body.name !== "") {
        document['name'] = req.body.name;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    configService.saveAllowIp(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}

function getAllowIpByID(req, res) {
    var findQuery = {};
    if (req.query.allowIpId !== undefined && req.query.allowIpId !== "" && req.query.allowIpId !== null) {
        findQuery['_id'] = commonService.convertIntoObjectId(req.query.allowIpId);
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.allowIp, findQuery).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Get IP Info Success.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function editAllowIp(req, res) {
    var document = {};
    if (req.body._id !== undefined && req.body._id !== null && req.body._id !== "") {
        document['allowIpId'] = req.body._id;
    }
    if (req.body.ip !== undefined && req.body.ip !== null && req.body.ip !== "") {
        document['ip'] = req.body.ip;
    }
    if (req.body.name !== undefined && req.body.name !== null && req.body.name !== "") {
        document['name'] = req.body.name;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    configService.editAllowIp(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Ip updated Success", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}

function allowAll(req, res) {
    var document = {};
    if (req.body.isAllowAll !== undefined && req.body.isAllowAll !== null && req.body.isAllowAll !== "") {
        document['isAllowAll'] = req.body.isAllowAll;
    }
    configService.allowAll(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}
function getAllowAllStatus(req, res) {
    var findQuery = {};
    commonService.getDocuments(appConfig.COLLECTION_NAME.configuration, findQuery).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Get Allow All Status Success.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function changeStatus(req, res) {
    var document = {};
    if (req.params.allowIpId !== undefined && req.params.allowIpId !== null && req.params.allowIpId !== "") {
        document['allowIpId'] = req.params.allowIpId;
    }
    if (req.body.isActive !== undefined && req.body.isActive !== null && req.body.isActive !== "") {
        document['isActive'] = req.body.isActive;
    }
    configService.changeStatus(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}
module.exports = router;