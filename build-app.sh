#/bin/sh

# gulp build-app
cordova platform add ios
cordova platform add android

cd platforms/android && keytool -genkey -v -keystore example.keystore -alias example -keyalg RSA -keysize 2048 -validity 10000

cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-image-picker --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="your message"
cordova plugin add cordova-plugin-android-permissions
cordova plugin add cordova-plugin-statusbar


cordova build ios
cordova build android
