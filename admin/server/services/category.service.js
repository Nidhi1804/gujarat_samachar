var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
const async = require('async');
var service = {};
service.addCategory = addCategory;
service.getMainCategories = getMainCategories;
service.getMainCategoryByID = getMainCategoryByID;
service.updateCategory = updateCategory;
service.deleteCategory = deleteCategory;
service.changeCategoryStatus = changeCategoryStatus;
service.changeArticleStatus = changeArticleStatus;
service.getSubCategories = getSubCategories;
service.getCategoryBreadcrumb = getCategoryBreadcrumb;
service.getCategoryListInfo = getCategoryListInfo;
service.getSelectedCategory = getSelectedCategory;
service.getSubCategoriesByType = getSubCategoriesByType;
module.exports = service;

/* Add New Category */
function addCategory(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    if (reqParam.parentId == 0) {
        reqParam.parentId = parseInt(reqParam.parentId);
    } else {
        reqParam.parentId = commonService.convertIntoObjectId(reqParam.parentId);
    }

    reqParam.slug = commonService.slugify(reqParam.name);
    db.collection("Categories").findOne({ slug: reqParam.slug, parentId: reqParam.parentId, type: reqParam.type }, function (err, category) {
        if (err) deferred.reject(err);
        if (category) {
            deferred.reject("This category already exists!");
        } else {
            /* Create an Auto-Incrementing Sequence Field */
            commonService.getNextSequence("catPosition").then(function (sequenceCount) {
                reqParam.position = sequenceCount;
                commonService.getNextSequence("catId").then(function (catId) {
                    reqParam.Id = catId;
                    db.collection("Categories").insertOne(reqParam, function (err, newCategory) {
                        if (err) deferred.reject(err);
                        if (newCategory) {
                            deferred.resolve({ message: 'Category added successfully', response: { name: reqParam.name } });
                        } else {
                            deferred.resolve('Unable to add new category.');
                        }
                    });
                });
            });
        }
    })
    return deferred.promise;
}

/* Get Category list */
function getMainCategories(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var findQuery = {};
    if (reqParam.type && reqParam.type !== '' && reqParam.isActive == 'true')
        findQuery = { parentId: 0, isActive: true, type: reqParam.type };
    else
        findQuery = { parentId: 0 };

    if (reqParam.type)
        findQuery['type'] = reqParam.type;

    if (reqParam.searchText && reqParam.searchText !== '') {
        findQuery['name'] = { '$regex': commonService.escapeRegExp(reqParam.searchText), '$options': 'i' }
    }
    if (reqParam.categoryIds && reqParam.categoryIds !== '' && reqParam.categoryIds.length > 0) {
        findQuery = {
            _id: {
                $in: []
            }
        }
        for (var index in reqParam.categoryIds) {
            findQuery._id.$in.push(commonService.convertIntoObjectId(reqParam.categoryIds[index]))
        }
    }
    var sortQuery = {};
    if (reqParam.sort) {
        sortQuery[reqParam.sort] = 1;
    } else {
        sortQuery['name'] = 1;
    }
    db.collection("Categories").find(findQuery).sort(sortQuery).toArray(function (err, categories) {
        if (err) deferred.reject(err);
        if (categories) {
            var catList = [];
            var catIdList = [];
            categories.forEach(function (val) {
                var catObj = {
                    _id: val._id,
                    name: val.name,
                    slug: val.slug,
                    isActive: val.isActive,
                    type: val.type
                }
                catList.push(catObj)
                catIdList.push(val._id)
            })
            /* Below query will return document count having parentId in(catIdList) with $group */
            db.collection("Categories").aggregate([
                { $match: { parentId: { $in: catIdList } } },
                {
                    $group: {
                        "_id": "$parentId",
                        "count": { $sum: 1 }
                    }
                }
            ]).toArray(function (err, matchValue) {
                if (err) deferred.reject(err);
                if (matchValue && matchValue.length > 0) {
                    catList.forEach(function (category) {
                        matchValue.forEach(function (matchItem) {
                            if (category._id.toString() == matchItem._id.toString()) {
                                category.count = matchItem.count;
                            }
                        })
                    })
                }
                deferred.resolve({ message: 'Main categories found.', response: catList });
            });
        } else {
            deferred.resolve({ message: 'Category not Found.', response: [] });
        }
    })
    return deferred.promise;
}

