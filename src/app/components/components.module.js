import angular from 'angular';

import { ProfileController } from './profile/profile.controller';
import { CameraController } from './camera/camera.controller';

import { routerConfig } from './components.route';

const components = angular.module('eyes.components', [
])
.config(routerConfig)
.controller('ProfileController', ProfileController)
.controller('CameraController', CameraController)

export default components.name;
