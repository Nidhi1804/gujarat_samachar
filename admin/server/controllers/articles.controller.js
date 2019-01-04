var express = require('express');
var fs = require('fs');
var q = require('q');
var router = express.Router();
var FCM = require('fcm-node')
var serverKey = 'AIzaSyBRpcxhJcyAy_NiwsOTRUEuEmRGEpKazKM';
var fcm = new FCM(serverKey);
var commonService = require('../services/shared/common.service');
var articlesService = require('../services/articles.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');
const async = require('async');

router.post('/articles/image-upload', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, saveArticleImage);
router.get('/articles/report/list', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getArticleReportList);
router.post('/articles/report/list', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getArticlesByReporterId);
router.get('/articles/breaking-news', middlewares.sessionHandler, getBreakingNewsList);
router.post('/articles', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addArticle);
router.get('/articles', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getArticles);
router.get('/articles/:articleId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getArticleByID);
router.put('/articles/:articleId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, editArticle);
router.delete("/articles/:articleId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteArticle);
router.put('/articles/change-status/:idList', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeArticlesStatus);
router.post('/meta-tags', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, addMetaTags);
router.get('/meta-tags', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getMetaTags);
router.get('/section-flags', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSectionFlags);
router.get('/magazines', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getMagazines);
router.get('/articles/section/:sectionId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getArticleBySection);
router.put('/articles/breaking-news/:articleId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getBreakingNews);

function addArticle(req, res) {
	var document = {
		heading: req.body.heading,
		subHeadingOne: req.body.subHeadingOne,
		subHeadingTwo: req.body.subHeadingTwo,
		description: req.body.description,
		categories: req.body.categories,
		content: req.body.content,
		metaTitle: req.body.metaTitle,
		metaDescriptions: req.body.metaDescriptions,
		metaKeywords: req.body.metaKeywords,
		metaTag: req.body.metaTag,
		source: req.body.source,
		reporter: req.body.reporter,
		publishArticle: req.body.publishArticle,
		publishScheduleTime: req.body.publishScheduleTime,
		section: req.body.section,
		sectionFlag: req.body.sectionFlag,
		magazine: req.body.magazine,
		city: req.body.city
	}

	var required = {
		heading: req.body.heading,
		content: req.body.content,
		metaTitle: req.body.metaTitle,
		metaDescriptions: req.body.metaDescriptions,
		metaKeywords: req.body.metaKeywords,
		source: req.body.source,
		reporter: req.body.reporter,
		publishArticle: req.body.publishArticle
	}
	if (req.body.publishArticle == 'false') {
		required['publishScheduleTime'] = req.body.publishScheduleTime;
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}

	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	document['reporter'] = commonService.convertIntoObjectId(document.reporter);
	if (document['section'])
		document['section'] = commonService.convertIntoObjectId(document.section);
	if (document['sectionFlag'])
		document['sectionFlag'] = commonService.convertIntoObjectId(document.sectionFlag);
	if (document['magazine'])
		document['magazine'] = commonService.convertIntoObjectId(document.magazine);
	if (document['city'])
		document['city'] = commonService.convertIntoObjectId(document.city);

	if (typeof document['categories'] == 'string') {
		document['categories'] = JSON.parse(document['categories']);
	}
	if (document['categories']) {
		document['categories'] = document['categories'].map(function (cat) {
			return commonService.convertIntoObjectId(cat);
		})
	}
	commonService.replaceContentImagePath(req.body.content, 'content_image').then(function (contentString) {
		document['content'] = contentString;
		saveArticle(req, document).then(function (responseData) {
			res.json(responseData).end();
		});
	});
}

function saveArticle(req, document) {
	let deffered = q.defer();
	if (req.body.articleImage !== undefined && req.body.articleImage.length > 0) {
		var imageObj = {
			image: req.body.articleImage
		};
		commonService.uploadSingleFiles(imageObj, [], 'articles/articles_thumbs').then(function (articleImageArr) {
			if (articleImageArr.length > 0) {
				document['articleImage'] = articleImageArr.pop();
			} else {
				document['articleImage'] = [];
			}
			articlesService.addArticle(document).then(function (resObj) {
				var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
				// res.json(apiSuccessResponse).end();
				deffered.resolve(apiSuccessResponse);
			}).catch(function (err) {
				var apiFailureResponse = apiResponse.setFailureResponse(err);
				// res.json(apiFailureResponse).end();
				deffered.resolve(apiFailureResponse);
			});
		})
	} else {
		articlesService.addArticle(document).then(function (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			// res.json(apiSuccessResponse).end();
			deffered.resolve(apiSuccessResponse);
		}).catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			// res.json(apiFailureResponse).end();
			deffered.resolve(apiFailureResponse);
		});
	}
	return deffered.promise;
}

/**
 * Write file on given path.
 * @param {*} imageArr
 */
function writeFile(imageArr) {
	let deffered = q.defer();
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

function getArticles(req, res) {
	var document = {
		searchText: req.query.searchText,
		reporter: req.query.reporter,
		category: req.query.category,
		pageIndex: req.query.pageIndex,
		city: req.query.city,
		magazine: req.query.magazine,
		subCategory: req.query.subCategory && req.query.subCategory !== undefined ? Array.isArray(req.query.subCategory) ? req.query.subCategory : [req.query.subCategory] : undefined,
		section: req.query.section
	};
	
	if (req.query.reporter)
		document['reporter'] = commonService.convertIntoObjectId(document.reporter);
	if (req.query.category)
		document['category'] = commonService.convertIntoObjectId(document.category);
	if (req.query.city)
		document['city'] = commonService.convertIntoObjectId(document.city);
	if (req.query.magazine)
		document['magazine'] = commonService.convertIntoObjectId(document.magazine);
	if (document.subCategory){
		document.subCategory = document.subCategory.map(val =>  commonService.convertIntoObjectId(val));
	}
	// document['subCategory'] = commonService.convertIntoObjectId(document.subCategory);
	if (req.query.section)
		document['section'] = commonService.convertIntoObjectId(document.section);

	// to get articles accept selected section for section-page
	if (req.query.selectedSection)
		document['selectedSection'] = commonService.convertIntoObjectId(req.query.selectedSection);
	articlesService.getArticlesList(document).then(function (resObj) {
		// sendNotification(resObj.response.articles[0],'');
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getArticleByID(req, res) {
	var articleId = req.params.articleId;
	var required = {
		"articleId": req.params.articleId
	};
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	articlesService.getArticleById(articleId).then(function (resObj) {
		if (resObj) {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		} else {
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
			res.json(apiSuccessResponse).end();
		}
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function editArticle(req, res) {
	var document = {
		articleId: req.params.articleId,
		heading: req.body.heading,
		subHeadingOne: req.body.subHeadingOne,
		subHeadingTwo: req.body.subHeadingTwo,
		description: req.body.description,
		categories: req.body.categories,
		subCategory: req.body.subCategory,
		content: req.body.content,
		metaTitle: req.body.metaTitle,
		metaDescriptions: req.body.metaDescriptions,
		metaKeywords: req.body.metaKeywords,
		metaTag: req.body.metaTag,
		source: req.body.source,
		reporter: req.body.reporter,
		publishArticle: req.body.publishArticle,
		section: req.body.section,
		sectionFlag: req.body.sectionFlag,
		magazine: req.body.magazine,
		city: req.body.city
	}
	var required = {
		articleId: req.params.articleId,
		heading: req.body.heading,
		content: req.body.content,
		metaTitle: req.body.metaTitle,
		metaDescriptions: req.body.metaDescriptions,
		metaKeywords: req.body.metaKeywords,
		source: req.body.source,
		reporter: req.body.reporter,
		publishArticle: req.body.publishArticle
	}
	if (req.body.publishArticle == 'false' || !req.body.publishArticle) {
		document['publishScheduleTime'] = req.body.publishScheduleTime;
		required['publishScheduleTime'] = req.body.publishScheduleTime;
	} else {
		document['publishScheduleTime'] = new Date();
	}

	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	document['loggedInUserId'] = commonService.convertIntoObjectId(req.session.userInfo.userId);
	document['articleId'] = commonService.convertIntoObjectId(document.articleId);
	document['reporter'] = commonService.convertIntoObjectId(document.reporter);
	if (document['sectionFlag'])
		document['sectionFlag'] = commonService.convertIntoObjectId(document.sectionFlag);
	if (document['magazine'])
		document['magazine'] = commonService.convertIntoObjectId(document.magazine);
	if (document['city'])
		document['city'] = commonService.convertIntoObjectId(document.city);

	if (typeof document['categories'] == 'string') {
		document['categories'] = JSON.parse(document['categories']);
	}
	if (document['categories']) {
		document['categories'] = document['categories'].map(function (cat) {
			return commonService.convertIntoObjectId(cat);
		})
	}
	if (document['section'])
		document['section'] = commonService.convertIntoObjectId(document.section);

	//document['categories'] = commonService.convertIntoObjectId(document.category);
	if (document.subCategory) {
		document['subCategory'] = commonService.convertIntoObjectId(document.subCategory);
	}

	// If content find image tag in string data than upload image on given path and save image path in content.
	commonService.replaceContentImagePath(req.body.content, 'content_image').then(function (contentString) {
		document['content'] = contentString;
		editArticleUploadImage(req, document).then(function (responseData) {
			return res.json(responseData).end();
		});
	}).catch(function (err) {
		return res.json(err).end();
	});

}

function editArticleUploadImage(req, document) {
	let deffered = q.defer();
	if (req.body.articleImage !== undefined && req.body.articleImage.length > 0) {
		var imageObj = {
			image: req.body.articleImage
		}
		commonService.uploadSingleFiles(imageObj, [], 'articles/articles_thumbs').then(function (articleImageArr) {
			if (articleImageArr.length > 0) {
				document['articleImage'] = articleImageArr.pop();
			} else {
				document['articleImage'] = [];
			}
			if (req.body.posterImage !== undefined && req.body.posterImage !== null && req.body.posterImage !== "" && req.body.posterImage.length > 0) {
				var imageObj = {
					image: req.body.posterImage
				}
				commonService.uploadSingleFiles(imageObj, [], 'posters').then(function (posterImageArr) {
					if (posterImageArr.length > 0) {
						document['posterImage'] = posterImageArr.pop();
					} else {
						document['posterImage'] = [];
					}
					updateArticle(document).then(function (updatedResp) {
						deffered.resolve(updatedResp);
					});
				})
			} else {
				updateArticle(document).then(function (updatedResp) {
					deffered.resolve(updatedResp);
				});
			}
		});
	} else {
		updateArticle(document).then(function (updatedResp) {
			deffered.resolve(updatedResp);
		});
	}
	return deffered.promise;
}

function updateArticle(document) {
	let deffered = q.defer();
	articlesService.updateArticle(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		deffered.resolve(apiSuccessResponse);
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		deffered.resolve(apiFailureResponse);
	});
	return deffered.promise;
}

function deleteArticle(req, res) {
	var collectionName = 'Articles';
	var document = {
		'articleId': req.params.articleId
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	commonService.removeDocuments(collectionName, JSON.parse(document.articleId)).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Article Removed Successfully.", resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function changeArticlesStatus(req, res) {
	var document = {
		'idList': req.params.idList,
		'isActive': req.body.isActive
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	commonService.changeDocumentsStatus(appConfig.COLLECTION_NAME.articles, document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function addMetaTags(req, res) {
	var document = {
		'name': req.body.name
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	articlesService.addMetaTags(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function getMetaTags(req, res) {
	var document = {
		searchTag: req.query.searchTag
	}
	articlesService.getMetaTags(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function getArticleBySection(req, res) {
	var document = {
		searchText: req.query.searchText,
		reporter: req.query.reporter,
		category: req.query.category,
		pageIndex: req.query.pageIndex,
		section: req.params.section,
		isActive: true
	};
	if (req.params.sectionId) {
		document['sectionFlag'] = commonService.convertIntoObjectId(req.params.sectionId);
	}
	if (req.query.reporter)
		document['reporter'] = commonService.convertIntoObjectId(document.reporter);
	if (req.query.category)
		document['category'] = commonService.convertIntoObjectId(document.category);
	if (req.query.section)
		document['section'] = commonService.convertIntoObjectId(document.section);
	if (req.query.city)
		document['city'] = commonService.convertIntoObjectId(document.city);
	if (req.query.magazine)
		document['magazine'] = commonService.convertIntoObjectId(document.magazine);
	articlesService.getArticlesList(document).then(function (resObj) {
		// sendNotification(resObj.response.articles[0],req.params.sectionId);
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getSectionFlags(req, res) {
	var collectionName = "SectionFlags";
	var findQuery = {};
	var sortQuery = {
		name: 1
	};
	commonService.getDocuments(collectionName, findQuery, sortQuery).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Section flags found.", resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getMagazines(req, res) {
	var collectionName = "Magazines";
	var findQuery = {};
	var sortQuery = {
		name: 1
	}
	commonService.getDocuments(collectionName, findQuery, sortQuery).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Magazines found.", resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getBreakingNews(req, res) {
	var document = {};
	if (req.params.articleId) {
		document['articleId'] = req.params.articleId;
	}
	if (req.body.isBreakingNews) {
		document['isBreakingNews'] = req.body.isBreakingNews;
	}
	articlesService.getBreakingNews(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getBreakingNewsList(req, res) {

	articlesService.getBreakingNewsList().then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getArticleReportList(req, res) {
	var document = {};
	if (req.query.userId !== undefined && req.query.userId !== null && req.query.userId !== "") {
		document.userId = req.query.userId;
	}
	if (req.query.pageIndex !== undefined && req.query.pageIndex !== null && req.query.pageIndex !== "") {
		document.pageIndex = req.query.pageIndex;
	}
	if (req.query.categoryId !== undefined && req.query.categoryId !== null && req.query.categoryId !== "") {
		document.categoryId = req.query.categoryId;
	}
	if (req.query.startDate !== undefined && req.query.startDate !== null && req.query.startDate !== "") {
		document.startDate = req.query.startDate;
	}
	if (req.query.endDate !== undefined && req.query.endDate !== null && req.query.endDate !== "") {
		document.endDate = req.query.endDate;
	}
	if (req.query.subCategoryId !== undefined && req.query.subCategoryId !== null && req.query.subCategoryId !== "") {
		document.subCategoryId = req.query.subCategoryId;
	}
	articlesService.getArticleReportList(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function saveArticleImage(req, res) {
	var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Image upload success", "1234567890");
	res.json(apiSuccessResponse).end();
}
function sendNotification(resObj,sectionId){
	var categoryName;
	if(resObj.magazineInfo.length > 0)
		var	categorySlug = resObj.magazineInfo[0].slug;
	else
		var	categorySlug = resObj.categoryInfo[0].slug;

	if(resObj.magazineInfo.length > 0){
		isMagazine = true;
	}else{
		isMagazine = false;
	}
    var androidMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: '/topics/news', 
        "content_available": true,
   		"mutable_content": true,
        "data": {
		        data: {
		        	body: resObj.heading,
		        	title: resObj.heading,
			        articleUrl: resObj.articleUrl,
			        categorySlug: categorySlug,
			        isMagazine: isMagazine,
			        icon: "http://admin.reprezzo.com/" + resObj.articleImage,
			    }
		    },
        "payload": {
         "aps": {}
       }
    }
    var iosMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: '/topics/iosNews', 
        "content_available": true,
   		"mutable_content": true,
   		"notification": {
        	body: resObj.heading,
	        title: 'Top Stories',
	        data: {
		        	body: resObj.heading,
		        	title: resObj.heading,
			        articleUrl: resObj.articleUrl,
			        categorySlug: categorySlug,
			        isMagazine: isMagazine,
			        icon: "http://admin.reprezzo.com/" + resObj.articleImage,
			    }
   		},
        "data": {
		        data: {
		        	body: resObj.heading,
		        	title: resObj.heading,
			        articleUrl: resObj.articleUrl,
			        categorySlug: categorySlug,
			        isMagazine: isMagazine,
			        icon: "http://admin.reprezzo.com/" + resObj.articleImage,
			    }
		    },
        "payload": {
         "aps": {}
       }
    }
    fcm.send(androidMessage, function(err, response){
        if (err) {
            console.log("Something has gone wrong!",err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    });
    console.log('iosMessage',iosMessage);
    fcm.send(iosMessage, function(err, response){
        if (err) {
            console.log("Something has gone wrong!",err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    });
}

async function getArticlesByReporterId(req, res) {
	const document = {
		userId: req.body.userId
	};

	/* Document Fields Validation */
	const validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}

	if (req.body.pageIndex !== undefined && req.body.pageIndex !== null && req.body.pageIndex !== "") {
		document.pageIndex = req.body.pageIndex;
	}
	if (req.body.categoryId !== undefined && req.body.categoryId !== null && req.body.categoryId !== "") {
		document.categoryId = req.body.categoryId;
	}
	if (req.body.startDate !== undefined && req.body.startDate !== null && req.body.startDate !== "") {
		document.startDate = req.body.startDate;
	}
	if (req.body.endDate !== undefined && req.body.endDate !== null && req.body.endDate !== "") {
		document.endDate = req.body.endDate;
	}
	if (req.body.subCategoryId !== undefined && req.body.subCategoryId !== null && req.body.subCategoryId !== "") {
		document.subCategoryId = req.body.subCategoryId;
	} 

    try {
		const result = await articlesService.getArticlesByReporterId(document);
		const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Articles found Successfully", result);
		res.json(apiSuccessResponse).end();
    } catch(err) {
    	const apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
    }
}
module.exports = router;
