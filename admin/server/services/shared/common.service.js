var mongodb = require('mongodb');
var Q = require('q');
var service = {};
var appConfig = require('../../appConfig');
var mongoClient = require('../../mongoClient');
const async         = require("async");
var fileManager = require('easy-file-manager');
var uuid = require('node-uuid');
var fs = require('fs');
const AWS = require('aws-sdk');
var easyimg = require("easyimage");
const s3 = new AWS.S3({
  accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY
});
const Sharp = require('sharp');

service.convertIntoObjectId = convertIntoObjectId;
service.changeStatus = changeStatus;
service.changeDocumentsStatus = changeDocumentsStatus;
service.uploadMultipleFiles = uploadMultipleFiles;
service.getDocuments = getDocuments;
service.updateOneDocument = updateOneDocument;
service.getNextSequence = getNextSequence;
service.getNextKey = getNextKey;
service.removeDocuments = removeDocuments;
service.escapeRegExp = escapeRegExp;
service.getPageSize = getPageSize;
service.removeAllDocuments = removeAllDocuments;
service.uploadSingleFiles = uploadSingleFiles;
service.sortDocuments = sortDocuments;
service.slugify = slugify;
service.IDGenerator = IDGenerator;
service.replaceContentImagePath = replaceContentImagePath;
module.exports = service;

function convertIntoObjectId(id) {
    var convertedIdIntoString = id.toString();
    if (convertedIdIntoString.length === 12 || convertedIdIntoString.length === 24) {
        var convertedObjId = mongodb.ObjectId(id);
        return convertedObjId;
    } else {
        return {
            "Error": "MongoDB ObjectId conversion error : Passed argument is must be a single String of 12 bytes or a String of 24 hex characters at new ObjectID"
        };
    }
}

/* Change document isActive status of requested collection  */
function changeStatus(reqParam, collectionName, statusOf) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var objectId = convertIntoObjectId(reqParam.id);
    var status;
    if (reqParam.status == '1') {
        status = true;
    } else if (reqParam.status == '0') {
        status = false;
    }
    db.collection(collectionName).update({
        _id: objectId
    }, {
        '$set': {
            'isActive': status
        }
    }, {
        'safe': true
    }, function (err, statusObject) {
        if (err) deferred.reject(err);
        if (statusObject.result.ok === 1 && statusObject.result.nModified === 1 && statusObject.result.n === 1) {
            return deferred.resolve({
                'message': statusOf + ' status changed successfully.',
                'response': {
                    'pageId': objectId
                }
            });
        } else {
            return deferred.resolve({
                'message': statusOf + ' not found.',
                'response': []
            });
        }
    });
    return deferred.promise;
}

