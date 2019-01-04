var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var async = require('async');
var moment = require('moment');
const { google } = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const key = require ('../googleAnalyticsKey.json');
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
const view_id = '69359553';

var service = {};
service.addArticle = addArticle;
service.getArticlesList = getArticlesList;
service.getArticleById = getArticleById;
service.deleteArticle = deleteArticle;
service.changeArticlesStatus = changeArticlesStatus;
service.updateArticle = updateArticle;
service.addMetaTags = addMetaTags;
service.getMetaTags = getMetaTags;
service.getBreakingNews = getBreakingNews;
service.getBreakingNewsList = getBreakingNewsList;
service.getArticleReportList = getArticleReportList;
service.getArticlesByReporterId = getArticlesByReporterId;
module.exports = service;

function addArticle(articleObj) {
	var deferred = Q.defer();
	var insertObj = {
		articleImage: (articleObj.articleImage && articleObj.articleImage.image) ? articleObj.articleImage.image : '',
		heading: articleObj.heading, //required field
		subHeadingOne: (articleObj.subHeadingOne) ? articleObj.subHeadingOne : '',
		subHeadingTwo: (articleObj.subHeadingTwo) ? articleObj.subHeadingTwo : '',
		description: (articleObj.description) ? articleObj.description : '',
		categories: articleObj.categories, //required field
		content: articleObj.content, //required field
		metaTitle: articleObj.metaTitle, //required field
		metaKeywords: articleObj.metaKeywords, //required field
		metaTag: (articleObj.metaTag) ? articleObj.metaTag : [],
		metaDescriptions: articleObj.metaDescriptions, //required field
		source: articleObj.source, //required field
		section: (articleObj.section) ? articleObj.section : '',
		reporter: articleObj.reporter,
		publishArticle: articleObj.publishArticle, //required field
		sectionFlag: (articleObj.sectionFlag) ? articleObj.sectionFlag : '',
		magazine: (articleObj.magazine) ? articleObj.magazine : '',
		city: (articleObj.city) ? articleObj.city : '',
		createdBy: articleObj.loggedInUserId,
		createdAt: new Date(),
		lastModifiedBy: articleObj.loggedInUserId,
		lastModifiedAt: new Date(),
		isActive: true,
		posterImage: articleObj.posterImage,
		articleUrl: (articleObj.metaTitle) ? commonService.slugify(articleObj.metaTitle) : ""
	}
	if (insertObj.publishArticle == 'false' || !insertObj.publishArticle) {
		insertObj.publishArticle = false; // Save publishArticle as boolen.(publishArticle in requesParam may be string or boolen value)
		insertObj['publishScheduleTime'] = new Date(articleObj.publishScheduleTime);
	} else if (insertObj.publishArticle == 'true' || insertObj.publishArticle) {
		insertObj.publishArticle = true;
		insertObj['publishScheduleTime'] = new Date();
	}

	if (typeof articleObj.metaKeywords == 'string') {
		insertObj.metaKeywords = JSON.parse(articleObj.metaKeywords);
	}

	if (typeof articleObj.metaTag == 'string') {
		insertObj.metaTag = JSON.parse(articleObj.metaTag);
	}

	var db = mongoClient.getDb();
	db.collection("Articles").count({ metaTitle: insertObj.metaTitle }, function (err, result) {
		if (err) deferred.reject(err);
		if (result > 0) {
			result++;
			insertObj.articleUrl = insertObj.articleUrl + '-' + result;
		}
		db.collection("Articles").insertOne(insertObj, function (err, newArticle) {
			if (err) deferred.reject(err);
			if (newArticle) {
				deferred.resolve({ message: 'Article added successfully', response: newArticle });
			}
			else {
				deferred.resolve({ message: 'Unable to add Article' });
			}
		});
	});
	return deferred.promise;
}

