'use strict';

angular.module('users').controller('EmailctivationController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', 'toaster',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    $scope.success = false;
    $scope.danger = false;

    if ($scope.authentication.user) {
      $location.path('/dashboard');
    }

    $scope.activate = function (isValid) {
      $http.get('api/auth/activare/' + $stateParams.token).success(function (response) {
        $scope.success = true;
      }).error(function (response) {
        $scope.danger = true;
        $scope.error = response.message;
      });
    };




  }
  ]);
