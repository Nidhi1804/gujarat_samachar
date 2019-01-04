var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var async = require('async');
var fs = require('fs');
var service = {};
service.addSlideShow = addSlideShow;
service.updateSlideShow = updateSlideShow;
service.getSlideShowByID = getSlideShowByID;
service.getSlideShowList = getSlideShowList;
service.deleteSlideShow = deleteSlideShow;
service.changeSlideShowStatus = changeSlideShowStatus;
service.addImagePhotoGallery = addImagePhotoGallery;
module.exports = service;

function addSlideShow(slideShowObj) {
    var deferred = Q.defer();
    var insertObj = {
        slideShowName: slideShowObj.slideShowName, //required field
        // categories: slideShowObj.categories, //required field
        metaTitle: slideShowObj.metaTitle ? slideShowObj.metaTitle : '',
        metaKeywords: (slideShowObj.metaKeywords) ? slideShowObj.metaKeywords : [],
        metaTag: (slideShowObj.metaTag) ? slideShowObj.metaTag : [],
        metaDescriptions: (slideShowObj.metaDescriptions) ? slideShowObj.metaDescriptions : '',
        // slideShowImages: slideShowObj.slideShowImages,
        createdBy: slideShowObj.loggedInUserId,
        createdAt: new Date(),
        lastModifiedBy: slideShowObj.loggedInUserId,
        lastModifiedAt: new Date(),
        isActive: true,
        publishSlideShow: slideShowObj.publishSlideShow,
        url: (slideShowObj.metaTitle) ? commonService.slugify(slideShowObj.metaTitle) : ""
    }


    if (typeof slideShowObj.metaKeywords == 'string') {
        insertObj.metaKeywords = JSON.parse(slideShowObj.metaKeywords);
    }

    if (typeof slideShowObj.metaTag == 'string') {
        insertObj.metaTag = JSON.parse(slideShowObj.metaTag);
    }
    if (insertObj.publishSlideShow == false) {
        insertObj.publishSlideShow = false;
        insertObj['publishScheduleTime'] = new Date(slideShowObj.publishScheduleTime);
    } else {
        insertObj.publishSlideShow = true;
        insertObj['publishScheduleTime'] = new Date();
    }
    var db = mongoClient.getDb();
    if (slideShowObj.slideShowImages !== undefined && slideShowObj.slideShowImages.length > 0) {
        db.collection(appConfig.COLLECTION_NAME.galleryImage).insertMany(slideShowObj.slideShowImages, function (err, newGallery) {
            if (newGallery.insertedIds !== undefined && newGallery.insertedIds.length > 0) {
                insertObj['slideShowImages'] = newGallery.insertedIds;
            }
            commonService.getNextSequence("slideShowId").then(function(slideShowId) {
                insertObj.Id = slideShowId;
                db.collection(appConfig.COLLECTION_NAME.slideShow).insertOne(insertObj, function (err, newSlideShow) {
                    if (err) {
                        console.log(err)
                        deferred.reject(err);
                    }
                    if (newSlideShow) {
                        deferred.resolve({ message: 'Slide Show added successfully', response: newSlideShow.insertedId });
                    }
                    else {
                        deferred.resolve('Unable to add new Slide Show.');
                    }
                });
            }).catch(function (err) {
                console.log(err);
                deferred.reject(err);
            });
        })
    } else {
        commonService.getNextSequence("slideShowId").then(function(slideShowId) {
            insertObj.Id = slideShowId;
            db.collection(appConfig.COLLECTION_NAME.slideShow).insertOne(insertObj, function (err, newSlideShow) {
                if (err) {
                        console.log(err)
                        deferred.reject(err);
                    }                
                if (newSlideShow) {
                    deferred.resolve({ message: 'Slide Show added successfully', response: newSlideShow.insertedId });
                }
                else {
                    deferred.resolve('Unable to add new Slide Show.');
                }
            });
        }).catch(function (err) {
            console.log(err);
            deferred.resolve(err);
        });
    }
    return deferred.promise;
}