async function uploadMultipleFiles(dataArr, imageArr, dirName) {
    try {
        const fileManagerArr = [];
        for (const data of dataArr) {
            let isBase64String = data.image.indexOf('data:image');
            if (dirName === undefined) {
                dirName = 'slide_show';
            }
            /*Found if data is : >= 0, Not found if data is : -1*/
            if (isBase64String >= 0) {
                let extension = data.image.split(';')[0].split('/')[1];
                let storePath = '/static/' + dirName;
                let imagePath = 'static/' + dirName;
                let resultThumb;
                let resultThumbnail;
                let base64Data = new Buffer(data.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                
                if(extension != 'svg+xml') {
                    const options = {
                        'quality': 30,
                        'chromaSubsampling': '4:4:4',
                        'progressive': true,
                        'force': true
                    };
                    extension = 'jpeg';
                    //base64Data = await Sharp(base64Data).jpeg(options).toBuffer();
                options.quality = 50;
                resultThumb = await Sharp(base64Data).resize(730, 470).jpeg(options).toBuffer();
                resultThumbnail = await Sharp(base64Data).resize(245, 145).jpeg(options).toBuffer();
                }

                let fileName = "photo_" + new Date().getTime() + '.' + extension;

                const obj = {
                    title: data.title,
                    description: data.description,
                    image: fileName,
                    _id: data._id,
                    publishDate: data.publishDate
                };
                imageArr.push(obj);

                const fileManagerObj = {
                    path: storePath, 
                    fileName: fileName,
                    image: resultThumb,
                    ext: extension
                }
                fileManagerArr.push(fileManagerObj);

                const fileManagerObjThumb = {
                    path: storePath + '/thumbnails', 
                    fileName: fileName,
                    image: resultThumbnail,
                    ext: extension
                }
                fileManagerArr.push(fileManagerObjThumb);
            } else {
                const obj = {};
                obj.title = data.title;
                obj.description = data.description;
                obj.image = data.image;
                obj._id = data._id;
                obj.isGalleryImage = data.isGalleryImage;
                imageArr.push(obj);
            }
        }
        if(fileManagerArr.length > 0) {
            const result = await Promise.all(fileManagerArr.map(val => uploadImageFileManager(val)));
        }
        return imageArr;
    } catch(err) {
        throw err;
    }
}

async function uploadSingleFiles(data, imageArr, dirName) {
    try {
        if (data.image) {
            /*Found if data is : >= 0, Not found if data is : -1*/
            if (data.image.indexOf('data:image') >= 0) {
                let extension = data.image.split(';')[0].split('/')[1];
                let storePath = '/static/' + dirName;
                let imagePath = 'static/' + dirName;
                let base64Data = new Buffer(data.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                // var base64Data = data.image.replace(/^data:image\/\w+;base64,/, "");

                const fileManagerArr = [];
                let base64DataThumbnail;

                let fileName;
                let resultThumb;
                let resultThumbnail;
                if(extension != 'svg+xml') {
                    const options = {
                        'quality': 30,
                        'chromaSubsampling': '4:4:4',
                        'progressive': true,
                        'force': true
                    };

                    extension = 'jpeg';

                    fileName = "photo_" + new Date().getTime() + '.' + extension;

                    if(dirName == 'articles/articles_thumbs') {
                        options.quality = 50;
                        resultThumb = await Sharp(base64Data).resize(370, 250).jpeg(options).toBuffer();
                        resultThumbnail = await Sharp(base64Data).resize(120, 70).jpeg(options).toBuffer();
                    } else if(dirName == 'slide_show') {
                        options.quality = 50;
                        resultThumb = await Sharp(base64Data).resize(730, 470).jpeg(options).toBuffer();
                        resultThumbnail = await Sharp(base64Data).resize(245, 145).jpeg(options).toBuffer();
                    } else {
                        resultThumb = await Sharp(base64Data).jpeg(options).toBuffer();
                    }
                } else {
                    fileName = "photo_" + new Date().getTime() + '.' + extension;
                    if(dirName == 'articles/articles_thumbs') {
                        resultThumb = await Sharp(base64Data).resize(370, 250).toBuffer();
                        resultThumbnail = await Sharp(base64Data).resize(120, 70).toBuffer();
                    } else if(dirName == 'slide_show') {
                        options.quality = 50;
                        resultThumb = await Sharp(base64Data).resize(730, 470).toBuffer();
                        resultThumbnail = await Sharp(base64Data).resize(245, 145).toBuffer();
                    } else {
                        resultThumb = await Sharp(base64Data).toBuffer();
                    }
                }

                const fileManagerObj = {
                    path: storePath, 
                    fileName: fileName,
                    image: resultThumb,
                }
                fileManagerArr.push(fileManagerObj);

                if(dirName == 'articles/articles_thumbs' || dirName == 'slide_show') {
                    const fileManagerObjThumb = {
                        path: storePath + '/thumbnails', 
                        fileName: fileName,
                        image: resultThumbnail,
                    }
                    fileManagerArr.push(fileManagerObjThumb);
                }
                
                const obj = {};
                if (dirName == 'articles/articles_thumbs') {
                    obj.image = storePath.split('/static/articles/articles_thumbs')[1] + fileName;
                } else {
                    obj.image = fileName;
                }
                imageArr.push(obj);

                const result = await Promise.all(fileManagerArr.map(val => uploadImageFileManager(val)));
            } else {
                const obj = {};
                obj.image = data.image;
                imageArr.push(obj);
            }
            return imageArr;
        }
    } catch(error) {
        throw error;
    }
}

async function uploadImageFileManager(params) {
    return new Promise((resolve, reject) => {
         fileManager.upload(params.path, params.fileName, params.image,function() {
            resolve(true)
         })
    })
}

async function uploadImageBucket(params) {
    return new Promise((resolve,reject) => {
        s3.upload(params, function(err, data) {
            resolve(data);
        });
    });
}

function getDocuments(collectionName, findQuery, sortQuery) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var sortQuery;
    if (!sortQuery)
        sortQuery = {
            _id: -1
        };
    db.collection(collectionName).find(findQuery).sort(sortQuery).toArray(function (err, documents) {
        if (err) deferred.reject(err);
        if (documents) {
            deferred.resolve({
                message: "Get document successfully.",
                response: documents
            });
        } else {
            deferred.reject('No record found.');
        }
    });
    return deferred.promise;
}

function updateOneDocument(collectionName, findQuery, updateQuery) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db = mongoClient.getDb();
    db.collection(collectionName).findOneAndUpdate(findQuery, {
        '$set': updateQuery
    }, {
        safe: true
    }, function (err, doc) {
        if (err) deferred.reject(err);
        if (doc.ok === 1) {
            deferred.resolve({
                message: "Document updated successfully.",
                response: findQuery
            });
        } else {
            deferred.reject("Document not found.");
        }
    });
    return deferred.promise;
}

