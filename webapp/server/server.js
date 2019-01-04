var compression = require('compression');
var express = require('express');
var prerender = require('prerender-node');
var appConfig = require('./appConfig');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();
var secureApp = express();

var helmet = require('helmet');
app.use(helmet());

var appConfig = require('./appConfig');
var redirection = require('./redirection');
var cors = require('cors');
var mongoClient = require('./mongoClient');
var sitemap = require('./sitemap');
var https = require('https');
var http = require('http');
var httpolyglot = require('httpolyglot');
var fs = require('fs');

/*
	Use 1337 port for prerender server
	export PORT=1337
	Reduced the RESOURCE_DOWNLOAD_TIMEOUT (environment variable for Prerender) to 4 seconds instead of 10 to Facebook debugger works correctly.

	prerender/lib/server.js
	var RESOURCE_DOWNLOAD_TIMEOUT = process.env.RESOURCE_DOWNLOAD_TIMEOUT || 4 * 1000;
 */
prerender.crawlerUserAgents.push('googlebot');
prerender.crawlerUserAgents.push('bingbot');
prerender.crawlerUserAgents.push('yandex');
app.use(prerender.set('protocol', 'https'));
app.use(prerender.set('prerenderServiceUrl', 'http://localhost:3000'));


/* compression disabled due to conflict with apicache */
app.use(compression({ threshold: 0, filter: shouldCompress }));
// app.get('*',function(req,res,next){
//     res.send('503','<h1>Soory! Site is temporary unavailable, will get back to you soon!</h1>');
// });
function shouldCompress(req, res) {
    var accept_type = req.get('Accept');
    if (accept_type === 'image/webp,image/*,*/*;q=0.8') {
        res.set('Content-Type', 'image/*');
    }
    var res_type = res.get('Content-Type');
    if (res_type === undefined) {
        //console.log('%s not compressible', res_type);
        return false
    }
    return true
}

/*Redirect Old Gujaratsamachar url Code*/
app.get('/index.php/articles/display_article/:category/:articleUrl', function(req, res, next){
  if (req.url.includes('index.php')) {
    let params = req.url.split('/');
    let url =  params[params.length - 1];
    let categorySlug = params[params.length - 2];
    let host = req.protocol + '://' + req.headers.host;
    redirection.redirectTo(url, categorySlug, host).then(function(redirectionUrl) {
        res.redirect(301, redirectionUrl);
    }).catch(function(err) {
        console.log(err);
    });
  } else {
    next();
  }
});

app.get('/index.php/page/:category', function(req, res){
    let params = req.url.split('/');
    let categorySlug =  params[params.length - 1];
    let host = req.protocol + '://' + req.headers.host;
    if(appConfig.CITY_SLUG.includes(categorySlug) == true)
      res.redirect(301, host + '/city/' + categorySlug + '/1');
    else if(appConfig.MAGAZINE_SLUG.includes(categorySlug) == true)
      res.redirect(301, host + '/magazine/' + categorySlug + '/1');
    else
      res.redirect(301, host + '/category/' + categorySlug + '/1'); 
});

/*Sitemap & RSS feed Generate*/
app.get('/sitemap.xml', sitemap.getMainSitemapXml);
app.get('/category/:slug/:pageIndex/sitemap.xml', sitemap.getCategorySitemapXml);
app.get('/city/:slug/:pageIndex/sitemap.xml', sitemap.getCitySitemapXml);
app.get('/magazine/:slug/:pageIndex/sitemap.xml', sitemap.getMagazineSitemapXml);
app.get('/photo/:pageIndex/sitemap.xml', sitemap.getSlideShowSitemapXml);
app.get('/rss/city/:slug', sitemap.getCityRssXml);
app.get('/rss/category/:slug', sitemap.getCategoryRssXml);
app.get('/rss/magazine/:slug', sitemap.getMagazineRssXml);
app.get('/rss/top-stories', sitemap.getTopStoriesRssXml);

/*API response set header*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static('../app', { maxAge: 17280000000 }) ); //Cache : 200 Days
app.use(express.static('./static', { maxAge: 17280000000 }) )

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return msg;
    }
}));

/*API calls*/
/*app.use('/api', require('./controllers/getArticles.controller'));
app.use('/api', require('./controllers/getCategories.controller'));
app.use('/api', require('./controllers/getGalleries.controller'));
app.use('/api', require('./controllers/googleAd.controller'));
app.use('/api', require('./controllers/getStaticPage.controller'));*/

/*Serve Frontens*/
app.use(function(req, res) {
    res.sendFile("index.html", { root: "../app" });
});

var server = app.listen(4444, function () {
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
    db = mongoClient.getDb();
    if (db)
        db.close()
    process.exit();
}