function getArticlesList(getArticlesObj) {
	var deferred = Q.defer();
	var skipArticles;
	var findQuery = {};
	commonService.getPageSize().then(function (pageSize) {
		let articlesPerPage = pageSize;
		if (getArticlesObj.pageIndex && parseInt(getArticlesObj.pageIndex) > 0) {
			skipArticles = (getArticlesObj.pageIndex - 1) * articlesPerPage;
		}
		else {
			skipArticles = 0;
		}
		if (getArticlesObj.selectedSection) {
			findQuery['section'] = { $ne:getArticlesObj.selectedSection};
		}
		if (getArticlesObj.section) {
			findQuery['section'] = getArticlesObj.section;
		}
		if (getArticlesObj.city) {
			findQuery['city'] = getArticlesObj.city;
		}
		if (getArticlesObj.magazine) {
			findQuery['magazine'] = getArticlesObj.magazine;
		}
		if (getArticlesObj.sectionFlag) {
			findQuery['sectionFlag'] = getArticlesObj.sectionFlag;
		}
		if (getArticlesObj.reporter) {
			findQuery['reporter'] = getArticlesObj.reporter;
		}
		if (getArticlesObj.category) {
			findQuery['categories'] = getArticlesObj.category;
		}
		if (getArticlesObj.subCategory) {
			findQuery['categories'] = { $all: getArticlesObj.subCategory };
		}
		if (getArticlesObj.searchText && getArticlesObj.searchText !== '') {
			findQuery['$or'] =
				[
					{ 'heading': { '$regex': commonService.escapeRegExp(getArticlesObj.searchText), '$options': 'i' } },
					{ 'description': { '$regex': commonService.escapeRegExp(getArticlesObj.searchText), '$options': 'i' } },
					{ 'articleUrl': { '$regex': commonService.escapeRegExp(getArticlesObj.searchText), '$options': 'i' } }
				]
		}
		var db = mongoClient.getDb();
		db.collection("Articles").find(findQuery).count(function (err, totalArticles) {
			db.collection("Articles").aggregate([
				{
					"$match": findQuery
				},
				{ $sort: { lastModifiedAt: -1 } },
				{ $skip: skipArticles },
				{ $limit: articlesPerPage },
				{
					$lookup:
						{
							from: "Users",
							localField: "reporter",
							foreignField: "_id",
							as: "userInfo"
						}
				},
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
					$lookup:
						{
							from: "Magazines",
							localField: "magazine",
							foreignField: "_id",
							as: "magazineInfo"
						}
				},
				{
					$project: {
						articleImage: 1,
						heading: 1,
						isActive: 1,
						publishScheduleTime: 1,
						createdAt: 1,
						lastModifiedAt: 1,
						articleUrl: 1,
						articleId: 1,
						magazine: 1,
						"userInfo._id": 1,
						"userInfo.firstName": 1,
						"userInfo.lastName": 1,
						"categoryInfo.name": 1,
						"categoryInfo.slug": 1,
						"magazineInfo.slug": 1
					}
				}]).toArray(function (err, articles) {
					if (err) return deferred.reject(err);
					if (articles !== null && articles.length > 0) {

						deferred.resolve({
							message: 'Articles found.',
							response: {
								'totalArticles': totalArticles,
								'articlesPerPage': articlesPerPage,
								'articles': articles
							}
						});
					} else {
						deferred.resolve({
							message: 'Articles found.',
							response: {
								'totalArticles': totalArticles,
								'articlesPerPage': articlesPerPage,
								'articles': []
							}
						});
					}
				});
		});
	});
	return deferred.promise;
}

function getArticleById(articleId) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findQuery = {
		_id: commonService.convertIntoObjectId(articleId)
	}
	db.collection(appConfig.COLLECTION_NAME.articles).find(findQuery).toArray(function (err, article) {
		if (err) deferred.reject(err);
		if (article.length > 0) {
			deferred.resolve({ message: 'Article Found', response: article[0] });
		}
		else {
			deferred.reject({ message: 'Article not Found', response: [] });
		}
	});
	return deferred.promise;
}

