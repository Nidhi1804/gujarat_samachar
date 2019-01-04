var mongoClient     = require('./mongoClient');
const sm            = require('sitemap');
const RSS           = require('rss');
const async         = require('async');
const appConfig     = require('./appConfig');
const commonService = require('./services/shared/common.service'); 
var Q               = require('q');
const moment = require('moment');

exports.getMainSitemapXml      = getMainSitemapXml;
exports.getCategorySitemapXml  = getCategorySitemapXml;
exports.getCitySitemapXml      = getCitySitemapXml;
exports.getMagazineSitemapXml  = getMagazineSitemapXml;
exports.getSlideShowSitemapXml = getSlideShowSitemapXml;
exports.getCityRssXml          = getCityRssXml;
exports.getCategoryRssXml      = getCategoryRssXml;
exports.getMagazineRssXml      = getMagazineRssXml;
exports.getTopStoriesRssXml    = getTopStoriesRssXml;
/* Get sitemap for landing page */
function getMainSitemapXml(req, res) {
	var sitemap       = sm.createSitemap ({
		hostname: 'https://' + req.headers.host,
		cacheTime: 600000,// 600 sec - cache purge period
	});
	sitemap.add({url: '/photo/1'});
	sitemap.add({url: '/photo/1/sitemap.xml'});
	sitemap.add({url: '/photo-gallery'});
	sitemap.add({url: '/sitemap'});
	sitemap.add({url: '/static-page/about-us'});
	sitemap.add({url: '/static-page/contact-us'});
	sitemap.add({url: '/static-page/terms-condition-with-us'});
	sitemap.add({url: '/static-page/advertise-with-us'});
	sitemap.add({url: '/static-page/feed-back'});
	getMainLinks(sitemap).then(function(){
		sitemap.toXML( function (err, xml) {
			if (err) {
				return res.status(500).end();
			}
			res.header('Content-Type', 'application/xml');
			res.send( xml );
		});
	});
}; 

/* Get sitemap for category list page (state: root.mainSidebar.articleList)  //listType : category */
function getCategorySitemapXml(req, res){
	let sitemap       = sm.createSitemap ({
		hostname: 'https://' + req.headers.host,
		cacheTime: 600000,// 600 sec - cache purge period
	});
	getCategoryOrCityArticleLinks(sitemap, req.params.slug, req.params.Id, req.params.pageIndex, 'category').then(function(){
		sitemap.toXML( function (err, xml) {
			if (err) {
				return res.status(500).end();
			}
			res.header('Content-Type', 'application/xml');
			res.send( xml );
		});
	})
}

/* Get sitemap for City list page (state: root.mainSidebar.articleList) //listType : city */
function getCitySitemapXml(req, res) {
	let sitemap       = sm.createSitemap ({
		hostname: 'https://' + req.headers.host,
		cacheTime: 600000,// 600 sec - cache purge period
	});
	getCategoryOrCityArticleLinks(sitemap, req.params.slug, req.params.Id, req.params.pageIndex, 'city').then(function(){
		sitemap.toXML( function (err, xml) {
			if (err) {
				return res.status(500).end();
			}
			res.header('Content-Type', 'application/xml');
			res.send( xml );
		});
	})
}

/* Get sitemap for Magazine list page (state: root.mainSidebar.articleByMagazine) */
function getMagazineSitemapXml(req, res){
	let sitemap       = sm.createSitemap ({
		hostname: 'https://' + req.headers.host,
		cacheTime: 600000,// 600 sec - cache purge period
	});
	getMagazineArticleLinks(sitemap, req.params.slug, req.params.pageIndex).then(function(){
		sitemap.toXML( function (err, xml) {
			if (err) {
				return res.status(500).end();
			}
			res.header('Content-Type', 'application/xml');
			res.send( xml );
		});
	})
}