/* Auto increment seq field on new record insert */
function getNextSequence(name) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection('Counters').findAndModify({
        _id: name
    }, {
        seq: 1
    }, {
        $inc: {
            seq: parseInt(1)
        }
    }, {
        new: true,
        upsert: true
    }, function (err, counterObj) {
        if (err) deferred.reject(err);
        deferred.resolve(parseInt(counterObj.value.seq));
    });
    return deferred.promise;
}

//Generate UUID
function getNextKey() {
    return uuid.v4();
}

//Delete Documents
function removeDocuments(collectionName, removeIds, path) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    if (removeIds !== undefined && removeIds.length > 0) {
        removeIds = removeIds.map(function (id) {
            return (convertIntoObjectId(id))
        })
    } else {
        removeIds = [];
    }
    var removeQuery = {
        _id: {
            $in: removeIds
        }
    }
    db.collection(collectionName).remove(removeQuery, function (err, removeDocuments) {
        if (err) deferred.reject(err);
        if (path !== undefined && path !== null && path !== "" && path.length > 0) {
            for (var index in path) {
                var imagePath = appConfig.DIR_PATH + path[index];
                fs.unlink(imagePath, function (error) {
                    if (error) {
                        deferred.reject({
                            message: "Unable to unlink image."
                        });
                    }
                });
            }
        }
        deferred.resolve({
            message: "Gallery Image Successfully removed.",
            response: removeIds
        });
    });
    return deferred.promise;
}

function changeDocumentsStatus(collectionName, reqObj) {
    var deferred = Q.defer();
    var findQuery = {
        _id: {
            $in: []
        }
    };
    var idList = JSON.parse(reqObj.idList)
    if (idList.length > 0) {
        for (var index in idList) {
            findQuery._id.$in.push(convertIntoObjectId(idList[index]));
        }
    }

    if (collectionName !== 'Cities') {
        var updatedObj = {
            isActive: reqObj.isActive,
            lastModifiedAt: new Date(),
            lastModifiedBy: reqObj.loggedInUserId
        }
    } else {
        var updatedObj = {
            isActive: reqObj.isActive
        }
    }

    var updateQuery = {
        '$set': updatedObj
    }
    var db = mongoClient.getDb();
    db.collection(collectionName).update(findQuery, updateQuery, {
        multi: true
    }, function (err, doc) {
        if (err) deferred.reject(err);
        deferred.resolve({
            message: 'Status Updated successfully',
            response: {
                _id: reqObj.idList
            }
        });
    });
    return deferred.promise;
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function getPageSize() {
    let pageSize = '';
    var findQuery = {};
    var deferred = Q.defer();
    if (!pageSize) {
        getDocuments("Configuration", findQuery).then(function (resObj) {
            var perPageObj = resObj.response[0].config.filter(function (config) {
                return config.key == 'records-per-page-limit';
            })
            pageSize = perPageObj[0].value;
            if (perPageObj.length > 0)
                deferred.resolve(pageSize);
            else
                deferred.resolve(1);
        }).catch(function (err) {
            deferred.reject(err);
        });
    } else {
        deferred.resolve(pageSize);
    }
    return deferred.promise;
}
//Delete Documents
function removeAllDocuments(collectionName) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection(collectionName).remove({}, function (err, removeAllDocuments) {
        if (err) deferred.reject(err);
        deferred.resolve({
            message: "Remove All Documents successfully.",
            response: removeAllDocuments
        });
    });
    return deferred.promise;
}