function deleteArticle(articleId) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var articleObjectId = commonService.convertIntoObjectId(articleId);
	db.collection("Articles").remove({ _id: articleObjectId }, function (err, removedArticle) {
		if (err) deferred.reject(err);
		if (removedArticle.result.n > 0) {
			return deferred.resolve({ 'message': 'Article deleted successfully.', 'response': { 'articleId': articleId } });
		}
		else {
			return deferred.resolve({ 'message': 'Article not found.', 'response': [] });
		}
	});
	return deferred.promise;
}

function changeArticlesStatus(articleObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var articleObjectId = commonService.convertIntoObjectId(articleObj.articleId);
	var articleStatus;
	if (articleObj.articleStatus == '1') {
		articleStatus = true;
	}
	else if (articleObj.articleStatus == '0') {
		articleStatus = false;
	}
	db.collection("Articles").update({ _id: articleObjectId }, { '$set': { 'isActive': articleStatus } }, { 'safe': true }, function (err, statusObject) {
		if (err) deferred.reject(err);
		if (statusObject.result.ok === 1 && statusObject.result.nModified === 1 && statusObject.result.n === 1) {
			return deferred.resolve({ 'message': 'Article status changed successfully.', 'response': { 'articleId': articleObjectId } });
		}
		else {
			return deferred.resolve({ 'message': 'Article not found.', 'response': [] });
		}
	});
	return deferred.promise;
}

function updateArticle(articleObj) {
	var deferred = Q.defer();
	var updatedArticleObj = {
		heading: articleObj.heading,
		subHeadingOne: (articleObj.subHeadingOne) ? articleObj.subHeadingOne : '',
		subHeadingTwo: (articleObj.subHeadingTwo) ? articleObj.subHeadingTwo : '',
		description: (articleObj.description) ? articleObj.description : '',
		categories: articleObj.categories,
		content: articleObj.content,
		metaTitle: articleObj.metaTitle,
		metaDescriptions: articleObj.metaDescriptions,
		metaKeywords: articleObj.metaKeywords,
		metaTag: articleObj.metaTag,
		source: articleObj.source,
		section: (articleObj.section) ? articleObj.section : '',
		reporter: articleObj.reporter,
		publishArticle: articleObj.publishArticle,
		lastModifiedBy: articleObj.loggedInUserId,
		lastModifiedAt: new Date(),
		sectionFlag: (articleObj.sectionFlag) ? articleObj.sectionFlag : '',
		magazine: (articleObj.magazine) ? articleObj.magazine : '',
		city: (articleObj.city) ? articleObj.city : '',
		articleUrl: (articleObj.metaTitle) ? commonService.slugify(articleObj.metaTitle) : ''
	}
	/* Update articleImage only if image uploaded */
	if (articleObj.articleImage)
		updatedArticleObj.articleImage = articleObj.articleImage.image;
	else
		updatedArticleObj.articleImage = "";
	if (articleObj.posterImage)
		updatedArticleObj.posterImage = articleObj.posterImage.image;
	else
		updatedArticleObj.posterImage = "";
	// Save publishArticle as boolen.(publishArticle in requesParam may be string or boolen value)
	if (updatedArticleObj.publishArticle == 'false' || !updatedArticleObj.publishArticle) {
		updatedArticleObj.publishArticle = false;
		updatedArticleObj['publishScheduleTime'] = new Date(articleObj.publishScheduleTime);
	} else {
		updatedArticleObj.publishArticle = true;
		updatedArticleObj['publishScheduleTime'] = new Date();
	}

	if (typeof articleObj.metaKeywords == 'string') {
		updatedArticleObj.metaKeywords = JSON.parse(articleObj.metaKeywords);
	} else if (articleObj.metaKeywords == '' || articleObj.metaKeywords == null) {
		updatedArticleObj.metaKeywords = []
	}

	if (typeof articleObj.metaTag == 'string') {
		updatedArticleObj.metaTag = JSON.parse(articleObj.metaTag);
	} else if (articleObj.metaTag == '' && articleObj.metaTag == null) {
		updatedArticleObj.metaTag = [];
	}
	db = mongoClient.getDb();
	db.collection("Articles").count({ metaTitle: updatedArticleObj.metaTitle }, function (err, result) {
		if (err) deferred.reject(err);
		if (result > 1) {
			result++;
			updatedArticleObj.articleUrl = updatedArticleObj.articleUrl + '-' + result;
		}
		db.collection(appConfig.COLLECTION_NAME.articles).findOneAndUpdate({ '_id': articleObj.articleId }, { '$set': updatedArticleObj }, { safe: true }, function (err, doc) {
			if (err) deferred.reject(err);
			if (doc.ok === 1) {
				deferred.resolve({ message: "Article updated successfully.", response: { _id: articleObj.articleId } });
				return deferred.promise;
			}
			else {
				deferred.reject("Article Show not found.");
			}
		});
	})
	return deferred.promise;
}

