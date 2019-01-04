var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var moment = require('moment');
var _ = require('lodash');

var service = {};
service.getConfig = getConfig;
service.getSlideShowList = getSlideShowList;
service.getSlideShowDetails = getSlideShowDetails;
service.getMetaTagList = getMetaTagList;
service.articleBySectionFlag = articleBySectionFlag;
service.articleByCityCategory = articleByCityCategory;
module.exports = service;

function getConfig(key) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var configValue;
	db.collection("Configuration").find({}).toArray(function (err, configObj) {
		if (err) deferred.reject(err);
		configObj[0].config.forEach(function (config) {
			if (key == "top-read-news") {
				if (config.key == "top-read-news-slide-limit")
					configValue = config.value;
			} else if (key == "recent-news") {
				if (config.key == "recent-news-slide-limit")
					configValue = config.value;
			} else if (key == "related-news") {
				if (config.key == "related-news-slide-limit")
					configValue = config.value;
			}else {
				configValue = 10;
			}
		})
		deferred.resolve(configValue);
	})
	return deferred.promise;
}

function getSlideShowList(slideShowObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findQueryObj = {
		isActive: true,
		publishScheduleTime: {
			$lte: new Date(moment())
		}
	};
	if (slideShowObj.publishDate) {
		var date = new Date(slideShowObj.publishDate);
		var oldDate = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0];
		var newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0];

		findQueryObj['lastModifiedAt'] = {
			$gte: new Date(oldDate),
			$lt: new Date(newDate)
		}
	}
	var sortQuery = { publishScheduleTime: -1 };
	var pageSize;
	if(slideShowObj.location == "home")
		pageSize = 7;
	else
		pageSize = appConfig.SLIDE_SHOW_PAGE_SIZE;
	var pageIndex;
	if (slideShowObj.pageIndex !== undefined && parseInt(slideShowObj.pageIndex) != 0) {
		pageIndex = (parseInt(slideShowObj.pageIndex) - 1) * pageSize;
	} else {
		pageIndex = 0;
	}
	var findQuery = [{
		$lookup:
		{
			from: appConfig.COLLECTION_NAME.galleryImage,
			localField: "slideShowImages",
			foreignField: "_id",
			as: "slideShowImages"
		}
	}, {
		$match: findQueryObj
	},
	{ $sort: sortQuery },
	{ $skip: pageIndex },
	{ $limit: pageSize },
	{
		$project: {
			slideShowName: 1,
			slideShowImages: 1,
			lastModifiedAt: 1,
			url:1,
			Id: 1,
			_id: 0,
			slideShowImages: {
				image: 1,
				publishDate: 1,
				publishDate: 1,
				title: 1,
				_id: 1
			}
		}
	}]

	db.collection(appConfig.COLLECTION_NAME.slideShow).aggregate(findQuery).toArray(function (err, slideShow) {
		if (err) deferred.reject(err);
		commonService.getCount(appConfig.COLLECTION_NAME.slideShow, findQueryObj).then(function (totalCount) {
			return deferred.resolve({
				response: {
					totalCount: totalCount,
					documentsPerPage: pageSize,
					documents: slideShow
				}
			});
		}).catch(function (err) {
			return deferred.resolve(err);
		})
	});
	return deferred.promise;
}

function getSlideShowDetails(slideShowObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findQueryObj = {
		Id: parseInt(slideShowObj.Id),
		url: slideShowObj.url
	};
	var findQuery = [{
		$lookup:
		{
			from: appConfig.COLLECTION_NAME.galleryImage,
			localField: "slideShowImages",
			foreignField: "_id",
			as: "slideShowImages"
		}
	}, {
		$match: findQueryObj
	},
	{
		$project: {
			slideShowName: 1,
			slideShowImages: 1,
			url:1,
			Id: 1,
			_id: 0,
			metaTitle: 1,
			metaKeywords: 1,
			metaTag: 1,
			metaDescriptions: 1,
			slideShowImages: {
				image: 1,
				publishDate: 1,
				description: 1,
				title: 1,
				_id: 1
			}
		}
	}];
	db.collection(appConfig.COLLECTION_NAME.slideShow).aggregate(findQuery).toArray(function (err, slideShow) {
		if (err) deferred.reject(err);
		return deferred.resolve(slideShow);
	});
	return deferred.promise;
}