function updateSlideShow(slideShowObj) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    var updatedslideShowObj = {
        categories: slideShowObj.categories,
        slideShowName: slideShowObj.slideShowName,
        metaTitle: slideShowObj.metaTitle,
        metaDescriptions: slideShowObj.metaDescriptions,
        metaKeywords: slideShowObj.metaKeywords,
        metaTag: slideShowObj.metaTag,
        lastModifiedBy: slideShowObj.loggedInUserId,
        lastModifiedAt: new Date(),
        publishSlideShow: slideShowObj.publishSlideShow,
        url: (slideShowObj.metaTitle) ? commonService.slugify(slideShowObj.metaTitle) : ""
    }
    /* Update slideShowImages only if image uploaded */
    // if (slideShowObj.slideShowImages !== undefined && slideShowObj.slideShowImages.length > 0) {
    //     updatedslideShowObj.slideShowImages = slideShowObj.slideShowImages;
    // }
    if (typeof slideShowObj.metaKeywords == 'string') {
        updatedslideShowObj.metaKeywords = JSON.parse(slideShowObj.metaKeywords);
    } else if (slideShowObj.metaKeywords == '' || slideShowObj.metaKeywords == null) {
        updatedslideShowObj.metaKeywords = []
    }

    if (typeof slideShowObj.metaTag == 'string') {
        updatedslideShowObj.metaTag = JSON.parse(slideShowObj.metaTag);
    } else if (slideShowObj.metaTag == '' && slideShowObj.metaTag == null) {
        updatedslideShowObj.metaTag = [];
    }
    if (updatedslideShowObj.publishSlideShow == false) {
        updatedslideShowObj.publishSlideShow = false;
        updatedslideShowObj['publishScheduleTime'] = new Date(slideShowObj.publishScheduleTime);
    } else {
        updatedslideShowObj.publishSlideShow = true;
        updatedslideShowObj['publishScheduleTime'] = new Date();
    }
    if (slideShowObj.slideShowImages.length > 0) {
        var galleryImg = [];
        async.forEachLimit(slideShowObj.slideShowImages, 1, function (result, callback) {
            if (result._id !== undefined) {
                var findQuery = {
                    _id: commonService.convertIntoObjectId(result._id)
                }
                delete result._id;
                delete result.publishDate;
                var updatedQuery = {
                    $set: result
                }
                db.collection(appConfig.COLLECTION_NAME.galleryImage).findOneAndUpdate(findQuery, updatedQuery, function (err, newGallery) {
                    if (err) deferred.reject(err);
                    galleryImg.push(newGallery.value._id)
                    callback();
                });
            } else {
                var updatedObj = result;
                db.collection(appConfig.COLLECTION_NAME.galleryImage).insertOne(updatedObj, function (err, newGallery) {
                    if (err) deferred.reject(err);
                    galleryImg.push(newGallery.insertedId)
                    callback();
                });
            }
        }, function (err) {
            if (err) console.error(err);
            updatedslideShowObj['slideShowImages'] = galleryImg;
            db.collection(appConfig.COLLECTION_NAME.slideShow).findOneAndUpdate({ '_id': slideShowObj.slideShowId }, { '$set': updatedslideShowObj }, { safe: true }, function (err, doc) {
                if (err) deferred.reject(err);
                if (doc.ok === 1) {
                    deferred.resolve({ message: "SlideShow updated successfully.", response: { _id: slideShowObj.slideShowId } });
                }
                else {
                    deferred.reject("slide Show not found.");
                }
            });
        });
    }
    return deferred.promise;
}

