const mongodb = require('mongodb');
const mongoClient = require('../mongoClient');
const async = require("async");
const service = {};

service.getSectionBySlugName = getSectionBySlugName;
module.exports = service;

async function getSectionBySlugName(objPostReq) {
    const db = await mongoClient.getDb();
    try {
        // Define collection
        const section = db.collection('Sections');
        const findQuery = objPostReq;

        const doc = await section.findOne(findQuery);
        return doc;
    } catch(e) {
        return {};
    }
}