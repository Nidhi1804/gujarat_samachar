'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('EditPageController', EditPageController);

EditPageController.$inject = ['$log', 'toastr', 'AdminService', '$state', '$stateParams', '$q', '$scope'];

function EditPageController($log, toastr, AdminService, $state, $stateParams, $q, $scope) {

	// initialize core components of jQuery plugins(bootstrap-switch)
	$scope.$on('$viewContentLoaded', function () {
		App.initAjax();
	});
	var vm = this;
	vm.pageId = $stateParams.pageId;
	vm.page = {};
	vm.page.metaKeywords = [];
	vm.getMetaTags = getMetaTags;
	vm.addTag = addTag;
	vm.updatePage = updatePage;

	if (vm.pageId && vm.pageId !== '' && vm.pageId !== null) {
		vm.typeTitle = "Edit";
		getPageInfo();
	}

	/* Reset form after submission */
	function reset() {
		vm.editPageForm.$setPristine();
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
				/* If new tag added in database than add newly created tag _id in 'vm.page.metaKeywords' model */
				if (vm.page.metaKeywords.length > 0) {
					var length = vm.page.metaKeywords.length;
					if (response.data.name == vm.page.metaKeywords[length - 1].name) {
						vm.page.metaKeywords[length - 1]._id = response.data._id;
					}
				}
			}
		});
	}

	/* Get page info by Id to edit page */
	function getPageInfo() {
		vm.isPageLoaded = false;
		App.startPageLoading({
			animate: true
		});
		AdminService.staticPages().get({
			pageId: vm.pageId
		}, function (response) {
			if (response) {
				vm.page = response.data;
				vm.isPageLoaded = true;
			}
			App.stopPageLoading();
		});
	}

	/* Update page on edit */
	function updatePage(isValid) {
		if (isValid) {
			vm.invalidForm = false;
			AdminService.staticPages().update({
				pageId: vm.pageId
			}, vm.page, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					reset();
					$state.go($state.current, {}, {
						reload: true
					});
				}
			});
		} else {
			vm.invalidForm = true;
		}
	}
	vm.options = {
		toolbar: [
			["style", ["bold", "italic", "underline", "clear"]],
			["para", ["style", "ul", "ol", "paragraph", "height"]],
			["font", ["strikethrough", "superscript", "subscript"]],
			["fontname", ["fontname"]],
			["fontsize", ["fontsize"]],
			["color", ["color"]],
			["table", ["table"]],
			["insert", ["link", "picture", "videoAttributes", "hr"]],
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
						if (img.parent().is('p')) {
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
}