/* Get sitemap for slide-show list page (State: root.mainSidebar.slideShowDetails) */
function getSlideShowSitemapXml(req, res){
	let sitemap       = sm.createSitemap ({
		hostname: 'https://' + req.headers.host,
		cacheTime: 600000,// 600 sec - cache purge period
	});
	let findQuery = {}
	let returnFields = { _id:1, url: 1, Id: 1 };
	var db = mongoClient.getDb();
	db.collection('SlideShow').find(findQuery, returnFields).toArray(function (err, documents) {
		if (err) console.log(err);
		if(documents && documents.length > 0) {
			documents.forEach(function(doc) {
				sitemap.add({url: '/photo_slide_show/'+doc.url+'/'+doc.Id});
			});
		}
		sitemap.toXML( function (err, xml) {
			if (err) {
				return res.status(500).end();
			}
			res.header('Content-Type', 'application/xml');
			res.send( xml );
		});
	});
}

function getCategoryOrCityArticleLinks(sitemap, slug, id, pageIndex, pageType) {
	let deferred = Q.defer();
	let collectionName = 'Articles';
    let categoryId;
    let cityId;
	let findQuery = {
		isActive:true,
	    publishScheduleTime: {
            $lte: new Date()
        }
	};
	let findCityOrCategoryQuery = {isActive:true};
    let cityOrCategorycollectionName;
    if (pageType == 'category')
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.categories;
    if (pageType == 'city')
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.cities;

    findCityOrCategoryQuery['slug'] = slug;

	var db = mongoClient.getDb();
	let returnFields = { _id:1, articleUrl:1 };
	let sortQuery = {publishScheduleTime: -1 };
    commonService.getDocuments(cityOrCategorycollectionName, findCityOrCategoryQuery).then(function(cityOrCategoryObj) {
        if (cityOrCategoryObj && cityOrCategoryObj.response && cityOrCategoryObj.response.length > 0) {
            if (pageType == 'category') {
                categoryId = cityOrCategoryObj.response[0]._id;
                findQuery['categories'] = cityOrCategoryObj.response[0]._id;
            }
            if (pageType == 'city') {
                cityId = cityOrCategoryObj.response[0]._id;
                findQuery['city'] = cityOrCategoryObj.response[0]._id;
            }
        }
		db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).limit(parseInt(500)).toArray(function (err, documents) {
			if (err) console.log(err);
			if (documents !== undefined && documents.length > 0) {
				documents.forEach(function(doc){
					sitemap.add({url: '/news/'+slug+'/'+doc.articleUrl});
				});
			}
			deferred.resolve(true);
		});
    }).catch(function(err) {
        console.log(err)
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
	return deferred.promise;
}

/* Get articles for magazine list page. (state: root.mainSidebar.articleByMagazine) */
function getMagazineArticleLinks(sitemap, slug, pageIndex) {
	let deferred = Q.defer();
	let collectionName = 'Articles';
	let findQuery = {
		isActive:true,
		publishScheduleTime: {
            $lte: new Date()
        }
	};
	let findMagazineQuery = {};
    findMagazineQuery['slug'] = slug;
	var db = mongoClient.getDb();
	let returnFields = { _id:1, articleUrl:1 };
	let sortQuery = {publishScheduleTime: -1 };
    commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, findMagazineQuery).then(function(magazineObj) {
        if (magazineObj && magazineObj.response && magazineObj.response.length > 0) {
            findQuery['magazine'] = magazineObj.response[0]._id;
        }
		db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).limit(parseInt(500)).toArray(function (err, documents) {
			if (err) console.log(err);
			if (documents !== undefined && documents.length > 0) {
				documents.forEach(function(doc){
					sitemap.add({url: '/news/'+slug+'/'+doc.articleUrl});
				});
			}
			deferred.resolve(true);
		});
    }).catch(function(err) {
        console.log(err)
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
	return deferred.promise;
}

/* Get sitemap for landing page (Main Route: /sitemap.xml)*/
function getMainLinks(sitemap) {
	let deferred = Q.defer();
	let pages = [
		{collectionName : 'Categories', pageType : 'category', findQuery : { isActive:true, type: "article" } },
		{collectionName : 'Cities', pageType : 'city', findQuery : { }}, 
		{collectionName : 'Magazines', pageType : '', findQuery : { }}
	];
	var db = mongoClient.getDb();
	async.forEachLimit(pages, 1, function (page, callback) {
		let findQuery = page.findQuery;
		let returnFields = { _id:1, slug: 1};
		db.collection(page.collectionName).find(findQuery, returnFields).toArray(function (err, documents) {
			if (err) console.log(err);
			if (documents !== undefined && documents.length > 0) {
				if(page.collectionName == 'Categories') {
					// Create dynamic URL of category list page
					documents.forEach(function(doc){
						sitemap.add({url: '/category/'+ doc.slug +'/1'});
						sitemap.add({url: '/category/'+ doc.slug +'/1/sitemap.xml'});
					});
				}
				if(page.collectionName == 'Cities') {
					// Create dynamic URL of category list page
					documents.forEach(function(doc){
						sitemap.add({url: '/city/'+ doc.slug +'/1'});
						sitemap.add({url: '/city/'+ doc.slug +'/1/sitemap.xml'});
					});
				}

				if(page.collectionName == 'Magazines') {

					documents.forEach(function(doc){
						sitemap.add({url: '/magazine/'+doc.slug+'/1'});
						sitemap.add({url: '/magazine/'+doc.slug+'/1'+'/sitemap.xml'});
					});
				}
				callback();
			} else {
				callback();
			}
		});
	}, function (err) {
		if (err) console.error(err);
		deferred.resolve(true);
	});
	return deferred.promise;
}

/* Get RSS feed for city*/
function getCityRssXml(req, res){
	let fullUrl = 'https://' + req.get('host');
	let currentUrl = fullUrl + req.url;
	var today = new Date();
	var slug = req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1);
	let feed = new RSS({
	    title: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    custom_namespaces: {
	      'sy': 'http://purl.org/rss/1.0/modules/syndication/',
	      'wfw': 'http://wellformedweb.org/CommentAPI/',
	      'slash': 'http://purl.org/rss/1.0/modules/slash/'
	    }, 
	    custom_elements: [
		    {'atom:link': 
			    { _attr: 
			    	{'type':"application/rss+xml",'rel':"self",'href': currentUrl}, 
			    }
			},
		    {'sy:updatePeriod': 'hourly'},
		    {'sy:updateFrequency': 1},
	    ],
	    pubDate: today,
	    language: 'en-US',	
	    description: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    site_url: 'https://' + req.get('host'),
	    docs: 'https://' + req.get('host'),
	    copyright: '© All Rights Reserved ' +  today.getFullYear() + ' ' + 'https://' + req.get('host'),
	    image_url: 'https://' + req.get('host') + '/assets/images/logo.png',
	});
	getCategoryOrCityArticles(feed, req.params.slug, 'city',fullUrl).then(function(){
		var xml = feed.xml();
		res.header('Content-Type', 'application/xml');
		res.send( xml );
	});
}

