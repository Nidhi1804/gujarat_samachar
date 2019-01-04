const MongoClient   = require( 'mongodb' ).MongoClient;
const mysql         = require('mysql');
const Q             = require('q');
const passwordHash  = require('password-hash');
const appConfig     = require('./appConfig');
const async         = require("async");
const client        = require('scp2');
const splitArray    = require('split-array');
var commonService = require('./services/shared/common.service');

async function migrationScript() {
	let mongoDBConnection = await getMongoDBConnection();
	console.log('Start Moving City category ar4ticles to City Articles');
	console.log('=======================================================');
	let cityResponse = await migrateCityCategoryArticlesToCityArticles(mongoDBConnection);

	console.log('Start Moving Magazine category ar4ticles to Magazine Articles');
	console.log('===============================================================');
	let magazineResponse = await migrateMagazineCategoryArticlesToMagazineArticles(mongoDBConnection);
	process.exit(0);
}

async function migrateCityCategoryArticlesToCityArticles(mongoDBConnection){
	let deferred = Q.defer();
	let cityArr = [
	{category:"5b0411eb348751d378b0dfe4",city:"5993f6d95b03ab694185afdf"},
	{category:"5b0411eb348751d378b0dfe8",city:"5993f7095b03ab694185affa"},
	{category:"5b0411eb348751d378b0dfe2",city:"5993f70f5b03ab694185b000"},
	{category:"5b0411eb348751d378b0dfdc",city:"5993f7195b03ab694185b008"},
	{category:"5b0411eb348751d378b0dfea",city:"5993f7255b03ab694185b010"},
	{category:"5b0411eb348751d378b0dfe6",city:"5993f72e5b03ab694185b014"},
	{category:"5b0411eb348751d378b0dfde",city:"5993f7355b03ab694185b01a"},
	{category:"5b0411eb348751d378b0dfe0",city:"5993f7415b03ab694185b022"},
	{category:"5b0411eb348751d378b0e018",city:"59b23fd351851cfd2c4d339a"}
	];
	const connection = mongoDBConnection.collection('Articles');
	let c = 1;
	async.forEachLimit(cityArr, 1, function(city, callback) {
		connection.update({categories: commonService.convertIntoObjectId(city.category)}, { $set: { city : commonService.convertIntoObjectId(city.city) } }, { safe: true, multi:true}, function(err, updatedDoc) {
			if (err) return deferred.reject(err);
			c++;
			console.log('***************************************************', c + ', ' + updatedDoc.result.n + ', ' + updatedDoc.result.nModified + '\n');
			// console.log(counter + 'article updated');
			callback();
		});
	},function(error) {
		if (error) throw error;
		deferred.resolve(true);
	});
	return deferred.promise;
}

async function migrateMagazineCategoryArticlesToMagazineArticles(mongoDBConnection){
	let deferred = Q.defer();
	let magazineArr = [
	{category:"5b0411eb348751d378b0dfec",magazines:"5993f3805b03ab694185adf0"},
	{category:"5b0411eb348751d378b0dfee",magazines:"5993f3985b03ab694185adfd"},
	{category:"5b0411eb348751d378b0dff0",magazines:"5993f3ae5b03ab694185ae07"},
	{category:"5b0411eb348751d378b0dff2",magazines:"5993f3bd5b03ab694185ae13"},
	{category:"5b0411eb348751d378b0dff4",magazines:"5993f3c95b03ab694185ae1b"},
	{category:"5b0411eb348751d378b0dff6",magazines:"5993f3d95b03ab694185ae23"},
	{category:"5b0411eb348751d378b0dff8",magazines:"5993f3e65b03ab694185ae29"},
	{category:"5b0411eb348751d378b0dffa",magazines:"5993f3f35b03ab694185ae31"}
	];
	const connection = mongoDBConnection.collection('Articles');
	let c = 1;
	async.forEachLimit(magazineArr, 1, function(magazine, callback) {
		connection.update({categories: commonService.convertIntoObjectId(magazine.category)}, { $set: { magazine : commonService.convertIntoObjectId(magazine.magazines) } }, { safe: true, multi:true}, function(err, updatedDoc) {
			if (err) return deferred.reject(err);
			c++;
			console.log('***************************************************', c + ', ' + updatedDoc.result.n + ', ' + updatedDoc.result.nModified + '\n');
			// console.log(counter + 'article updated');
			callback();
		});
	},function(error) {
		if (error) throw error;
		deferred.resolve(true);
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
migrationScript();