function getSlideShowByID(slideShowId) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var slideShowObjectId = commonService.convertIntoObjectId(slideShowId);
    var findQuery = [
        {
            $lookup:
            {
                from: appConfig.COLLECTION_NAME.galleryImage,
                localField: "slideShowImages",
                foreignField: "_id",
                as: "galleryInfo"
            }
        }, {
            $match: {
                _id: commonService.convertIntoObjectId(slideShowId)
            }
        }
    ];
    db.collection(appConfig.COLLECTION_NAME.slideShow).aggregate(findQuery).toArray(function (err, slideShow) {
        if (err) deferred.reject(err);
        if (slideShow) {
            if (slideShow.length > 0) {
                slideShow.map(function (slide) {
                    slide.slideShowImages = slide.galleryInfo;
                    delete slide.galleryInfo;
                    return slide;
                })
            }
            deferred.resolve({ message: 'slide Show Found', response: slideShow[0] });
        }
        else {
            deferred.reject("slide Show not found.");
        }
    });
    return deferred.promise;
}

function deleteSlideShow(slideShowIds) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    slideShowIds = slideShowIds.map(function (id) {
        return commonService.convertIntoObjectId(id);
    });
    async.forEachLimit(slideShowIds, 1, function (result, callback) {
        var findQuery = {
            _id: result
        }
        db.collection(appConfig.COLLECTION_NAME.slideShow).find(findQuery).toArray(function (err, slideShowDoc) {
            if (err) deferred.reject(err);
            var imgIds;
            if (slideShowDoc.length > 0) {
                if (slideShowDoc[0].slideShowImages !== undefined && slideShowDoc[0].slideShowImages.length > 0) {
                    imgIds = slideShowDoc[0].slideShowImages.map(function (img) {
                        return commonService.convertIntoObjectId(img)
                    })
                } else {
                    return deferred.resolve({ 'message': 'Slide show not found.', 'response': [] });
                }
                var removeQuery = { _id: { $in: imgIds } }
                db.collection(appConfig.COLLECTION_NAME.galleryImage).find(removeQuery).toArray(function (err, slideShowDoc) {
                    if (err) deferred.reject(err);
                    if (slideShowDoc !== undefined && slideShowDoc.length > 0) {
                        for (var index in slideShowDoc) {
                            var imgPath = appConfig.DIR_PATH + slideShowDoc[index].image;
                            fs.unlink(imgPath, function (err) {
                                if (err) {
                                    return deferred.reject({ 'message': 'Unable to unlink image', 'response': err });
                                }
                            });
                        }
                    }
                    db.collection(appConfig.COLLECTION_NAME.galleryImage).remove(removeQuery, function (err, removedslideShowes) {
                        if (err) deferred.reject(err);
                        db.collection(appConfig.COLLECTION_NAME.slideShow).remove(findQuery, function (err, removeDoc) {
                            if (err) deferred.reject(err);
                            callback();
                        });
                    });
                });
            } else {
                return deferred.resolve({ 'message': 'Slide show not found.', 'response': [] });
            }

        });
    }, function (err) {
        if (err) console.error(err);
        return deferred.resolve({ 'message': 'Slide showe deleted successfully.', 'response': { 'slideShowIds': slideShowIds } });
    });
    return deferred.promise;
}


function getSlideShowList(getSlideShowObj) {
    var deferred = Q.defer();
    var skipSlideShowes;
    commonService.getPageSize().then(function (pageSize) {
        var slideShowesPerPage = pageSize;
        var findQuery = {};
        if (getSlideShowObj.pageIndex && parseInt(getSlideShowObj.pageIndex) > 0) {
            skipSlideShowes = (getSlideShowObj.pageIndex - 1) * slideShowesPerPage;
        }
        else {
            skipSlideShowes = 0;
            slideShowesPerPage = 0;
        }
        if (getSlideShowObj.category) {
            findQuery['categories'] = getSlideShowObj.category;
        }
        if (getSlideShowObj.searchText && getSlideShowObj.searchText !== '') {
            findQuery['$or'] =
                [
                    { 'slideShowName': { '$regex': commonService.escapeRegExp(getSlideShowObj.searchText), '$options': 'i' } },
                ]
        }
        var db = mongoClient.getDb();
        db.collection("SlideShow").find(findQuery).count(function (err, totalSlideShowes) {
            db.collection("SlideShow").aggregate([
                {
                    "$match": findQuery
                },
                { $sort: { publishScheduleTime: -1 } },
                { $skip: skipSlideShowes },
                { $limit: slideShowesPerPage },
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
                        slideShowName: 1,
                        isActive: 1,
                        "categoryInfo._id": 1,
                        "categoryInfo.name": 1,
                    }
                }]).toArray(function (err, slideShowes) {
                    if (err) return deferred.reject(err);
                    if (slideShowes !== null && slideShowes.length > 0) {
                        deferred.resolve({
                            message: 'SlideShowes found.',
                            response: {
                                'totalSlideShowes': totalSlideShowes,
                                'slideShowesPerPage': slideShowesPerPage,
                                'slideShowes': slideShowes
                            }
                        });
                    } else {
                        deferred.resolve({
                            message: 'SlideShowes found.',
                            response: {
                                'totalSlideShowes': totalSlideShowes,
                                'slideShowesPerPage': slideShowesPerPage,
                                'slideShowes': []
                            }
                        });
                    }
                });
        });
    });
    return deferred.promise;
}

