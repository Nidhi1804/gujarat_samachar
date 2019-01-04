const MongoClient   = require( 'mongodb' ).MongoClient;
const Q             = require('q');
const fs            = require('fs-extra');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');

async function migrationScript() {
	console.log('Migrating data from Gujrat Samachar MySQL database to its MongoDB' + '\n');
	let mongoDBConnection = await getMongoDBConnection();
	console.log('MongoDB connected successfully.' + '\n');
	let result = await MoveSlideshowImages(mongoDBConnection);
	console.log('Slide show images are moved successfully!' + '\n');
	if(!result) {
		console.log('ERROR: articles => Articles');
		process.exit(1);
	}
	process.exit(0);
}

async function MoveSlideshowImages(mongoDBConnection){
	var deferred = Q.defer();
	let findQuery = {};
	mongoDBConnection.collection('GalleryImage').find(findQuery).toArray(function(err, documents) {
		if (err) deferred.reject(err);
        console.log("************************************************",documents.length);
		if (documents !== undefined && documents.length > 0) {
			let slideShowImages = documents;
			async.forEachLimit(slideShowImages, 1, function(slideshow, callback) {
                let oldPath = './static/' + slideshow.image;
                let path = slideshow.image.split('/');
                let imageName = path[parseInt(path.length) - 1];
				let findQuery = { image : slideshow.image };
				if(slideshow.image.includes('/photo_story_') == true)
					slideshow.image = 'photo_story_' + slideshow.mapId + '_' + imageName;
				else
					slideshow.image = imageName;
                console.log("---------------------------------------------",slideshow.image);
				mongoDBConnection.collection('GalleryImage').update(findQuery, { $set: { image: slideshow.image } }, { safe: true, upsert: false}, function(err, updatedDoc) {
					if (err) return deferred.reject(err);
					callback();
				});
			}, function (err) {
				if (err) return deferred.reject(err);;
				return deferred.resolve(true);
			});
		} else {
		    deferred.resolve({ message: "Document Not Found", response: [] });
		}
	});
	return deferred.promise;
}



function getMongoDBConnection() {
	let deferred = Q.defer();
	console.log('Db URL',appConfig.MONGO_DB_URL);
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
migrationScript();
