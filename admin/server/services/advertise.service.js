var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var moment = require('moment');
var async = require('async');
var fs = require('fs');

var service = {
    addAdvertise: addAdvertise,
    editAdvertise: editAdvertise,
    getAdvertiseByID: getAdvertiseByID,
    getAdvertiseByPosition: getAdvertiseByPosition,
    getAdvertiseList: getAdvertiseList,
    removeAdvertise: removeAdvertise
};

module.exports = service;

function addAdvertise(advertiseObj) {
    var deferred = Q.defer();
    var insertObj = {
        title: advertiseObj.title,
        categories: advertiseObj.categories,
        magazines: advertiseObj.magazines,
        isArticle: advertiseObj.isArticle,
        city: advertiseObj.city,
        userAgent: advertiseObj.userAgent,
        subCategories: advertiseObj.subCategories,
        position: advertiseObj.position,
        fileType: advertiseObj.fileType,
        listIndex: advertiseObj.listIndex,
        startDate: new Date(moment(advertiseObj.startDate).startOf('day')),
        endDate: new Date(moment(advertiseObj.endDate).endOf('day')),
        isActive: advertiseObj.isActive,
        pageType: (advertiseObj.pageType) ? advertiseObj.pageType : '',
        createdBy: advertiseObj.loggedInUserId,
        createdAt: new Date(),
        lastModifiedBy: advertiseObj.loggedInUserId,
        lastModifiedAt: new Date(),
    }
    // There will be 2 advertise in Header
    if (advertiseObj.position == 'Header') {
        insertObj['image1'] = (advertiseObj.image1) ? advertiseObj.image1 : '';
        insertObj['image2'] = (advertiseObj.image2) ? advertiseObj.image2 : '';
    } else {
        insertObj['image'] = (advertiseObj.image1) ? advertiseObj.image1 : '';
    }

    if (advertiseObj.position == 'Header') {
        insertObj['adLink1'] = (advertiseObj.adLink1) ? advertiseObj.adLink1 : '';
        insertObj['adLink2'] = (advertiseObj.adLink2) ? advertiseObj.adLink2 : '';
        insertObj['description1'] = (advertiseObj.description1) ? advertiseObj.description1 : '';
        insertObj['description2'] = (advertiseObj.description2) ? advertiseObj.description2 : '';
    } else {
        insertObj['adLink'] = (advertiseObj.adLink1) ? advertiseObj.adLink1 : '';
        insertObj['description'] = (advertiseObj.description1) ? advertiseObj.description1 : '';
    }

    var db = mongoClient.getDb();
    db.collection(appConfig.COLLECTION_NAME.advertise).insertOne(insertObj, function(err, newAdvertise) {
        if (err) deferred.reject(err);
        if (newAdvertise) {
            deferred.resolve({ message: 'Advertise added successfully', response: newAdvertise });
        } else {
            deferred.resolve('Unable to add new Advertise.');
        }
    });
    return deferred.promise;
}