/* Get articles with match metaTags and show article with match reqObj.articleId will show on top of the list page. 
 * matchFlag: Used to manage total article per page based on first match of selected article
 */
function getMetaTagList(reqObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var matchFlag = reqObj.matchFlag;
	var pageSize;
	if (reqObj.slideLimit) {
		pageSize = reqObj.slideLimit;
	} else {
		pageSize = appConfig.PAGE_SIZE;
	}
	var pageIndex;
	if (reqObj.pageIndex !== undefined && parseInt(reqObj.pageIndex) != 0) {
		pageIndex = (parseInt(reqObj.pageIndex) - 1) * pageSize;
		if (parseInt(reqObj.pageIndex) !== 1 && matchFlag !== false) {
			pageIndex = pageIndex - 1;
		}
	} else {
		pageIndex = 0;
	}
	var findQuery = {};
	if (reqObj.metaTag !== undefined && reqObj.metaTag.length > 0) {
		findQuery['metaTag'] = {
			$elemMatch: {
				$or: []
			}
		}
		var metaTag = reqObj.metaTag;
		for (var index in metaTag) {
			var obj = {};
			obj.name = metaTag[index];
			findQuery.metaTag.$elemMatch.$or.push(obj)
		}
	}
	if (reqObj.publishDate !== undefined) {
		findQuery['publishScheduleTime'] = {
			$gte: new Date(moment(reqObj.publishDate).startOf('day')),
			$lte: new Date(moment(reqObj.publishDate).endOf('day'))
		}
	}
	//console.log(reqObj)
	if(reqObj.excludeUrl) {
		findQuery['articleUrl'] = { $ne : reqObj.excludeUrl }
	}
	else {
		findQuery['publishScheduleTime'] = {
			$lte: new Date(moment())
		}
	}
    findQuery['isActive'] = true;
	
	var returnFields = {
		publishScheduleTime: 1,
		heading: 1,
		articleImage: 1,
		categories: 1,
		articleUrl: 1,
		magazine:1,
		_id:1
	}
	if(reqObj.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
	var sortQuery = {
		publishScheduleTime: -1
	}

	db.collection(appConfig.COLLECTION_NAME.articles).find(findQuery).count(function (err, totalCount) {
		if (err) deferred.reject(err);
		db.collection(appConfig.COLLECTION_NAME.articles).find(findQuery, returnFields).sort(sortQuery).skip(pageIndex).limit(pageSize).toArray(function (err, articles) {
			if (err) deferred.reject(err);
			var getDocQuery;
			if (reqObj.articleUrl) {
				getDocQuery = {
					articleUrl: reqObj.articleUrl
				}
			}
			db.collection(appConfig.COLLECTION_NAME.articles).find(getDocQuery, returnFields).toArray(function (err, findArticles) {
				if (err) deferred.reject(err);
				if (reqObj.metaTag && reqObj.metaTag.length > 0 && articles && articles.length > 0) {
					if (reqObj.articleUrl !== undefined && reqObj.publishDate === undefined && parseInt(reqObj.pageIndex) === 1 && findArticles !== undefined && findArticles.length > 0) {
						var findIndex = _.findIndex(articles, function (o) {
							return o.articleUrl.toString() == reqObj.articleUrl.toString();
						});
						if (findIndex > -1) {
							articles.splice(findIndex, 1);
							articles.unshift(findArticles[0]);
							matchFlag = true;
						}
						else {
							articles.unshift(findArticles[0]);
						}
					}
					return deferred.resolve({
						response: { totalCount: totalCount, documentsPerPage: pageSize, documents: articles, flag: matchFlag }
					});
				}
				else {
					if (reqObj.articleUrl !== undefined && reqObj.publishDate === undefined && parseInt(reqObj.pageIndex) === 1 && findArticles !== undefined && findArticles.length > 0) {
						return deferred.resolve({
							response: { totalCount: findArticles.length, documentsPerPage: pageSize, documents: findArticles, flag: matchFlag }
						});
					} else {
						return deferred.resolve({
							response: { totalCount: 0, documentsPerPage: pageSize, documents: [], flag: matchFlag }
						});
					}
				}
			});
		});
	});
	return deferred.promise;
}


function articleBySectionFlag(findQuery, document){
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	const returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        articleId: 1,
        category : { $arrayElemAt: ["$category", 0] }, 
        magazine : { $arrayElemAt: ["$magazine", 0] }, 
    };
    const finalRetunrFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        articleId: 1,
        categorySlug: "$category.slug", 
        magazineSlug: "$magazine.slug",
    }
    if(document.isMobile == 'true'){
        finalRetunrFields['content'] = 1;
        finalRetunrFields['subHeadingOne'] = 1;
        finalRetunrFields['subHeadingTwo'] = 1;
        finalRetunrFields['metaTag'] = 1;
        finalRetunrFields['createdAt'] = 1;
        finalRetunrFields['metaKeywords'] = 1;
        finalRetunrFields['metaKeywords'] = 1;
    }
    if(document.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    const projectParams = {
		_id: 1,
		sectionFlag:1,
		isActive:1,
		publishScheduleTime:1,
		articleImage:1, 
		heading:1,
		magazine:1,
		articleUrl:1,
		articleId:1,
		categories: 1
	}
	if(document.isMobile == 'true'){
        projectParams['content'] = 1;
        projectParams['subHeadingOne'] = 1;
        projectParams['subHeadingTwo'] = 1;
        projectParams['metaTag'] = 1;
        projectParams['createdAt'] = 1;
        projectParams['metaKeywords'] = 1;
        projectParams['metaKeywords'] = 1;
    }
	db.collection('Articles').aggregate([
		{ $project: projectParams },
	    { "$match": findQuery },
	    { $lookup: {
	            from: "Categories",
	            localField: "categories",
	            foreignField: "_id",
	            as: "category"
	        }
	    },
	    { $lookup: {
	            from: "Magazines",
	            localField: "magazine",
	            foreignField: "_id",
	            as: "magazine"
	        }
	    },
	    {
	        $sort: {
	            publishScheduleTime : -1
	        }
	    },
	    {
	    	$limit: document.slideLimit
	    },
	    {
	        $project: returnFields
	    },
	    {
	    	$project: finalRetunrFields
	    }
		]).toArray(function(err, articles) {
	    if(err) {
	        console.log(err);
	    }
	    deferred.resolve({ message: "Get document successfully.", response: articles });  
	}) 
    return deferred.promise;
}

