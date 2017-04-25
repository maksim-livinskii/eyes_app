import angular from 'angular';

import componentsModule from './components/components.module';

import { AppController } from './app.controller';

require('../assets/styles/main.less');

const appModule = angular.module('eyes', [
  'ui.router',
  'ui.router.stateHelper',
  'ngFileUpload',
  'nvd3',
  componentsModule,
  // sharedModule
])
// .config(routerConfig)
.controller('AppController', AppController);

/**
 * Startup the application
 */
function bootstrap() {

  console.log('bootstraped');

  appModule.config(($locationProvider) => {
    // Use html5 to get rid of the hash tag if not on the browser

    // TODO: enable html5
    // $locationProvider.html5Mode(true);

    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: true
    // });
  });

  angular.bootstrap(document, ['eyes']);
}

/**
 * If we are on the device, wait until cordova is ready.  Otherwise, just boot up when document is ready
 */
try {
  angular.element(document).ready(() => {
    if (window.cordova) {
      console.log('window.cordova', window.cordova);
      document.addEventListener('deviceready', () => {

        StatusBar.hide();
        navigator.splashscreen.hide();

        let permissions = window.cordova.plugins && window.cordova.plugins.permissions;

        if (permissions) {
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
            console.log('is camera ready ? ', status.hasPermission);
            if (status.hasPermission) {
              bootstrap();
            } else {
              console.log('not permissions');
            }
          }, () => {
            console.log('not permissions');
          });
        } else {
          bootstrap();
        }

      }, false);
    } else {
      angular.element(document).ready(function() {
        bootstrap();
      });
    }
  });
} catch (e) {
  console.log(e);
}
