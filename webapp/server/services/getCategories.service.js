var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');

var service       = {};
//service.getConfig = getConfig;
module.exports    = service;
