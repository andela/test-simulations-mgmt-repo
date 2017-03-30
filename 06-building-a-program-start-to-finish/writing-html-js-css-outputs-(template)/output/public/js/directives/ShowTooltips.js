app.directive('showTooltips', function showTooltips() {
  return function onRender(scope) {
    if (scope.$last) {
      $('.tooltipped').tooltip({ delay: 50 });
    }
  };
});
