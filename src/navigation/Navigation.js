import { Navigation } from 'react-native-navigation';
import * as SCREEN_MAP from './ScreensMap';

export function pushModal(screens, passProps = {}) {

    Navigation.showModal({
        stack: {
            children: [{
                component: {
                    id: screens,
                    name: screens,
                    passProps: {
                        ...passProps
                    },
                    options: {
                        screenBackgroundColor: 'transparent',
                        modalPresentationStyle: 'overCurrentContext',
                        statusBar: {
                            // style: 'light',
                            visible: true,
                            drawBehind: false
                            // backgroundColor: 'rgba(0,0,0,0.6)'
                        },
                        topBar: {
                            visible: false,
                            height: 0
                        },
                        bottomTabs: {
                            visible: false,
                            drawBehind: false
                        },
                        animations: {
                            showModal: {
                                waitForRender: true,
                                enabled: false,
                                alpha: {
                                    from: 0,
                                    to: 1,
                                    duration: 250
                                }
                            },
                            dismissModal: {
                                waitForRender: true,
                                enabled: true,
                                alpha: {
                                    from: 1,
                                    to: 0,
                                    duration: 250
                                }
                            }
                        },
                        blurOnUnmount: true
                    }
                }
            }]
        }
    })
        .then(() => {
        })
        .catch(e => {
        });
}

export function pushSingleScreen(stackId, screenId, title, passProps = {}, showHeader = true, topBarOptions = {}, key = null) {
    Navigation.push(
        stackId,
        {
            component: {
                name: screenId,
                passProps: {
                    screenName: screenId,
                    ...passProps
                },
                options: {
                    topBar: {
                        animate: true,
                        title: {
                            text: title,
                            alignment: 'center'
                        },
                        height: showHeader ? 50 : 0,
                        visible: showHeader,
                        elevation: 1,
                        ...topBarOptions
                    },
                    sideMenu: {
                        left: {
                            enabled: false
                        }
                    },
                    bottomTabs: {
                        visible: false,
                        drawBehind: true,
                        animate: false
                    }
                }
            }
        })
        .then(() => {
        })
        .catch(e => {
            console.log(e);
            // stackPop(pushedId, stackId)
        });
}

export function startSingleScreenApp() {
    Navigation.setRoot({
        root: {
            component: {
                name: SCREEN_MAP.ONBOARDING,
                options: {
                    statusBar: {
                        backgroundColor: 'white',
                        style: 'dark'
                    },
                    layout: {
                        backgroundColor: 'white'
                    },
                    topBar: {
                        visible: false,
                        height: 0
                    }
                }
            }
        }
    })
}
