'use strict';

angular.module('users').controller('CardController', ['$scope', 'Authentication', '$log', '$modal', '$uibModalInstance', 'Users', '$http', 'toaster', '$window',
  function ($scope, Authentication, $log, $modal, $uibModalInstance, Users, $http, toaster, $window) {
    $scope.user = Authentication.user;

    $scope.close = function(){
      $uibModalInstance.close();
    };

    



  }
  ]);