var express = require('express');
var cache = require('express-redis-cache')();
var router = express.Router();
var commonService = require('../services/shared/common.service');
var getArticlesService = require('../services/getArticles.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middleware');
var async = require('async');
var mongoClient = require('../mongoClient');
var moment = require('moment');
var getSectionsService = require('../services/getSections.service');

router.get('/meta-tag/list', cache.route({ expire: 5000 }), getMetaTagList);
router.get('/stories/:sectionId', function (req, res, next) {
    res.express_redis_cache_name = 'article_by_section-' + req.params.sectionId;
    next();
    },cache.route({ expire: 120 }), getStoriesBySection);
router.get('/section-flags',cache.route({ expire: 120 }), getSectionFlags);
router.get('/stories', cache.route({ expire: 120 }), getStories);
router.get('/article-details/:categorySlug/:articleUrl', function (req, res, next) {
    res.express_redis_cache_name = 'article-detail-' + req.params.articleUrl;
    cache.get('article-detail-'+req.params.articleUrl, function (error, entries) {
        if(entries.length > 0){  
            if(JSON.parse(entries[0].body).data.Id){
               cache.del('article-detail-' + req.params.articleUrl, function(err,num){
                    console.log('clear cache due to API change',num);
               }); 
            }
            if(JSON.parse(entries[0].body).code == 404 || JSON.parse(entries[0].body).code == 500){
                cache.del('article-detail-' + req.params.articleUrl, function(err,num){
                    console.log('clear cache due to 404 error',num);
                });
            }
        }
    });
    next();
    }, cache.route(), getArticleDetails);
router.get('/article-list', cache.route({ expire: 120 }), getArticleList);
router.get('/article-category/:slug',cache.route({ expire: 120 }), getCategoryName);
router.get('/recent-post', getRecentPost);
router.get('/magazine/:slug',cache.route({ expire: 120 }), getMagazineList);
router.get('/articles-by-category', getArticlesByCategory);
router.get('/get-documents/:collectionName', getCollectionDocuments);
router.get('/get-documents/:collectionName/:docId', getDocumentById);
router.get('/get-city/:collectionName/:slug',cache.route({ expire: 120 }), getCityInfoBySlug);
router.get('/slide-show',cache.route({ expire: 120 }), getSlideShowList);
router.get('/magazine-name/:slug',cache.route({ expire: 120 }), getMagazineName)
router.get('/slide-show-details/:url/:Id',cache.route({ expire: 120 }), getSlideShowDetails);
router.get('/breaking-news', getBreakingNews);
router.get('/top-read-news/:sectionId',cache.route({ expire: 120 }), getAllNews);
router.get('/top-head-news/:sectionId',cache.route({ expire: 120 }), getAllNews);
router.get('/all-recent-news/:sectionId',cache.route({ expire: 120 }), getAllNews);
router.get('/article-search/:searchTag', findArticleByMetaTag);
router.get('/top-stories',cache.route({ expire: 120 }), getTopstories);
router.get('/getBaseUrl', getBaseUrl);
router.get('/clearCache', clearCache);
router.get('/articles-by-section',cache.route({ expire: 120 }), getArticlesBySection);
function clearCache(req,res){
    let cacheUrl;
    console.log('************ get request to clear cache **************',req.query.apiName);
    if(req.query.apiName){
       cacheUrl = req.query.apiName;
    }
    cache.del(cacheUrl, function(err,num){
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Cache clear successfully!', num);
        res.json(apiSuccessResponse);
    });
}

function getStoriesBySection1(req, res) {
    let document = {};
    if (req.params.sectionId) {
        var sectionFlagObjId = commonService.convertIntoObjectId(req.params.sectionId);
    }
    var findQuery = {
        sectionFlag: sectionFlagObjId,
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    var configOf = req.query.type;
    document['isMobile'] = req.query.isMobile;

    getArticlesService.getConfig(configOf).then(function(slideLimit) {
        document['slideLimit'] = slideLimit;
        getArticlesService.articleBySectionFlag(findQuery, document).then(function(resObj) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
            res.json(apiSuccessResponse);
        }).catch(function(err) {
            console.log(err);
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse);
        });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse);
    });
}

