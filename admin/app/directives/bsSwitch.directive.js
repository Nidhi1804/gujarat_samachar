// Directive: Update model value in Bootstrap Switch
// <input type="checkbox" ng-model="blah" bs-switch>
angular.module('gujaratSamachar').directive('bsSwitch', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			$(element).bootstrapSwitch({
				onSwitchChange: function(event, state) {
					scope.$apply(function() {
						ngModelCtrl.$setViewValue(state);
					});
				}
			});

			scope.$watch(function() {
				return ngModelCtrl.$modelValue;
			}, function(newVal) {
				$(element).bootstrapSwitch('state', !!newVal, true);
			});
		}
	}
});