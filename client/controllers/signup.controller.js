'use strict';

angular.module('users').controller('SignUpController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'toaster',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, toaster) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back dashboard
    if ($scope.authentication.user) {
      $location.path('/dashboard');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }


      $http.post('/api/auth/signup', this.credentials).success(function (response) {
        // If successful we assign the response to the global user model

        // And redirect to the previous or dashboard page
        toaster.pop('Sign Up', 'Update', "An email has been sent to the provided email with further instructions");
        $state.go('home', $state.previous.params);
        
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
