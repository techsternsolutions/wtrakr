'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('emailActivate', {
      url: '/email/active/:token',
      templateUrl: 'modules/users/client/views/password/email-active-success.client.view.html'
    })
    .state('inviteSignUp', {
      url: '/invite/signup/:token',
      templateUrl: 'modules/users/client/views/authentication/invitation-signup.client.view.html'
    });
    
  }

  ]);
