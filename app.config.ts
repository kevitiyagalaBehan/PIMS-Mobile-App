import 'dotenv/config';

export default {
  expo: {
    name: "PIMS",
    slug: "PIMS",
    version: "1.0.8",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      versionCode: 26,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      statusBar: {
        backgroundColor: "#ffffff",
        barStyle: "dark-content"
      },
      package: "com.pims_app.PIMS",
    },
    web: {
      favicon: "./assets/adaptive-icon.png",
    },
    plugins: ["expo-asset",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain"
        }
      ]
    ],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      aasDocPath: process.env.AAS_DOC_PATH,
      appEnv: process.env.APP_ENV,
      eSigningBaseUrl: process.env.E_SIGNING_BASE_URL,
      eas: {
        projectId: "3a492d15-b6a8-427d-afb2-a5dbcba5c041"
      }
    },
  },
};