/* Get RSS feed for Category*/
function getCategoryRssXml(req, res){
	let fullUrl = 'https://' + req.get('host');
	let currentUrl = fullUrl + req.url;
	var today = new Date();
	var slug = req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1);
	let feed = new RSS({
	    title: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    custom_namespaces: {
	      'sy': 'http://purl.org/rss/1.0/modules/syndication/',
	      'wfw': 'http://wellformedweb.org/CommentAPI/',
	      'slash': 'http://purl.org/rss/1.0/modules/slash/'
	    }, 
	    custom_elements: [
	    	{'atom:link': 
			    { _attr: 
			    	{'type':"application/rss+xml",'rel':"self",'href': currentUrl}, 
			    }
			},
		    {'sy:updatePeriod': 'hourly'},
		    {'sy:updateFrequency': 1},
	    ],
	    language: 'en-US',
	    description: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    site_url: 'https://' + req.get('host'),
	    docs: 'https://' + req.get('host'),
	    copyright: '© All Rights Reserved ' +  today.getFullYear() + ' ' + 'https://' + req.get('host'),
	    image_url: 'https://' + req.get('host') + '/assets/images/logo.png',
	});
	getCategoryOrCityArticles(feed, req.params.slug, 'category', fullUrl).then(function(){
		var xml = feed.xml();
		res.header('Content-Type', 'application/xml');
		res.send( xml );
	});
}

