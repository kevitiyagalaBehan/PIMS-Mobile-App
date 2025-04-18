import 'dotenv/config';

export default {
  expo: {
    name: "PIMS",
    slug: "PIMS",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/pims_logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/pims_logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/app_icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.pims_app.PIMS",
    },
    web: {
      favicon: "./assets/app_icon.png",
    },
    plugins: ["expo-asset"],
    extra: {
      eas: {
        projectId: "2443f24a-aee5-4b52-9478-070288e766a8"
      },
      apiBaseUrl: process.env.API_BASE_URL,
      appEnv: process.env.APP_ENV,
    },
  },
};

{/*

{
  "expo": {
    "name": "PIMS",
    "slug": "PIMS",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/pims_logo.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/pims_logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/app_icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.pims_app.PIMS"
    },
    "web": {
      "favicon": "./assets/app_icon.png"
    },
    "plugins": [
      "expo-asset"
    ],
    "extra": {
      "eas": {
        "projectId": "2443f24a-aee5-4b52-9478-070288e766a8"
      }
    }
  }
}

*/}