function editAdvertise(advertiseObj) {
    var deferred = Q.defer();
    var updatedObj = {
        title: advertiseObj.title,
        categories: advertiseObj.categories,
        magazines: advertiseObj.magazines,
        isArticle: advertiseObj.isArticle,
        city: advertiseObj.city,
        subCategories: advertiseObj.subCategories,
        position: advertiseObj.position,
        userAgent: advertiseObj.userAgent,
        fileType: advertiseObj.fileType,
        listIndex: advertiseObj.listIndex,
        startDate: new Date(moment(advertiseObj.startDate).startOf('day')),
        endDate: new Date(moment(advertiseObj.endDate).endOf('day')),
        lastModifiedBy: advertiseObj.loggedInUserId,
        lastModifiedAt: new Date(),
        isActive: advertiseObj.isActive,
        pageType: (advertiseObj.pageType) ? advertiseObj.pageType : '',
    }
    /* Update advertise image only if image uploaded */
    if (advertiseObj.position == 'Header') {
        if (advertiseObj.image1){
            if(advertiseObj.image1 == '')
                updatedObj['image1'] = '';
            else
                updatedObj['image1'] = advertiseObj.image1;
        }
        if (typeof advertiseObj.image2 != 'undefined'){
            if(advertiseObj.image2 == null)
                updatedObj['image2'] = '';
            else
                updatedObj['image2'] = advertiseObj.image2;
        }
    } else {
        if (advertiseObj.image1)
            updatedObj['image'] = advertiseObj.image1;
    }
    if (advertiseObj.position == 'Header') {
        updatedObj['adLink1'] = (advertiseObj.adLink1) ? advertiseObj.adLink1 : '';
        updatedObj['adLink2'] = (advertiseObj.adLink2) ? advertiseObj.adLink2 : '';
        updatedObj['description1'] = (advertiseObj.description1) ? advertiseObj.description1 : '';
        updatedObj['description2'] = (advertiseObj.description2) ? advertiseObj.description2 : '';
    } else {
        updatedObj['adLink'] = (advertiseObj.adLink1) ? advertiseObj.adLink1 : '';
        updatedObj['description'] = (advertiseObj.description1) ? advertiseObj.description1 : '';
    }

    if (typeof advertiseObj.advertiseId === 'string') {
        advertiseObj['advertiseId'] = commonService.convertIntoObjectId(advertiseObj.advertiseId);
    }
    var findQuery = {
        '_id': advertiseObj.advertiseId
    }
    var updateQuery = {
        '$set': updatedObj
    }
    var db = mongoClient.getDb();
    db.collection(appConfig.COLLECTION_NAME.advertise).findOne(findQuery, function(err, advertise) {
        if (err) deferred.reject(err);
        if (advertise) {
            /* Remove old advertise image before edit if new image added
                - image1 & image 2 : for Header advertise
                - image : For other type of advertise
            */
            if (advertiseObj.isImage1New) {
                let imagePath;
                if (advertiseObj.position == 'Header')
                    imagePath = appConfig.DIR_PATH + advertise.image1;
                else
                    imagePath = appConfig.DIR_PATH + advertise.image;

                fs.unlink(imagePath, function(err) {
                    if (err) console.log(err);
                });
            }
            if (advertiseObj.isImage2New) {
                let imagePath;
                imagePath = appConfig.DIR_PATH + advertise.image2;
                fs.unlink(imagePath, function(err) {
                    if (err) console.log(err);
                });
            }
            db.collection(appConfig.COLLECTION_NAME.advertise).findOneAndUpdate(findQuery, updateQuery, { safe: true }, function(err, doc) {
                if (err) deferred.reject(err);
                if (doc.lastErrorObject.updatedExisting && doc.lastErrorObject.n === 1 && doc.ok === 1) {
                    deferred.resolve({ message: 'Advertise Updated successfully', response: { _id: advertiseObj.advertiseId } });
                } else {
                    deferred.reject('Unable to Edit Advertise.');
                }
            });
        } else {
            deferred.reject('Unable to Edit Advertise.');
        }
    });
    return deferred.promise;
}

function getAdvertiseByID(advertiseObj) {
    var deferred = Q.defer();
    if (typeof advertiseObj.advertiseId === 'string') {
        advertiseObj['advertiseId'] = commonService.convertIntoObjectId(advertiseObj.advertiseId);
    }
    var findQuery = {
        _id: advertiseObj.advertiseId
    }
    var db = mongoClient.getDb();
    db.collection(appConfig.COLLECTION_NAME.advertise).find(findQuery).toArray(function(err, findDocument) {
        if (err) deferred.reject(err);
        if (findDocument) {
            deferred.resolve({ message: 'Get Advertise successfully', response: findDocument });
        } else {
            deferred.resolve('Unable to Ge Advertise Document.');
        }
    });
    return deferred.promise;
}

