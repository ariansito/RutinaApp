import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rutinaapp.app',
  appName: 'RutinaApp',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  ios: {
    contentInset: "always"
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
