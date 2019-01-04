angular.module('gujaratSamachar')
	.filter("imagePathFilter", imagePathFilter)
	.filter("arrayChunk", arrayChunk)
	.filter('unsafe', unsafe);

/* Filter articleImage path based on image_base_url */
function imagePathFilter(GENERAL_CONFIG,$state) {
	return function (articles,imageType) {
		if (articles.length > 0) {
			if(imageType == 'thumbImage'){
				articles.map(function (article) {
					if (article.articleImage) {
						article.baseUrl = GENERAL_CONFIG.article_thumb_images_base_url;
					} else if (article.slideShowImages || article.image) {
						if($state.current.url == '/' || $state.current.name == 'root.mainSidebar.slideShow' || $state.current.name == 'root.mainSidebar.photoGallery')
							article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show/thumbnails';
						else
							article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show'; //baseUrl for new admin panel articles
					} else {
						article.baseUrl = GENERAL_CONFIG.image_base_url;
					}
					return article;
				});
			}else{
				articles.map(function (article) {
					if (article.articleImage) {
						article.baseUrl = GENERAL_CONFIG.article_images_base_url;
					} else if (article.slideShowImages || article.image) {
						if($state.current.url == '/' || $state.current.name == 'root.mainSidebar.slideShow' || $state.current.name == 'root.mainSidebar.photoGallery')
							article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show/thumbnails';
						else
							article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show'; //baseUrl for new admin panel articles
					} else {
						article.baseUrl = GENERAL_CONFIG.image_base_url;
					}
					return article;
				});
			}
			return articles;
		} else {
			return articles;
		}
	};
}

/* split array in to chunk of array */
function arrayChunk(GENERAL_CONFIG) {
	return function (array, size) {
		var newArray = [];
		for (var i = 0; i < array.length; i += size) {
			newArray.push(array.slice(i, i + size));
		}
		return newArray;
	};
}

function unsafe($sce) { return $sce.trustAsHtml; }