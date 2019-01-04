const mongodb = require('mongodb');
const mongoClient = require('../mongoClient');
const commonService = require('./shared/common.service');
const appConfig = require('../appConfig');
const async = require('async');
const service = {};

service.getPhotoGalleryList = getPhotoGalleryList;
service.addPhotoGallery = addPhotoGallery;
service.getPhotoGalleryById = getPhotoGalleryById;
service.editPhotoGallery = editPhotoGallery;
service.deletePhotoGallery = deletePhotoGallery;
service.changePhotoGalleryStatus = changePhotoGalleryStatus;
module.exports = service;

async function getPhotoGalleryList(objPostReq) {
	let skipPhotoGalleries;
    try {
        // Define collection
        const section = db.collection('Sections');
        
        const pageSize = await commonService.getPageSize();
        if(pageSize) {
        	let photoGalleriesPerPage = pageSize;
        	const findQuery = {
        		'isGalleryImage': true
        	};
	        if (objPostReq.pageIndex && parseInt(objPostReq.pageIndex) > 0) {
	            skipPhotoGalleries = (objPostReq.pageIndex - 1) * photoGalleriesPerPage;
	        } else {
	            skipPhotoGalleries = 0;
	            photoGalleriesPerPage = 0;
	        }
	        
	        if (objPostReq.searchText && objPostReq.searchText !== '') {
	            findQuery['$and'] =
	                [
	                    { 'title': { '$regex': commonService.escapeRegExp(objPostReq.searchText), '$options': 'i' } },
	                ]
	        }
	  
	        const db = await mongoClient.getDb();
		    try {
		        // Define collection
		        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
		        
		        const photoGalleryTotalCount = await galleryImage.find(findQuery).count();

		        const doc = await galleryImage.find(findQuery).sort({ lastModifiedAt: -1 }).skip(parseInt(skipPhotoGalleries)).limit(parseInt(photoGalleriesPerPage)).toArray();

		        const response = {
                    'totalPhotoGalleries': photoGalleryTotalCount,
                    'photoGalleriesPerPage': photoGalleriesPerPage,
                    'photoGalleries': doc
                };
		        return response;
		    } catch(e) {
		        return {};
		    }
	    } else {
	    	return {};
	    }
    } catch(e) {
        return {};
    }	
}

async function addPhotoGallery(objPostReq) {
	const db = await mongoClient.getDb();
    try {
        // Define collection
        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
        const doc = await galleryImage.insert(objPostReq);
        return doc;
    } catch(e) {
        return {};
    }
}

async function getPhotoGalleryById(photoGalleryId) {
	const photoGalleryObjectId = commonService.convertIntoObjectId(photoGalleryId);
	const db = await mongoClient.getDb();
    try {

    	const findQuery = {
    		'_id': photoGalleryObjectId,
    		'isGalleryImage': true
    	}
        // Define collection
        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
        const doc = await galleryImage.findOne(findQuery);
        return doc;
    } catch(e) {
        return {};
    }
}

async function editPhotoGallery(objPostReq) {
	const db = await mongoClient.getDb();
    try {
        // Define collection
        const photoGalleryId = commonService.convertIntoObjectId(objPostReq.photoGalleryId);
        const updateObj = {
        	'title': objPostReq.title,
        	'description': objPostReq.description,
        	'image': objPostReq.image,
            'lastModifiedAt' : objPostReq.lastModifiedAt
        }
        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
        const doc = await galleryImage.findOneAndUpdate({ '_id': photoGalleryId }, { '$set': updateObj }, { safe: true });
        return doc;
    } catch(e) {
        return {};
    }
}

async function deletePhotoGallery(objInfo) {
    const db = await mongoClient.getDb();
    try {
        // Define collection
        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
        let tempArray = [];
        async.forEach(objInfo.photoGalleryIds, function (item, innerCallback) {
            tempArray.push(commonService.convertIntoObjectId(item));
            innerCallback();
        });

        try {
			const doc = await galleryImage.remove({ '_id': { '$in': tempArray}, 'isFromPhotoGallery': true});
			try {
				const docUpdate = await galleryImage.updateMany({ '_id': { '$in': tempArray}}, { '$set': {'isGalleryImage': false} }, { safe: true });
				return docUpdate;
			} catch(e) {
				return {};	
			}
		} catch(e){
			return {};
		}
    } catch(e) {
        return {};
    }
}

async function changePhotoGalleryStatus(objPostReq) {
	const db = await mongoClient.getDb();
    try {
        // Define collection
        const photoGalleryId = commonService.convertIntoObjectId(objPostReq.photoGalleryId);
        const updateObj = {};
        if (objPostReq.photoGalleryStatus == '1') {
	        updateObj['isActive'] = true;
	    } else {
	        updateObj['isActive'] = false;
	    }
        const galleryImage = db.collection(appConfig.COLLECTION_NAME.galleryImage);
        const doc = await galleryImage.findOneAndUpdate({ '_id': photoGalleryId }, { '$set': updateObj }, { safe: true });
        return doc;
    } catch(e) {
        return {};
    }
}