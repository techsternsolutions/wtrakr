'use strict';

angular.module('users').controller('SubscriptionController', ['$scope', 'Authentication', '$log', '$uibModal', '$uibModalInstance', 'Users', 'toaster', '$http', '$window',
  function ($scope, Authentication, $log, $uibModal, $uibModalInstance, Users, toaster, $http, $window) {
    
    Stripe.setPublishableKey('pk_test_x8DtEFWIWovudA9PEwq6pSDY');
    $scope.user = Authentication.user;

    $scope.close = function(){
      $uibModalInstance.close();
    };



    $scope.expMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.expYears = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];


    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
       $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      if(this.package.lite){
        $scope.user.membership.package = this.user.membership.package;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.addCard = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'stripeCard');
        return false;
      }

      Stripe.card.createToken(this.card, function(status, response) {
       $scope.$apply(function () {
        if (status === 200){
          var data = {
            token: response.id, 
            name: response.card.name, 
            exp_month: response.card.exp_month, 
            exp_year: response.card.exp_year, 
            last4: response.card.last4, 
            userId: $scope.user._id
          };

          $http.post('/api/subscripe-card', data).success(function(customerId) {
            // $scope.close();
            $window.location.reload();
            toaster.pop('success', 'Card Update', 'card update successful');
          }).error(function(message) {
            $scope.error = message.error.message;
          });
        } else {
          $scope.error = response.error.message;
        }
      });
     });
    };


  // Update a user Plan
  $scope.updatePlan = function (isValid) {

    console.log(1);
    $scope.success = $scope.error = null;

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'userForm');

      return false;
    }

    if($scope.user.paymentMethods && $scope.user.paymentMethods.customer_id){

      $scope.user.membership.package = this.user.membership.package;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;

        if($scope.user.membership.package=='Starter'){
          toaster.pop('success', 'Plan Update', 'plan update successful');
        }else{
          $scope.chargeCard();
        }

      }, function (response) {
        $scope.error = response.data.message;
      });
    }else{
      toaster.pop('warning', 'Warning', 'Please update card first');
    }
  };

  $scope.chargeCard = function() {
    $scope.processingError = 'PENDING';

    $http.post('/api/package-change', {userId: $scope.user._id}).success(function(result) {

      Authentication.user = result;
      console.log(result);

      toaster.pop('success', 'Package Change', 'Package change successful');

    }).error(function(message) {
      $scope.processingError = message;
    });
  };

  // $scope.addCard = function(){
  //   var uibModalInstance = $modal.open({
  //     animation: $scope.animationsEnabled,
  //     templateUrl: 'userCard.html',
  //     controller: 'CardController',
  //     windowClass: 'card-details',
  //     scope: $scope
  //   });
  // };



}
]);