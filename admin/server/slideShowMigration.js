const MongoClient   = require( 'mongodb' ).MongoClient;
const mysql         = require('mysql');
const Q             = require('q');
const passwordHash  = require('password-hash');
const appConfig     = require('./appConfig');
const async         = require("async");

// credentials
const gsServerUser = 'gujsamac_harnews';
const gsServerPassword = 'OO)zAwSqG_0u';
const gsServerHost = '216.144.251.82';
const gsServerDBName = 'gujsamac_gs_news';

async function migrationScript() {
	console.log('Migrating data from Gujrat Samachar MySQL database to its MongoDB' + '\n');
	let mongoDBConnection = await getMongoDBConnection();
	console.log('MongoDB connected successfully.' + '\n');

	result = await migrateSlideShowImages(mongoDBConnection);
	if(!result) {
		console.log('ERROR: photo_article_media => GalleryImage');
		process.exit(1);
	}
	console.log('photo_article_media table data migrated into GalleryImage collection' + '\n');
	console.log('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*');
	

	result = await migrateSlideShow(mongoDBConnection);
	if(!result) {
		console.log('ERROR: photo_article => SlideShow');
		process.exit(1);
	}
	console.log('photo_article table data migrated into SlideShow collection' + '\n');
	console.log('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*');
	

	result = await migratePhotoGallery(mongoDBConnection);
	if(!result) {
		console.log('ERROR: tbl_gallery_photo_of_the_day => GalleryImage');
		process.exit(1);
	}
	console.log('tbl_gallery_photo_of_the_day table data migrated into GalleryImage collection' + '\n');
	console.log('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*');

	process.exit(0);
}

/* SLIDE SHOW IMAGE */
async function migrateSlideShowImages(mongoDBConnection) {
	const mySQLTableName = 'photo_article_media';
	const mongoDBCollectionName = 'GalleryImage';
	const sql = 'SELECT * FROM `' + mySQLTableName + '`;';
	let mainGalleryImage = await mySQLQuery(sql); // get main_categories from mysql databse
	console.log('Found ' + mainGalleryImage.length + 'Images Data in mySQL databse' + '\n');
	let galleryImage = await mapGalleryImage(mainGalleryImage);
	console.log('Mapped', galleryImage.length, 'Images Data for mongoDB' + '\n');
	let result = await importDataInMongoCollection(mongoDBConnection, mongoDBCollectionName, galleryImage);
	return result;
}

function mapGalleryImage(mainGalleryImage) {
	let deferred = Q.defer();
	let galleryImagesData = [];
	async.forEachLimit(mainGalleryImage, 1, function(imageData, callback) {
		let params = {
			sqlId: imageData.id,
			mapId: imageData.gallery_id,
			image: imageData.image
		};
		galleryImagesData.push(params);
		process.nextTick(callback);
	}, function(err) {
		if (err) return deferred.reject(err);
		return deferred.resolve(galleryImagesData);
	});
	return deferred.promise;
}

/* SLIDE SHOW */
async function migrateSlideShow(mongoDBConnection) {
	const mySQLTableName = 'photo_article';
	const mongoDBCollectionName = 'SlideShow';
	const sql = 'SELECT * FROM `' + mySQLTableName + '`;';
	let getSqlSlideShow = await mySQLQuery(sql); // getAdminUsers from mysql databse
	console.log('Found' + getSqlSlideShow.length + 'slide Show in mySQL databse' + '\n');
	let mapedSlideShow = await mapSlideShow(getSqlSlideShow);
	console.log('Mapped', mapedSlideShow.length, 'slide Show for mongoDB' + '\n');
	let slideShow = await mapImagesOfSlideShow(mapedSlideShow, mongoDBConnection);
	console.log('Mapped Images', slideShow.length, 'slide Show for mongoDB' + '\n');
	let result = await importDataInMongoCollection(mongoDBConnection, mongoDBCollectionName, slideShow);
	return result;
}

function mapSlideShow(getSlideShow) {
	let deferred = Q.defer();
	let slideShows = [];
	async.forEachLimit(getSlideShow, 1, function(slideshow, callback) {
		let slideShowParams = {
			'slideShowName' : slideshow.title,
			'categories' : [],
			'metaTitle' : slideshow.meta_title,
			'metaKeywords' : slideshow.meta_keywords,
			'metaTag' : [],
			'metaDescriptions' : slideshow.meta_description,
			'createdBy' : slideshow.created_by,
			'createdAt' : slideshow.created_date,
			'lastModifiedBy' : slideshow.modified_by,
			'lastModifiedAt' : slideshow.modified_date,
			'isActive' : (slideshow.active == 1) ? true : false,
			'publishSlideShow' : true,
			'publishScheduleTime' : slideshow.created_date,
			'slideShowImages' : [],
			'sqlId' : slideshow.id,
			'Id' : slideshow.id,
			'url' : slideshow.url
		}
		slideShows.push(slideShowParams);
		process.nextTick(callback);
		}, function(err) {
		if (err) return deferred.reject(err);
		return deferred.resolve(slideShows);
	});
	return deferred.promise;
}