function updateArticleWithImage(articleObj, updatedArticleObj) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	db.collection(appConfig.COLLECTION_NAME.articles).findOneAndUpdate({ '_id': articleObj.articleId }, { '$set': updatedArticleObj }, { safe: true }, function (err, doc) {
		if (err) deferred.reject(err);
		if (doc.ok === 1) {
			deferred.resolve({ message: "Article updated successfully.", response: { _id: articleObj.articleId } });
			return deferred.promise;
		}
		else {
			deferred.reject("Article Show not found.");

		}
	});
	return deferred.promise;
}
function addMetaTags(reqParam) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	db.collection("MetaTags").findOne(reqParam, function (err, tag) {
		if (err) deferred.reject(err);
		if (tag) {
			deferred.resolve({ message: 'Tag Found', response: { _id: tag._id } });
		}
		else {
			db.collection("MetaTags").insertOne(reqParam, { '$set': reqParam }, function (err, createdTag) {
				if (err) deferred.reject(err);
				if (createdTag.result.n > 0) {
					deferred.resolve({ message: 'Tag added successfully', response: { _id: createdTag.insertedId, name: reqParam.name } });
				}
				else {
					deferred.resolve('Unable to add new tag.');
				}
			});
		}
	});
	return deferred.promise;
}

function getMetaTags(reqParam) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findQuery = { 'name': { '$regex': reqParam.searchTag, '$options': 'i' } }
	db.collection("MetaTags").find(findQuery).toArray(function (err, tags) {
		if (err) deferred.reject(err);
		if (tags.length > 0) {
			deferred.resolve({ message: 'Tags found.', response: tags });
		}
		else {
			deferred.resolve({ message: 'Tags not found.', response: [] });
		}
	});
	return deferred.promise;
}

function getBreakingNews(articleObj) {

	var deferred = Q.defer();
	var db = mongoClient.getDb();
	if (articleObj.isBreakingNews === undefined) {
		articleObj.isBreakingNews = false;
	}
	var findQuery = {
		isBreakingNews: true

	};
	var updateObj = {
		$set: {
			isBreakingNews: false,
			lastModifiedAt: new Date(),
			lastModifiedBy: articleObj.loggedInUserId
		},
		$unset: {
			posterImage: ""
		}
	};
	var setNewsObj = {
		$set: {
			isBreakingNews: articleObj.isBreakingNews,
			lastModifiedAt: new Date(),
			lastModifiedBy: articleObj.loggedInUserId
		}
	}
	var setNewsQuery = {
		_id: commonService.convertIntoObjectId(articleObj.articleId)
	};
	db.collection(appConfig.COLLECTION_NAME.articles).update(findQuery, updateObj, { 'multi': true }, function (err, statusObject) {
		if (err) deferred.reject(err);
		db.collection(appConfig.COLLECTION_NAME.articles).findOneAndUpdate(setNewsQuery, setNewsObj, { 'safe': true }, function (err, status) {
			if (err) deferred.reject(err);
			if (status.lastErrorObject.updatedExisting && status.lastErrorObject.n === 1 && status.ok === 1) {
				return deferred.resolve({ 'message': 'Article is removed from breaking news successfully.', 'response': { 'articleId': setNewsQuery._id } });
			}
			else {
				return deferred.resolve({ 'message': 'Article not found.', 'response': [] });
			}
		});
	});

	return deferred.promise;
}

