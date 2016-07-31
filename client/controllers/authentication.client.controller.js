'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$uibModal', '$uibModalInstance', 'toaster',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $uibModal, $uibModalInstance, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    $scope.showSingupForm = true;

    // If user is signed in then redirect back dashboard
    if ($scope.authentication.user) {
      $location.path('/inventory');
    }

    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.closeRestorePass = function(){
      $scope.showSingupForm = true;
    }

    $scope.showSignUp = function(){
      // $uibModalInstance.close();
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'userSignUp.html',
        controller: 'AuthenticationController',
        windowClass: 'sign-up',
        scope: $scope
      });
    };

    $scope.forgotPassword = function(){
      $scope.showSingupForm = false;
      // var uibModalInstance = $uibModal.open({
      //   animation: $scope.animationsEnabled,
      //   templateUrl: 'forgetPassword.html',
      //   controller: 'PasswordController',
      //   windowClass: 'app-modal-window',
      //   scope: $scope
      // });
    };

    $scope.showLogin = function(){
      $uibModalInstance.close();
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'userSignUp.html',
        controller: 'AuthenticationController',
        windowClass: 'app-modal-window',
        scope: $scope
      });
    };

     // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      console.log(11);

      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', this.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        toaster.pop('success', 'Restore', response.message);
        $uibModalInstance.close();
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };


    $scope.signup = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }


      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the previous or dashboard page
        $state.go('dashboard', $state.previous.params);
        // $state.go($state.previous.state.name || 'dashboard', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      $http.post('/api/auth/signin', this.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $uibModalInstance.close();
        // And redirect to the previous or dashboard page
        $state.go('inventory', $state.previous.params);
        // $state.go($state.previous.state.name || 'dashboard', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
  ]);
