import { Navigation } from 'react-native-navigation';
import { App } from './src/app';
import { YellowBox } from 'react-native';
// import bgMessaging from './src/firebase/bgMessaging';

YellowBox.ignoreWarnings(['Remote debugger']);

console.disableYellowBox = true;

// todo: fix this
// see https://github.com/facebook/react-native/issues/15059 for more detail
console.reportErrorsAsExceptions = false;

Navigation.events().registerAppLaunchedListener(() => new App());
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