function updatePosterImage(setNewsQuery, setNewsObj) {
	db.collection(appConfig.COLLECTION_NAME.articles).findOneAndUpdate(setNewsQuery, setNewsObj, { 'safe': true }, function (err, status) {
		if (err) deferred.reject(err);
		if (status.lastErrorObject.updatedExisting && status.lastErrorObject.n === 1 && status.ok === 1) {
			return ({ 'message': 'Article is breaking news successfully.', 'response': { 'articleId': setNewsQuery._id } });
		}
		else {
			return ({ 'message': 'Article not found.', 'response': [] });
		}
	});
}

function getBreakingNewsList() {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var findObj = {
		isBreakingNews: true
	}
	var findQuery = [
		{
			$lookup:
				{
					from: appConfig.COLLECTION_NAME.users,
					localField: "reporter",
					foreignField: "_id",
					as: "userInfo"
				}
		},
		{
			$match: findObj
		},
		{ $sort: { lastModifiedAt: -1 } },
		{
			$project: {
				publishScheduleTime: 1,
				lastModifiedAt: 1,
				heading: 1,
				articleImage: 1,
				userInfo: 1
			}
		}
	]
	db.collection(appConfig.COLLECTION_NAME.articles).aggregate(findQuery).toArray(function (err, breakingNews) {
		if (err) deferred.reject(err);
		if (breakingNews) {
			return deferred.resolve({ 'message': 'Get Breaking News List.', 'response': breakingNews });
		}
		else {
			return deferred.resolve({ 'message': 'Breaking News not found.', 'response': [] });
		}
	});
	return deferred.promise;
}

