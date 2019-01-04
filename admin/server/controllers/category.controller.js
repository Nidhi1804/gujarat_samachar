var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs-extra');

var commonService = require('../services/shared/common.service');
var categoryService = require('../services/category.service');
var apiResponse = require('../apiResponse');
var validateFn = require('../validate');
var appConfig = require('../appConfig');
var middlewares = require('../middlewares');
const async = require('async');

var image = '';

var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './static/cat_icon';
        fs.ensureDir(dir, function (err) { //Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.
            if (err) console.log("Error while creating " + dir + " directory : ", err);
            cb(null, dir);
        })
    },
    filename: function (req, file, cb) {
        var n = file.originalname.lastIndexOf(".");
        fileExtension = file.originalname.substr(n);
        let uniqueId = Date.now() + parseInt(commonService.IDGenerator());
        imageName = 'cat' + '-' + uniqueId + fileExtension;
        cb(null, imageName);
    }
});
var upload = multer({ storage: imageStorage });

router.put('/categories/sort', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, sortCategories);
router.get('/categories/user/list', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSelectedCategory);
router.post('/categories', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser,upload.fields([
        { name: 'icon', maxCount: 1 }]), addCategory);
router.get('/categories', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getMainCategories);
router.get('/categories/list-info', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getCategoryListInfo);
router.get('/categories/:categoryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getMainCategoryByID);
router.put('/categories/:categoryId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser,upload.fields([
        { name: 'icon', maxCount: 1 }]), editCategory);
router.delete("/categories/:categoryId", middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, deleteCategory);
router.post('/categories/change-status', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, changeCategoryStatus);
router.get('/sub-categories/:parentCatId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSubCategories);
router.get('/categories/breadcrumb/:parentCatId', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getCategoryBreadcrumb);
router.get('/sub-categories', middlewares.sessionHandler, middlewares.ipHandler, middlewares.isActiveUser, getSubCategoriesByType);

function addCategory(req, res) {
	var document = {
		name: req.body.name,
		parentId: req.body.parentId,
		type: req.body.type
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	if (req.body.listType) {
		document['listType'] = req.body.listType;
	}
	if (req.files) {
        if(req.files.icon)
            document.icon = 'cat_icon/' + req.files.icon[0].filename;
    }
	document.isActive = true;
	categoryService.addCategory(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getMainCategories(req, res) {
	var document = {
		searchText: req.query.searchText,
		isActive: req.query.isActive,
		sort: req.query.sort,
		type: req.query.type
	}
	if (req.query.categoryIds !== undefined && req.query.categoryIds !== "" && req.query.categoryIds !== null) {
		document['categoryIds'] = req.query.categoryIds;
	}
	categoryService.getMainCategories(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getMainCategoryByID(req, res) {
	var document = {
		categoryId: req.params.categoryId
	}
	/* Document Fields Validation */
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.getMainCategoryByID(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function editCategory(req, res) {
	var document = {
		name: req.body.name,
		parentId: req.body.parentId,
		type: req.body.type
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	if (req.body.listType) {
		document['listType'] = req.body.listType;
	}
	if (req.files) {
        if(req.files.icon){
            document.icon = 'cat_icon/' + req.files.icon[0].filename;
        }
    }
	categoryService.updateCategory(req.params.categoryId, document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function deleteCategory(req, res) {
	var document = {
		'categoryId': req.params.categoryId
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.deleteCategory(req.params.categoryId).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	})
		.catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
}

function changeCategoryStatus(req, res) {
	var document = {
		'categoryId': req.body.categoryId,
		'status': req.body.status
	}
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.changeArticleStatus(document).then(function(resObj){
		categoryService.changeCategoryStatus(document).then(function (resObj) {
			var userInfo = {};
			var apiSuccessResponse = apiResponse.setSuccessResponse(200, "Category status change successfully.", resObj);
			res.json(apiSuccessResponse).end();
		}).catch(function (err) {
			var apiFailureResponse = apiResponse.setFailureResponse(err);
			res.json(apiFailureResponse).end();
		});
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getSubCategories(req, res) {
	var document = {
		parentCatId: req.params.parentCatId,
		isActive: req.query.isActive,
		sort: req.query.sort,
		type: req.query.type
	};
	var required = {
		parentCatId: req.params.parentCatId
	}
	var validation = validateFn.validate(req, res, required);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.getSubCategories(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

async function getSubCategoriesByType(req, res) {
	const document = {
		isActive: req.query.isActive,
		sort: req.query.sort,
		type: req.query.type,
	};
	try{
		const doc = await categoryService.getSubCategoriesByType(document);
		const apiSuccessResponse = apiResponse.setSuccessResponse(200, "Subcategory found", doc);
		res.json(apiSuccessResponse).end();
	} catch(err){
		const apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	}
}

function getCategoryBreadcrumb(req, res) {
	var document = {
		parentCatId: req.params.parentCatId
	};
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.getCategoryBreadcrumb(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}

function getCategoryListInfo(req, res) {
	var document = {
		categoryIdList: req.query.categoryIdList
	};
	var validation = validateFn.validate(req, res, document);
	if (!validation.success) {
		return res.json(validation).end();
	}
	categoryService.getCategoryListInfo(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}
function getSelectedCategory(req, res) {
	var document = {
		userId: req.query.userId
	};
	categoryService.getSelectedCategory(document).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, resObj.message, resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}
function sortCategories(req, res) {
	let categoryList = req.body.categoryList;
	commonService.sortDocuments(appConfig.COLLECTION_NAME.categories, categoryList).then(function (resObj) {
		var apiSuccessResponse = apiResponse.setSuccessResponse(200, "City list order changed successfully", resObj.response);
		res.json(apiSuccessResponse).end();
	}).catch(function (err) {
		var apiFailureResponse = apiResponse.setFailureResponse(err);
		res.json(apiFailureResponse).end();
	});
}
module.exports = router;