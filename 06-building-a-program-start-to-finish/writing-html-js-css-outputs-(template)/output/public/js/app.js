$(document).ready(() => {
  $('.modal').modal();
  $('.carousel.carousel-slider').carousel({ fullWidth: true });
});

$(document).keydown((e) => {
  if ($('#help').hasClass('open')) {
    if (e.keyCode === 37) {
      $('.carousel.carousel-slider').carousel('prev');
    } else if (e.keyCode === 39) {
      $('.carousel.carousel-slider').carousel('next');
    }
  }
});

const auth = function auth($http, $rootScope, $location, $q) {
  const deferred = $q.defer();

  $http.get('/signedin')
    .then((user) => {
      if (user.data !== '0') {
        $rootScope.currentUser = user.data;
        deferred.resolve();
        $location.url('/profile');
      } else {
        deferred.resolve();
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'red rounded');
    });

  return deferred.promise;
};

const profileAuth = function profileAuth($http, $rootScope, $location, $q) {
  const deferred = $q.defer();

  $http.get('/signedin')
    .then((user) => {
      if (user.data !== '0') {
        $rootScope.currentUser = user.data;
        deferred.resolve();
      } else {
        deferred.resolve();
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'red rounded');
    });

  return deferred.promise;
};

const app = angular.module('FouilleApp', ['ngRoute']);

app.config(($routeProvider, $locationProvider) => {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: 'views/home.html',
      resolve: {
        logincheck: auth,
      },
    })
    .when('/profile', {
      controller: 'ProfileController',
      templateUrl: 'views/profile.html',
      resolve: {
        logincheck: profileAuth,
      },
    })
    .otherwise({
      redirectTo: '/',
    });

  $locationProvider.html5Mode(true);
});

