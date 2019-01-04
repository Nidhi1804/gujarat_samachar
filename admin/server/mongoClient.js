const MongoClient = require( 'mongodb' ).MongoClient;
const appConfig   = require('./appConfig');
let _db;

function connectToDBServer(callback){
	/*MongoClient connection pooling : db object will be re-used when new connections to the database are required.*/
	MongoClient.connect(appConfig.MONGO_DB_URL, function( err, db ) {
		if(err){
			console.log('Unable to connect to MongoDB Server. Error: ' + err);
		}
		_db = db;
		console.log('connected to database :: ' + appConfig.MONGO_DB_URL);
		return callback( err );
	});
}

function getDb() {
	if(!_db){
		connectToDBServer();
	}
	return _db;
}

module.exports = { connectToDBServer, getDb };