function getAdvertiseByPosition(advertiseObj){
    var deferred = Q.defer();
    var findQuery = {
        pageType: advertiseObj.pageType,
        position: { $in : [] },
        _id: { $ne: advertiseObj.skipId },
        $or: [ 
              { startDate : { $lte: new Date(moment(advertiseObj.startDate).startOf('day'))}, endDate : { $gte: new Date(moment(advertiseObj.startDate).startOf('day')) } },
              { startDate : { $lte: new Date(moment(advertiseObj.endDate).endOf('day')) }, endDate : { $gte: new Date(moment(advertiseObj.endDate).endOf('day')) } },
              { startDate : { $gte: new Date(moment(advertiseObj.startDate).startOf('day')) }, endDate : { $lte: new Date(moment(advertiseObj.endDate).endOf('day')) } }
            ]
    }
    if(advertiseObj.listIndex)  {
        findQuery['listIndex'] = advertiseObj.listIndex
    }
    if(advertiseObj.categories){
        findQuery['categories']= { $in : [] };
        if(typeof advertiseObj.categories == 'string'){
            var categoryList = [];
            categoryList.push(advertiseObj.categories);
            if (categoryList.length > 0) {
                for (var index in categoryList) {
                    findQuery.categories.$in.push(commonService.convertIntoObjectId(categoryList[index]));
                }
            }
        }else{
            var categoryList = advertiseObj.categories;
            for (var index in categoryList) {
                findQuery.categories.$in.push(commonService.convertIntoObjectId(categoryList[index]));
            }
        }   
    }
    if(advertiseObj.subCategories){
        findQuery['subCategories']= { $in : [] };
        if(typeof advertiseObj.subCategories == 'string'){
            var subCategoryList = [];
            subCategoryList.push(advertiseObj.subCategories);
            if (subCategoryList.length > 0) {
                for (var index in subCategoryList) {
                    findQuery.subCategories.$in.push(commonService.convertIntoObjectId(subCategoryList[index]));
                }
            }
        }else{
            var subCategoryList = advertiseObj.subCategories;
            for (var index in subCategoryList) {
                findQuery.subCategories.$in.push(commonService.convertIntoObjectId(subCategoryList[index]));
            }
        }   
    }
    if(advertiseObj.position){
        if(typeof advertiseObj.position == 'string'){
            var positionList = [];
            positionList.push(advertiseObj.position);
            if (positionList.length > 0) {
                for (var index in positionList) {
                    findQuery.position.$in.push(positionList[index]);
                }
            }
        }else{
            var positionList = advertiseObj.position;
            if (positionList.length > 0) {
                for (var index in positionList) {
                    findQuery.position.$in.push(positionList[index]);
                }
            }
        }
    }
    var db = mongoClient.getDb();
    db.collection(appConfig.COLLECTION_NAME.advertise).find(findQuery).toArray(function(err, findDocument) {
        if (err) deferred.reject(err);
        if (findDocument) {
            deferred.resolve({ message: 'Get Advertise successfully', response: findDocument });
        } else {
            deferred.resolve('Unable to Ge Advertise Document.');
        }
    });
    return deferred.promise;
}

