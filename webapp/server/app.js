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

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

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
app.use('/api', require('./controllers/getArticles.controller'));
app.use('/api', require('./controllers/getCategories.controller'));
app.use('/api', require('./controllers/getGalleries.controller'));
app.use('/api', require('./controllers/googleAd.controller'));
app.use('/api', require('./controllers/getStaticPage.controller'));

var server = app.listen(4446, function () {
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