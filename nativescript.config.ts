import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.studymaterialsapp',
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true,
    enableScreenCapture: true
  }
} as NativeScriptConfig;