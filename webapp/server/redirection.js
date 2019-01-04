const mongoClient   = require('./mongoClient');
const appConfig = require('./appConfig');
const Q = require('q');

function redirectTo(articleUrl, categorySlug, host) {
	let deferred = Q.defer();
	let categories = [];
	const db = mongoClient.getDb();
	let findQueryObj = {"url": categorySlug + '/' +articleUrl};
	db.collection(appConfig.COLLECTION_NAME.categories).find().toArray(function(err, categoriesObj) {
        if (err) deferred.reject(err);
        categories = categoriesObj;
		db.collection(appConfig.COLLECTION_NAME.articles).find(findQueryObj).toArray(function (err, articleObj) {
			if (err) deferred.reject(err);
		    if (articleObj.length > 0) {
				if(appConfig.CITY_SLUG.includes(categorySlug) == true){
					articleObj.forEach(function(response) {
			            response.categorySlug = categories.filter((category) => {
		                    return category._id.toString() == response.categories[0].toString();
			            })[0].slug;
				    })
					deferred.resolve(host + "/news/" + articleObj[0].categorySlug + "/" + articleObj[0].articleUrl );
				}else{
					deferred.resolve(host + "/news/" + categorySlug + "/" + articleObj[0].articleUrl );
				}
		    }else{
		    	deferred.resolve(host + '/404');
		    }
		});
	})
	return deferred.promise;
}

module.exports = { redirectTo };