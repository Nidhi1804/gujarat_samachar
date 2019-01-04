'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('ImageCropperModal', ImageCropperModal);

ImageCropperModal.$inject = ['FileUploader', '$uibModalInstance', '$scope'];

function ImageCropperModal(FileUploader, $uibModalInstance, $scope, ) {
	var vm = this;
	vm.imageType = $scope.imageType;
	vm.fileUploader = new FileUploader({});
	vm.requireFileError = false;
	vm.resImageQuality = 0.2
	vm.fileUploader.onAfterAddingFile = function (item) {
		uploadFile(item._file);
	};
	/*image clear filter: is used to remove last uploaded image*/
	vm.fileUploader.filters.push({
		name: 'clearQueueFilter',
		fn: function (item /*{File|FileLikeObject}*/, options) {
			vm.fileUploader.clearQueue();
			return true;
		}
	});

	vm.imageTypeErr = false; // by default false
	vm.imageSizerr = false;
	/*image type filter: is used to prevent image type*/
	vm.fileUploader.filters.push({
		name: 'imageTypeFilter',
		fn: function (item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			if ('|jpg|png|jpeg|gif|'.indexOf(type) == -1) {
				vm.imageTypeErr = true; // true if type mismatch
			}
			else {
				/*once type error occurs and then if image will gets uploaded with proper type
				at that time need to false below flags to hide errors from UI*/
				vm.imageTypeErr = false;
				vm.requireFileError = false;
			}

			return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
		}
	},
		{
			/* Prevent file upload greater than 3.0mb size*/
			name: 'imageSizeFilter',
			fn: function (item /*{File|FileLikeObject}*/, options) {
				if (item.size > 3145728) {
					vm.imageSizerr = true;
				} else {
					vm.imageSizerr = false;
				}
				return item.size <= 3145728; // 3.5 MiB to bytes
			}
		});
	vm.uploadedImage = '';
	vm.croppedImage = '';
	vm.closeModal = closeModal;
	vm.setImage = setImage;

	// Private function call
	Init();

	// Private functions
	function Init() {

	}

	function uploadFile(file) {
		// console.log("file : ", file);
		if (file) {
			// ng-img-crop
			var imageReader = new FileReader();
			imageReader.onload = function (image) {
				$scope.$apply(function ($scope) {
					vm.uploadedImage = image.target.result;
					/*console.log("vm.doImage",vm.doImage);
					console.log("IMG",vm.doCroppedImage);*/
				});
			};
			imageReader.readAsDataURL(file);
		}
	};

	// Bindable functions
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function setImage() {

		//(!vm.croppedImage) vm.requireFileError = true
		if (vm.uploadedImage) {
			if (!vm.croppedImage) {
				vm.croppedImage = vm.uploadedImage;
			}
			var objResponse = {
				'success': true,
				'croppedImage': vm.croppedImage
			};
			$uibModalInstance.close(objResponse);
			vm.requireFileError = false;
		}
		else {
			vm.requireFileError = true;
		}
	}

	vm.setCroppedPreview = function (base64) {
		vm.croppedImage = base64;
		$scope.$apply(); // Apply the changes.
	};
}