/* Get RSS feed for Magazine*/
function getMagazineRssXml(req, res){
	let fullUrl = 'https://' + req.get('host');
	let currentUrl = fullUrl + req.url;
	var today = new Date();
	var slug = req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1);
	let feed = new RSS({
	    title: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    custom_namespaces: {
	      'sy': 'http://purl.org/rss/1.0/modules/syndication/',
	      'wfw': 'http://wellformedweb.org/CommentAPI/',
	      'slash': 'http://purl.org/rss/1.0/modules/slash/'
	    }, 
	    custom_elements: [
	     	{'atom:link': 
			    { _attr: 
			    	{'type':"application/rss+xml",'rel':"self",'href': currentUrl}, 
			    }
			},
		    {'sy:updatePeriod': 'hourly'},
		    {'sy:updateFrequency': 1},
	    ],
	    language: 'en-US',
	    description: slug.replace('-',' ') + " News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    site_url: 'https://' + req.get('host'),
	    docs: 'https://' + req.get('host'),
	    copyright: '© All Rights Reserved ' +  today.getFullYear() + ' ' + 'https://' + req.get('host'),
	    image_url: 'https://' + req.get('host') + '/assets/images/logo.png',
	});
	getMagazineArticles(feed, req.params.slug, fullUrl).then(function(){
		var xml = feed.xml({indent: true});
		res.header('Content-Type', 'application/xml');
		res.send( xml );
	});
}

/* Get RSS feed for Magazine*/
function getTopStoriesRssXml(req, res){
	let fullUrl = 'https://' + req.get('host');
	let currentUrl = fullUrl + req.url;
	var today = new Date();
	let feed = new RSS({
	    title: "Top Stories News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    custom_namespaces: {
	      'sy': 'http://purl.org/rss/1.0/modules/syndication/',
	      'wfw': 'http://wellformedweb.org/CommentAPI/',
	      'slash': 'http://purl.org/rss/1.0/modules/slash/'
	    }, 
	    custom_elements: [
	    	{'atom:link': 
			    { _attr: 
			    	{'type':"application/rss+xml",'rel':"self",'href': currentUrl}, 
			    }
			},
		    {'sy:updatePeriod': 'hourly'},
		    {'sy:updateFrequency': 1},
	    ],
	    language: 'en-US',
	    description: "Top Stories News - Gujarat Samachar : World's Leading Gujarati Newspaper",
	    site_url: 'https://' + req.get('host'),
	    docs: 'https://' + req.get('host'),
	    copyright: '© All Rights Reserved ' +  today.getFullYear() + ' ' + 'https://' + req.get('host'),
	    image_url: 'https://' + req.get('host') + '/assets/images/logo.png',
	});
	getTopStoryArticles(feed, fullUrl).then(function(){
		var xml = feed.xml();
		res.header('Content-Type', 'application/xml');
		res.send( xml );
	});
}

