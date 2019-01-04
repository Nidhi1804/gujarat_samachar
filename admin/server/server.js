var compression = require('compression');
var express = require('express');
var appConfig = require('./appConfig');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();
var helmet = require('helmet');
app.use(helmet());
var appConfig = require('./appConfig');
var session = require('express-session');
var cors = require('cors');
var mongoClient = require('./mongoClient');
var MongoStore = require('connect-mongo')(session);
var httpolyglot = require('httpolyglot');
var fs = require('fs');
 
app.use(compression({threshold: 0, filter: shouldCompress}));
function shouldCompress(req, res) {
	var accept_type = req.get('Accept');
	if( accept_type === 'image/webp,image/*,*/*;q=0.8') {
		res.set('Content-Type', 'image/*');
	}  
	var res_type = res.get('Content-Type');
	if (res_type === undefined) {
		//console.log('%s not compressible', res_type);
		return false
	}
	return true
}

/* Redirect all http request to https server */
/* Note : uncomment below code on production environment */
// app.use(function(req, res, next) {
// 	if (!req.socket.encrypted) {
// 	    res.writeHead(301, { 'Location': ['https://', req.get('Host'), req.url].join('') });
// 	    return res.end();
// 	}
// 	next();
// });
// app.get('*',function(req,res,next){
// 	res.send('503','<h1>Soory! Site is temporary unavailable, will get back to you soon!</h1>');
// });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static('../app'));//Cache : 1 week
app.use(express.static('static/', { maxAge: 172800000000 }));//Cache : 20000 Days

/* Session will destroy after 1hr of inactivity.
 * Cokkie expire time will update with every API response (Set resave: true, rolling:true)
 * If you have multiple apps running on the same hostname (i.e. localhost or 127.0.0.1; different schemes and ports do not name a different hostname), then you need to separate the session cookies from each other.
 * The simplest method is to simply set different names per app.
 */
app.use(session({
	secret: appConfig.JWT_SECRET,
	resave: true,
	rolling:true,
	saveUninitialized: false,
	name: "gsdev",
	cookie: {
		maxAge: 1000 * 60 * 60 // Milliseconds (3600000ms -> 60min)
	}, 
	store: new MongoStore({
		db: appConfig.DB_NAME,
		url: appConfig.MONGO_DB_URL,
		host: 'localhost',
		port: 27017,
		autoRemove: 'native',
		stringify: false
		//clear_interval: 60 * 60
	})
}));


app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return msg;
	}
}));

app.use('/api', expressJwt({ secret: appConfig.JWT_SECRET, credentialsRequired: true }).unless({
	path: [
		'/api/users/login',
		'/api/users/logout',
		'/api/users/getToken',
		'/api/users/verify-reset-pwd-link',
		'/api/users/reset-password',
		'/api/users/forgot-password',
		'/api/articles/image-upload'
	]
}));
app.use('/api', require('./controllers/articles.controller'));
app.use('/api/users', require('./controllers/accounts.controller'));
app.use('/api', require('./controllers/category.controller'));
app.use('/api', require('./controllers/sections.controller'));
app.use('/api', require('./controllers/staticPages.controller'));
app.use('/api', require('./controllers/slideShow.controller'));
app.use('/api', require('./controllers/photoGallery.controller'));
app.use('/api', require('./controllers/videoGallery.controller'));
app.use('/api', require('./controllers/configuration.controller'));
app.use('/api', require('./controllers/advertise.controller'));
app.use('/api', require('./controllers/city.controller'));
app.get('*',function(req,res,next){
	res.redirect('/');
});

// httpolyglot.createServer({
//     key: fs.readFileSync('ssl.key'),
//     cert: fs.readFileSync('ssl.crt')
// }, app).listen(5555, 'localhost', function() { // Replace localhost with domain name(gujaratsamachar.com)
//     console.log('httpolyglot server listening on port 5555');
//     // visit http://gujaratsamachar.com:5555 and https://gujaratsamachar.com:5555 in your browser ...
//     mongoClient.connectToDBServer(function(err) {
//         //console.log('Unable to connect to MongoDB Server. Error: ' + err);
//     });
// });
var server = app.listen(5555, function () {
	console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
	mongoClient.connectToDBServer(function (err) {
	//console.log('Unable to connect to MongoDB Server. Error: ' + err);
	});
})


process.stdin.resume();
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('exit', exitHandler.bind(null, { cleanup: true }));

function exitHandler(options, error) {
	console.log(error);
	console.log(">>>>>>>>>>>>>>> Exit server");
	db = mongoClient.getDb();
	if (db)
		db.close()
	process.exit();
}