/* Get category info by ID  */
function getMainCategoryByID(reqParam) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    db.collection("Categories").findOne({ _id: commonService.convertIntoObjectId(reqParam.categoryId) }, function (err, category) {
        if (err) deferred.reject(err);
        if (category) {
            var resObj = {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                parentId: category.parentId,
                type: category.type,
                listType: category.listType,
                icon: category.icon
            }
            return deferred.resolve({ 'message': 'Category found.', 'response': [resObj] });
        } else {
            return deferred.resolve({ 'message': 'Category not found.', 'response': [] });
        }
    });
    return deferred.promise;
}
/* Update Category Name */
function updateCategory(categoryId, reqParam) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    reqParam.slug = commonService.slugify(reqParam.name);
    if (reqParam.parentId == 0) {
        reqParam.parentId = parseInt(reqParam.parentId);
    } else {
        reqParam.parentId = commonService.convertIntoObjectId(reqParam.parentId);
    }
    db.collection("Categories").update({ '_id': commonService.convertIntoObjectId(categoryId) }, { '$set': reqParam }, { 'safe': true }, function (err, doc) {
        if (err) deferred.reject(err);
        if (doc.result.n > 0) {
            deferred.resolve({ 'message': 'Category updated successfully', 'response': { categoryId: categoryId } });
            //deferred.resolve({categoryId:categoryId});
        } else {
            deferred.reject("Category not found");
        }
    });
    return deferred.promise;
}
/* Delete Category by ID */
function deleteCategory(categoryId, reqParam) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    db.collection("Categories").remove({ '_id': commonService.convertIntoObjectId(categoryId) }, function (err, removedCategory) {
        if (err) deferred.reject(err);
        if (removedCategory.result.n > 0) {
            /* Remove related sub category */
            db.collection("Categories").remove({ 'parentId': commonService.convertIntoObjectId(categoryId) }, function (err, removedCategory) {
                if (err) deferred.reject(err);
                return deferred.resolve({ 'message': 'Category deleted successfully.', 'response': { 'categoryId': categoryId } });
            });
        } else {
            return deferred.resolve({ 'message': 'Category not found.', 'response': [] });
        }
    });
    return deferred.promise;
}

/* Change category status : Active / InActive */
function changeCategoryStatus(reqParam) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    var userObjectId = commonService.convertIntoObjectId(reqParam.categoryId);
    if (reqParam.status == '0') // 0- Inactive, 1 - Active
        var activeStatus = false;
    else
        var activeStatus = true;
    var updateQuery = { isActive: activeStatus }
    db.collection("Categories").update({ '_id': userObjectId }, { $set: updateQuery }, function (err, user) {
        if (err) deferred.reject(err);
        if (user.result.n > 0) {
            deferred.resolve({ status: reqParam.status });
        } else {
            deferred.reject("Category not found.");
        }
    });
    return deferred.promise;
}

/* Change Article status : Active / InActive */
function changeArticleStatus(reqParam) {
    var deferred = Q.defer();
    db = mongoClient.getDb();
    var userObjectId = commonService.convertIntoObjectId(reqParam.categoryId);
    if (reqParam.status == '0') // 0- Inactive, 1 - Active
        var activeStatus = false;
    else
        var activeStatus = true;
    var updateQuery = { isActive: activeStatus }
    db.collection("Articles").update({ 'categories': [userObjectId] }, { $set: updateQuery },{multi: true}, function (err, user) {
        if (err) deferred.reject(err);
        if (user.result.n > 0) {
            deferred.resolve({ status: reqParam.status });
        } else {
            deferred.resolve({status: reqParam.status});
        }
    });
    return deferred.promise;
}