function getStoriesBySection(req, res) {
    let categories = [];
    let magazines = [];
    if (req.params.sectionId) {
        var sectionFlagObjId = commonService.convertIntoObjectId(req.params.sectionId);
    }
    var findQuery = {
        sectionFlag: sectionFlagObjId,
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        articleId: 1,
        magazine: 1,
        categories: 1,
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    var configOf = req.query.type
    var collectionName = "Articles";
    var sortQuery = { publishScheduleTime: -1 };

    getArticlesService.getConfig(configOf).then(function(slideLimit) {
        /* 
         * Get Categories  Get categorySlug by comparing article category ID
         * We will append last level category slug of article with an article url
         * So, Article url will be like : http:// gujaratsamachar.com/news/categorySlug/articleUrl/articleId(autoincid)
         */
        commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
            categories = categoriesObj.response;
            commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
                magazines = magazinesObj.response;
                //console.log('magazines',magazines);
                commonService.getDocuments(collectionName, findQuery, sortQuery, slideLimit, returnFields).then(function(resObj) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
                    res.json(apiSuccessResponse).end();
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
}

function getSectionFlags(req, res) {
    var collectionName = "SectionFlags";
    var findQuery = {};
    var sortQuery = { _id: 1 };
    commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Section flags found.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getStories(req, res) {
    var collectionName = "Articles";
    let findCityOrCategoryQuery = { isActive: true }
    var findQuery = {
        isActive: true,
        sectionFlag: "",
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    if (req.query.categoryId)
        findCityOrCategoryQuery['_id'] = commonService.convertIntoObjectId(req.query.categoryId);

    if (req.query.cityId)
        findCityOrCategoryQuery['_id'] = commonService.convertIntoObjectId(req.query.cityId);

    if(req.query.skipArticleUrl){
        findQuery['articleUrl'] = { $ne: req.query.skipArticleUrl }
    }
    var sortQuery = { _id: -1 };
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        "metaTag.name": 1,
        articleId: 1,
        categories: 1,
        magazine: 1,
        sectionFlag: 1
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    var storyLimit = 10
    let cityOrCategorycollectionName;

    if (req.query.categoryId)
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.categories;
    if (req.query.cityId)
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.cities;

    /*
     * Get CityID or ctaegoryID based on Id according to req.query.categoryId or req.query.cityId
     * Get category info if 'req.query.categoryId' field found else get city info if 'req.query.cityId' found.
     */
    commonService.getDocuments(cityOrCategorycollectionName, findCityOrCategoryQuery).then(function(cityOrCategoryObj) {
        var categories = [];
        if (cityOrCategoryObj && cityOrCategoryObj.response && cityOrCategoryObj.response.length > 0) {
            if (req.query.categoryId) {
                categoryId = cityOrCategoryObj.response[0]._id;
                findQuery['categories'] = commonService.convertIntoObjectId(req.query.categoryId);
                findQuery['$or'] =  [{city : { $exists: false }}, {city:  ""}];
            }
            if (req.query.cityId) {
                cityId = cityOrCategoryObj.response[0]._id;
                findQuery['city'] = cityOrCategoryObj.response[0]._id;
            }
        }
        commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
            categories = categoriesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, storyLimit, returnFields).then(function(resObj) {
                resObj.response = commonService.getCategorySlug(resObj.response, categories);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
                res.json(apiSuccessResponse);
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
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getStories1(req, res) {
    let document = {};
    let storyLimit = 10
    if (req.params.sectionId) {
        var sectionFlagObjId = commonService.convertIntoObjectId(req.params.sectionId);
    }
    var findQuery = {
        sectionFlag: "",
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    if (req.query.categoryId)
        findQuery['categories'] = commonService.convertIntoObjectId(req.query.categoryId);

    if (req.query.cityId)
        findQuery['city'] = commonService.convertIntoObjectId(req.query.cityId);

    if(req.query.skipArticleUrl){
        findQuery['articleUrl'] = { $ne: req.query.skipArticleUrl }
    }
    var configOf = req.query.type;
    document['isMobile'] = req.query.isMobile;
    document['storyLimit'] = storyLimit;
    getArticlesService.articleByCityCategory(findQuery, document).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
        res.json(apiSuccessResponse);
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse);
    });
}

function getArticleDetails(req, res) {
    var collectionName = "Articles";
    var findQuery = { 
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
     };
    if (req.params.articleId) {
        findQuery['articleId'] = parseInt(req.params.articleId);
    }
    if (req.params.articleUrl) {
        findQuery['articleUrl'] = req.params.articleUrl;
    }
    var sortQuery = { _id: -1 };
    var returnFields = {
        heading: 1,
        articleImage: 1,
        content: 1,
        description: 1,
        content: 1,
        publishScheduleTime: 1,
        createdAt: 1,
        metaTag: 1,
        metaKeywords: 1,
        categories: 1,
        subHeadingOne: 1,
        subHeadingTwo: 1,
        metaTitle: 1,
        metaDescriptions: 1,
        articleId: 1,
        _id: 1,
        articleUrl: 1
    }
    var pageSize = 0;

    let findCategoryQuery = {}
    if (req.params.categorySlug) {
        findCategoryQuery['slug'] = req.params.categorySlug;
        //findCategoryQuery['isActive'] = true;
    }
    /* Check if category exist or not */
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, findCategoryQuery).then(function(categoryObj) {
        if (categoryObj && categoryObj.response && categoryObj.response.length == 0) {
            /* If article is not from category than check if magazine exist or not */
            delete findCategoryQuery['isActive'];
            commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, findCategoryQuery).then(function(magazineObj) {
                if (magazineObj && magazineObj.response && magazineObj.response.length == 0) {
                    /* If article and category not found */
                    var cityArray = ['bhuj','north-gujarat','rajkot','ahmedabad','bhavnagar','kheda-anand','baroda','surat','gandhinagar','mumbai'];
                    if(cityArray.includes(req.params.categorySlug) == true){
                        commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields).then(function(resObj) {                
                            if (resObj.response && resObj.response.length > 0){
                                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {article:resObj.response});
                            }else{
                                var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page not fund", []);
                            }
                            res.json(apiSuccessResponse).end();
                        }).catch(function(err) {
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end(); 
                        });
                    }else{
                        var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page nott fund", []);
                        res.json(apiSuccessResponse).end();
                    }
                } else {
                    commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields).then(function(resObj) {
                        if (resObj.response && resObj.response.length > 0)
                            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {article:resObj.response,
                        slug:magazineObj.response[0].slug});
                        else
                            var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page nottt fund", []);
                        res.json(apiSuccessResponse).end();
                    }).catch(function(err) {
                        var apiFailureResponse = apiResponse.setFailureResponse(err);
                        res.json(apiFailureResponse).end();
                    });
                }
            })
        } else {
            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields).then(function(resObj) {                
                if (resObj.response && resObj.response.length > 0){
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {article:resObj.response,
                        slug:categoryObj.response[0].slug});
                }else{
                    var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page not fund", []);
                }
                res.json(apiSuccessResponse).end();
            }).catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end(); 
            });
        }
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getArticleList(req, res) {
    let categoryId;
    let cityId;
    let articleListType;
    let categories = [];
    let magazines = [];
    if (req.query.listType)
        articleListType = req.query.listType;
    var collectionName = 'Articles';
    var findQuery = {
        isActive: true,
    };
    let topStoryId = commonService.convertIntoObjectId("5993f2835b03ab694185ad25");
    let topSubStoryId = commonService.convertIntoObjectId("5993f2915b03ab694185ad32");

    if(req.query.isMobile != 'true'){
        findQuery['sectionFlag'] = { $in: ["",topStoryId,topSubStoryId] };
    }

    if(req.query.skipArticleUrl){
        findQuery['articleUrl'] = { $ne: req.query.skipArticleUrl }
    }

    if (req.query.publishDate) {
        findQuery['publishScheduleTime'] = {
            $gte: new Date(moment(req.query.publishDate).startOf('day')),
            $lte: new Date(moment(req.query.publishDate).endOf('day'))
        }
        if (req.query.metaTag) {
            findQuery['metaTag'] = { $elemMatch: { name: req.query.metaTag } }
        }
    } else {
        /* Show all record in metaTag search. Don't use date for filter */
        if (req.query.metaTag) {
            findQuery['metaTag'] = { $elemMatch: { name: req.query.metaTag } }
        } else {
            findQuery['$and'] = [];
            var obj = {
                publishScheduleTime: {
                    $gte: new Date(moment().startOf('day')),
                    $lt: new Date(moment().endOf('day'))
                }
            }
            findQuery.$and.push(obj);
        }
    }
    var pageSize = appConfig.PAGE_SIZE;
    var pageIndex;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    var sortQuery = {
        publishScheduleTime: -1
    }
    var returnFields = {
        heading: 1,
        publishScheduleTime: 1,
        articleImage: 1,
        lastModifiedAt: 1,
        articleUrl: 1,
        articleId: 1,
        _id: 1,
        categories: 1,
        magazine: 1,
        sectionFlag: 1
    }

    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }

    let findCityOrCategoryQuery = { 'isActive': true };
    if (req.query.slug)
        findCityOrCategoryQuery['slug'] = req.query.slug;

    /*
     * Get CityID or ctaegoryID based on Id and slug according to req.query.listType
     * Get category info if 'req.query.listType == category' else get city info if 'req.query.listType == city'
     */

    let cityOrCategorycollectionName;
    if (articleListType == 'category')
        cityOrCategorycollectionName = appConfig.COLLECTION_NAME.categories;
    if (articleListType == 'city')
        cityOrCategorycollectionName = "Cities";
    /* Get categories to send categorySlug in API resonse to make SEO friendly article-detail page URL */
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(cityOrCategorycollectionName, findCityOrCategoryQuery).then(function(cityOrCategoryObj) {
                if (cityOrCategoryObj && cityOrCategoryObj.response && cityOrCategoryObj.response.length > 0) {
                    if (articleListType == 'category') {
                        categoryId = cityOrCategoryObj.response[0]._id;
                        findQuery['categories'] = cityOrCategoryObj.response[0]._id;
                    }
                    if (articleListType == 'city') {
                        cityId = cityOrCategoryObj.response[0]._id;
                        findQuery['city'] = cityOrCategoryObj.response[0]._id;
                    }
                } else {
                    if(!req.query.metaTag){
                        var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page not fund", []);
                        res.json(apiSuccessResponse).end();
                    }
                }

                /* If list type == 'All
                    than show all article
                  else
                    show aticles of last added article date */
                if (req.query.publishDate === undefined) {
                    if (cityOrCategoryObj && cityOrCategoryObj.response[0]) {
                        delete findQuery['$and'];
                        findQuery['publishScheduleTime'] = {
                            $lte: new Date(moment())
                        }
                    } else {
                        if (findQuery.$and === undefined) {
                            findQuery.$and = [];
                        }
                        var obj = {
                            publishScheduleTime: {
                                $lte: new Date(moment())
                            }
                        }
                        findQuery.$and.push(obj);
                    }
                }
                commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                    /* If today articles length 0, and  publishDate = 'undefined' than get aticles of last added article date*/
                    if (resObj.response.length === 0 && req.query.publishDate === undefined) {
                        var maxDocQuery = {
                            isActive: true,
                            publishScheduleTime: {
                                $lte: new Date(moment())
                            },
                            sectionFlag: ""
                        }
                        if (categoryId) {
                            maxDocQuery['categories'] = categoryId;
                        }
                        if (cityId) {
                            maxDocQuery['city'] = cityId;
                        }
                        if (req.query.metaTag) {
                            maxDocQuery['metaTag'] = { $elemMatch: { name: req.query.metaTag } }
                        }
                        commonService.getDocuments(collectionName, maxDocQuery, sortQuery, 1, returnFields).then(function(documents) {
                            if (documents.response.length > 0) {
                                var finalQuery = {
                                    isActive: true,
                                    sectionFlag: ""
                                };
                                if (categoryId) {
                                    finalQuery['categories'] = categoryId;
                                }
                                if (cityId) {
                                    finalQuery['city'] = cityId;
                                }
                                if (req.query.metaTag) {
                                    finalQuery['metaTag'] = { $elemMatch: { name: req.query.metaTag } }
                                } else {
                                    /* Show all record in metaTag search. Don't use date for filter */
                                    if (documents.response !== undefined && documents.response.length > 0) {
                                        var publishScheduleTime = documents.response[0].publishScheduleTime;
                                        finalQuery['publishScheduleTime'] = {
                                            $gte: new Date(moment(publishScheduleTime).startOf('day')),
                                            $lt: new Date(moment(publishScheduleTime).endOf('day'))
                                        }
                                    }
                                }
                                commonService.getDocuments(collectionName, finalQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(finalDoc) {
                                    commonService.getCount(collectionName, finalQuery).then(function(totalCount) {
                                        finalDoc.response = commonService.getCategorySlug(finalDoc.response, categories);
                                        finalDoc.response = commonService.getMagazineSlug(finalDoc.response, magazines);
                                        var apiSuccessResponse = apiResponse.setSuccessResponse(200, finalDoc.message, {
                                            totalCount: totalCount,
                                            articles: finalDoc.response,
                                            articlePerPage: pageSize
                                        });
                                        res.json(apiSuccessResponse).end();
                                    }).catch(function(err) {
                                        console.log(err)
                                        var apiFailureResponse = apiResponse.setFailureResponse(err);
                                        res.json(apiFailureResponse).end();
                                    })
                                }).catch(function(err) {
                                    console.log(err)
                                    var apiFailureResponse = apiResponse.setFailureResponse(err);
                                    res.json(apiFailureResponse).end();
                                })
                            } else {
                                documents.response = commonService.getCategorySlug(documents.response, categories);
                                documents.response = commonService.getMagazineSlug(documents.response, magazines);
                                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                    totalCount: 0,
                                    articles: documents.response,
                                    articlePerPage: pageSize
                                });
                                res.json(apiSuccessResponse).end();
                            }
                        }).catch(function(err) {
                            console.log(err)
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end();
                        })
                    } else {
                        commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                            // Get varegorySlug
                            resObj.response = commonService.getCategorySlug(resObj.response, categories);
                            resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                totalCount: totalCount,
                                articles: resObj.response,
                                articlePerPage: pageSize
                            });
                            res.json(apiSuccessResponse).end();
                        }).catch(function(err) {
                            console.log(err)
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end();
                        })
                    }

                }).catch(function(err) {
                    console.log(err)
                    var apiFailureResponse = apiResponse.setFailureResponse(err);
                    res.json(apiFailureResponse).end();
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
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getCategoryName(req, res) {
    var collectionName = "Categories";
    var findQuery = {
        slug: req.params.slug
    };
    var sortQuery = { _id: 1 };
    commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
        if (resObj.response.length > 0)
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Category found.", resObj.response);
        else
            var apiSuccessResponse = apiResponse.setSuccessResponse(404, resObj.message, []);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getRecentPost(req, res) {
    let categories = [];
    let magazines = [];
    var collectionName = 'Articles';
    var findQuery = {
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }

    };
    var sortQuery = {
        publishScheduleTime: -1
    }
    var pageIndex;
    var pageSize = appConfig.PAGE_SIZE;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    var returnFields = {
        heading: 1,
        articleImage: 1,
        articleUrl: 1,
        articleId: 1,
        magazine: 1,
        categories: 1,
        _id: 1
    }
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Get Recent Posts.", {
                            totalCount: totalCount,
                            articles: resObj.response,
                            articlePerPage: pageSize
                    });
                    res.json(apiSuccessResponse).end();
                }).catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
                });
            }).catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
        }).catch(function(err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getMagazineList(req, res) {
    let collectionName = "Articles";
    let magazineCollectionName = "Magazines";
    let findMagazineQuery = {};
    var findQuery = {
        isActive: true,
    };
    if(req.query.isMobile != 'true'){
        findQuery['sectionFlag'] = "";
    }
    if (req.params.slug) {
        findMagazineQuery['slug'] = req.params.slug;
    }
    if(req.query.skipArticleUrl){
        findQuery['articleUrl'] = { $ne: req.query.skipArticleUrl }
    }
    if (req.query.publishDate) {
        var oldDate = new Date(req.query.publishDate).toISOString().split('T')[0];
        var date = new Date(req.query.publishDate);
        var newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0];

        findQuery['publishScheduleTime'] = {
            $gte: new Date(oldDate),
            $lt: new Date(newDate)
        }
    } else {
        findQuery['publishScheduleTime'] = {
            $lte: new Date(moment())
        }
    }
   //    findQuery['articleUrl'] = { $ne : req.query.excludeUrl }
    var sortQuery = { publishScheduleTime: -1 };
    var pageSize = appConfig.PAGE_SIZE;
    var pageIndex;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    var returnFields = {
        heading: 1,
        articleImage: 1,
        publishScheduleTime: 1,
        lastModifiedAt: 1,
        articleUrl: 1,
        articleId: 1,
        categories: 1,
        _id: 1,
    }
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }

    /* Get magazine info based on slug */
    commonService.getDocuments(magazineCollectionName, findMagazineQuery).then(function(magazineObj) {
        if (magazineObj && magazineObj.response && magazineObj.response.length > 0) {
            findQuery['magazine'] = magazineObj.response[0]._id;
        } else {
            var apiSuccessResponse = apiResponse.setSuccessResponse(404, "Page not fund", []);
            res.json(apiSuccessResponse).end();
        }
        commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
            commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
                    categories = categoriesObj.response;
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                        totalCount: totalCount,
                        documents: resObj.response,
                        magazinePerPage: pageSize
                    });
                    res.json(apiSuccessResponse).end();
                }).catch(function(err) {
                    console.log(err);
                    var apiFailureResponse = apiResponse.setFailureResponse(err);
                    res.json(apiFailureResponse).end();
                });
            }).catch(function(err) {
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            });
        }).catch(function(err) {
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        });
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getArticlesByCategory(req, res) {
    var articlesList = [];
    var collectionName = 'Categories';
    var nameArr = ['Gujarat', 'National', 'International', 'Business', 'Astro', 'NRI News', 'Sports', 'Entertainment'];
    var findQuery = {
        isActive: true
    };
    var sortQuery = { _id: 1 };
    var pageIndex = 0;
    var pageSize = 0;
    commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, {}, pageIndex).then(function(resObj) {
        if (resObj.response.length > 0) {
            async.forEachLimit(resObj.response, 1, function(result, callback) {
                try {
                    if (nameArr.indexOf(result.name) > -1) {
                        var articleCollection = 'Articles';
                        var articleObjId = commonService.convertIntoObjectId(result._id);
                        var articleFindQuery = {
                            categories: articleObjId,
                            isActive: true,
                            publishScheduleTime: {
                                $lte: new Date(moment())
                            }
                        };
                        var articleSortQuery = { publishScheduleTime: -1 };
                        var pageIndex = 0;
                        var pageSize = appConfig.PAGE_SIZE;
                        var returnFields = {
                            heading: 1,
                            description: 1,
                            articleImage: 1,
                            articleUrl: 1,
                            articleId: 1,
                            _id: 1
                        }
                        if(req.query.isMobile == 'true'){
                            returnFields['content'] = 1;
                            returnFields['subHeadingOne'] = 1;
                            returnFields['subHeadingTwo'] = 1;
                            returnFields['metaTag'] = 1;
                            returnFields['createdAt'] = 1;
                            returnFields['metaKeywords'] = 1;
                            returnFields['metaKeywords'] = 1;
                        }
                        commonService.getDocuments(articleCollection, articleFindQuery, articleSortQuery, pageSize, returnFields, pageIndex).then(function(articles) {
                            var articleObj = {};
                            articleObj[result.name] = articles.response;
                            articlesList.push(articleObj);
                            callback();
                        }).catch(function(err) {
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end();
                        });
                    } else {
                        callback();
                    }
                } catch (e) {
                    return callback(e);
                }
            }, function(err) {
                if (err) console.error(err);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Category Articles', articlesList);
                res.json(apiSuccessResponse).end();
            });
        } else {

        }
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getCollectionDocuments(req, res) {
    var collectionName;
    let returnFields = {};
    if (req.params.collectionName) {
        collectionName = req.params.collectionName
    }
    if(collectionName == "Cities") {
        returnFields._id = 1;
        returnFields.Id = 1;
        returnFields.name = 1;
        returnFields.slug = 1;
        returnFields.position = 1;
    }
    var findQuery = {};
    var sortQuery = {};
    if (collectionName === appConfig.COLLECTION_NAME.articles) {
        sortQuery = { "publishScheduleTime": -1 };
    } else {
        if (req.query.sortBy)
            sortQuery[req.query.sortBy] = 1;
        else
            sortQuery = { lastModifiedAt: -1 }
    }

    var pageSize;
    if (req.query.pageSize === undefined || req.query.pageSize === null || req.query.pageSize === "") {
        pageSize = 0;
    } else {
        pageSize = appConfig.pageSize;
    }
    var pageIndex;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
        commonService.getCount(collectionName, findQuery).then(function(totalCount) {
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Documents found.", {
                totalCount: totalCount,
                documentsPerPage: pageSize,
                documents: resObj.response
            });
            res.json(apiSuccessResponse).end();
        }).catch(function(err) {
            console.log(err)
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        })
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getDocumentById(req, res) {
    var collectionName;
    var findQuery = {};
    var sortQuery = { lastModifiedAt: -1 };
    if (req.params.collectionName) {
        collectionName = req.params.collectionName
    }
    if (req.params.docId) {
        findQuery['_id'] = commonService.convertIntoObjectId(req.params.docId)
    }
    commonService.getDocuments(collectionName, findQuery).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Document Found", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getCityInfoBySlug(req, res) {
    var collectionName;
    var findQuery = {};
    var sortQuery = { lastModifiedAt: -1 };
    if (req.params.collectionName) {
        collectionName = req.params.collectionName
    }
    if (req.params.slug) {
        findQuery['slug'] = req.params.slug;
    }
    if (req.params.Id) {
        findQuery['Id'] = parseInt(req.params.Id);
    }
    commonService.getDocuments(collectionName, findQuery).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Document Found", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getSlideShowList(req, res) {
    var document = {};
    if (req.query.publishDate) {
        document['publishDate'] = req.query.publishDate;
    }
    if (req.query.location) {
        document['location'] = req.query.location;
    }
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        document['pageIndex'] = req.query.pageIndex;
    } else {
        document['pageIndex'] = 0;
    }

    getArticlesService.getSlideShowList(document).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Slide Show found.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getMagazineName(req, res) {
    var collectionName = "Magazines";
    var findQuery = {
        slug: req.params.slug
    };
    var sortQuery = { _id: 1 };
    commonService.getDocuments(collectionName, findQuery, sortQuery).then(function(resObj) {
        var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Magazine found.", resObj.response);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getSlideShowDetails(req, res) {
    var document = {};
    if (req.params.Id) {
        document['Id'] = parseInt(req.params.Id);
    }
    if (req.params.url) {
        document['url'] = req.params.url;
    }
    getArticlesService.getSlideShowDetails(document).then(function(resObj) {
        if (resObj && resObj.length > 0)
            var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Get Slide Show Details Success', resObj);
        else
            var apiSuccessResponse = apiResponse.setSuccessResponse(404, 'Page not fund', []);
        res.json(apiSuccessResponse).end();
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}

function getMetaTagList(req, res) {
    var document = {};
    if (req.query.metaTag) {
        document['metaTag'] = JSON.parse(req.query.metaTag);
    }
    if (req.query.pageIndex !== undefined && req.query.pageIndex !== "" && req.query.pageIndex !== null) {
        document['pageIndex'] = req.query.pageIndex;
    }
    if (req.query.excludeUrl !== undefined && req.query.excludeUrl !== "" && req.query.excludeUrl !== null) {
        document['excludeUrl'] = req.query.excludeUrl;
    }
    if (req.query.publishDate !== undefined && req.query.publishDate !== "" && req.query.publishDate !== null) {
        document['publishDate'] = req.query.publishDate;
    }
    if (req.query.matchFlag !== undefined && req.query.matchFlag !== "" && req.query.matchFlag !== null) {
        document['matchFlag'] = req.query.matchFlag;
    } else {
        document['matchFlag'] = false;
    }
    document['isMobile'] = req.query.isMobile;
    if (req.query.type) {
        configOf = req.query.type
        getArticlesService.getConfig(configOf).then(function(slideLimit) {
            if (slideLimit !== undefined && slideLimit !== null && slideLimit !== "") {
                document['slideLimit'] = slideLimit;
            }
            getMetaTag(document, res);
        });
    } else {
        getMetaTag(document, res);
    };
}

function getMetaTag(document, res) {
    let categories = [];
    let magazines = [];
    //let findCatQuery = {parentId: 0, isActive:true}
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            getArticlesService.getMetaTagList(document).then(function(resObj) {
                resObj.response.documents = commonService.getCategorySlug(resObj.response.documents, categories);
                resObj.response.documents = commonService.getMagazineSlug(resObj.response.documents, magazines);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, 'Get Meta tags List Success', resObj.response);
                res.json(apiSuccessResponse).end();
            }).catch(function(err) {
                console.log(err);
                var apiFailureResponse = apiResponse.setFailureResponse(err);
                res.json(apiFailureResponse).end();
            })
        }).catch(function(err) {
            console.log(err);
            var apiFailureResponse = apiResponse.setFailureResponse(err);
            res.json(apiFailureResponse).end();
        })
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    })
}

