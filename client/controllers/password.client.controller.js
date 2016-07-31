'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', '$modalInstance', 'toaster',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, $modalInstance, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.close = function(){
      console.log(11);

      $modalInstance.close();
    };

   // this controller are not using
  }
  ]);
