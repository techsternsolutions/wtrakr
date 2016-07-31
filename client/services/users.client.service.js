'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
  ]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  ]);


angular.module('users').factory('CustomUser', function($http, $log){
  return {
    removeUser: function(userId){
      var promise = $http({
        method: 'delete',
        url: 'api/users/'+userId,
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    updateUser: function(userId, data){
      var promise = $http({
        method: 'put',
        url: 'api/users/'+userId,
        data: data
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    invitedUser: function(userId){
      var promise = $http({
        method: 'get',
        url: 'api/invited/users/'+userId
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }
  };
});