function getBreakingNews(req, res) {
    let magazines = [];
    var collectionName = "Articles";
    var findQuery = {
        isBreakingNews: true,
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
     if (req.query.publishDate) {
        findQuery['publishScheduleTime'] = {
            $gte: new Date(moment(req.query.publishDate).startOf('day')),
            $lte: new Date(moment(req.query.publishDate).endOf('day'))
        }
    }
    var sortQuery = { _id: 1,publishScheduleTime: -1 };
    var returnFields = {
        articleId: 1,
        categories: 1,
        magazine: 1,
        heading: 1,
        publishScheduleTime: 1,
        posterImage: 1,
        articleUrl: 1,
        _id: 1
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, false, returnFields).then(function(resObj) {
                resObj.response = commonService.getCategorySlug(resObj.response, categories);
                resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Breaking found.", resObj.response);
                res.json(apiSuccessResponse).end();
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
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getAllNews(req, res) {
    let categories = [];
    let magazines = [];
    if (req.params.sectionId) {
        var sectionFlagObjId = commonService.convertIntoObjectId(req.params.sectionId);
    }
    var findQuery = {
        sectionFlag: sectionFlagObjId,
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    if (req.query.publishDate) {
        findQuery['publishScheduleTime'] = {
            $gte: new Date(moment(req.query.publishDate).startOf('day')),
            $lte: new Date(moment(req.query.publishDate).endOf('day'))
        }
    }
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        publishScheduleTime: 1,
        articleId: 1,
        magazine: 1,
        categories: 1
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    var collectionName = "Articles";
    var sortQuery = { publishScheduleTime: -1 };
    var pageSize = appConfig.PAGE_SIZE;
    var pageIndex;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                        totalCount: totalCount,
                        articles: resObj.response,
                        articlePerPage: pageSize
                    });
                    res.json(apiSuccessResponse).end();
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
}

function findArticleByMetaTag (req, res){
    let categories = [];
    let magazines = [];
    var searchTag = [];
    if (req.params.searchTag) {
        searchTag.push(req.params.searchTag);
    }
    var findQuery = {
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    findQuery['metaTag'] = { $regex: searchTag, $options: 'i'};

    findQuery['metaTag'] = {
            $elemMatch: {
                $or: []
            }
        }
        var metaTag = searchTag;
        for (var index in metaTag) {
            var obj = {};
            obj.name = {$regex: metaTag[index]};
            findQuery.metaTag.$elemMatch.$or.push(obj)
        }
    var pageSize = appConfig.PAGE_SIZE;
    var pageIndex;
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
    }
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        articleId: 1,
        magazine: 1,
        categories: 1,
        publishScheduleTime: 1,
        lastModifiedAt: 1,
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    var collectionName = "Articles";
    /* 
     * Get Categories - Get categorySlug by comparing article category ID
     * We will append last level category slug of article with an article url
     * So, Article url will be like : http:// gujaratsamachar.com/news/categorySlug/articleUrl/articleId(auto-inc-id)
     */
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, {}, pageSize, returnFields, pageIndex).then(function(resObj) {
                commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message,{
                        totalCount: totalCount,
                        articles: resObj.response,
                        articlePerPage: pageSize
                    });
                    res.json(apiSuccessResponse).end();
                }).catch(function(err) {
                    console.log(err)
                    var apiFailureResponse = apiResponse.setFailureResponse(err);
                    res.json(apiFailureResponse).end();
                })
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
    }).catch(function(err) {
        console.log(err);
        var apiFailureResponse = apiResponse.setFailureResponse(err);
        res.json(apiFailureResponse).end();
    });
}

