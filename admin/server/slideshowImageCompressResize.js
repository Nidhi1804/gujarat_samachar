const MongoClient   = require( 'mongodb' ).MongoClient;
const Q             = require('q');
const fs            = require('fs-extra');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');
var fileManager = require('easy-file-manager');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY
});

const Sharp = require('sharp');
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
	try {
		const documents = await mongoDBConnection.collection('GalleryImage').find().toArray(); 
		let slideShowImages = documents;
		console.log(documents.length + ' Document Found!');
		const fileManagerArr = [];
		for (const slideshow of slideShowImages) {
			if(slideshow.image){
				let storePath = './static/slide_show/' + slideshow.image;
		        
				if (fs.existsSync(storePath)) {
					let path = slideshow.image;
			        let imageName = path.split('.')[0];
			        let extension = path.split('.')[1];
			        let base64DataOriginal;
			        let base64DataThumbnail;
			        let fileName;
			        
				    if(extension != 'svg+xml') {
			            const options = {
			                'quality': 30,
			                'chromaSubsampling': '4:4:4',
			                'progressive': true,
			                'force': true
			            };

			            extension = 'jpeg';
			            fileName = imageName + '.' + extension;
			            options.quality = 50;
			            base64DataOriginal = await Sharp(storePath).resize(750, 500).jpeg(options).toBuffer();
						base64DataThumbnail = await Sharp(storePath).resize(245, 145).jpeg(options).toBuffer();
					} else {
		    			fileName = imageName + '.' + extension;
		    			base64DataOriginal = await Sharp(storePath).resize(750, 500).toBuffer();
						base64DataThumbnail = await Sharp(storePath).resize(245, 145).toBuffer();
		    		}

		    		const fileManagerObj = {
		    			path: '/static/slide_show', 
                        fileName: fileName,
	                    image: base64DataOriginal,
	                    s3Path: 'static/slide_show/' + fileName,
	                    ext: extension
	                }
	                fileManagerArr.push(fileManagerObj);
	                const fileManagerThumbObj = {
	                	path: '/static/slide_show/thumbnails', 
                        fileName: fileName,
	                    image: base64DataThumbnail,
	                    s3Path: 'static/slide_show/thumbnails/'+ fileName,
	                    ext: extension
	                }
	                fileManagerArr.push(fileManagerThumbObj);

					let findQuery = {image: slideshow.image};
			        const updateSlideShow = await mongoDBConnection.collection('GalleryImage').update(findQuery, { $set: { image: fileName } }, { safe: true, upsert: false});
				}else{
					console.log('no image found!');
				}
			}
	    }
	    if(fileManagerArr.length > 0){
	    	const result = await Promise.all(fileManagerArr.map(val => uploadImageFileManager(val)));
	    	let tmpArr = fileManagerArr.map(val => {
		        return{
		             Bucket: 'gsstatic',
		             Key: val.s3Path,
		             Body: val.image,
		             ACL: 'public-read',
		             ContentType: 'image/' + val.ext
		            }
		        });
		    const s3Result = await Promise.all(tmpArr.map(val => uploadImageBucket(val)));
	    	console.log(s3Result);
	    }
	} catch(err) {
    	throw err;
    }
}

async function uploadImageFileManager(params) {
    return new Promise((resolve, reject) => {
         fileManager.upload(params.path, params.fileName, params.image,function() {
            resolve(true)
         })
    })
}

async function uploadImageBucket(params) {
    return new Promise((resolve,reject) => {
        s3.upload(params, function(err, data) {
            resolve(data);
        });
    });
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
