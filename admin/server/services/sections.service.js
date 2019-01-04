var mongodb       = require('mongodb');
var mongoClient   = require('../mongoClient');
var Q             = require('q');
var commonService = require('./shared/common.service');
var appConfig     = require('../appConfig');
const async = require('async');

var service            = {};
service.addSection     = addSection;
service.getSections    = getSections;
service.getSectionById = getSectionById;
service.deleteSection  = deleteSection;
service.changeStatus   = changeStatus;
service.updateSection  = updateSection;
service.associateArticlesToSection = associateArticlesToSection;
module.exports         = service;

function  addSection(reqParam) {
	var deferred = Q.defer();
	var insertObj = {
		title: reqParam.title,//required field
		description: reqParam.description, //required field
		metaTags: (reqParam.metaTags) ? reqParam.metaTags : [], //required field
		createdBy: reqParam.loggedInUserId,
		createdAt: new Date(),
		lastModifiedBy: reqParam.loggedInUserId,
		lastModifiedAt: new Date(),		
		isActive: true
	}
	if(typeof reqParam.metaTags == 'string'){
		insertObj.metaTags = JSON.parse(reqParam.metaTags);
	}

	insertObj.slug = commonService.slugify(reqParam.title);
	
	var db = mongoClient.getDb();
	db.collection("Sections").findOne({ slug: insertObj.slug },function(err, section) {
		if (err) deferred.reject(err);
        if (section) {
            deferred.reject("This section already exists!");
        } else {
            db.collection("Sections").insertOne(insertObj,function(err, newSection) {
				if (err) deferred.reject(err);
				if(newSection) {			
					deferred.resolve({message: 'Section added successfully', response:{ _id:newSection.insertedId }});
				}
				else {
					deferred.resolve('Unable to add new section.');
				}
			});
        }
	});
	// db.collection("Sections").insertOne(insertObj,function(err, newSection) {
	// 	if (err) deferred.reject(err);
	// 	if(newSection) {			
	// 		deferred.resolve({message: 'Section added successfully', response:{ _id:newSection.insertedId }});
	// 	}
	// 	else {
	// 		deferred.resolve('Unable to add new section.');
	// 	}
	// });
	return deferred.promise;
}

function getSections(reqParam){
	var deferred       = Q.defer();
	var findQuery      = {};
	commonService.getPageSize().then(function(pageSize){
		var sectionsPerPage = pageSize;
		if(reqParam.pageIndex){
			var page     = parseInt(reqParam.pageIndex),		
			skipSections = page > 0 ? ((page - 1) * sectionsPerPage) : 0;
		}else{
			var skipSections = 0, limit = 0;
		}
		if(reqParam.searchText && reqParam.searchText !== ''){
			findQuery = {'title': {'$regex': commonService.escapeRegExp(reqParam.searchText), '$options': 'i'}};
		}else if(reqParam.isActive == 'true'){
			findQuery = {isActive : true};
		}
		
		var db = mongoClient.getDb();
		db.collection("Sections").find(findQuery).count(function(err, totalSections) {
			db.collection("Sections").aggregate([
			    { 
					"$match": findQuery
				}, 
				{ 
					"$skip" : skipSections 
				},
				{ 
					"$limit" : sectionsPerPage 
				},
				{
					"$lookup": {
			            "from": "Articles",
			            "localField": "_id",
			            "foreignField": "section",
			            "as": "articles"
			        }
				}
			]).sort({title:1}).toArray(function(err, sections) {
				if(err) deferred.reject(err);
				if(sections) {
					var resObj = {
							'totalSections': totalSections,
							'sectionsPerPage': sectionsPerPage,
							'sections': []
						}
					sections.forEach(function(section){
						var sectionObj = {
							_id:      section._id,
							title:    section.title,
							articles: section.articles.length,
							isActive: section.isActive
						}
						resObj.sections.push(sectionObj);
					});
					deferred.resolve({
						message:'Sections found.',
						response: resObj
					});
				}
				else {
					deferred.reject("Sections not found.");
				}
			});
		});
	});
	return deferred.promise;	
}

