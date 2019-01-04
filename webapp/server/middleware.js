const middleware = {};
const mongoClient = require('./mongoClient');
const mcache = require('memory-cache');
const async         = require("async");
middleware.cache = cache;
module.exports = middleware;


async function cache(req, res, next) {
	let key = '__express__' + req.originalUrl || req.url
	let cachedBody = mcache.get(key);
	if (cachedBody) {
		res.send(cachedBody);
		return
	} else {
		res.sendResponse = res.send
		res.send = (body) => {
			mcache.put(key, body, 120 * 1000);
			res.sendResponse(body)
		}
		next()
	}
}