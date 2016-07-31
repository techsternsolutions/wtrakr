'use strict';

angular.module('users').controller('InviteSignupController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', 'toaster', '$state',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, toaster, $state) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    if ($scope.authentication.user) {
      $location.path('/dashboard');
    }

    $scope.inviteUserDetails = function () {
      console.log($stateParams.token);
      $http.get('api/auth/invite/' + $stateParams.token).success(function (response) {
        $scope.credentials = response;
      }).error(function (response) {
        console.log(response);
        $scope.danger = true;
        $scope.error = response.message;
      });
    };

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/inviteSignup', this.credentials).success(function (response) {
        toaster.pop('Sign Up', 'Update', response.message);
        $state.go('home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };


  }
  ]);
