'use strict';

var app = angular.module('App', ['ui.router','ui.bootstrap','ngCookies','uiGmapgoogle-maps']);

app.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});
