var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs-extra');

var commonService = require('../services/shared/common.service');
var advertiseService = require('../services/advertise.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');
var moment = require('moment');
const async = require("async");

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY
});

var image = '';

var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './static/adv_upload';
        fs.ensureDir(dir, function (err) { //Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.
            if (err) console.log("Error while creating " + dir + " directory : ", err);
            cb(null, dir);
        })
    },
    filename: function (req, file, cb) {
        var n = file.originalname.lastIndexOf(".");
        fileExtension = file.originalname.substr(n);
        let uniqueId = Date.now() + parseInt(commonService.IDGenerator());
        imageName = 'adv' + '-' + uniqueId + fileExtension;
        cb(null, imageName);
    }
});

var upload = multer({ storage: imageStorage });

router.post('/adv', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, upload.fields([
        { name: 'image1', maxCount: 1 }, 
        { name: 'image2', maxCount: 1 }]), addAdvertise);
router.get('/adv', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAdvertiseList);
router.put('/adv/:advertiseId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, upload.fields([
        { name: 'image1', maxCount: 1 }, 
        { name: 'image2', maxCount: 1 }]), editAdvertise);
router.get('/adv/:advertiseId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAdvertiseByID);
router.get('/adv-by-position/:pageType', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getAdvertiseByPosition);
router.delete('/adv/:advertiseId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, removeAdvertise);
router.put('/adv/change-status/:idList', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeStatus);
async function addAdvertise(req, res) {
    var document = {
        title: req.body.title,
        categories: req.body.categories,
        magazines: req.body.magazines,
        city: req.body.city,
        subCategories: req.body.subCategories,
        position: req.body.position,
        fileType: req.body.fileType,
        userAgent: req.body.userAgent,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        adLink1: req.body.adLink1,
        adLink2: req.body.adLink2,
        description1: req.body.description1,
        description2: req.body.description2,
        isActive: req.body.isActive,
        pageType: req.body.pageType,
        listIndex: req.body.listIndex
    }
    var required = {
        title: req.body.title,
        position: req.body.position,
        fileType: req.body.fileType,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    if(document['position'] == 'List') {
        required['listIndex'] = req.body.listIndex;
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testingif (document['city'])    
    
    // There will be 2 advertise in Header
    if (req.files) {
        if(req.files.image1)
            document.image1 = 'adv_upload/' + req.files.image1[0].filename;
        if(req.files.image2)
            document.image2 = 'adv_upload/' + req.files.image2[0].filename;
    }
    if (document['categories'] !== "undefined" && typeof document['categories'] == 'string') {
        document['categories'] = JSON.parse(document['categories']);
    } else {
        document['categories'] = [];
    }
    if (document['categories'] ) {
        document['categories'] = document['categories'].map(function (cat) {
            return commonService.convertIntoObjectId(cat);
        });
    }

    if (document['magazines'] !== "undefined" && typeof document['magazines'] == 'string') {
        document['magazines'] = JSON.parse(document['magazines']);
    } else {
        document['magazines'] = [];
    }
    if (document['magazines'] ) {
        document['magazines'] = document['magazines'].map(function (cat) {
            return commonService.convertIntoObjectId(cat);
        });
    }

    if (document['city'] !== "undefined" && typeof document['city'] == 'string') {
        document['city'] = JSON.parse(document['city']);
    } else {
        document['city'] = [];
    }
    if (document['city'] ) {
        document['city'] = document['city'].map(function (cat) {
            return commonService.convertIntoObjectId(cat);
        });
    }
    if (document['subCategories'] !== "undefined" && typeof document['subCategories'] == 'string') {
        document['subCategories'] = JSON.parse(document['subCategories']);
    } else {
        document['subCategories'] = [];
    }
    if (document['subCategories']) {
        document['subCategories'] = document['subCategories'].map(function (subCat) {
            return commonService.convertIntoObjectId(subCat);
        });
    }
        if (document['isActive'] || document['isActive'] == 'true')
        document['isActive'] = true;
    else
        document['isActive'] = false;

    if (req.body.isArticle == 'true')
        document['isArticle'] = true;
    else
        document['isArticle'] = false;
    var imageArr = [];
    var imageObj1 = {};
    var imageObj2 = {};

    if(document.image1) {
        imageObj1.mainPath = './static/' + document.image1;
        imageObj1.path = 'static/' + document.image1;
        imageObj1.image = fs.readFileSync(imageObj1.mainPath);
        imageArr.push(imageObj1);
    }

    if(document.image2) {
        imageObj2.mainPath = './static/' + document.image2;
        imageObj2.path = 'static/' + document.image2;
        imageObj2.image = fs.readFileSync(imageObj2.mainPath);
        imageArr.push(imageObj2);
    }

    if(imageArr.length > 0) {
        try {
            let tmpArr = imageArr.map(val => {
                return{
                     Bucket: 'gsstatic',
                     Key: val.path,
                     Body: val.image,
                     ACL: 'public-read',
                     ContentEncoding: 'base64',
                     ContentType: 'image/*'
                    }
                });
            const data = await Promise.all(tmpArr.map(val => uploadImageBucket(val)));
            console.log(data);
            try {
                const response = await advertiseService.addAdvertise(document);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, response.message, response.response);
                res.json(apiSuccessResponse).end();
            } catch (err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            }
            
        } catch(err) {
            console.log("Error1: ", err);
        }
    } else {
        try {
            const response = await advertiseService.addAdvertise(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, response.message, response.response);
            res.json(apiSuccessResponse).end();

        } catch (err) {
            const apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        }
    }
    // advertiseService.addAdvertise(document).then(function (resObj) {
    //     var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
    //     res.json(apiSuccessResponse).end();
    // }).catch(function (err) {
    //     var apiFailureResponse = apiResponse.setFailureResponse(err);
    //     res.json(apiFailureResponse).end();
    // });
}

async function editAdvertise(req, res) {
    var document = {
        advertiseId: req.params.advertiseId,
        title: req.body.title,
        categories: req.body.categories,
        magazines: req.body.magazines,
        city: req.body.city,
        subCategories: req.body.subCategories,
        position: req.body.position,
        userAgent: req.body.userAgent,
        fileType: req.body.fileType,
        adLink1: req.body.adLink1,
        adLink2: req.body.adLink2,
        description1: req.body.description1,
        description2: req.body.description2,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isActive: req.body.isActive,
        pageType: req.body.pageType,
        listIndex: req.body.listIndex
    }
    var required = {
        advertiseId: req.params.advertiseId,
        title: req.body.title,
        position: req.body.position,
        fileType: req.body.fileType,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }
    if(document['position'] == 'List') {
        required['listIndex'] = req.body.listIndex;
    }
    /* Unlink Image before adding new */
    if(req.files.image1){
        document.image1 = 'adv_upload/' + req.files.image1[0].filename ; 
        document.isImage1New = true;
    }
    
    if(req.files.image2) {
        document.image2 = 'adv_upload/' + req.files.image2[0].filename ;
        document.isImage2New = true;
    }
    if(req.body.image2 == ''){
        document.image2 = null;
        document.isImage2New = true;
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testingif (document['city'])

    if (typeof document['advertiseId'] == 'string') {
        document['advertiseId'] = document['advertiseId'];
    }
    if (typeof document['categories'] == 'string') {
        document['categories'] = JSON.parse(document['categories']);
    }
    if (document['categories']) {
        document['categories'] = document['categories'].map(function (cat) {
            return commonService.convertIntoObjectId(cat);
        });
    }
    if (typeof document['magazines'] == 'string') {
        document['magazines'] = JSON.parse(document['magazines']);
    } else {
        document['magazines'] = [];
    }
    if (document['magazines'] ) {
        document['magazines'] = document['magazines'].map(function (cat) {
            return commonService.convertIntoObjectId(cat);
        });
    }

    if (typeof document['city'] == 'string') {
        document['city'] = JSON.parse(document['city']);
    } else {
        document['city'] = [];
    }
    if (document['city'] ) {
        document['city'] = document['city'].map(function (cat) {
            return commonService.convertIntoObjectId(cat)
        });
    }
    if (typeof document['subCategories'] == 'string') {
        document['subCategories'] = JSON.parse(document['subCategories']);
    }
    if (document['subCategories']) {
        document['subCategories'] = document['subCategories'].map(function (subCat) {
            return commonService.convertIntoObjectId(subCat);
        });
    }
    if (document['isActive'] == 'true')
        document['isActive'] = true;
    else
        document['isActive'] = false;

    if (req.body.isArticle == 'true')
        document['isArticle'] = true;
    else
        document['isArticle'] = false;

    var imageArr = [];
    var imageObj1 = {};
    var imageObj2 = {};

    if(document.image1 && document.isImage1New) {
        imageObj1.mainPath = './static/' + document.image1;
        imageObj1.path = 'static/' + document.image1;
        imageObj1.image = fs.readFileSync(imageObj1.mainPath);
        imageArr.push(imageObj1);
    }

    if(document.image2 && document.isImage2New) {
        imageObj2.mainPath = './static/' + document.image2;
        imageObj2.path = 'static/' + document.image2;
        imageObj2.image = fs.readFileSync(imageObj2.mainPath);
        imageArr.push(imageObj2);
    }

    if(imageArr.length > 0) {
        try {
            let tmpArr = imageArr.map(val => {
                return{
                     Bucket: 'gsstatic',
                     Key: val.path,
                     Body: val.image,
                     ACL: 'public-read',
                     ContentEncoding: 'base64',
                     ContentType: 'image/*'
                    }
                });
            const data = await Promise.all(tmpArr.map(val => uploadImageBucket(val)));
            console.log(data);
            try {
                const response = await advertiseService.editAdvertise(document);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, response.message, response.response);
                res.json(apiSuccessResponse).end();
            } catch (err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            }
            
        } catch(err) {
            console.log("Error1: ", err);
        }
    } else {
        try {
            const response = await advertiseService.editAdvertise(document);
            const apiSuccessResponse = apiResponse.setSuccessResponse(200, response.message, response.response);
            res.json(apiSuccessResponse).end();

        } catch (err) {
            const apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        }
    }
}

async function uploadImageBucket(params) {
    return new Promise((resolve,reject) => {
        s3.upload(params, function(err, data) {
            resolve(data);
        });
    });
}

function getAdvertiseByID(req, res) {
    var document = {
        advertiseId: req.params.advertiseId
    }
    var required = {
        advertiseId: req.params.advertiseId
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testingif (document['city'])

    if (typeof document['advertiseId'] == 'string') {
        document['advertiseId'] = commonService.convertIntoObjectId(document['advertiseId']);
    }

    advertiseService.getAdvertiseByID(document).then(function (resObj) {
        resObj.response.map(function(advertise) {
            advertise.startDate = new Date(moment(advertise.startDate).endOf('day'));
            advertise.endDate = new Date(moment(advertise.endDate));
            return advertise;
        });
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function removeAdvertise(req, res) {
    advertiseService.removeAdvertise(JSON.parse(req.params.advertiseId)).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Advertise Removed.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getAdvertiseList(req, res) {
    var document = {};    
    if (req.query.pageIndex !== undefined && req.query.pageIndex !== null && req.query.pageIndex !== "") {
        document['pageIndex'] = req.query.pageIndex
    }
    if (req.query.title !== undefined && req.query.title !== null && req.query.title !== "") {
        document['title'] = req.query.title
    }
    if (req.query.categoryId !== undefined && req.query.categoryId !== null && req.query.categoryId !== "") {
        document['categoryId'] = req.query.categoryId
    }
    if (req.query.searchText !== undefined && req.query.searchText !== null && req.query.searchText !== "") {
        document['searchText'] = req.query.searchText;
    }
    if (req.query.pageType !== undefined && req.query.pageType !== null && req.query.pageType !== "") {
        document['pageType'] = req.query.pageType;
    }
    if (req.query.magazineId !== undefined && req.query.magazineId !== null && req.query.magazineId !== "") {
        document['magazineId'] = req.query.magazineId;
    }
    if (req.query.cityId !== undefined && req.query.cityId !== null && req.query.cityId !== "") {
        document['cityId'] = req.query.cityId;
    }
    if (req.query.userAgent !== undefined && req.query.userAgent !== null && req.query.userAgent !== "") {
        document['userAgent'] = req.query.userAgent;
    }
    if (req.query.position !== undefined && req.query.position !== null && req.query.position !== "") {
        document['position'] = req.query.position;
    }
    if (req.query.advertiseType !== undefined && req.query.advertiseType !== null && req.query.advertiseType !== "") {
        document['advertiseType'] = req.query.advertiseType;
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    //document['loggedInUserId'] = commonService.convertIntoObjectId('593a64a4c1c94816656cb8fb'); //For POSTman testingif (document['city'])    
    advertiseService.getAdvertiseList(document).then(function (resObj) {
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
    commonService.changeDocumentsStatus(appConfig.COLLECTION_NAME.advertise, document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getAdvertiseByPosition(req, res){
    var document = {
        position: req.query.position,
        pageType: req.params.pageType,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    }
    if(req.query.categories){
        document['categories'] = req.query.categories;
    }
    if(req.query.subCategories){
        document['subCategories'] = req.query.subCategories;
    }
    if(req.query.skipId){
        document['skipId'] = commonService.convertIntoObjectId(req.query.skipId);
    }
    if(req.query.position == 'List' && req.query.listIndex) {
        document['listIndex'] = req.query.listIndex;   
    }
    var required = {
        position: req.query.position,
        pageType: req.params.pageType,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    }
    var validation = validateFn.validate(req, res, required);
    if (!validation.success) {
        return res.json(validation).end();
    }
    document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
    advertiseService.getAdvertiseByPosition(document).then(function (resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function (err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}
module.exports = router;
