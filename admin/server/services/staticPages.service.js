var mongodb       = require('mongodb');
var mongoClient   = require('../mongoClient');
var Q             = require('q');
var commonService = require('./shared/common.service');
var appConfig     = require('../appConfig');

var service            = {};
service.addStaticPage  = addStaticPage;
service.getStaticPages = getStaticPages;
service.deletePage     = deletePage;
service.getPageById    = getPageById;
service.updatePage     = updatePage;
module.exports         = service;

function  addStaticPage(reqParam) {
	var deferred = Q.defer();
	var insertObj = {
		title: reqParam.title,//required field
		metaTitle: reqParam.metaTitle, //required field
		metaDescription: (reqParam.metaDescription) ? reqParam.metaDescription : '',
		metaKeywords: (reqParam.metaKeywords) ? reqParam.metaKeywords : [], //required field
		content: reqParam.content, //required field
		createdBy: reqParam.loggedInUserId,
		createdAt: new Date(),
		lastModifiedBy: reqParam.loggedInUserId,
		lastModifiedAt: new Date(),
		isActive: true
	}
	insertObj.slug = reqParam.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
	if(typeof reqParam.metaKeywords == 'string'){
		insertObj.metaKeywords = JSON.parse(reqParam.metaKeywords);
	}
	
	var db = mongoClient.getDb();
	db.collection("StaticPages").insertOne(insertObj,function(err, newPage) {
		if (err) deferred.reject(err);
		if(newPage) {
			deferred.resolve({message: 'Page added successfully', response:{ _id:newPage.insertedId }});
		}
		else {
			deferred.resolve('Unable to add new page.');
		}
	});
	return deferred.promise;
}

function getStaticPages(reqParam){
	var deferred       = Q.defer();
	var db = mongoClient.getDb();	
	db.collection("StaticPages").find().toArray(function(err, pages) {
		if(err) deferred.reject(err);
		if(pages) {
			var resObj = []
			pages.forEach(function(page){
				var pageObj = {
					_id:       page._id,
					title:     page.title,
					metaTitle: page.metaTitle,
					isActive:  page.isActive
				}
				resObj.push(pageObj);
			});
			deferred.resolve({ message:'Pages found.', response: resObj });
		}
		else {
			deferred.reject("Page not found.");
		}
	});	
	return deferred.promise;
}

function deletePage(pageId){
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var pageObjectId = commonService.convertIntoObjectId(pageId);
	db.collection("StaticPages").remove({ _id: pageObjectId}, function(err, removedPage) {
		if(err) deferred.reject(err);
		if(removedPage.result.n > 0) {
			return deferred.resolve({'message': 'Page deleted successfully.', 'response':{ 'pageId': pageId}});
		}
		else{
			return deferred.resolve({'message': 'Page not found.', 'response':[]});
		}
	});
	return deferred.promise;	
}

function getPageById(pageId){
	var deferred = Q.defer();
	var db       = mongoClient.getDb();
	var pageId   = commonService.convertIntoObjectId(pageId);
	db.collection("StaticPages").findOne({_id: pageId}, function(err, page) {
		if(err) deferred.reject(err);
		if(page) {
			deferred.resolve({message:'Page Found', response:page});
		}
		else {
			deferred.reject("Page not found.");
		}
	});
	return deferred.promise;	
}

function updatePage(reqParam){
	var deferred   = Q.defer();
	var updatedObj = {
		title:           reqParam.title,//required field
		metaTitle:       reqParam.metaTitle, //required field
		metaDescription: (reqParam.metaDescription) ? reqParam.metaDescription : '',
		metaKeywords:    (reqParam.metaKeywords) ? reqParam.metaKeywords : [], //required field
		content:         reqParam.content, //required field
		lastModifiedBy:  reqParam.loggedInUserId,
		lastModifiedAt:  new Date()
	}
		
	if(typeof reqParam.metaKeywords == 'string'){
		updatedObj.metaKeywords = JSON.parse(reqParam.metaKeywords);
	}else if(reqParam.metaKeywords == '' && reqParam.metaKeywords == null){
		updatedObj.metaKeywords = [];
	}
	
	db = mongoClient.getDb();
	db.collection("StaticPages").findOneAndUpdate({'_id': reqParam.pageId}, {'$set': updatedObj},{safe:true}, function(err, doc){
		if(err) deferred.reject(err);
		if(doc.lastErrorObject.updatedExisting && doc.lastErrorObject.n === 1 && doc.ok === 1) {
			deferred.resolve({message:"Page updated successfully.", response: {_id : reqParam.pageId}});
		}
		else {
			deferred.reject("Page not found.");
		}
	});
	return deferred.promise;	
}