function getArticleReportList(articleObj, callback) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var matchObj = {
		$and: [{
			isActive: true,
			"userInfo.isActive": true
		}]

	};
	if (articleObj.userId) {
		var obj = {};
		obj.reporter = commonService.convertIntoObjectId(articleObj.userId);
		matchObj.$and.push(obj);
	}
	if (articleObj.categoryId) {
		var obj = {};
		obj.categories = {
			$in: [commonService.convertIntoObjectId(articleObj.categoryId)]
		}
		matchObj.$and.push(obj);
	}
	if (articleObj.startDate) {
		var obj = {};
		var date = articleObj.startDate;
		obj.publishScheduleTime = {
			$gte: new Date(moment(date).startOf('day'))
		}
		matchObj.$and.push(obj);
	}
	if (articleObj.endDate) {
		var obj = {};
		var date = articleObj.endDate;
		obj.publishScheduleTime = {
			$lte: new Date(moment(date).endOf('day')),
		}
		matchObj.$and.push(obj);
	}
	var pageSize = appConfig.PAGE_SIZE;
	var pageIndex;
	if (articleObj.pageIndex && parseInt(articleObj.pageIndex) > 0) {
		pageIndex = (articleObj.pageIndex - 1) * pageSize;
	}
	else {
		pageIndex = 0;
	}
	var lookupObj = {
		from: appConfig.COLLECTION_NAME.users,
		localField: "reporter",
		foreignField: "_id",
		as: "userInfo"
	}
	var unwindObj = {
		"path": "$userInfo",
		"preserveNullAndEmptyArrays": true,
		"includeArrayIndex": "userIndex"
	}
	var groupObj = {
		"_id": "$reporter",
		"articleInfo": {
			$addToSet: {
				"userId": "$userInfo._id",
				"heading": "$heading",
				"_id": "$_id",
				"userName": {
					"$concat": ["$userInfo.firstName", " ", "$userInfo.lastName"]
				}
			}
		}
	}
	var findQuery = [
		{
			$lookup: lookupObj
		},
		{
			$unwind: unwindObj
		},

		{
			$match: matchObj
		},
		{
			$group: groupObj
		},
		{
			$skip: pageIndex
		},
		{
			$limit: pageSize
		}
	];
	var countQuery = [{ $lookup: lookupObj }, { $unwind: unwindObj }, { $match: matchObj }, { $group: groupObj }, { $count: 'totalArticles' }];
	db.collection(appConfig.COLLECTION_NAME.articles).aggregate(countQuery).toArray(function (err, totalCount) {
		if (err) deferred.reject(err);
		db.collection(appConfig.COLLECTION_NAME.articles).aggregate(findQuery).toArray(function (err, articles) {
			if (err) deferred.reject(err);
			var mainArr = getUserNamewithCount([], articles);
			var total;
			if (totalCount !== undefined && totalCount.length > 0) {
				total = totalCount[0].totalArticles
			}
			else {
				total = 0;
			}
			if (articleObj.subCategoryId) {
				getSubCategoryTotal(matchObj, articleObj, findQuery).then(function (subArr) {
					var newMainArr = [];
					for (var sIndex in subArr) {
						for (var mIndex in mainArr) {
							if (subArr[sIndex].userId.toString() === mainArr[mIndex].userId.toString()) {
								var obj = {};
								obj.userName = mainArr[mIndex].userName;
								obj.count = mainArr[mIndex].count;
								obj.subCount = subArr[sIndex].count
								newMainArr.push(obj);
								break;
							}
						}
					}
					return deferred.resolve({
						'message': 'Get User list successfully.', 'response': {
							totalUsers: total,
							usersPerPage: pageSize,
							users: newMainArr
						}
					});
				});
			}
			else {
				return deferred.resolve({
					'message': 'Get User list successfully.', 'response': {
						totalUsers: total,
						usersPerPage: pageSize,
						users: mainArr
					}
				});
			}
		});
	});
	return deferred.promise;
}
function getSubCategoryTotal(matchObj, articleObj, findQuery) {
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var obj = {};
	obj.categories = {
		$in: [commonService.convertIntoObjectId(articleObj.subCategoryId)]
	}
	matchObj.$and.push(obj);
	db.collection(appConfig.COLLECTION_NAME.articles).aggregate(findQuery).toArray(function (err, response) {
		if (err) deferred.reject(err);
		var userCountArr = getUserNamewithCount([], response);
		deferred.resolve(userCountArr);
	});
	return deferred.promise;
}

function getUserNamewithCount(userCountArr, articles) {
	if (articles !== undefined && articles.length > 0) {
		for (var index in articles) {
			if (articles[index].articleInfo !== undefined && articles[index].articleInfo !== "" && articles[index].articleInfo !== null) {
				var articleInfoArr = articles[index].articleInfo;
				if (articleInfoArr.length > 0) {
					var arrayLenght = articleInfoArr.length;
					var userName = articleInfoArr[0].userName;
					var userId = articleInfoArr[0].userId;
					var obj = {};
					obj.userId = userId;
					obj.userName = userName;
					obj.count = arrayLenght;
					userCountArr.push(obj);
				}
			}
		}
		return userCountArr;
	}
}

