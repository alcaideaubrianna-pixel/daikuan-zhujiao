import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kuaidai.app',
  appName: '快贷',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowMixedContent: true
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#f5f7fb',
      style: 'LIGHT'
    }
  }
};

export default config;
