(function () {
  'use strict';

  angular.module('app.mobile')
    .controller('MobileCtrl', function ($scope,Mobile) {
    	Mobile.getApps().then(function (result) {
    		$scope.apps = result.data;
    	});
    });
})();
