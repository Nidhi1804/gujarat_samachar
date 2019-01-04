var mongodb = require('mongodb');
var Q = require('q');
var service = {};
var appConfig = require('../../appConfig');
var mongoClient = require('../../mongoClient');
var async = require('async');

service.convertIntoObjectId = convertIntoObjectId;
service.getDocuments = getDocuments;
service.getCount = getCount;
service.getCategorySlug = getCategorySlug;
service.getMagazineSlug = getMagazineSlug;
service.saveScribeEmail = saveScribeEmail;
module.exports = service;

function convertIntoObjectId(id) {
    var convertedIdIntoString = id.toString();
    if (convertedIdIntoString.length === 12 || convertedIdIntoString.length === 24) {
        var convertedObjId = mongodb.ObjectId(id);
        return convertedObjId;
    } else {
        return { "Error": "MongoDB ObjectId conversion error : Passed argument is must be a single String of 12 bytes or a String of 24 hex characters at new ObjectID" };
    }
}

function getDocuments(collectionName, findQuery, sortQuery, limit, returnFields, pageIndex) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    if (!sortQuery)
        var sortQuery = { _id: -1 }; // Descending order - latest created document first
    if (limit == undefined || limit == "" || limit == null)
        limit = 0; // Get all records
    if (!returnFields)
        returnFields = {}
    if (!pageIndex) {
        pageIndex = 0; // Get all records
    }
    if (collectionName) {
        db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).skip(parseInt(pageIndex)).limit(parseInt(limit)).toArray(function(err, documents) {
            if (err) deferred.reject(err);
            if (documents !== undefined && documents.length > 0) {
                deferred.resolve({ message: "Get document successfully.", response: documents });
            } else {
                deferred.resolve({ message: "Document Not Found", response: [] });
            }

        });
    } else {
        deferred.resolve();
    }

    return deferred.promise;
}

function getCount(collectionName, findQuery) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection(collectionName).find(findQuery).count(function(err, counts) {
        if (err) deferred.reject(err);
        deferred.resolve(counts);
    });
    return deferred.promise;
}

function getCategorySlug(responseArray, categories) {
    responseArray.forEach(function(response) {
        let catLength = response.categories.length;
        if (catLength && catLength > 0) {
            response.categorySlug = categories.filter((category) => {
                if(category.parentId != 0 && appConfig.CITY_SLUG.includes(category.slug) == false){
                    return category._id.toString() == response.categories[parseInt(catLength) - 1].toString();
                }
                else{
                    return category._id.toString() == response.categories[0].toString()
                }

            })[0].slug;
        }
    })
    return responseArray;
}

function getMagazineSlug(responseArray, magazines) {
    responseArray.forEach(function(response) {
        if(response.magazine && response.magazine !== '') {
            response.magazineSlug = magazines.filter((magazine) => {
                return magazine._id.toString() == response.magazine.toString()
            })[0].slug;
        }
    })
    //console.log('responseArray',responseArray);
    return responseArray;
}
function saveScribeEmail(reqParam){
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection("Subscribe").findOne({ emailId: reqParam.emailId}, function (err, email) {
        if (err) deferred.reject(err);
        if (email) {
            deferred.reject("You have Already Subscribe!");
        } else {
            db.collection("Subscribe").insertOne(reqParam, function (err, newEmail) {
                if (err) deferred.reject(err);
                if (newEmail) {
                    deferred.resolve({ message: 'You have Subscribe successfully!', response: { name: reqParam.name } });
                } else {
                    deferred.resolve('Unable to Subscribe.');
                }
            });
        }
    });
    return deferred.promise;
}