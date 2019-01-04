const MongoClient   = require( 'mongodb' ).MongoClient;
const mysql         = require('mysql');
const Q             = require('q');
const passwordHash  = require('password-hash');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');
var commonService = require('./services/shared/common.service');

// credentials
const gsServerUser = 'gujsamac_harnews';
const gsServerPassword = 'OO)zAwSqG_0u';
const gsServerHost = '216.144.251.82';
const gsServerDBName = 'gujsamac_gs_news';

async function migrationScript() {
	console.log('Migrating data from Gujrat Samachar MySQL database to its MongoDB' + '\n');
	let mongoDBConnection = await getMongoDBConnection();
	console.log('MongoDB connected successfully.' + '\n');
	let result = await migrateArticles(mongoDBConnection);
	if(!result) {
		console.log('ERROR: articles => Articles');
		process.exit(1);
	}
	process.exit(0);
}


async function migrateArticles(mongoDBConnection) {
	console.log("*********** STARTING migrating articles ************" + '\n');
	const mySQLTableName = 'article';
	const mongoDBCollectionName = 'Articles';
	const sql = 'SELECT * FROM `' + mySQLTableName + '`  WHERE id > 301261';
	let articles = await mySQLQuery(sql); // getArticles from mysql databse
	console.log('Found ' + articles.length + 'articles in mySQL databse' + '\n');
	let articlesArray = splitArray(articles, 10);
	let result = await loopOverArticlesArray(articlesArray, mongoDBConnection);
	return result;
}

async function loopOverArticlesArray(articlesArray, mongoDBConnection) {
	let deferred = Q.defer();
	let c = 1;
	async.forEachLimit(articlesArray, 1, function(articles, callback) {
		console.log('***************************************************', c + '\n');
		mapArticles(articles, mongoDBConnection).then(function(articles) {
			importArticles(articles, mongoDBConnection).then(function(result) {
				c++;
				callback();
				if(articlesArray.length == parseInt(c)*10){
					console.log('==========Migration Done==================')
				}
			});
		});
	},function(error) {
		if (error) throw error;
		deferred.resolve(true);
	});
	return deferred.promise;
}

async function mapArticles(articles, mongoDBConnection) {
	let deferred = Q.defer();
	// console.log('import meta keywords start');
	articles = await importMetaKeywords(articles, mongoDBConnection);
	// console.log('import meta keywords done');
	// console.log('import meta tags start');
	articles = await importMetaTags(articles, mongoDBConnection);
	// console.log('import meta tags done');
	// console.log('import reporter start');
	articles = await importReporter(articles, mongoDBConnection);
	// console.log('import reporter done');
	// console.log('import Categories start');
	articles = await importCategories(articles, mongoDBConnection);
	// console.log('import Categories done');
	deferred.resolve(articles);
	return deferred.promise;
}


/* Insert/update each article meta-keywords in mongodb metaTags collection */
function importMetaKeywords(articles, mongoDBConnection) {
	let deferred = Q.defer();
	let metaTagsCollection = mongoDBConnection.collection("MetaTags");
	let articlesData = [];
	let c = 1;
	async.forEachLimit(articles, 1, function(article, callback) {
		let metaKeywords = article.meta_keywords.split(',');
		let insertMetaKeyObj = [];
		let finalMetaKeywordArray = [];
		metaKeywords.forEach(function(keyword) {
			insertMetaKeyObj.push({ name:keyword })
		});
		async.forEachLimit(insertMetaKeyObj, 1, function(metakeyObj, innerCallback) {
			metaTagsCollection.findAndModify({ name: metakeyObj.name } , { name:1 }, metakeyObj, { new: true, upsert: true}, function(err, updatedMetaTags) {
				if (err) console.log(err);
				finalMetaKeywordArray.push(updatedMetaTags.value)
				setTimeout(innerCallback, 0);
			});
			}, function(error) {
				if (error) console.log(error);
				finalMetaKeywordArray =  finalMetaKeywordArray.map(function(meta) {
					meta._id = meta._id.toString();
					return meta;
				});
				let articleObj = {
					sqlId: article.id,
					articleImage : article.image,
					heading : article.title,
					subHeadingOne : article.title2,
					subHeadingTwo : article.title3,
					description : article.short_desc,
					content : article.content,
					metaTitle : article.meta_title,
					articleUrl: article.meta_title.replace(/\s+/g, '-').toLowerCase(),
					metaDescriptions : article.meta_description,
					metaKeywords : finalMetaKeywordArray,
					source : article.source,
					reporter : article.reporter_id,
					publishArticle : true,
					createdBy : article.created_by,
					createdAt : article.created_date,
					lastModifiedBy : (article.modified_by == 0) ? article.created_by : article.modified_by,
					lastModifiedAt : article.modified_date,
					isActive : (article.active == 1) ? true : false,
					metaTag : article.tags,
					categories : [],
					section : '',
					sectionFlag : '',
					url:article.url,
					catid: article.catid,
					sub_catid: article.sub_catid
				}
				
				if(article.schedule_time == '0000-00-00 00:00:00') {
					articleObj['publishScheduleTime'] = new Date(article.modified_date);
				} else {
					articleObj['publishScheduleTime'] = new Date(article.schedule_time);
				}
				// console.log(c);
				c++;
				articlesData.push(articleObj);
				setTimeout(callback, 0);
			});
	},function(error) {
		if (error) throw error;
		deferred.resolve(articlesData);
	});
	return deferred.promise;
}

