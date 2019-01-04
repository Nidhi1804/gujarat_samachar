const MongoClient   = require( 'mongodb' ).MongoClient;
const mysql         = require('mysql');
const Q             = require('q');
const passwordHash  = require('password-hash');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');
const IMAGE_BASE_URL = 'https://dlfbv97u99p9c.cloudfront.net/static/';
var commonService = require('./services/shared/common.service');

async function migrationScript() {
	console.log('Migrating data from Gujrat Samachar MySQL database to its MongoDB' + '\n');
	let mongoDBConnection = await getMongoDBConnection();
	console.log('MongoDB connected successfully.' + '\n');
	let result = await changeArticleContentImagePath(mongoDBConnection);
	if(!result) {
		console.log('ERROR: articles => Articles');
		process.exit(1);
	}
	process.exit(0);
}

async function changeArticleContentImagePath(mongoDBConnection){
	var deferred = Q.defer();
	// let findQuery = {content: { $regex: 'https://gujaratsamachar.com/' }}
	let findQuery = {$or : [{content: { $regex: 'https://gujaratsamachar.com/' }}, {content: { $regex: 'https://www.gujaratsamachar.com/' }},{content: { $regex: 'http://gujaratsamachar.com/' }},{content: { $regex: 'http://www.gujaratsamachar.com/' }},{content: { $regex: 'http://dlfbv97u99p9c.cloudfront.net/static/' }} ] };
	mongoDBConnection.collection('Articles').find(findQuery).toArray(function(err, documents) {
		if (err) deferred.reject(err);
        console.log("************************************************",documents.length);
		if (documents !== undefined && documents.length > 0) {
			let articles = documents;
			async.forEachLimit(articles, 1, function(article, callback) {
                let findQuery = { articleUrl:article.articleUrl };
				let articleContent = article.content;
				if(articleContent.search('https://gujaratsamachar.com/') > -1)
					article.content = articleContent.replace('https://gujaratsamachar.com/',  appConfig.IMG_URL);
				else if(articleContent.search('https://www.gujaratsamachar.com/') > -1)
					article.content = articleContent.replace('https://www.gujaratsamachar.com/',  appConfig.IMG_URL);
				else if(articleContent.search('http://gujaratsamachar.com/') > -1)
					article.content = articleContent.replace('http://gujaratsamachar.com/',  appConfig.IMG_URL);
				else if(articleContent.search('http://www.gujaratsamachar.com/') > -1)
					article.content = articleContent.replace('http://www.gujaratsamachar.com/',  appConfig.IMG_URL);
				else if(articleContent.search('http://dlfbv97u99p9c.cloudfront.net/static/') > -1)
					article.content = articleContent.replace('http://dlfbv97u99p9c.cloudfront.net/static/',  appConfig.IMG_URL);
                
               console.log("---------------------------------------------",article.articleUrl);
				mongoDBConnection.collection('Articles').update(findQuery, { $set: { content: article.content } }, { safe: true, upsert: false}, function(err, updatedDoc) {
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
