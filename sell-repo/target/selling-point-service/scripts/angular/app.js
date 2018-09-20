
(function() {

	var app = angular.module("selling-point", [ 'ngRoute','ngCookies' ,'selling-point.configController','selling-point.configServices','selling-point.loginModule','selling-point.loginService','selling-point.productModule','selling-point.productServices']);

	app.controller("menuList", function($log,$scope,$rootScope,$location,AuthenticationService) {
		$scope.isActive = function(viewlocation) {
			return viewlocation === $location.path();
		}
		$scope.logout=function(){
			AuthenticationService.clearCredentials();
			$location.path("/");
			
		}
		
		
		
	});


	app.config(function($routeProvider, $locationProvider) {

		$routeProvider.when('/', {
			templateUrl : 'services/home/home.html',
			controller : 'homectrl'
		}).when("/userManagement/createUser",{
			templateUrl:"loginService/createUser.html",
			controller:"createuserCtrl"
		}).when("/userManagement/userList",{
			templateUrl:"loginService/userList.html",
			controller:"userlistCtrl"
		}).	when("/userManagement/editUser/:showId?",{
			templateUrl:"loginService/createUser.html",
			controller:"createuserCtrl"
		}).when("/userManagement/resetPassword/:showId?",{
			templateUrl:"loginService/forgotpassword.html",
			controller:"forgotCtrl",
		}).when("/productManagement/addProduct",{
			templateUrl:"product/sell.html",
			controller:"productListCtrl",
		}).when("/productManagement/editProduct/:showId?",{
			templateUrl:"loginService/forgotpassword.html",
			controller:"forgotCtrl",
		}).when("/productManagement/productList",{
			templateUrl:"product/productList.html",
			controller:"productListCtrl",
		})
		.otherwise({
				redirectTo : '/'
		});
		/*
		 * $locationProvider.html5Mode({ enabled: true
		 * 
		 * });
		 */
	});

	app.controller("homectrl", function($scope) {

	});
	

	app.controller('proAppCtrl', function ($scope) {

	});
	
	  
  
	

	app.run(['$rootScope', '$location', '$cookieStore', '$http',
	      function ($rootScope, $location, $cookieStore, $http) {
	          // keep user logged in after page refresh
	          $rootScope.globals = $cookieStore.get('globals') || {};
	          if ($rootScope.globals.currentUser) {
	              $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
	          }
	   
	          $rootScope.$on('$locationChangeStart', function (event, next, current) {
	              // redirect to login page if not logged in
	        if($location.path().indexOf('userManagement/resetPassword/') > -1) {
	        	
	        }
	        else  if ($location.path() !== '/' && !$rootScope.globals.currentUser) {
	                  $location.path('/');
	                  alert("Please login and access")
	              }
	          });
	      }]);
	
})();