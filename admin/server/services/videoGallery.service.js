var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');

var service = {};
service.addVideoGallery = addVideoGallery;
service.updateVideoGallery = updateVideoGallery;
service.getGalleryByID = getGalleryByID;
service.getGalleryList = getGalleryList;
service.deleteGallery = deleteGallery;
service.changeGalleryStatus = changeGalleryStatus;
module.exports = service;

function addVideoGallery(videoGalleryObj) {
    var deferred = Q.defer();
    var insertObj = {
        galleryName: videoGalleryObj.galleryName, //required field
        categories: videoGalleryObj.categories, //required field
        metaTitle: (videoGalleryObj.metaTitle) ? videoGalleryObj.metaTitle : '',
        metaKeywords: (videoGalleryObj.metaKeywords) ? videoGalleryObj.metaKeywords : [],
        metaTag: (videoGalleryObj.metaTag) ? videoGalleryObj.metaTag : [],
        metaDescriptions: (videoGalleryObj.metaDescriptions) ? videoGalleryObj.metaDescriptions : '',
        galleryVideos: videoGalleryObj.galleryVideos, //required field
        createdBy: videoGalleryObj.loggedInUserId,
        createdAt: new Date(),
        lastModifiedBy: videoGalleryObj.loggedInUserId,
        lastModifiedAt: new Date(),
        isActive: true,
        publishVideoGallery: videoGalleryObj.publishVideoGallery,
        url: (videoGalleryObj.metaTitle) ? commonService.slugify(videoGalleryObj.metaTitle) : ""
    }


    if (typeof videoGalleryObj.metaKeywords == 'string') {
        insertObj.metaKeywords = JSON.parse(videoGalleryObj.metaKeywords);
    }

    if (typeof videoGalleryObj.metaTag == 'string') {
        insertObj.metaTag = JSON.parse(videoGalleryObj.metaTag);
    }
    if (insertObj.publishVideoGallery == false) {
        insertObj.publishVideoGallery = false;
        insertObj['publishScheduleTime'] = new Date(videoGalleryObj.publishScheduleTime);
    } else {
        insertObj.publishVideoGallery = true;
        insertObj['publishScheduleTime'] = new Date();
    }
    var db = mongoClient.getDb();
    /* Create an Auto-Incrementing Sequence Field */
    commonService.getNextSequence("videoGalleryId").then(function(videoGalleryId) {
        insertObj.Id = videoGalleryId;    
        db.collection("VideoGallery").insertOne(insertObj, function (err, newVideoGallery) {
            if (err) deferred.reject(err);
            if (newVideoGallery) {
                deferred.resolve({ message: 'Video Gallery added successfully', response: newVideoGallery.insertedId });
            }
            else {
                deferred.resolve('Unable to add new Video-Gallery.');
            }
        });
    })
    return deferred.promise;
}

function updateVideoGallery(videoGalleryObj) {
    var deferred = Q.defer();
    var updatedVideoGalleryObj = {
        categories: videoGalleryObj.categories,
        galleryName: videoGalleryObj.galleryName,
        metaTitle: videoGalleryObj.metaTitle,
        metaDescriptions: videoGalleryObj.metaDescriptions,
        metaKeywords: videoGalleryObj.metaKeywords,
        metaTag: videoGalleryObj.metaTag,
        galleryVideos: videoGalleryObj.galleryVideos,
        lastModifiedBy: videoGalleryObj.loggedInUserId,
        lastModifiedAt: new Date(),
        publishVideoGallery: videoGalleryObj.publishVideoGallery,
        url: (videoGalleryObj.metaTitle) ? commonService.slugify(videoGalleryObj.metaTitle) : ""
    }

    if (typeof videoGalleryObj.metaKeywords == 'string') {
        updatedVideoGalleryObj.metaKeywords = JSON.parse(videoGalleryObj.metaKeywords);
    } else if (videoGalleryObj.metaKeywords == '' || videoGalleryObj.metaKeywords == null) {
        updatedVideoGalleryObj.metaKeywords = []
    }

    if (typeof videoGalleryObj.metaTag == 'string') {
        updatedVideoGalleryObj.metaTag = JSON.parse(videoGalleryObj.metaTag);
    } else if (videoGalleryObj.metaTag == '' && videoGalleryObj.metaTag == null) {
        updatedVideoGalleryObj.metaTag = [];
    }
    if (updatedVideoGalleryObj.publishVideoGallery == false) {
        updatedVideoGalleryObj.publishVideoGallery = false;
        updatedVideoGalleryObj['publishScheduleTime'] = new Date(videoGalleryObj.publishScheduleTime);
    } else {
        updatedVideoGalleryObj.publishVideoGallery = true;
        updatedVideoGalleryObj['publishScheduleTime'] = new Date();
    }
    db = mongoClient.getDb();
    db.collection("VideoGallery").findOneAndUpdate({ '_id': videoGalleryObj.galleryId }, { '$set': updatedVideoGalleryObj }, { safe: true }, function (err, doc) {
        if (err) deferred.reject(err);
        if (doc.ok === 1) {
            deferred.resolve({ message: "Video Gallery updated successfully.", response: { _id: videoGalleryObj.galleryId } });
        }
        else {
            deferred.reject("Video Gallery not found.");
        }
    });
    return deferred.promise;
}

