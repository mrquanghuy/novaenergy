import React from 'react';
import { Navigation } from 'react-native-navigation';

import * as SCREEN_MAP from './navigation/ScreensMap';
import Register from './screens/Register';
import List from './screens/List';
import Detail from './screens/Detail';
import Calculate from './screens/Calculate';

export default function registerScreens() {
    Navigation.registerComponent(SCREEN_MAP.REGISTER, () => Register);
    Navigation.registerComponent(SCREEN_MAP.LIST, () => List);
    Navigation.registerComponent(SCREEN_MAP.DETAIL, () => Detail);
    Navigation.registerComponent(SCREEN_MAP.CALCULATE, () => Calculate);
    console.info('All screens have been registered...');
}
