'use strict';

angular.module('users').controller('UserInviteController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', '$uibModalInstance', 'toaster',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, $uibModalInstance, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.iviteEmail = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'inviteForm');
        return false;
      }

      $http.post('/api/auth/invite', this.credentials).success(function (response) {
        $scope.credentials = null;
        toaster.pop('success', 'Invitation', response.message);
        $uibModalInstance.close();
      }).error(function (response) {
        $scope.credentials = null;
        toaster.pop('warning', 'Invitation', response.message);
      });
    };


    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }


      $http.post('/api/auth/signup', this.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        // $scope.authentication.user = response;

        // And redirect to the previous or dashboard page
        toaster.pop('Sign Up', 'Update', response.message);
        $state.go('home', $state.previous.params);
        
        // $state.go($state.previous.state.name || 'dashboard', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    
  }
  ]);
