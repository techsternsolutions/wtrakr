'use strict';

angular.module('users').controller('ReserPasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', 'toaster',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }



    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/dashboard');
        toaster.pop('success', 'Update Password', 'password update successful');

      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
  ]);
