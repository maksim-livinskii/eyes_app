# Build
`./build-app`

# Run
`cordova run android`
`cordova run ios`

# Generate keystore
cd platforms/android && keytool -genkey -v -keystore example.keystore -alias example -keyalg RSA -keysize 2048 -validity 10000
