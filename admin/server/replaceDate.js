var mongodb = require('mongodb');
var mongoClient = require('./mongoClient');
var async = require("async");
var Q = require('q');
var passwordHash = require('password-hash');

mongoClient.connectToDBServer(function (err) {
    db = mongoClient.getDb();
    var articleCollection = db.collection("Articles");

    articleCollection.find({
        publishScheduleTime: new Date('1970-01-01T00:00:00.000Z')
    }).toArray(function (error, articles) {
        if (error) console.log("error : ", error);
        console.log(articles.length)
        async.forEachLimit(articles, 10, function (doc, updateCallback) {
            console.log(articles.indexOf(doc))
            //console.log(doc)
            var findQuery = { _id: doc._id };
            var updateQuery = { $set: { publishScheduleTime: doc.createdAt } };
            articleCollection.update(findQuery, updateQuery, { safe: true, upsert: true }, function (err, updatedDoc) {
                if (err) console.log(err);
                // if(updatedDoc.result.nModified == 0)
                // 	console.log(result.sqlId, " inserted.");
                // else
                // 	console.log(result.sqlId, " updated.");
                setTimeout(updateCallback, 0);
            });
        }, function (error) {
            if (error) console.log("error : ", error);
            console.log("------ mongoCollection : Articles : ", articles.length, " Records Updated.");
        });
    })

});