function getAdvertiseList(advertiseObj) {
    var deferred = Q.defer();
    var findQuery = {};
    var categoryObjId;
    var magazineObjId;
    var cityObjId;
    var matchItem = {};
    if (typeof advertiseObj.categoryId === 'string') {
        categoryObjId = commonService.convertIntoObjectId(advertiseObj.categoryId);

        matchItem['categories'] = {
            $in: [commonService.convertIntoObjectId(advertiseObj.categoryId)]
        }

    } else {
        categoryObjId = advertiseObj.categoryId;
    }
    if (typeof advertiseObj.magazineId === 'string') {
        magazineObjId = commonService.convertIntoObjectId(advertiseObj.magazineId);

        matchItem['magazines'] = {
            $in: [commonService.convertIntoObjectId(advertiseObj.magazineId)]
        }

    } else {
        magazineObjId = advertiseObj.magazineId;
    }
    if (typeof advertiseObj.cityId === 'string') {
        cityObjId = commonService.convertIntoObjectId(advertiseObj.cityId);

        matchItem['city'] = {
            $in: [commonService.convertIntoObjectId(advertiseObj.cityId)]
        }

    } else {
        cityObjId = advertiseObj.cityId;
    }
    if(advertiseObj.pageType){
        matchItem['pageType'] = advertiseObj.pageType;
    }
    if(advertiseObj.userAgent){
        matchItem['userAgent'] = advertiseObj.userAgent;
    }
    if(advertiseObj.position){
        matchItem['position'] = advertiseObj.position;
    }
    if (advertiseObj.searchText) {
        //matchItem['title'] = advertiseObj.searchText;
        matchItem['title'] = { '$regex': commonService.escapeRegExp(advertiseObj.searchText), '$options': 'i' };
    }
    if(advertiseObj.advertiseType === 'Expired'){
        matchItem['endDate'] = { $lt: new Date() }
    }

    var sortedBy = {};
    findQuery = [
        {
            $lookup: {
                from: "Categories",
                localField: "categories",
                foreignField: "_id",
                as: "categoriesInfo"
            }

        },{
            $lookup: {
                from: "Magazines",
                localField: "magazines",
                foreignField: "_id",
                as: "magazinesInfo"
            }

        },{
            $lookup: {
                from: "Cities",
                localField: "city",
                foreignField: "_id",
                as: "cityInfo"
            }

        },{
            $match: matchItem
        },
        { $sort: { lastModifiedAt: -1 } }, 
        {
            $addFields: {
                isExpired: {
                    $cond: { if: { $lt: [ "$endDate", new Date() ] }, then: true, else: false }
                }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                categories: 1,
                position: 1,
                fileType: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                userAgent: 1,
                lastModifiedAt: 1,
                isActive: 1,
                pageType: 1,
                "categoriesInfo.name": 1,
                "magazinesInfo.name": 1,
                "cityInfo.name": 1,
                isExpired: 1
            }
        }
    ]
    commonService.getPageSize().then(function(pageSize) {
        var advertisePerPage = pageSize;
        if (advertiseObj.pageIndex && parseInt(advertiseObj.pageIndex) > 0) {
            skipArticles = (advertiseObj.pageIndex - 1) * advertisePerPage;
        } else {
            skipArticles = 0;
        }
        var db = mongoClient.getDb();
        db.collection(appConfig.COLLECTION_NAME.advertise).aggregate(findQuery).skip(skipArticles).limit(advertisePerPage).toArray(function(err, advertiseList) {
            db.collection(appConfig.COLLECTION_NAME.advertise).find(matchItem).count(function(err, totalCount) {
                if (err) deferred.reject(err);
                if (advertiseList) {
                    deferred.resolve({
                        message: 'Get Advertise List successfully',
                        response: {
                            totalCount: totalCount,
                            advertise: advertiseList,
                            advertisePerPage: advertisePerPage
                        }
                    });
                } else {
                    deferred.resolve('Unable to Get Advertise List.');
                }
            });
        });
    });
    return deferred.promise;
}

function removeAdvertise(advertiseIds) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    advertiseIds = advertiseIds.map(function(id) {
        return commonService.convertIntoObjectId(id);
    });
    async.forEachLimit(advertiseIds, 1, function(result, callback) {
        var findQuery = {
            _id: result
        }
        db.collection(appConfig.COLLECTION_NAME.advertise).find(findQuery).toArray(function(err, advertiseDoc) {
            if (err) deferred.reject(err);
            var imgIds;
            if (advertiseDoc.length > 0) {
                let imagePath;
                if (advertiseDoc[0].image && advertiseDoc[0].image !== '') {
                    imagePath = appConfig.DIR_PATH + advertiseDoc[0].image;
                    fs.unlink(imagePath, function() {
                        if (err) return deferred.reject('Unable to unlink image');
                    });
                }
                if (advertiseDoc[0].image1 && advertiseDoc[0].image1 !== '') {
                    imagePath = appConfig.DIR_PATH + advertiseDoc[0].image1;
                    fs.unlink(imagePath, function(err) {
                        if (err) return deferred.reject('Unable to unlink image');
                    });
                }
                if (advertiseDoc[0].image2 && advertiseDoc[0].image2 !== '') {
                    imagePath = appConfig.DIR_PATH + advertiseDoc[0].image2;
                    fs.unlink(imagePath, function(err) {
                        if (err) return deferred.reject('Unable to unlink image');
                    });
                }
                db.collection(appConfig.COLLECTION_NAME.advertise).remove(findQuery, function(err, removeDoc) {
                    if (err) deferred.reject(err);
                    callback();
                });
            } else {
                callback();
                return deferred.resolve({ 'message': 'Advertise not found.', 'response': [] });
            }
        });
    }, function(err) {
        if (err) console.error(err);
        return deferred.resolve({ 'message': 'Advertise deleted successfully.', 'response': { 'advertiseIds': advertiseIds } });
    });
    return deferred.promise;
}