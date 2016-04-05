(function () {
	'use strict';

	angular.module('app.mobile',[])
	.config(function ($stateProvider) {
		$stateProvider
		  .state('apps', {
		    url: '/apps',
		    templateUrl: 'app/mobile/mobile.html',
		    controller: 'MobileCtrl'
		  });
	});
})();
