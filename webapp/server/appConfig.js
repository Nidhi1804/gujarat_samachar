const JWT_SECRET = 'Tops?123';
const SUPER_ADMIN_EMAIL = 'shahin.belim@tops-int.com';
const SUPER_ADMIN_PASSWORD = 'tops?123';
const SECRET = 'randomString';
const DB_NAME = 'GS-database'; // Live Database
const BASE_URL = 'http://localhost:4444';
const CITY_SLUG = ['bhuj','north-gujarat','rajkot','ahmedabad','bhavnagar','kheda-anand','baroda','surat','gandhinagar'];
const MAGAZINE_SLUG = ['ravi-purti','business-plus','sahiyar','shatdal','dharmlok','chitralok','zagmag','gujarat-samachar-plus'];

let MONGO_DB_URL;
if (process.env.NODE_ENV == 'development')
	MONGO_DB_URL = 'mongodb://localhost/' + DB_NAME;
else
	MONGO_DB_URL = 'mongodb://gsuser:tops123@localhost:27017/'+DB_NAME;

/**********PAGINATION**********/
const PAGE_SIZE = 10;
const SLIDE_SHOW_PAGE_SIZE = 21;
const VIDEO_GALLERY_SIZE = 21;

const COLLECTION_NAME = {
	articles: 'Articles',
	advertise: 'Advertise',
	galleryImage: 'GalleryImage',
	slideShow: 'SlideShow',
	staticPages: 'StaticPages',
	videoGallery: 'VideoGallery',
	categories: 'Categories',
	cities: 'Cities',
	magazines:'Magazines'
}

module.exports = {
	JWT_SECRET, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SECRET, 
	BASE_URL, MONGO_DB_URL, DB_NAME, PAGE_SIZE, SLIDE_SHOW_PAGE_SIZE,
	COLLECTION_NAME, VIDEO_GALLERY_SIZE,CITY_SLUG,MAGAZINE_SLUG
};