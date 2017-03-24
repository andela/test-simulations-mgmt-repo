$(document).ready(() => {
  $('.modal').modal();
  $('.carousel.carousel-slider').carousel({ fullWidth: true });
});

const auth = function auth($http, $rootScope, $location, $q) {
  const deferred = $q.defer();

  $http.get('/signedin')
    .then((user) => {
      if (user.data !== '0') {
        $rootScope.currentUser = user.data;
        deferred.resolve();
      } else {
        deferred.reject();
        $location.url('/');
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'rounded');
    });

  return deferred.promise;
};

const app = angular.module('FouilleApp', ['ngRoute']);

app.config(($routeProvider, $locationProvider) => {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: 'views/home.html',
    })
    .when('/profile', {
      controller: 'ProfileController',
      templateUrl: 'views/profile.html',
      resolve: {
        logincheck: auth,
      }
    })
    .otherwise({
      redirectTo: '/',
    });

  $locationProvider.html5Mode(true);
});