function sortDocuments(collectionName, docList) {
    var deferred = Q.defer();
    async.forEachLimit(docList, 1, function (document, callback) {
        db.collection(collectionName).update({
            _id: convertIntoObjectId(document._id)
        }, {
            '$set': {
                'position': parseInt(document.position)
            }
        }, {
            'safe': true
        }, function (err, updatedDoc) {
            if (err) deferred.reject(err);
            callback();
        });
    }, function (error) {
        if (error) throw error;
        deferred.resolve({
            message: "Documents sorted successfully.",
            response: docList
        });
    });
    return deferred.promise;
}

function IDGenerator() {
    this.length = 8;
    this.timestamp = +new Date;

    var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.generate = function () {
        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < this.length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }
        return id;
    }

    return this.generate();
}

function updateDocumentPositionManually(collectionName) {
    //var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection(collectionName).find({}).toArray(function (err, documents) {
        // async.forEachLimit(documents, 1, function (document, callback) {
        //  var cuerrentIndex = documents.indexOf(document) + 1;
        //      console.log("cuerrentIndex +++++ ", cuerrentIndex);
        //  db.collection(collectionName).update({ _id: convertIntoObjectId(document._id)}, { '$set': { 'Id': cuerrentIndex } }, { 'safe': true }, function (err, updatedDoc) {
        //      if (err) deferred.reject(err);
        //      callback();
        //  });
        // }, function (error) {
        //  if (error) throw error;
        //  console.log(collectionName, " Updated successfully.");
        // });
    });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

async function replaceContentImagePath(reqContent, savedFileName) {
    try {
        let contentString = reqContent.toString();
        if (contentString.length) {
            let findBase64InIndex = reqContent.indexOf('data:image');
            if (findBase64InIndex) {
                let imageTags = reqContent.split('data:image/');
                if (imageTags && imageTags.length) {
                    contentString = imageTags[0];
                    let imagesArr = [];
                    const s3ImageArr = [];
                    for(const [index,imgTag] of imageTags.entries()) {
                        if (imgTag && index > 0) {
                            let extension = imgTag.split(';base64,')[0];
                            let base64Data = imgTag.split(';base64,')[1].split('" data-filename=')[0];
                            var decodedImage = new Buffer.from(base64Data, 'base64');
                            let fileName = savedFileName + '_' + getNextKey();
                            let firstIndex = imgTag.indexOf(extension + ';base64,');
                            let lastIndex = imgTag.indexOf('data-filename="');
                            let filePath = appConfig.IMG_URL + savedFileName + '/' + fileName + '.' + extension;
                            
                            if(extension != 'svg+xml') {
                                const options = {
                                    'quality': 30,
                                    'chromaSubsampling': '4:4:4',
                                    'progressive': true,
                                    'force': true
                                };

                                saveFilePath = './static/' + savedFileName + '/' + fileName + '.jpeg';
                                filePath = appConfig.IMG_URL + savedFileName + '/' + fileName + '.jpeg';
                                
                                const sharpObj = await Sharp(decodedImage).jpeg(options).toBuffer();
                                base64Data = sharpObj;
                                decodedImage = sharpObj;
                            }

                            let obj = {
                                base64Data: base64Data,
                                filePath: saveFilePath
                            }
                            imagesArr.push(obj);
                            
                            contentString += imgTag.replace(imgTag.substring(parseInt(firstIndex), parseInt(lastIndex) - 2), filePath);
                        }
                    }
                    const result = await writeFile(imagesArr);
                    return contentString;
                }
            }
        } else {
            return '';
        }
    }catch(e) {
        console.log(e);
        throw e;
    }
}

/**
 * Write file on given path.
 * @param {*} imageArr
 */
function writeFile(imageArr) {
    let deffered = Q.defer();
    if (imageArr && imageArr.length) {
        let obj = imageArr.pop();
        fs.writeFile(obj.filePath, obj.base64Data, 'base64', (err) => {
            if (err) {
                deffered.reject(err);
            }
            return new Promise((resolve) =>
                setTimeout(() =>
                    resolve(writeFile(imageArr)), 2000
                )
            );
        });
    }
    deffered.resolve(true);
    return deffered.promise;
}
// setTimeout(function(){
//  updateDocumentPositionManually("SlideShow")
// }, 2000)