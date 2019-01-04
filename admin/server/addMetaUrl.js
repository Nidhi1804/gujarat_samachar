var mongodb      = require('mongodb');
var mongoClient  = require('./mongoClient');
var async        = require("async");
var Q            = require('q');
var passwordHash = require('password-hash');

mongoClient.connectToDBServer( function( err ) {
	db = mongoClient.getDb();	
	var articleCollection = db.collection("Articles");	
	
	articleCollection.find({}).toArray(function(error, articles){
		if (error) console.log("error : ", error);
		console.log(articles.length)
		async.forEachLimit(articles,10,function(doc, updateCallback){
			console.log( articles.indexOf(doc) )
			//console.log(doc)
			var findQuery= {_id:doc._id};
			var updateQuery = {$set:{"articleUrl": doc.metaTitle.replace(/\s+/g, '-').toLowerCase()}};
			articleCollection.update(findQuery, updateQuery, {safe:true, upsert: true}, function(err, updatedDoc){
				if (err) console.log(err);
				// if(updatedDoc.result.nModified == 0)
				// 	console.log(result.sqlId, " inserted.");
				// else
				// 	console.log(result.sqlId, " updated.");
				setTimeout(updateCallback, 0);
			});
		},function(error) {
			if (error) console.log("error : ", error);
			console.log("------ mongoCollection : Articles : ", articles.length, " Records inserted.");
		});
	})

});

