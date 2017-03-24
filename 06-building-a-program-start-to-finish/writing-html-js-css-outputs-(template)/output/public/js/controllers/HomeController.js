app.controller('HomeController',
function homeCtrl($scope, $http, $rootScope, $location) {
  $(document).keydown((e) => {
    if (e.keyCode === 37) {
      $('.carousel.carousel-slider').carousel('prev');
    } else if (e.keyCode === 39) {
      $('.carousel.carousel-slider').carousel('next');
    }
  });
  $scope.$on('$routeChangeSuccess', () => {
    $('.modal').modal();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
    });
  });
  $scope.incorrectLogin = false;
  $scope.signup = (user) => {
    $('#signup-preloader').addClass('active');
    $http.post('/signup', user)
      .then((res) => {
        if (res.status === 200) {
          $rootScope.currentUser = res.data;
          $location.url('/profile');
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
