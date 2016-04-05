(function () {
    'use strict';

    angular.module('app.service')
        .factory('CustomModalService', function ($modal) {
          return {
            open: function (ctrlName,url,size) {
                $modal.open({
                    templateUrl: url,
                    controller: ctrlName,
                    size: size
                });
            }
          };
        });
})();


