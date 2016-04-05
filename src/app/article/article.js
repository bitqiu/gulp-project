(function () {
	'use strict';

	angular.module('app.article',[])
	  .config(function ($stateProvider) {
	    $stateProvider
	      .state('article', {
	        url: '/article/:aid',
	        templateUrl: 'app/article/article.html',
	        controller: 'ArticleCtrl'
	      });
	  });
})();
