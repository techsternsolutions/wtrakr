'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$log', '$uibModal', 'FileUploader', '$window', '$timeout', 'Users', 'toaster', '$uibModalInstance', 'PasswordValidator', '$http', 'CustomUser', 'Country', 'countries',
  function ($scope, Authentication, $log, $uibModal, FileUploader, $window, $timeout, Users, toaster, $uibModalInstance, PasswordValidator, $http, CustomUser, Country, countries) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    $scope.countries = countries;

    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.roles = [
    {'label':'Admin', 'value': 'admin' }, 
    {'label':'Read', 'value': 'guest'}, 
    {'label':'Write', 'value': 'user'}
    ];



    $scope.removeUser = function (user) {
      CustomUser.removeUser(user._id).then(function(result) {
        $scope.findUsers();
        toaster.pop('success', 'Remove user', 'User remove successful');
      });
    };


    $scope.iviteEmail = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');
        return false;
      }
      this.credentials.firstName ='Sir';
      this.credentials.lastName ='.';
      this.credentials.invitedBy = $scope.user._id;

      $http.post('/api/auth/invite', this.credentials).success(function (response) {
        $scope.credentials = null;
        toaster.pop('success', 'Invitation', response.message);
        $uibModalInstance.close();
      }).error(function (response) {
        $scope.credentials = null;
        toaster.pop('warning', 'Invitation', response.message);
      });
    };

    $scope.changeUserRole = function (userRoles) {
      var newUser = userRoles;
      newUser.roles = [this.user.role]; 
      CustomUser.updateUser(newUser._id, newUser, function () {
        $scope.findUsers();
        toaster.pop('success', 'Update Role', 'User role update successful');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Users
    $scope.findUsers = function () {
      CustomUser.invitedUser($scope.user._id).then(function(result) {
        $scope.invitedUsers = result;
      });
    };

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }
      // console.log(this.passwordDetails);


      $http.post('/api/users/password', this.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        this.passwordDetails = null;
        toaster.pop('success', 'Update Profile', 'Password update successful');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };



    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        toaster.pop('success', 'User Profile', 'user profile update successful');

        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    // Update a user profile
    $scope.updateUsers = function (userId) {

      // var checkbox = event.target.id;

      console.log(userId);
      return;

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        toaster.pop('success', 'User Profile', 'user profile update successful');

        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|JPG|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };


    // $scope.findCountry = function () {
    //   $scope.countries = Country.query();
    // };



    $scope.dropDown = function(){
      var countryIndex='';
      $('#country').on('change', function(){
        for(var i = 0; i < $scope.countries.length; i++){
          if($scope.countries[i].title == $(this).val()){
            countryIndex = i;
            $('#state').html('<option value="">Select State</option>');
            $.each($scope.countries[i].state, function (index, value) {
              $("#state").append('<option value="'+value.title+'">'+value.title+'</option>');
            });
          }
        }
      });
    };



    $timeout(function() {
      $scope.dropDown();
    }, 1000);




  }
  ])
.directive('ngConfirmClick', [
  function(){
    return {
      priority: 1,
      terminal: true,
      link: function (scope, element, attr) {
        var msg = attr.ngConfirmClick || "Are you sure?";
        var clickAction = attr.ngClick;
        element.bind('click',function (event) {
          if ( window.confirm(msg) ) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }]);