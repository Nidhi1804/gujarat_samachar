angular
	.module('gujaratSamachar')
	.component('confirmModal', {
		templateUrl: 'components/confirmModal.view.html',
		bindings: {
			name: "@",
			id: "@",
			type: '@',
			onConfirm: '&'
		},
		controllerAs: 'vm',
		controller: function (AdminService, $q, $scope, $uibModal) {
			var vm = this;
			vm.onAction = onAction;
			vm.showDelErr = false;
			vm.delArray = vm.id;
			vm.getAllowIpStatus = getAllowIpStatus;
			vm.onIPAction = onIPAction;
			function onAction() {
				vm.delArray = vm.id.toString();
				$scope.confirmMsg = "Are you sure want to " + vm.type + " selected " + vm.name + " ?";
				/* Show alert for multiple item delete, show error if 0 items selected */
				if (vm.type == 'delete selected' || vm.type == 'activate selected' || vm.type == 'inactive selected' || vm.type == 'allow all') {
					if (vm.id.length == 0) {
						vm.showDelErr = true;
					}
					else {
						if (vm.allowAllIp !== undefined && vm.allowAllIp === false && vm.type == 'allow all') {
							vm.type = 'diciable all'
						}
						vm.showDelErr = false;
						$scope.confirmMsg = "Are you sure want to " + vm.type + " " + vm.name + " ?";
					}

				}
				if (!vm.showDelErr) {
					var deleteUserInstance = $uibModal.open({
						templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
						controller: 'confirmModalController as vm',
						scope: $scope
					});
					deleteUserInstance.result.then(function (result) {
						if (result) {
							if (vm.type == 'delete selected' || vm.type == 'activate selected' || vm.type == 'inactive selected') {
								if (typeof vm.id == 'string')
									vm.id = JSON.parse(vm.id);
							}
							if (vm.type == 'delete' || vm.type == 'delete selected') {
								vm.onConfirm({ id: vm.id });
							}
							if (vm.type == 'allow all' || vm.type == 'diciable all') {
								vm.onConfirm({ id: vm.allowAllIp });
							}
							else {
								if (vm.type == 'activate' || vm.type == 'activate selected')
									vm.onConfirm({ id: vm.id, status: 1 });
								else if (vm.type == 'Inactive' || vm.type == 'inactive selected')
									vm.onConfirm({ id: vm.id, status: 0 });
							}
						}
					}, function (err) {
						console.info('Modal dismissed at: ' + new Date());
						getAllowIpStatus();
					});
				}
			}

			function onIPAction() {
				console.log('Ip action call');
				if (vm.allowAllIp !== undefined && vm.allowAllIp === false && vm.type == 'allow all') {
					vm.type = 'diciable all'
				}
				vm.showDelErr = false;
				$scope.confirmMsg = "Are you sure want to restrict allowed IP only?";
				if (!vm.showDelErr) {
					var deleteUserInstance = $uibModal.open({
						templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
						controller: 'confirmModalController as vm',
						scope: $scope
					});
					deleteUserInstance.result.then(function (result) {
						if (result) {
							if (vm.type == 'allow all' || vm.type == 'diciable all') {
								vm.onConfirm({ id: vm.allowAllIp });
							}else {
								if (vm.type == 'activate' || vm.type == 'activate selected')
									vm.onConfirm({ id: vm.id, status: 1 });
								else if (vm.type == 'Inactive' || vm.type == 'inactive selected')
									vm.onConfirm({ id: vm.id, status: 0 });
							}
						}
					},
					function (err) {
						console.info('Modal dismissed at: ' + new Date());
						getAllowIpStatus();
					});
				}
			}
			function getAllowIpStatus() {
				AdminService.allowAllStatus().get({}, function (status) {
					if (status.code == 200) {
						vm.allowAllIp = status.data[0].ipConfig;
					} else {
						vm.allowAllIp = false;
					}
				});
			}
		}
	});