function getTopstories1(req, res) {
    let categories = [];
    let magazines = [];
    var findQuery = {};
    var sectionFlagObjId = commonService.convertIntoObjectId('5993f2835b03ab694185ad25');
    var collectionName = "Articles";
    var sortQuery = { publishScheduleTime: -1 };
    var pageIndex;
    findQuery = {
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
        var pageSize;
        if(req.query.pageIndex == 1){
            pageSize = 2;
            findQuery['sectionFlag'] = sectionFlagObjId;
        }else{
            pageSize = appConfig.PAGE_SIZE;
        }
        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    } else {
        pageIndex = 0;
        var pageSize = 2;
        findQuery['sectionFlag'] = sectionFlagObjId;
    }
    if (req.query.publishDate) {
        findQuery['publishScheduleTime'] = {
            $gte: new Date(moment(req.query.publishDate).startOf('day')),
            $lte: new Date(moment(req.query.publishDate).endOf('day'))
        }
    }
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        publishScheduleTime: 1,
        articleId: 1,
        magazine: 1,
        categories: 1
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    var topStory = [];
                    topStory = resObj.response;
                    var sectionFlagObjId = commonService.convertIntoObjectId('5993f2915b03ab694185ad32');
                    var findQuery = {};
                    var pageIndex;
                    var returnFields = {
                        _id: 1,
                        articleImage: 1,
                        heading: 1,
                        articleUrl: 1,
                        publishScheduleTime: 1,
                        articleId: 1,
                        magazine: 1,
                        categories: 1
                    };
                    if(req.query.isMobile == 'true'){
                        returnFields['content'] = 1;
                        returnFields['subHeadingOne'] = 1;
                        returnFields['subHeadingTwo'] = 1;
                        returnFields['metaTag'] = 1;
                        returnFields['createdAt'] = 1;
                        returnFields['metaKeywords'] = 1;
                        returnFields['metaKeywords'] = 1;
                    }
                    if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
                        if(req.query.pageIndex == 1){

                            var pageSize = 8;
                            findQuery = {
                                isActive: true,
                                publishScheduleTime: {
                                    $lte: new Date(moment())
                                }
                            };
                            findQuery['sectionFlag'] = sectionFlagObjId;
                            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                                resObj.response = commonService.getCategorySlug(resObj.response, categories);
                                resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                                topStory = topStory.concat(resObj.response);
                                var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                    totalCount: totalCount,
                                    articles: topStory,
                                    articlePerPage: 10
                                });
                                res.json(apiSuccessResponse).end();
                            }).catch(function(err) {
                                console.log(err);
                                var apiFailureResponse = apiResponse.setFailureResponse(err);
                                res.json(apiFailureResponse).end();
                            });
                        }else{
                            var pageSize = appConfig.PAGE_SIZE;
                            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                totalCount: totalCount,
                                articles: resObj.response,
                                articlePerPage: pageSize
                            });
                            res.json(apiSuccessResponse).end();
                        }
                        pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
                    } else {
                        var pageSize = 8;
                        findQuery = {
                            isActive: true,
                            publishScheduleTime: {
                                $lte: new Date(moment())
                            }
                        };
                        findQuery['sectionFlag'] = sectionFlagObjId;
                        commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                            resObj.response = commonService.getCategorySlug(resObj.response, categories);
                            resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                            topStory = topStory.concat(resObj.response);
                            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                totalCount: totalCount,
                                articles: topStory,
                                articlePerPage: 10
                            });
                            res.json(apiSuccessResponse).end();
                        }).catch(function(err) {
                            console.log(err);
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end();
                        });
                    }
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
}

