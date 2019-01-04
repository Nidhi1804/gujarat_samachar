const JWT_SECRET = 'Tops?123';
const SUPER_ADMIN_EMAIL = "shahin.belim@tops-int.com";
const SUPER_ADMIN_PASSWORD = "tops?123";
const SECRET = "randomString";
const DB_NAME = 'GujaratSamachar'; // Live Database
const TEST_DB_NAME = 'GSTest'; // Live Database
let BASE_URL;
let MONGO_DB_URL;
if (process.env.NODE_ENV == 'development'){
    MONGO_DB_URL = 'mongodb://192.168.4.47/' + DB_NAME;
    BASE_URL = 'http://localhost:5555/';
    IMG_URL = 'https://static.gujaratsamachar.com/';
}
else{
    MONGO_DB_URL = 'mongodb://gsuser:tops123@localhost:27017/'+DB_NAME;
    BASE_URL = 'https://www.gujaratsamachar.com/';
    IMG_URL = 'https://static.gujaratsamachar.com/';
}
const DIR_PATH = __dirname + '/static/';

/**********PAGINATION**********/
const PAGE_SIZE = 10;

/**********COLLECTION NAMES*****************/
const COLLECTION_NAME = {
    articles: 'Articles',
    advertise: 'Advertise',
    galleryImage: 'GalleryImage',
    slideShow: 'SlideShow',
    allowIp: 'AllowIP',
    configuration: 'Configuration',
    users: 'Users',
    poster: 'Poster',
    cities:'Cities',
    categories:'Categories'
}

const AWS_ACCESS_KEY_ID = 'AKIAIBNZYMBZEZ6WNVLQ';
const AWS_SECRET_ACCESS_KEY = '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';

module.exports = {
    JWT_SECRET, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SECRET,IMG_URL,
    BASE_URL, MONGO_DB_URL, DB_NAME, PAGE_SIZE, COLLECTION_NAME, DIR_PATH, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
};