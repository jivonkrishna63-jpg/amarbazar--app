import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amarbazar.app',
  appName: 'আমারবাজার',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#059669',
    allowMixedContent: true
  }
};

export default config;
