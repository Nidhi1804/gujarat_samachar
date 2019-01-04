var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var moment = require('moment');
var service = {};
service.getPhotoGalleryList = getPhotoGalleryList;
service.getVideoGallery = getVideoGallery;
service.getVideoGalleryDetails = getVideoGalleryDetails;
module.exports = service;

function getPhotoGalleryList(galleryObj) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var pageSize = appConfig.PAGE_SIZE;
    var pageIndex;
    if (galleryObj.pageIndex && parseInt(galleryObj.pageIndex) > 0) {
        pageIndex = (galleryObj.pageIndex - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    var findQueryObj = {
        isGalleryImage: true,
        isActive: true,
        publishDate: {
            $lte: new Date(moment())
        }

    }
    var groupObj = {
        "_id": {
            year: { $year: "$publishDate" },
            month: { $month: "$publishDate" },
            day: { $dayOfMonth: "$publishDate" }
        },
        "sortInfo": {
            $addToSet: {
                "normalizeName": {
                    "$toLower": "$publishDate"
                }
            }
        },
        "galleryInfo": {
            $addToSet: {
                "_id": "$_id",
                "title": "$title",
                "image": "$image",
                "isGalleryImage": "$isGalleryImage",
                "publishDate": "$publishDate"
            }
        }
    }
    var findQuery = [{
            $match: findQueryObj
        },
        {
            $group: groupObj
        },
        {
            $sort: {
                "sortInfo.normalizeName": -1
            }
        },
        {
            $skip: pageIndex
        },
        {
            $limit: pageSize
        }
    ];
    var findTotalQuery = [{
            $match: findQueryObj
        },
        {
            $group: groupObj
        },
        {
            $count: 'totalCount'
        }
    ]
    db.collection(appConfig.COLLECTION_NAME.galleryImage).aggregate(findTotalQuery).toArray(function(err, totalCount) {
        if (err) res.json((err));
        var total;
        if (totalCount !== undefined && totalCount > 0) {
            total = totalCount;
        } else {
            total = 0;
        }
        db.collection(appConfig.COLLECTION_NAME.galleryImage).aggregate(findQuery).toArray(function(err, slideShow) {
            if (err) res.json((err));
            var imgArr = [];
            if (slideShow) {
                var publishDate;
                if (slideShow.length > 0) {
                    for (var index in slideShow) {
                        if (slideShow[index].galleryInfo.length > 0) {
                            if (slideShow[index].galleryInfo[0].publishDate !== undefined) {
                                var obj = {};
                                publishDate = slideShow[index].galleryInfo[0].publishDate.toISOString().split('T')[0];
                                obj[publishDate] = slideShow[index].galleryInfo;
                                imgArr.push(obj);
                            }
                        }
                    }
                }
                deferred.resolve({
                    message: 'slide Show Found',
                    response: {
                        documentsPerPage: pageSize,
                        totalCount: total,
                        images: imgArr
                    }
                });
                return deferred.promise;
            } else {
                deferred.resolve([]);
            }
        });
    });
    return deferred.promise;
}

function getVideoGallery(galleryObj) {
    let deferred = Q.defer();
    let db = mongoClient.getDb();
    let pageSize;
    if(galleryObj.location == "home")
        pageSize = 7;
    else
        pageSize = appConfig.VIDEO_GALLERY_SIZE;
    let pageIndex;
    if (galleryObj.pageIndex && parseInt(galleryObj.pageIndex) > 0) {
        pageIndex = (galleryObj.pageIndex - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    let findQuery = {
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    }
    let returnFileds = {
        Id: 1,
        galleryName: 1,
        galleryVideos: 1,
        lastModifiedAt: 1,
        url: 1,
        _id: 0
    };

    let sortQuery = {
        publishScheduleTime: -1
    }
    db.collection(appConfig.COLLECTION_NAME.videoGallery).find(findQuery).count(function(err, totalCount) {
        if (err) deferred.reject(err);
        db.collection(appConfig.COLLECTION_NAME.videoGallery).find(findQuery, returnFileds).sort(sortQuery).skip(parseInt(pageIndex)).limit(parseInt(pageSize)).toArray(function(err, galleryDocs) {
            if (err) deferred.reject(err);
            if (galleryDocs !== undefined && galleryDocs.length > 0) {
                deferred.resolve({
                    message: 'Video Gallery Found',
                    response: {
                        documentsPerPage: pageSize,
                        totalCount: totalCount,
                        videos: galleryDocs
                    }
                });
            } else {
                deferred.resolve({
                    message: 'Video Gallery not found',
                    response: {
                        documentsPerPage: pageSize,
                        totalCount: 0,
                        videos: []
                    }
                });
            }
        });
    });
    return deferred.promise;
}

function getVideoGalleryDetails(galleryObj) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var findQuery = {};
    if (galleryObj.Id !== undefined && galleryObj.Id !== null && galleryObj.Id !== "") {
        findQuery['Id'] = parseInt(galleryObj.Id);
    }
    if (galleryObj.url !== undefined && galleryObj.url !== null && galleryObj.url !== "") {
        findQuery['url'] = galleryObj.url
    }
    var returnFileds = {
        Id: 1,
        galleryName: 1,
        galleryVideos: 1,
        lastModifiedAt: 1,
        metaDescriptions: 1,
        metaKeywords: 1,
        metaTag: 1,
        metaTitle: 1,
        url: 1
    };
    db.collection(appConfig.COLLECTION_NAME.videoGallery).find(findQuery, returnFileds).toArray(function(err, galleryDocs) {
        if (err) deferred.reject(err);
        if (galleryDocs !== undefined && galleryDocs.length > 0) {
            deferred.resolve({
                message: 'Video Gallery Found',
                response: {
                    videos: galleryDocs
                }
            });
        } else {
            deferred.resolve({
                message: 'Video Gallery not found',
                response: {
                    totalCount: 0,
                    videos: []
                }
            });
        }
    });

    return deferred.promise;
}