function articleByCityCategory(findQuery, document){
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	const returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        "metaTag.name": 1,
        categories: 1,
        sectionFlag: 1,
        category : { $arrayElemAt: ["$category", 0] }, 
    };
    const finalRetunrFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        sectionFlag: 1,
        "metaTag.name": 1,
        categorySlug: "$category.slug", 
    }
    if(document.isMobile == 'true'){
        finalRetunrFields['content'] = 1;
        finalRetunrFields['subHeadingOne'] = 1;
        finalRetunrFields['subHeadingTwo'] = 1;
        finalRetunrFields['createdAt'] = 1;
        finalRetunrFields['metaKeywords'] = 1;
        finalRetunrFields['metaKeywords'] = 1;
    }
    if(document.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    const projectParams = {
		_id: 1,
		sectionFlag:1,
		isActive:1,
		city: 1,
		publishScheduleTime:1,
		articleImage:1, 
		heading:1,
		"metaTag.name": 1,
		magazine:1,
		articleUrl:1,
		articleId:1,
		categories: 1
	}
	if(document.isMobile == 'true'){
        projectParams['content'] = 1;
        projectParams['subHeadingOne'] = 1;
        projectParams['subHeadingTwo'] = 1;
        projectParams['createdAt'] = 1;
        projectParams['metaKeywords'] = 1;
        projectParams['metaKeywords'] = 1;
    }
	db.collection('Articles').aggregate([
		{ $project: projectParams },
	    { "$match": findQuery },
	    { $lookup: {
	            from: "Categories",
	            localField: "categories",
	            foreignField: "_id",
	            as: "category"
	        }
	    },
	    {
	        $sort: {
	            publishScheduleTime : -1
	        }
	    },
	    {
	    	$limit: document.storyLimit
	    },
	    {
	        $project: returnFields
	    },
	    {
	    	$project: finalRetunrFields
	    }
		]).toArray(function(err, articles) {
	    if(err) {
	        console.log(err);
	    }
	    deferred.resolve({ message: "Get document successfully.", response: articles });  
	}) 
    return deferred.promise;
}