function changeSlideShowStatus(slideShowObj) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var findQuery = {
        _id: commonService.convertIntoObjectId(slideShowObj.slideShowId)
    }
    var slideShowStatus;
    if (slideShowObj.slideShowStatus == '1') {
        slideShowStatus = true;
    }
    else if (slideShowObj.slideShowStatus == '0') {
        slideShowStatus = false;
    }
    db.collection(appConfig.COLLECTION_NAME.slideShow).find(findQuery).toArray(function (err, slideShowDoc) {
        if (err) deferred.reject(err);
        var updateQuery = {};
        var updateObj = {};
        if (slideShowDoc.length > 0) {
            slideShowDoc = slideShowDoc.pop();
            var idsArr = [];
            if (slideShowDoc.slideShowImages !== undefined && slideShowDoc.slideShowImages.length > 0) {
                updateQuery = { _id: { $in: slideShowDoc.slideShowImages } };
                updateObj = { $set: { isActive: slideShowStatus } }
            }
        }
        db.collection(appConfig.COLLECTION_NAME.galleryImage).update(updateQuery, updateObj, { 'multi': true }, function (err, status) {
            if (err) deferred.reject(err);
            db.collection(appConfig.COLLECTION_NAME.slideShow).update(findQuery, { '$set': { 'isActive': slideShowStatus } }, { 'safe': true }, function (err, statusObject) {
                if (err) deferred.reject(err);
                if (statusObject.result.ok === 1 && statusObject.result.nModified === 1 && statusObject.result.n === 1) {
                    return deferred.resolve({ 'message': 'slide Show status changed successfully.', 'response': { 'slideShowId': findQuery._id } });
                }
                else {
                    return deferred.resolve({ 'message': 'slide Show not found.', 'response': [] });
                }
            });
        });
    });
    return deferred.promise;
}

function addImagePhotoGallery(slideShowObj) {
    var deferred = Q.defer();

    var collectionName = appConfig.COLLECTION_NAME.galleryImage;
    var db = mongoClient.getDb();
    var imgObjId;
    if (typeof slideShowObj.imageId == 'string') {
        imgObjId = commonService.convertIntoObjectId(slideShowObj.imageId);
    } else {
        imgObjId = slideShowObj.imageId;
    }
    var findQuery = {
        _id: imgObjId
    }
    var updateObj = {
        '$set': {
            'isGalleryImage': slideShowObj.isGalleryImage,
            'publishDate': new Date()
        }
    }
    db.collection(collectionName).findOneAndUpdate(findQuery, updateObj, { 'safe': true }, function (err, statusObject) {
        if (slideShowObj.isGalleryImage === true) {
            return deferred.resolve({ 'message': 'Image added to photo gallery successfully', 'response': { 'slideShowId': findQuery._id, isGalleryImage: slideShowObj.isGalleryImage } });
        } else {
            return deferred.resolve({ 'message': 'Image removed from photo gallery successfully', 'response': { 'slideShowId': findQuery._id, isGalleryImage: slideShowObj.isGalleryImage } });
        }

    });



    return deferred.promise;
}