async function getArticlesByReporterId(postObj) {
	const db = mongoClient.getDb();

	const findQuery = {
		'reporter': commonService.convertIntoObjectId(postObj.userId),
		'isActive': true
	}

	if (postObj.categoryId) {
		findQuery['categories'] = commonService.convertIntoObjectId(postObj.categoryId);
	}
	if (postObj.subCategoryId) {
		findQuery['categories'] = { $eq: commonService.convertIntoObjectId(postObj.subCategoryId) };
	}
	
	if (postObj.startDate) {
		findQuery.publishScheduleTime = {
			$gte: new Date(moment(postObj.startDate).startOf('day'))
		}
	}
	if (postObj.endDate) {
		findQuery.publishScheduleTime = Object.assign(findQuery.publishScheduleTime || {},{
			$lte: new Date(moment(postObj.endDate).endOf('day')),
		});
	}

	const pageSize = 10;
	let pageIndex;
	if (postObj.pageIndex && parseInt(postObj.pageIndex) > 0) {
		pageIndex = (postObj.pageIndex - 1) * pageSize;
	} else {
		pageIndex = 0;
	}
	const totalArticlesCount = await db.collection("Articles").find(findQuery).count();
	const articles = await db.collection("Articles").aggregate([
				{
					"$match": findQuery
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: pageIndex },
				{ $limit: pageSize },
				{
					$lookup:
						{
							from: "Users",
							localField: "reporter",
							foreignField: "_id",
							as: "userInfo"
						}
				},
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
					$lookup:
						{
							from: "Magazines",
							localField: "magazine",
							foreignField: "_id",
							as: "magazineInfo"
						}
				},
				{
					$project: {
						articleImage: 1,
						heading: 1,
						isActive: 1,
						publishScheduleTime: 1,
						createdAt: 1,
						lastModifiedAt: 1,
						articleUrl: 1,
						articleId: 1,
						magazine: 1,
						"userInfo._id": 1,
						"userInfo.firstName": 1,
						"userInfo.lastName": 1,
						"categoryInfo.name": 1,
						"categoryInfo.slug": 1,
						"magazineInfo.slug": 1
					}
				}]).toArray();
	
	let articlesPathStringArr = [];
	for(const [index,article] of articles.entries()){
		if(article.categoryInfo.length > 0){
			article.analyticUrl = "/news/"+article.categoryInfo[0].slug+"/"+article.articleUrl;
		} else if(article.magazineInfo.length > 0) {
			article.analyticUrl = "/news/"+article.magazineInfo[0].slug+"/"+article.articleUrl;
		}
		articlesPathStringArr.push("ga:pagePath=="+(article.analyticUrl).replace(/([,;])/g, "\\$&"));
	}
	console.log(articlesPathStringArr);
	const articlesArrs = articlesPathStringArr.reduce((str,val,currentIndex) => { return currentIndex === 0 ? String(val) : str + ','+ String(val) },'');
	// console.log(articlesPathStringArr);
	if(articlesPathStringArr.length > 0) {
		let startDate = "2018-08-13";
		let endDate = "today";
		if(postObj.startDate) {
			startDate = moment(postObj.startDate).format('YYYY-MM-DD');
		}
		if(postObj.endDate){
			endDate = moment(postObj.endDate).format('YYYY-MM-DD');
		}
		const response = await jwt.authorize();
		const result = await google.analytics('v3').data.ga.get({
	      	"auth": jwt,
        	"ids": "ga:" + view_id,
	      	"start-date": startDate,
	      	"end-date": endDate,
	      	"metrics": "ga:pageviews, ga:uniquePageviews, ga:avgTimeOnPage, ga:entrances, ga:bounceRate, ga:exitRate, ga:pageValue",
	      	"dimensions": "ga:pagePath",
	      	"filters": articlesPathStringArr.join(',')
	    });

	    if(result.data.rows){
	    	const googleAnalyticsArr = result.data.rows;
	    	for(const article of articles){
	    		for (const analytic of googleAnalyticsArr) {
	    			if(analytic.indexOf(article.analyticUrl) > -1) {
	    				const analyticObj = {
	    					'pageviews': analytic[1],
	    					'uniquePageviews': analytic[2],
	    					'avgTimeOnPage': analytic[3],
	    					'entrances': analytic[4],
	    					'bounceRate': analytic[5],
	    					'exitRate': analytic[6],
	    					'pageValue': analytic[7]
	    				}
	    				article.analyticObj = analyticObj;
	    			}
	    		}
			}
		}
	}
	const doc = {
		'totalArticles': totalArticlesCount,
		'articlesPerPage': pageSize,
		'articles': articles
	}
	return doc;
	
}