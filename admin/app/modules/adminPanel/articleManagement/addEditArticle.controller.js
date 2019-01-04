'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditArticleController', AddEditArticleController);

AddEditArticleController.$inject = ['$timeout','$log', '$scope', 'toastr', 'GENERAL_CONFIG', 'AdminService', '$state', '$stateParams', 'FileUploader', 'localStorageService', '$q', '$uibModal'];

function AddEditArticleController($timeout, $log, $scope, toastr, GENERAL_CONFIG, AdminService, $state, $stateParams, FileUploader, localStorageService, $q, $uibModal) {

	// initialize core components of jQuery plugins(bootstrap-switch)
	$scope.$on('$viewContentLoaded', function () {
		App.initAjax();
	});
	var vm = this;
	var redirectFlag1;
	vm.disable = false;
	vm.invalidLimit = false;
	vm.saveArticle = saveArticle;
	vm.getSubCategory = getSubCategory;
	vm.getMetaTags = getMetaTags;
	vm.addTag = addTag;
	vm.article = {};
	vm.article.categories = [];
	vm.article.publishArticle = true;
	vm.subCategoryList = [];
	vm.mainCategoryList = [];
	vm.reporterList = [];
	vm.sectionList = [];
	vm.sectionFlags = [];
	vm.cities = [];
	vm.magazines = [];
	vm.articleId = $stateParams.articleId;
	vm.requireFileError = false;
	vm.appBaseUrl = GENERAL_CONFIG.app_base_url;
	vm.openAddModal = openAddModal;
	vm.removethisImage = removethisImage;
	vm.pubishTime = ''
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	var url, method;
	if (vm.article.publishArticle) {
		vm.showScheduleTime = false;
	} else {
		vm.showScheduleTime = true;
	}

	vm.subCategoryList = []
	vm.updateSelection = updateSelection;

	function removethisImage() {
		vm.article.articleImage = undefined;
	}

	function updateSelection(position) {
		vm.sectionFlags = vm.sectionFlags.map(function (section, index) {
			if (position != index) {
				section.status = false;
			}
			return section;
		});
	}

	$scope.validateHeadLine = function(){
		vm.height = $('#headLine').height();
		if(vm.height <= 54){
			vm.invalidLimit = false;
		}else{
			vm.invalidLimit = true;
		}
	}

	/* List selected sub-categories IDs */
	vm.models = [];

	if (vm.articleId && vm.articleId !== '' && vm.articleId !== null) {
		vm.typeTitle = "Edit";
		method = 'PUT';
	} else {
		vm.typeTitle = "Add New";
		vm.isArticleLoaded = true; // Flag to load html only after retieving ArticleInfo to initialize bootstrap-switch and other js plugins based on data
		vm.article.metaKeywords = [];
		vm.article.metaTag = [];
		method = 'POST';
	}

	/* Reset form after submission */
	function reset() {
		vm.addArticleForm.$setPristine();
	}

	vm.article.sectionFlag = '';

	/* Save Article */
	function saveArticle(isValid, flag) {
		redirectFlag1 = flag;
		var found = false;
		vm.sectionFlags.forEach(function (section, index) {
			if (section.status) {
				found = true;
				vm.article.sectionFlag = section._id;
			}
		});
		if (!found)
			vm.article.sectionFlag = '';
		if (isValid) {
			if (vm.article.isBreakingNews) {
				if (vm.article.posterImage) {
					vm.invalidForm = false;
					updateArticle(isValid);
				} else {
					vm.invalidForm = true;
				}
			} else {
				updateArticle(isValid);
			}
		} else {
			vm.invalidForm = true;
		}
	}

	/* Get Reporter list, sections and Main Categories (Only active), Cities, Magazines */
	var promises = {
		usersPromise: AdminService.user().get({
			userGroup: 'Editor',
			isActive: true
		}).$promise,
		sectionsPromise: AdminService.sections().get().$promise,
		mainCategoriesPromise: AdminService.categories().get({
			sort: 'name',
			type: 'article',
			isActive: true
		}).$promise,
		magazinesPromise: AdminService.magazines().get().$promise,
		citiesPromise: AdminService.cities().get().$promise,
		sectionFlagsPromise: AdminService.sectionFlags().get().$promise
	}
	$q.all(promises).then(function (responses) {
		if (responses.usersPromise.data) {
			if (loggedInUserInfo.userGroup === 'Administrator') {
				vm.reporterList = responses.usersPromise.data.userList;
				vm.reporterList = vm.reporterList.map(function (reporter) {
					reporter.fullName = reporter.firstName + ' ' + reporter.lastName;
					return reporter;
				});
			}
			vm.reporterList.push({
				_id: loggedInUserInfo.userId,
				fullName: loggedInUserInfo.firstName + ' ' + loggedInUserInfo.lastName
			});
			vm.article.reporter = loggedInUserInfo.userId;
		}
		if (responses.sectionsPromise.data) {
			vm.sectionList = responses.sectionsPromise.data.sections;
			vm.sectionList.unshift({
				'_id ': '1',
				'title': "Select Section"
			});
		}
		if (responses.mainCategoriesPromise.data) {
			vm.mainCategoryList = responses.mainCategoriesPromise.data;
			vm.mainCategoryList.unshift({
				"name": "Select Category"
			});
		}
		if (responses.magazinesPromise.data) {
			vm.magazines = responses.magazinesPromise.data;
			vm.magazines.unshift({
				'_id ': '1',
				'name': "Select Magazine"
			})
		}
		if (responses.citiesPromise.data) {
			vm.cities = responses.citiesPromise.data;
			vm.cities.unshift({
				'_id ': '1',
				'name': "Select City"
			})
		}
		if (responses.sectionFlagsPromise.data) {
			vm.sectionFlags = responses.sectionFlagsPromise.data;
		}
		if (vm.articleId && vm.articleId !== '' && vm.articleId !== null) {
			getArticleInfo();
		}
	}, function (error) {
		$log.log(error);
	});

	/* Get Sub Categories */
	function getSubCategory(parentCatId, isMainCategory, index, init) {
		var deferred = $q.defer();
		if (isMainCategory) {
			vm.subCategoryList = [] // Reload subCat array on change of main category
			if (!init) {
				vm.models = []; // Reset sub category models on Main category selection.
			}
		}
		if (index + 1 < vm.subCategoryList.length) {
			vm.subCategoryList.splice(index + 1) // Reload child subCat array on change of parent subCat
			vm.models.splice(index + 1)
		}
		AdminService.subCategories().get({
			sort: 'name',
			parentCatId: parentCatId,
			isActive: true,
			type: 'article'
		}, function (response) {
			vm.subCategoryList.push({
				label: 'Sub Category',
				list: response.data.list,
				model: "subCat" + index
			})
			return deferred.resolve(response.data.list)
		})
		return deferred.promise;
	}

	/* Get article info by Id to edit article */
	function getArticleInfo() {
		vm.isArticleLoaded = false;
		App.startPageLoading({
			animate: true
		});
		AdminService.articles().get({
			articleId: vm.articleId
		}, function (response) {
			if (response) {
				vm.article = response.data;
				if (vm.article.articleImage && vm.article.articleImage !== "") {
					var articleImage = vm.appBaseUrl + '/articles/articles_thumbs/' + vm.article.articleImage;
					vm.showArticleImage = articleImage;
					var uploadFolder = vm.article.articleImage.split("/")[0];
					vm.serverUrl = false;
					if (uploadFolder == "uploads") {
						vm.baseUrl = "http://www.gujaratsamachar.com/"; //baseUrl for old admin panel articles
						vm.serverUrl = true;
					}

				}
				if (vm.article.sectionFlag) {
					vm.sectionFlags.forEach(function (section) {
						if (section._id == vm.article.sectionFlag)
							section.status = true;
					})
				}


				/* Check if reporter exist in active list of reporters. If not, than get user info by id andd append that info to vm.reporterList */
				if (vm.article.reporter) {
					checkIfReporterExistInList();
				}
				// if (vm.article.section) {
				// 	checkIfSectionExistInList();
				// }
				/* Make categories selected based on retrieved values */
				// categories array : first id will be main category id and remaining ids will be sub-category ids
				/* If existing catId found inActive on edit article, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
				if (vm.article.categories && vm.article.categories.length > 0) {
					getSelectedSubCategoryInfo();
				}
				if (!vm.article.publishArticle) {
					vm.article.publishScheduleTime = moment(new Date(vm.article.publishScheduleTime));
				}
				vm.isArticleLoaded = true;
			}
			App.stopPageLoading();
		});
	}

	/* Update article on edit if image not uploaded(Default fileUploader does not call API if image not uploaded) */

	function updateArticle(isValid) {
		vm.disable = true;
		if (isValid) {
			/* Save all category Ids as an array */
			vm.article.categories = []
			if (vm.parentId && vm.parentId !== '' && vm.parentId !== null) {
				vm.article.categories.push(vm.parentId);
				if (vm.models.length > 0) {
					vm.models = vm.models.filter(function (val) {
						return val !== null;
					});
					vm.article.categories = vm.article.categories.concat(vm.models);
				}
			}
			if (vm.articleId !== undefined) {
				if (!vm.article.isBreakingNews) {
					vm.article.posterImage = '';
				}
				AdminService.breakingNews().update({
					articleId: vm.articleId
				}, {
						isBreakingNews: vm.article.isBreakingNews
					}, function (status) {
						AdminService.articles().update({
							articleId: vm.articleId
						}, vm.article, function (response) {
							if (response.code == 200) {
								vm.params = 'article-detail-' + vm.article.articleUrl;
								toastr.success(response.message, "", {
									closeButton: true,
									timeOut: 3000,
									preventOpenDuplicates: true
								});
								reset();
								if (redirectFlag1 === false) {
									$state.go('root.articleList.id', {
										pageId: 1,
										sectionId: "all"
									});
								} else {
									$state.go('root.addArticle')
								}
								AdminService.clearCache().get({apiName: vm.params},function(response){
									console.log(response.message);
								})
							}
						});
					});
			} else {
				AdminService.articles().save(vm.article, function (response) {
					if (response.code == 200) {
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						reset();
						if (redirectFlag1 === false) {
							$state.go('root.articleList.id', {
								pageId: 1,
								sectionId: "all"
							});
						} else {
							$state.go($state.current, {}, {
								reload: true
							});
						}
					}
				});
			}

		}
	}

	function getMetaTags(query) {
		var deferred = $q.defer();
		AdminService.metaTags().get({
			searchTag: query
		}, function (response) {
			if (response.code == 200) {
				deferred.resolve(response.data)
			}
		})
		return deferred.promise;
	}

	function addTag(tag) {
		AdminService.metaTags().save(tag, function (response) {
			if (response.code == 200 && response.message == "Tag added successfully") {
				/* If new tag added in database than add newly created tag _id in 'vm.article.metaKeywords' model */
				if (vm.article.metaKeywords.length > 0) {
					var length = vm.article.metaKeywords.length;
					if (response.data.name == vm.article.metaKeywords[length - 1].name) {
						vm.article.metaKeywords[length - 1]._id = response.data._id;
					}
				}
				if (vm.article.metaTag.length > 0) {
					var length = vm.article.metaTag.length;
					if (response.data.name == vm.article.metaTag[length - 1].name) {
						vm.article.metaTag[length - 1]._id = response.data._id;
					}
				}
			}
		});
	}

	/* If existing catId found inActive on edit article, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
	function getSelectedSubCategoryInfo() {
		/* Get selected categories info */
		AdminService.getCategoryListInfo().get({
			categoryIdList: JSON.stringify(vm.article.categories)
		}, function (catListInfoObj) {
			if (catListInfoObj) {
				var lastIndex = vm.article.categories.length - 1;
				/* Get Sub categories */
				getSubCategoriesLoop(vm.article.categories);

				function getSubCategoriesLoop(categories) {
					var counter = 0;

					function next() {
						if (counter < categories.length) {
							var index = counter;
							counter++;
							var isMainCategory, subCatIndex, init;
							if (index > 0) {
								isMainCategory = false;
								init = false;
								subCatIndex = index;
							} else if (index == 0) {
								isMainCategory = true;
								init = true;
								subCatIndex = '';
							}
							getSubCategory(categories[index], isMainCategory, subCatIndex, init).then(function (subCategoryList) {
								var isSubCategoryfound = false;
								var isMainCategoryFound = false;
								if (index > 0) {
									vm.models.push(categories[index])
								} else if (index == 0) {
									vm.parentId = categories[index] // If already selected id is inactive, than retrieve its info
								}

								if (subCategoryList.length > 0) {
									subCategoryList.forEach(function (subCatItem) {
										if (subCatItem._id == categories[index + 1]) {
											isSubCategoryfound = true;
										}
									})
								}
								vm.mainCategoryList.forEach(function (mainCategory) {
									if (mainCategory._id == vm.parentId) {
										isMainCategoryFound = true;
									}
								});

								catListInfoObj.data.forEach(function (catInfo) {
									if (!isSubCategoryfound && categories[index + 1]) {
										if (catInfo._id == categories[index + 1]) {
											vm.subCategoryList[vm.subCategoryList.length - 1].list.push(catInfo)
										}
									}
									if (index == 0 && !isMainCategoryFound && categories[index]) {
										if (catInfo._id == categories[index]) {
											vm.mainCategoryList.push(catInfo);
										}
									}
								})
								next();
							});
						}
					}
					next();
				}
			}
		});
	}

	/* Check if reporter exist in active list of reporters. If not, than get user info by id and append that info to vm.reporterList */
	function checkIfReporterExistInList() {
		if (loggedInUserInfo.userGroup === 'Administrator') {
			var isReporterFound = false;
			vm.reporterList.forEach(function (reporter) {
				if (vm.reporterList._id == vm.article.reporter) {
					isReporterFound = true;
				}
			})
			if (!isReporterFound) { // If not found, than add its info to reporterList
				AdminService.user().get({
					userId: vm.article.reporter
				}, function (response) {
					if (response.data) {
						response.data.fullName = response.data.firstName + ' ' + response.data.lastName;
						vm.reporterList.push({
							_id: vm.article.reporter,
							fullName: response.data.fullName
						})
					}
				});
			}
		} else {
			AdminService.user().get({
				userId: vm.article.reporter
			}, function (response) {
				if (response.data) {
					response.data.fullName = response.data.firstName + ' ' + response.data.lastName;
					vm.reporterList = [];
					vm.reporterList.push({
						_id: vm.article.reporter,
						fullName: response.data.fullName
					})
				}
			});
		}

	}

	/* Check if section exist in active list of sections. If not, than get section info by id and append that info to vm.sectionList */
	function checkIfSectionExistInList() {
		var isSectionFound = false;
		vm.sectionList.forEach(function (section) {
			if (vm.sectionList._id == vm.article.section) {
				isSectionFound = true;
			}
		})
		if (!isSectionFound) { // If not found, than add its info to vm.sectionList
			AdminService.sections().get({
				sectionId: vm.article.section
			}, function (response) {
				if (response.data) {
					vm.sectionList.push(response.data)
				}
			});
		}
	}

	function openAddModal(type) {
		if (type == 'poster')
			$scope.imageType = "poster";
		else
			$scope.imageType = "";
		var modalInstance = $uibModal.open({
			templateUrl: 'partial-views/imageCropperModal/imageCropperModal.view.html',
			controller: 'ImageCropperModal',
			controllerAs: 'vm',
			scope: $scope,
			backdrop: 'static',
		});
		modalInstance.result.then(function (result) {
			if (result && result.success) {
				vm.serverUrl = false;
				if (type == 'article') {
					vm.article.articleImage = result.croppedImage;
					vm.showArticleImage = result.croppedImage;
				}
				if (type == 'poster') {
					vm.article.posterImage = result.croppedImage;
				}
			}
		}, function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
	vm.options = {
		toolbar: [
			['custom',['findnreplace']],
			["style", ["bold", "italic", "underline", "clear"]],
			["para", ["style", "ul", "ol", "paragraph", "height"]],
			["font", ["strikethrough", "superscript", "subscript"]],
			["fontname", ["fontname"]],
			["fontsize", ["fontsize"]],
			["color", ["color"]],
			["table", ["table"]],
			["insert", ["link", "picture", "videoAttributes", "media", "hr"]],
			["misc", ["undo", "redo", "fullscreen", "codeview", "help"]],
		],
		popover: {
			image: [
				['imagesize', ['imageSizeOf100', 'imageSizeOf50', 'imageSizeOf25']],
				['float', ['floatToLeft', 'floatToRight', 'floatNone']],
				['remove', ['removeThisMedia']],
				['caption', ['addCaption']]
			],
			link: [
				['link', ['linkDialogShow', 'unlink']]
			],
			table: [
				['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
				['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
			],
			air: [
				['color', ['color']],
				['font', ['bold', 'underline', 'clear']],
				['para', ['ul', 'paragraph']],
				['table', ['table']],
				['insert', ['link', 'picture']]
			]
		},
		buttons: {
			addCaption: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				// create button
				var button = ui.button({
					contents: '<i class="fa fa-comment"/>',
					tooltip: 'add caption',
					click: function () {
						var img = $($editable.data('target'));
						var getImgWidth = img.css('width');
						var getImgFloat = img.css('float');
						if (getImgFloat == 'none') {
							getImgFloat = 'left';
						}
						if (img.parent().is('p') || img.parent().is('div')) {
							img.unwrap();
						}
						if (img.parent().parent()[0].innerHTML.includes('<table')) {
							var $newFigure = img.wrap('<table class="tr-caption-container" style="margin: 1px 1em 0 1em;float:' + getImgFloat + ';"><tr><td style="text-align: center;"></td></tr>').parent().parent().parent();
							$newFigure.append('<tr><td class="tr-caption" style="text-align: center;">add caption</td></tr></table>');
						} else if (img.css("float") == 'right') {
							var $newFigure = img.wrap('<table class="tr-caption-container" style="margin: 1px 1em 0 1em;float:right ;"><tr><td style="text-align: center;"></td></tr>').parent().parent().parent();
							$newFigure.append('<tr><td class="tr-caption" style="text-align: center;">add caption</td></tr></table>');
						} else if (!img.parent().parent()[0].innerHTML.includes('<table')) {
							var $newFigure = img.wrap('<table class="tr-caption-container" style="margin: 1px 1em 0 1em;float:' + getImgFloat + ';"><tr><td style="text-align: center;"></td></tr>').parent().parent().parent();
							$newFigure.append('<tr><td class="tr-caption" style="text-align: center;">add caption</td></tr></table>');
						}
						img.parent().parent().parent().parent().css('width', getImgWidth);
						img.css('width', '100%');
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
						//context.invoke('editor.insertnode', img);
					}
				});
				return button.render(); // return button as jquery object
			},
			floatToLeft: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<i class="note-icon-align-left"/>',
					tooltip: 'float left',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('float', 'left');
						} else {
							img.parent().parent().parent().parent().css('float', 'left');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			},
			floatToRight: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<i class="note-icon-align-right"/>',
					tooltip: 'Float right',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('float', 'right');
						} else {
							img.parent().parent().parent().parent().css('float', 'right');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');

					}
				});
				return button.render(); // return button as jquery object
			},
			floatToCenter: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<i class="note-icon-align-justify"/>',
					tooltip: 'Float none',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('float', 'none');
						} else {
							img.parent().parent().parent().parent().css('float', 'none');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			},
			removeThisMedia: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<i class="note-icon-trash"/>',
					tooltip: 'remove image',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('td')) {
							img.parent().parent().parent().parent().remove();
						} else {
							img.remove();
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			},
			imageSizeOf100: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<span class="note-fontsize-10">100%</span>',
					tooltip: 'Resize full',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('width', '100%');
						} else {
							img.parent().parent().parent().parent().css('width', '100%');
							var alignment = img.parent().parent().parent().parent().css('float');
							img.parent().css('text-align', alignment);
							img.css('width', '100%');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			},
			imageSizeOf50: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<span class="note-fontsize-10">50%</span>',
					tooltip: 'Resize half',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('width', '50%');
						} else {
							img.parent().parent().parent().parent().css('width', '50%');
							var alignment = img.parent().parent().parent().parent().css('float');
							img.parent().css('text-align', alignment);
							img.css('width', '100%');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			},
			imageSizeOf25: function (context) {
				var $editable = context.layoutInfo.editable;
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: '<span class="note-fontsize-10">25%</span>',
					tooltip: 'Resize quarter',
					click: function () {
						var img = $($editable.data('target'));
						if (img.parent().is('p') || img.parent().is('div')) {
							img.css('width', '25%');
						} else {
							img.parent().parent().parent().parent().css('width', '25%');
							var alignment = img.parent().parent().parent().parent().css('float');
							img.parent().css('text-align', alignment);
							img.css('width', '100%');
						}
						$('body > .note-popover').hide();
						$('.note-control-selection').css('display', 'none');
						context.triggerEvent('change');
					}
				});
				return button.render(); // return button as jquery object
			}
		}
	}

	$scope.snPaste = function(event){
		$timeout(function() {
			var content = vm.article.content;
			vm.article.content = content.replace(/<p><br><\/p>/g,'');
			console.log(vm.article.content);
		}, 500);
	}
}