function getSectionById(sectionId){
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var sectionId = commonService.convertIntoObjectId(sectionId);
	db.collection("Sections").findOne({_id: sectionId}, function(err, section) {
		if(err) deferred.reject(err);
		if(section) {
			deferred.resolve({message:'Section Found', response:section});
		}
		else {
			deferred.reject("Section not found.");
		}
	});
	return deferred.promise;	
}

function deleteSection(sectionId){
	var deferred = Q.defer();
	var db = mongoClient.getDb();
	var sectionObjectId = commonService.convertIntoObjectId(sectionId);
	db.collection("Sections").remove({ _id: sectionObjectId}, function(err, removedSection) {
		if(err) deferred.reject(err);
		if(removedSection.result.n > 0) {
			return deferred.resolve({'message': 'Section deleted successfully.', 'response':{ 'sectionId': sectionId}});
		}
		else{
			return deferred.resolve({'message': 'Section not found.', 'response':[]});
		}
	});
	return deferred.promise;	
}

function changeStatus(reqParam){
	var deferred        = Q.defer();
	var db              = mongoClient.getDb();
	var sectionObjectId = commonService.convertIntoObjectId(reqParam.sectionId);
	var sectionStatus;
	if(reqParam.sectionStatus == '1') {
		sectionStatus = true;
	}
	else if(reqParam.sectionStatus == '0') {
		sectionStatus = false;
	}	
	db.collection("Sections").update({ _id: sectionObjectId}, {'$set': {'isActive': sectionStatus}}, {'safe': true}, function(err, statusObject) {
		if(err) deferred.reject(err);
		if(statusObject.result.ok === 1 && statusObject.result.nModified === 1 && statusObject.result.n === 1) {
			return deferred.resolve({'message': 'Section status changed successfully.', 'response':{ 'sectionId': sectionObjectId}});
		}
		else{
			return deferred.resolve({'message': 'Section not found.', 'response':[]});
		}
	});
	return deferred.promise;	
}

function updateSection(reqParam){
	var deferred = Q.defer();
	var updatedSectionObj = {		
		title: reqParam.title,//required field
		description: reqParam.description, //required field
		metaTags: (reqParam.metaTags) ? reqParam.metaTags : [], //required field
		lastModifiedBy: reqParam.loggedInUserId,
		lastModifiedAt: new Date()
	}

	var sectionObjectId = commonService.convertIntoObjectId(reqParam.sectionId);
		
	if(typeof reqParam.metaTags == 'string'){
		updatedSectionObj.metaTags = JSON.parse(reqParam.metaTags);
	}else if(reqParam.metaTags == '' && reqParam.metaTags == null){
		updatedSectionObj.metaTags = [];
	}

	updatedSectionObj.slug = commonService.slugify(reqParam.title);
	
	db = mongoClient.getDb();
	db.collection("Sections").findOne({ 'slug': updatedSectionObj.slug, '_id': { $ne:  sectionObjectId} },function(err, section) {
		if (err) deferred.reject(err);
        if (section) {
            deferred.reject("This section already exists!");
        } else {
            db.collection("Sections").findOneAndUpdate({'_id': reqParam.sectionId}, {'$set': updatedSectionObj},{safe:true}, function(err, doc){
				if(err) deferred.reject(err);
				if(doc.lastErrorObject.updatedExisting && doc.lastErrorObject.n === 1 && doc.ok === 1) {
					deferred.resolve({message:"Section updated successfully.", response: {_id : reqParam.sectionId}});
				}
				else {
					deferred.reject("Section not found.");
				}
			});
        }
	});
	
	return deferred.promise;	
}

async function associateArticlesToSection(postObj) {
	const sectionId = commonService.convertIntoObjectId(postObj.sectionId);
	let articles = postObj.articles;
	articles = articles.map(item => commonService.convertIntoObjectId(item));
	
	const db = mongoClient.getDb();
	const doc = await db.collection("Articles").updateMany({ '_id': { '$in': articles }}, {'$set': {'section': sectionId}}, {'safe': true});
	return doc;
}