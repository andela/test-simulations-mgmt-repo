app.controller('HomeController',
function homeCtrl($scope, $http, $rootScope, $location) {
  $scope.$on('$routeChangeSuccess', () => {
    $('.modal').modal();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
    });
  });

  $scope.usernameExists = false;
  $scope.incorrectLogin = false;
  $scope.openSignup = () => {
    $('#signup').modal('open');
  };
  $scope.openSignin = () => {
    $('#signin').modal('open');
  };
  $scope.signup = (user) => {
    $('#signup-preloader').addClass('active');
    $http.post('/signup', user)
      .then((res) => {
        if (res.status === 200) {
          $rootScope.currentUser = res.data;
          $location.url('/profile');
        } else if (res.status === 204) {
          $('#signup-preloader').removeClass('active');
          $scope.usernameExists = true;
        }
      }, (err) => {
        $('#signup-preloader').removeClass('active');
        Materialize.toast(err.message, 5000, 'rounded');
      });
  };
  $scope.signin = (user) => {
    $('#signin-preloader').addClass('active');
    $http.post('/signin', user)
      .then((res) => {
        $rootScope.currentUser = res.data;
        $location.url('/profile');
      }, (err) => {
        if (err.status === 401) {
          $('#signin-preloader').removeClass('active');
          $scope.incorrectLogin = true;
        }
      });
  };
});