function getGalleryByID(galleryId) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var galleryObjectId = commonService.convertIntoObjectId(galleryId);
    db.collection("VideoGallery").findOne({ _id: galleryObjectId }, function (err, gallery) {
        if (err) deferred.reject(err);
        if (gallery) {
            deferred.resolve({ message: 'Video Gallery Found', response: gallery });
        }
        else {
            deferred.reject("Video Gallery not found.");
        }
    });
    return deferred.promise;
}


function deleteGallery(galleryIds) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    galleryIds = galleryIds.map(function (id) {
        return commonService.convertIntoObjectId(id);
    });
    db.collection("VideoGallery").remove({ _id: { $in: galleryIds } }, function (err, removedGallery) {
        if (err) deferred.reject(err);
        if (removedGallery.result.n > 1) {
            return deferred.resolve({ 'message': 'Video Galleries deleted successfully.', 'response': { 'galleryIds': galleryIds } });
        }
        else if (removedGallery.result.n == 1) {
            return deferred.resolve({ 'message': 'Video Gallery deleted successfully.', 'response': { 'galleryIds': galleryIds } });
        }
        else {
            return deferred.resolve({ 'message': 'Video Gallery not found.', 'response': [] });
        }
    });
    return deferred.promise;
}


function getGalleryList(getGalleryObj) {
    var deferred = Q.defer();
    var skipGalleries;
    commonService.getPageSize().then(function (pageSize) {
        var galleriesPerPage = pageSize;
        var findQuery = {};
        if (getGalleryObj.pageIndex && parseInt(getGalleryObj.pageIndex) > 0) {
            skipGalleries = (getGalleryObj.pageIndex - 1) * galleriesPerPage;
        }
        else {
            skipGalleries = 0;
            galleriesPerPage = 0;
        }
        if (getGalleryObj.category) {
            findQuery['categories'] = getGalleryObj.category;
        }
        if (getGalleryObj.searchText && getGalleryObj.searchText !== '') {
            findQuery['$or'] =
                [
                    { 'galleryName': { '$regex': commonService.escapeRegExp(getGalleryObj.searchText), '$options': 'mi' } },
                ]
        }
        var db = mongoClient.getDb();

        db.collection("VideoGallery").find(findQuery).count(function (err, totalGalleries) {
            db.collection("VideoGallery").aggregate([
                {
                    "$match": findQuery
                },
                { $sort: { publishScheduleTime: -1 } },
                { $skip: skipGalleries },
                { $limit: galleriesPerPage },
                {
                    $lookup:
                    {
                        from: "Categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categoryInfo"
                    }
                },
                {
                    $project: {
                        galleryName: 1,
                        isActive: 1,
                        "categoryInfo._id": 1,
                        "categoryInfo.name": 1,
                    }
                }]).toArray(function (err, galleries) {
                    if (err) return deferred.reject(err);
                    if (galleries !== null && galleries.length > 0) {
                        deferred.resolve({
                            message: 'Galleries found.',
                            response: {
                                'totalGalleries': totalGalleries,
                                'galleriesPerPage': galleriesPerPage,
                                'galleries': galleries
                            }
                        });
                    } else {
                        deferred.resolve({
                            message: 'Galleries found.',
                            response: {
                                'totalGalleries': totalGalleries,
                                'galleriesPerPage': galleriesPerPage,
                                'galleries': []
                            }
                        });
                    }
                });
        });
    });
    return deferred.promise;
}

function changeGalleryStatus(galleryObj) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var galleryObjectId = commonService.convertIntoObjectId(galleryObj.galleryId);
    var galleryStatus;
    if (galleryObj.galleryStatus == '1') {
        galleryStatus = true;
    }
    else if (galleryObj.galleryStatus == '0') {
        galleryStatus = false;
    }
    db.collection("VideoGallery").update({ _id: galleryObjectId }, { '$set': { 'isActive': galleryStatus } }, { 'safe': true }, function (err, statusObject) {
        if (err) deferred.reject(err);
        if (statusObject.result.ok === 1 && statusObject.result.nModified === 1 && statusObject.result.n === 1) {
            return deferred.resolve({ 'message': 'Video Gallery status changed successfully.', 'response': { 'galleryId': galleryObjectId } });
        }
        else {
            return deferred.resolve({ 'message': 'Video Gallery not found.', 'response': [] });
        }
    });
    return deferred.promise;
}