/* Get articles for Category/City list page.*/
function getCategoryOrCityArticles(feed, slug, pageType, baseUrl){
	let deferred = Q.defer();
	let collectionName = 'Articles';
    let categoryId;
    let cityId;
	let findQuery = {isActive:true,
        publishScheduleTime: {
            $lte: new Date()
        }};
	let findCityOrCategoryQuery = {isActive:true};
    let cityOrCategorycollectionName;
    if (pageType == 'category')
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.categories;
    if (pageType == 'city')
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.cities;

    findCityOrCategoryQuery['slug'] = slug;

	var db = mongoClient.getDb();
	let returnFields = { 
		_id:1, 
		articleUrl:1, 
		heading:1, 
		description: 1,
		publishScheduleTime: 1,
		content: 1,
		articleImage: 1
	};
	var sortQuery = { publishScheduleTime: -1 };
    commonService.getDocuments(cityOrCategorycollectionName, findCityOrCategoryQuery).then(function(cityOrCategoryObj) {
        if (cityOrCategoryObj && cityOrCategoryObj.response && cityOrCategoryObj.response.length > 0) {
            if (pageType == 'category') {
                categoryId = cityOrCategoryObj.response[0]._id;
                findQuery['categories'] = cityOrCategoryObj.response[0]._id;
            }
            if (pageType == 'city') {
                cityId = cityOrCategoryObj.response[0]._id;
                findQuery['city'] = cityOrCategoryObj.response[0]._id;
            }
        }
		db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).limit(parseInt(20)).toArray(function (err, documents) {
			if (err) console.log(err);
			if (documents !== undefined && documents.length > 0) {
				documents.forEach(function(doc){
					feed.item({
						title:  doc.heading,
						guid: doc.articleUrl,
   						description: doc.content,
						url: baseUrl + '/news/'+slug+'/'+doc.articleUrl,
    					date: moment(doc.publishScheduleTime).utc(),
    					enclosure: {
						  'url'  : 'http://dlfbv97u99p9c.cloudfront.net/static/articles/articles_thumbs/' + doc.articleImage,
						}
					});
				});
			}
			deferred.resolve(true);
		});
    }).catch(function(err) {
        console.log(err)
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
	return deferred.promise;
}

/* Get articles for magazine list page.*/
function getMagazineArticles(feed, slug, baseUrl){
	let deferred = Q.defer();
	let collectionName = 'Articles';
	let findQuery = {isActive:true,
        publishScheduleTime: {
            $lte: new Date()
        }};
	let findMagazineQuery = {};
    findMagazineQuery['slug'] = slug;
	var db = mongoClient.getDb();
	let returnFields = { 
		_id:1, 
		articleUrl:1, 
		heading:1, 
		description: 1,
		publishScheduleTime: 1,
		content: 1,
		articleImage: 1
	};
	var sortQuery = { publishScheduleTime: -1 };
    commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, findMagazineQuery).then(function(magazineObj) {
        if (magazineObj && magazineObj.response && magazineObj.response.length > 0) {
            findQuery['magazine'] = magazineObj.response[0]._id;
        }
		db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).limit(parseInt(500)).toArray(function (err, documents) {
			if (err) console.log(err);
			if (documents !== undefined && documents.length > 0) {
				documents.forEach(function(doc){
					feed.item({
						title:  doc.heading,
						guid: doc.articleUrl,
   						description: doc.content,
						url: baseUrl + '/news/'+slug+'/'+doc.articleUrl,
    					date: moment(doc.publishScheduleTime).utc(), 
    					enclosure: {
						  'url'  : 'http://dlfbv97u99p9c.cloudfront.net/static/articles/articles_thumbs/' + doc.articleImage,
						}
					});
				});
			}
			deferred.resolve(true);
		});
    }).catch(function(err) {
        console.log(err)
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
	return deferred.promise;
}

/* Get articles for Top story list page.*/
function getTopStoryArticles(feed,baseUrl){
	let deferred = Q.defer();
	let categories = [];
    let magazines = [];
    var db = mongoClient.getDb();
    var sectionFlagObjId = commonService.convertIntoObjectId('5993f2835b03ab694185ad25');
    var findQuery = {
        sectionFlag: sectionFlagObjId,
        isActive: true,
        publishScheduleTime: {
            $lte: new Date()
        }
    };
    var returnFields = {
        _id:1, 
		articleUrl:1, 
		heading:1, 
		description: 1,
		publishScheduleTime: 1,
		magazine: 1,
        categories: 1,
		content: 1,
		articleImage: 1
    };
    var collectionName = "Articles";
    var sortQuery = { publishScheduleTime: -1 };
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
		    db.collection(collectionName).find(findQuery, returnFields).sort(sortQuery).limit(parseInt(20)).toArray(function (err, documents) {
		        if (err) console.log(err);
		        documents = commonService.getCategorySlug(documents, categories);
                documents = commonService.getMagazineSlug(documents, magazines);
		        documents.forEach(function(doc){
		        	let slug;
		        	if(doc.categorySlug == 'magazines'){
		        		slug = doc.magazineSlug;
		        	}else{
		        		slug = doc.categorySlug;
		        	}
					feed.item({
						title:  doc.heading,
						guid: doc.articleUrl,
						description: doc.content,
						url: baseUrl + '/news/' + slug + '/' + doc.articleUrl,
						date: moment(doc.publishScheduleTime).utc(),
						enclosure: {
						  'url'  : 'http://dlfbv97u99p9c.cloudfront.net/static/articles/articles_thumbs/' + doc.articleImage,
						}
					});
				});
				deferred.resolve(true);
		    });
    	}).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
	    });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
    return deferred.promise;
}