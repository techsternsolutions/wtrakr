'use strict';
angular.module('users').factory('StripeService', function($http, $log){
  return {
    postStripe: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/subscripe-card',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }
  };
});