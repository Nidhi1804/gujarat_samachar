var mongodb = require('mongodb');
var mongoClient = require('../mongoClient');
var Q = require('q');
var commonService = require('./shared/common.service');
var appConfig = require('../appConfig');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var service = {};

service.getCities = getCities;
service.addCity = addCity;
module.exports = service;

function getCities(reqParam) {
    var deferred = Q.defer();
    var findQuery = {};
    if (reqParam.sort)
        var sortQuery = reqParam.sort;
    if (reqParam.searchText && reqParam.searchText !== '') {
        findQuery = { 'name': { '$regex': commonService.escapeRegExp(reqParam.searchText), '$options': 'i' } };
    } else if (reqParam.isActive == 'true' || reqParam.isActive) {
        findQuery = { isActive: true };
    }
    var db = mongoClient.getDb();
    db.collection("Cities").find(findQuery).sort(sortQuery).toArray(function(err, cities) {
        if (err) deferred.reject(err);
        if (cities && cities.length > 0) {
            var cityList = []
            cities.forEach(function(city) {
                var cityObj = {
                    _id: city._id,
                    name: city.name,
                    position: city.position,
                    isActive: city.isActive
                }
                cityList.push(cityObj);
            });
            deferred.resolve({
                message: 'Cities found.',
                response: cityList
            });
        } else {
            deferred.resolve({
                message: 'No city found.',
                response: []
            });
        }
    });
    return deferred.promise;
}

function addCity(reqParam) {
    var deferred = Q.defer();
    var db = mongoClient.getDb();
    db.collection(appConfig.COLLECTION_NAME.cities).findOne({ name: reqParam.name }, function(err, city) {
        if (err) deferred.reject(err);
        if (city) {
            deferred.reject("This city already exists!");
        } else {
            /* Create an Auto-Incrementing Sequence Field */
            commonService.getNextSequence("cityPosition").then(function(sequenceCount) {
                reqParam.position = sequenceCount;
                commonService.getNextSequence("cityId").then(function(cityId) {
                    reqParam.Id = cityId;
                    db.collection(appConfig.COLLECTION_NAME.cities).insertOne(reqParam, function(err, newCategory) {
                        if (err) deferred.reject(err);
                        if (newCategory) {
                            deferred.resolve({ message: 'City added successfully', response: { name: reqParam.name } });
                        } else {
                            deferred.resolve('Unable to add new city.');
                        }
                    });
                })
            });
        }
    })
    return deferred.promise;
}