/* Insert/update each article metaTags in mongodb metaTags collection */
function importMetaTags(articles, mongoDBConnection) {
	let deferred = Q.defer();
	let metaTagsCollection = mongoDBConnection.collection("MetaTags");
	let articlesData = [];
	let c = 0;
	async.forEachLimit(articles, 1, function(article, callback) {
		let metaTags = article.metaTag.split(',')
		let insertMetaTagObj  = [];
		let finalMetaTagArray = [];
		metaTags.forEach(function(keyword) {
			insertMetaTagObj.push({ name:keyword });
		});
		async.forEachLimit(insertMetaTagObj, 1, function(metakeyObj, innerCallback) {
			metaTagsCollection.findAndModify({ name: metakeyObj.name } , { name:1 }, metakeyObj, { new: true, upsert: true }, function(err, updatedMetaTags) {
				if (err) console.log(err);
				finalMetaTagArray.push(updatedMetaTags.value)
				setTimeout(innerCallback, 0);
			});
		},function(error) {
			if (error) console.log(error);
			finalMetaTagArray =  finalMetaTagArray.map(function(meta){
				meta._id = meta._id.toString();
				return meta;
			});
			article.metaTag = finalMetaTagArray;
			articlesData.push(article);
			c++;
			// console.log(c);
			setTimeout(callback, 0);
		});
	},function(error) {
		if (error) throw error;
		deferred.resolve(articlesData)
	});
	return deferred.promise;
}

/* Map users mongodb _id in article using sql primary key */
function importReporter(articles, mongoDBConnection) {
	let deferred = Q.defer();
	const usersCollection    = mongoDBConnection.collection("Users");
	let articlesData = [];
	usersCollection.find({}).toArray(function(error, users){
		if(error) console.log(error);
		if(users && users.length > 0){
			articles.forEach(function(article, index) {
				users.forEach(function(user) {
					if (user.sqlId) {
						if (article.createdBy == user.sqlId) {
							article.createdBy = user._id;
						}
						if (article.reporter == user.sqlId) {
							article.reporter = user._id;
						}
						if (article.lastModifiedBy == user.sqlId) {
							article.lastModifiedBy = user._id;
						}
					}
				})
				articlesData.push(article);
			});
		}
		return deferred.resolve(articlesData);
	});
	return deferred.promise;
}

function importCategories(articles, mongoDBConnection) {
	let deferred = Q.defer();
	const categoryCollection = mongoDBConnection.collection("Categories");
	let articlesData = [];
	categoryCollection.find({}).toArray(function(error, categories) {
		if(error) console.log(error);
		if(categories && categories.length > 0) {
			articles.forEach(function(article, index) {
				categories.forEach(function(category, index){
					if(category.sqlId){
						if (article.catid == category.sqlId) {
							article.categories.push(category._id);
						}
					}
					if(category.subCatSqlId){
						if(article.sub_catid == category.subCatSqlId) {
							article.categories.push(category._id);
						}
					}
				});
				delete article['catid'];
				delete article['sub_catid'];
				articlesData.push(article);
			});
		}
		return deferred.resolve(articlesData);
	})
	return deferred.promise;
}


function importArticles(articles, mongoDBConnection) {
	let deferred = Q.defer();
	const connection = mongoDBConnection.collection('Articles');
	let counter = 0;
	async.forEachLimit(articles, 1, function(article, callback) {
		let findQuery = { sqlId: article.sqlId };
		let articleImageName = article.articleImage.substring(article.articleImage.lastIndexOf("/") + 1);
		article.articleImage = articleImageName;
		connection.update(findQuery, { $set: article }, { safe: true, upsert: true}, function(err, updatedDoc) {
			if (err) return deferred.reject(err);
			counter++;
			// console.log(counter + 'article updated');
			callback();
		});
	}, function (err) {
		if (err) return deferred.reject(err);;
		return deferred.resolve(true);
	});
	return deferred.promise;
}


/* Database connection and configuration functions */
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

migrationScript();