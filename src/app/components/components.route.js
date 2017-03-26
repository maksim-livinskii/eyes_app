export function routerConfig(stateHelperProvider) {
  'ngInject';

  stateHelperProvider
    .state({
      name: 'app',
      templateUrl: 'app/app.html',
      controller: 'AppController',
      controllerAs: 'appCtrl',
      url: '',
      children: [{
        name: 'profile',
        url: 'profile',
        templateUrl: 'app/components/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
      }, {
        name: 'page1',
        url: 'page/1',
        template: '<h1>Page1</h1>'
      }, {
        name: 'camera',
        url: 'camera',
        templateUrl: 'app/components/camera/camera.html',
        controller: 'CameraController',
        controllerAs: 'vm',
      }, {
        name: 'result',
        url: 'result',
        controller: 'ResultController',
        controllerAs: 'vm'
      }]
    });
}

// {
//   name: 'notFound',
//   url: '*path',
//   template: '<h1>page not found</h1>',
// }