function getSubCategories(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var parentId, findQuery;
    if (reqParam.parentCatId == '0')
        parentId = 0;
    else
        parentId = commonService.convertIntoObjectId(reqParam.parentCatId)

    if (reqParam.type && reqParam.type !== '' && reqParam.isActive == 'true')
        findQuery = { parentId: parentId, isActive: true, type: reqParam.type };
    else
        findQuery = { parentId: parentId };

    var sortQuery = {};
    if (reqParam.sort) {
        sortQuery[reqParam.sort] = 1;
    } else {
        sortQuery['_id'] = -1;
    }
    db.collection("Categories").find(findQuery).sort(sortQuery).toArray(function (err, subCategories) {
        if (err) deferred.reject(err);
        if (subCategories) {

            var subCatList = {};
            subCatList.list = [];
            var subCatIdList = [];
            subCategories.forEach(function (val) {
                var catObj = {
                    _id: val._id,
                    name: val.name,
                    slug: val.slug,
                    isActive: val.isActive,
                    type: val.type
                }
                subCatList.list.push(catObj);
                subCatIdList.push(val._id);
            })

            /* Below query will return document count having parentId in(catIdList) with $group */
            db.collection("Categories").aggregate([
                { $match: { parentId: { $in: subCatIdList } } },
                {
                    $group: {
                        "_id": "$parentId",
                        "count": { $sum: 1 }
                    }
                }
            ]).toArray(function (err, matchValue) {
                if (err) deferred.reject(err);
                if (matchValue && matchValue.length > 0) {
                    subCatList.list.forEach(function (category) {
                        matchValue.forEach(function (matchItem) {
                            if (category._id.toString() == matchItem._id.toString()) {
                                category.count = matchItem.count;
                            }
                        })
                    })
                }
                /* Get parentId name */
                if (reqParam.parentCatId != '0') {
                    db.collection("Categories").findOne({ _id: parentId }, function (err, category) {
                        if (err) deferred.reject(err);
                        if (category) {
                            subCatList.mainCategoryId = category._id;
                            subCatList.mainCategory = category.name;
                            deferred.resolve({ message: 'Sub categories found.', response: subCatList });
                        } else {
                            deferred.reject("Main category not found.");
                        }
                    })
                }
            });
        } else {
            deferred.reject("Sub category not found.");
        }
    })
    return deferred.promise;
}

function getCategoryBreadcrumb(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    var parentId;
    if (reqParam.parentCatId == '0') {
        parentId = 0;
    } else {
        parentId = commonService.convertIntoObjectId(reqParam.parentCatId)
    }
    var breadcrumb = [];
    getCategoryParent(parentId);

    function getCategoryParent(parentId) {
        function next(parentId) {
            db.collection("Categories").findOne({ _id: parentId }, function (err, categoryInfo) {
                if (err) deferred.reject(err);
                if (categoryInfo) {
                    breadcrumb.push({ name: categoryInfo.name, id: categoryInfo._id, parentId: categoryInfo.parentId });
                    if (categoryInfo.parentId == 0) {
                        return deferred.resolve({ message: 'Breadcrumb found.', response: breadcrumb })
                    } else {
                        next(categoryInfo.parentId);
                    }
                } else {
                    return deferred.reject('Category not found.')
                }
            });
        }
        next(parentId);
    }
    return deferred.promise;
}

function getCategoryListInfo(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    if (typeof reqParam.categoryIdList == 'string') {
        var categoryIdList = JSON.parse(reqParam.categoryIdList);
    }
    categoryIdList = categoryIdList.map(function (id) {
        return commonService.convertIntoObjectId(id)
    })
    var findQuery = { _id: { $in: categoryIdList } }
    db.collection("Categories").find(findQuery).toArray(function (err, categories) {
        if (err) deferred.reject(err);
        if (categories) {
            deferred.resolve({ message: 'Categories found ', response: categories });
        } else {
            deferred.reject("Category not found.");
        }
    })
    return deferred.promise;
}

