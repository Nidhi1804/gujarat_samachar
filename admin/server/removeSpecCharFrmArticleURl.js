const MongoClient   = require( 'mongodb' ).MongoClient;
const Q             = require('q');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');
var commonService = require('./services/shared/common.service');

async function migrationScript() {
	console.log('Migrating data from Gujrat Samachar MySQL database to its MongoDB' + '\n');
	let mongoDBConnection = await getMongoDBConnection();
	console.log('MongoDB connected successfully.' + '\n');
	let result = await changeArticleUrl(mongoDBConnection);
	if(!result) {
		console.log('ERROR: articles => Articles');
		process.exit(1);
	}
	process.exit(0);
}

async function changeArticleUrl(mongoDBConnection){
	var deferred = Q.defer();
	let findQuery = {articleUrl:{'$regex':'\\?','$options':'i'}}
	mongoDBConnection.collection('Articles').find(findQuery).toArray(function(err, documents) {
		if (err) deferred.reject(err);
        console.log("************************************************",documents.length);
		if (documents !== undefined && documents.length > 0) {
			let articles = documents;
			async.forEachLimit(articles, 1, function(article, callback) {
                let findQuery = { articleUrl:article.articleUrl };
				let articleUrl = article.articleUrl;
				article.articleUrl = articleUrl.replace(/[?]/g,'');
                console.log("---------------------------------------------",article.articleUrl);
				mongoDBConnection.collection('Articles').update(findQuery, { $set: { articleUrl: article.articleUrl } }, { safe: true, upsert: false}, function(err, updatedDoc) {
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
