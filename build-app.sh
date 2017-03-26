#/bin/sh

# gulp build-app
cordova platform add ios
cordova platform add android

cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-image-picker

cordova build ios
cordova build android