function getSelectedCategory(reqParam) {
    var deferred = Q.defer();

    var db = mongoClient.getDb();
    var articleUnwindObj = {
        "path": "$articleInfo",
        "preserveNullAndEmptyArrays": false,

    }
    var matchObj = {
        "reporter": commonService.convertIntoObjectId(reqParam.userId)
    }
    var findQuery = [{
        $match: matchObj
    },
    {
        $project: {
            categories: 1
        }
    }

    ];
    db.collection(appConfig.COLLECTION_NAME.articles).aggregate(findQuery).toArray(function (err, docs) {
        if (err) deferred.reject(err);
        var mainObj = {};
        mainObj.mainCategoryArr = [];
        mainObj.subCategoryArr = [];
        if (docs !== undefined && docs.length > 0) {
            for (var index in docs) {
                if (docs[index].categories !== undefined && docs[index].categories.length > 0) {
                    for (var i in docs[index].categories) {
                        //Get Main Cateogry 
                        var findInx = _.indexOf(mainObj.mainCategoryArr, docs[index].categories[0].toString());
                        if (findInx === -1) {
                            mainObj.mainCategoryArr.push(docs[index].categories[0].toString());
                        }
                        //If Subcategory Id available
                        if (docs[index].categories.length > 1) {
                            var obj = {};
                            var arr = [];
                            //Get Main Category Id 
                            var str = docs[index].categories[0].toString()
                            if (mainObj.subCategoryArr.length > 0) {
                                for (var subIdx in mainObj.subCategoryArr) {
                                    var sIdx = mainObj.subCategoryArr[subIdx].mainCategoryId;
                                    if (sIdx === str) {
                                        var subCatIdx = _.findIndex(mainObj.subCategoryArr[subIdx].subCategoryId, function (o) {
                                            return o.toString() === docs[index].categories[1].toString();
                                        });
                                        if (subCatIdx === -1) {
                                            mainObj.subCategoryArr[subIdx].subCategoryId.push(docs[index].categories[1].toString());
                                        }
                                    } else {
                                        var obj = {};
                                        var mIdx = _.findIndex(mainObj.subCategoryArr, function (o) {
                                            return o.mainCategoryId.toString() === docs[index].categories[0].toString();
                                        });
                                        if (mIdx > -1) {
                                            var fidx = _.findIndex(mainObj.subCategoryArr[mIdx].subCategoryId, function (o) {
                                                return o.toString() === docs[index].categories[1].toString();
                                            });
                                            if (fidx === -1) {
                                                mainObj.subCategoryArr[mIdx].subCategoryId.push(docs[index].categories[1].toString())
                                            }
                                        } else {
                                            obj['mainCategoryId'] = docs[index].categories[0].toString();
                                            arr.push(docs[index].categories[1].toString())
                                            obj['subCategoryId'] = arr;
                                            mainObj.subCategoryArr.push(obj);
                                        }
                                        break;
                                    }
                                    break;
                                }
                            } else {
                                var fidx = _.indexOf(arr, docs[index].categories[1].toString());
                                if (fidx === -1) {
                                    arr.push(docs[index].categories[1].toString())
                                    obj['mainCategoryId'] = docs[index].categories[0].toString();
                                    obj['subCategoryId'] = arr;
                                    mainObj.subCategoryArr.push(obj);
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        if (docs !== undefined && docs.length > 0) {
            deferred.resolve({ message: 'Categories found. ', response: mainObj });
        } else {
            deferred.resolve({ message: 'Categories not found. ', response: [] });
        }
    })
    return deferred.promise;
}

async function getSubCategoriesByType(reqParam){
    const db = await mongoClient.getDb();
    const findQuery = {
        isActive: JSON.parse(reqParam.isActive),
        type: reqParam.type,
        parentId: {$ne: 0}
    };
    const sortQuery = {};
    if (reqParam.sort) {
        sortQuery[reqParam.sort] = 1;
    } else {
        sortQuery['name'] = 1;
    }

    const category = db.collection("Categories");
    const doc = await category.find(findQuery).sort(sortQuery).toArray();
    return doc;
}