function mapImagesOfSlideShow(mapedSlideShow, mongoDBConnection) {
	let deferred = Q.defer();
	const slideShowImageCollection = mongoDBConnection.collection("GalleryImage");
	let mapedSlideShowData = [];
	slideShowImageCollection.find({}).toArray(function(error, slideShowImages) {
		if(error) console.log(error);
		if(slideShowImages && slideShowImages.length > 0) {
			mapedSlideShow.forEach(function(slideShow, index) {
				slideShowImages.forEach(function(image, index){
					if(image.sqlId){
						if (image.mapId == slideShow.Id) {
							slideShow.slideShowImages.push(image._id);
						}
					}
				});
				mapedSlideShowData.push(slideShow);
			});
		}
		return deferred.resolve(mapedSlideShowData);
	})
	return deferred.promise;
}

/* PHOTO GALLERY IMAGE */
async function migratePhotoGallery(mongoDBConnection) {
	const mySQLTableName = 'tbl_gallery_photo_of_the_day';
	const mongoDBCollectionName = 'GalleryImage';
	const sql = 'SELECT * FROM `' + mySQLTableName + '`;';
	let mainPhotoGallery = await mySQLQuery(sql); // get main_categories from mysql databse
	console.log('Found ' + mainPhotoGallery.length + 'Images Data in mySQL databse' + '\n');
	let photoGalleryData = await mapPhotoGallery(mainPhotoGallery);
	console.log('Mapped', photoGalleryData.length, 'Images Data for mongoDB' + '\n');
	let result = await importDataInMongoCollection(mongoDBConnection, mongoDBCollectionName, photoGalleryData);
	return result;
}

function mapPhotoGallery(mainPhotoGallery) {
	let deferred = Q.defer();
	let photoGalleryData = [];
	async.forEachLimit(mainPhotoGallery, 1, function(gallery, callback) {
		let imageParams = {
			sqlId: gallery.id,
			title: gallery.description,
			isActive : true,
			image: 'slide_show/' + gallery.incname,
			publishDate: gallery.created_date,
			isGalleryImage: true
		};
		photoGalleryData.push(imageParams);
		process.nextTick(callback);
	}, function(err) {
		if (err) return deferred.reject(err);
		return deferred.resolve(photoGalleryData);
	});
	return deferred.promise;
}

/* Database connection and configuration functions */
function getMongoDBConnection() {
	let deferred = Q.defer();
	MongoClient.connect(appConfig.MONGO_DB_URL, function( err, db ) {
		if (err) {
			console.log('Unable to connect to MongoDB Server. Error: ' + err);
			return deferred.reject(err);
		}
		console.log('connected to database :: ' + appConfig.MONGO_DB_URL);
		return deferred.resolve(db);
	});
	return deferred.promise;
}
/* Database connection and configuration functions */


/* Database fetch and update functions */ 
function importDataInMongoCollection(mongoDBConnection, collectionName, data, queryField) {
	let deferred = Q.defer();
	const connection = mongoDBConnection.collection(collectionName);
	let counter = 0;
	async.forEachLimit(data, 1, function(result, callback) {
		let findQuery;
		if (queryField) {
			// for sub_categories table
			findQuery = { subCatSqlId: result.subCatSqlId };
		} else {
			findQuery = { sqlId: result.sqlId };
		}
		connection.update(findQuery, { $set: result }, { safe: true, upsert: true}, function(err, updatedDoc) {
			if (err) return deferred.reject(err);
			counter++;
			process.nextTick(callback);
		});
	}, function (err) {
		if (err) return deferred.reject(err);
		console.log('MongoDB no. of documents inserted/updated', counter , '\n');
		return deferred.resolve(true);
	});
	return deferred.promise;
}

function mySQLQuery(sql) {
	let deferred = Q.defer();
	let connection = mysql.createConnection({
		host: gsServerHost,
		user: gsServerUser,
		password: gsServerPassword,
		port: 3306,
		database: gsServerDBName
	});
	connection.connect();
	connection.query(sql, function (err, results, fields) {
		connection.end();
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(results);
	});
	return deferred.promise;
}
/* Database fetch and update functions */

migrationScript();