function getTopstories(req, res) {
    let categories = [];
    let magazines = [];
    var findQuery = {};
    var sectionFlagObjId = commonService.convertIntoObjectId('5993f2835b03ab694185ad25');
    var topSubStoryId = commonService.convertIntoObjectId('5993f2915b03ab694185ad32');
    var collectionName = "Articles";
    var sortQuery = { publishScheduleTime: -1 };
    var pageIndex;
    findQuery = {
        isActive: true,
        publishScheduleTime: {
            $lte: new Date(moment())
        }
    };
    var pageSize;
    if(req.query.pageIndex == 1){
        pageSize = 2;
        findQuery['sectionFlag'] = sectionFlagObjId;
    }else{
        findQuery['sectionFlag'] = topSubStoryId;
        pageSize = appConfig.PAGE_SIZE;
    }
    pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
    
    var returnFields = {
        _id: 1,
        articleImage: 1,
        heading: 1,
        articleUrl: 1,
        publishScheduleTime: 1,
        articleId: 1,
        magazine: 1,
        categories: 1
    };
    if(req.query.isMobile == 'true'){
        returnFields['content'] = 1;
        returnFields['subHeadingOne'] = 1;
        returnFields['subHeadingTwo'] = 1;
        returnFields['metaTag'] = 1;
        returnFields['createdAt'] = 1;
        returnFields['metaKeywords'] = 1;
        returnFields['metaKeywords'] = 1;
    }
    commonService.getDocuments(appConfig.COLLECTION_NAME.categories, {}).then(function(categoriesObj) {
        categories = categoriesObj.response;
        commonService.getDocuments(appConfig.COLLECTION_NAME.magazines, {}).then(function(magazinesObj) {
            magazines = magazinesObj.response;
            commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                commonService.getCount(collectionName, findQuery).then(function(totalCount) {
                    resObj.response = commonService.getCategorySlug(resObj.response, categories);
                    resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                    if(req.query.pageIndex == 1){
                        var topStory = [];
                        topStory = resObj.response;
                        var sectionFlagObjId = commonService.convertIntoObjectId('5993f2915b03ab694185ad32');
                        var findSubStoryQuery = {};
                        var returnFields = {
                            _id: 1,
                            articleImage: 1,
                            heading: 1,
                            articleUrl: 1,
                            publishScheduleTime: 1,
                            articleId: 1,
                            magazine: 1,
                            categories: 1
                        };
                        if(req.query.isMobile == 'true'){
                            returnFields['content'] = 1;
                            returnFields['subHeadingOne'] = 1;
                            returnFields['subHeadingTwo'] = 1;
                            returnFields['metaTag'] = 1;
                            returnFields['createdAt'] = 1;
                            returnFields['metaKeywords'] = 1;
                            returnFields['metaKeywords'] = 1;
                        }
                        var pageSize = 8;
                        findSubStoryQuery = {
                            isActive: true,
                            publishScheduleTime: {
                                $lte: new Date(moment())
                            }
                        };
                        findSubStoryQuery['sectionFlag'] = sectionFlagObjId;
                        commonService.getDocuments(collectionName, findSubStoryQuery, sortQuery, pageSize, returnFields, pageIndex).then(function(resObj) {
                            resObj.response = commonService.getCategorySlug(resObj.response, categories);
                            resObj.response = commonService.getMagazineSlug(resObj.response, magazines);
                            topStory = topStory.concat(resObj.response);
                            totalCount = totalCount + resObj.response.length;
                            var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                                totalCount: totalCount,
                                articles: topStory,
                                articlePerPage: 10
                            });
                            res.json(apiSuccessResponse).end();
                        }).catch(function(err) {
                            console.log(err);
                            var apiFailureResponse = apiResponse.setFailureResponse(err);
                            res.json(apiFailureResponse).end();
                        });
                    }else{
                        var pageSize = appConfig.PAGE_SIZE;
                        var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, {
                            totalCount: totalCount,
                            articles: resObj.response,
                            articlePerPage: pageSize
                        });
                        res.json(apiSuccessResponse).end();
                    }
                    pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
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
}

function getBaseUrl(req, res) {
    res.json({baseUrl: 'https://www.gujaratsamachar.com',IMAGE_SEARCH_BASE_URL:'https://static.gujaratsamachar.com/articles/articles_thumbs/'}).end();
}

async function getArticlesBySection(req, res) {
    const findQueryForSlug = {
        slug: req.query.slug,
        isActive: true
    };

    try {
        // get section id using slug name
        const sectionResponse = await getSectionsService.getSectionBySlugName(findQueryForSlug);
        if(sectionResponse){
            const collectionName = "Articles";

            let sectionId = commonService.convertIntoObjectId(sectionResponse._id);

            const findQuery = {
                section: sectionId,
                isActive: true,
            };

            if(req.query.isMobile != 'true'){
                findQuery['sectionFlag'] = "";
            }

            if (req.query.publishDate) {
                findQuery['publishScheduleTime'] = {
                    $gte: new Date(moment(req.query.publishDate).startOf('day')),
                    $lte: new Date(moment(req.query.publishDate).endOf('day'))
                }
            } else {
                /* Show all record in metaTag search. Don't use date for filter */
                // if (req.query.metaTag) {
                //     findQuery['metaTag'] = { $elemMatch: { name: req.query.metaTag } }
                // } else {
                // findQuery['$and'] = [];
                // const obj = {
                //     publishScheduleTime: {
                //         $gte: new Date(moment().startOf('day')),
                //         $lt: new Date(moment().endOf('day'))
                //     }
                // }
                // findQuery.$and.push(obj);
                // }
            }
            let pageSize = appConfig.PAGE_SIZE;
            let pageIndex;
            if (req.query.pageIndex !== undefined && parseInt(req.query.pageIndex) != 0) {
                pageIndex = (parseInt(req.query.pageIndex) - 1) * pageSize;
            } else {
                pageIndex = 0;
            }
            const sortQuery = {
                publishScheduleTime: -1
            }
            const returnFields = {
                heading: 1,
                publishScheduleTime: 1,
                articleImage: 1,
                lastModifiedAt: 1,
                articleUrl: 1,
                articleId: 1,
                _id: 1,
                categories: 1,
                magazine: 1,
                sectionFlag: 1
            }

            if(req.query.isMobile == 'true'){
                returnFields['content'] = 1;
                returnFields['subHeadingOne'] = 1;
                returnFields['subHeadingTwo'] = 1;
                returnFields['metaTag'] = 1;
                returnFields['createdAt'] = 1;
                returnFields['metaKeywords'] = 1;
                returnFields['metaKeywords'] = 1;
            }

            try {
                // get Articles accoding to section id
                const doc = await commonService.getDocuments(collectionName, findQuery, sortQuery, pageSize, returnFields, pageIndex);
                if(doc.response){
                    try {
                        const docCount = await commonService.getCount(collectionName, findQuery);
                        const apiSuccessResponse = apiResponse.setSuccessResponse(200, doc.message, { totalCount: docCount, articles: doc.response, articlePerPage: pageSize });
                        res.json(apiSuccessResponse).end();
                    } catch (e) {
                        const apiSystemFailureResponse = apiResponse.setFailureResponse(e.toString());
                        res.json(apiSystemFailureResponse).end();
                    }
                } else {
                    const apiSystemFailureResponse = apiResponse.setFailureResponse("No record found");
                    res.json(apiSystemFailureResponse).end();
                }
            } catch (e) {
                const apiSystemFailureResponse = apiResponse.setFailureResponse(e.toString());
                res.json(apiSystemFailureResponse).end();
            }
        } else {
            const apiSystemFailureResponse = apiResponse.setFailureResponse("No record found");
            res.json(apiSystemFailureResponse).end();
        }
    } catch (e) {
        const apiSystemFailureResponse = apiResponse.setFailureResponse(e.toString());
        res.json(apiSystemFailureResponse).end();
    }
}
module.exports = router;
