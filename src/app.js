import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import registerScreens from './registerScreens';
import { LIST, REGISTER } from './navigation/ScreensMap';
import { dataStorage } from './storage';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
registerScreens();

export class App extends Component {
    constructor(props) {
        super(props)
        this.startAppAfterLoadStore()
    }

    startAppAfterLoadStore = async () => {
        Navigation.setDefaultOptions({
            layout: {
                orientation: 'portrait'
            },
            statusBar: {
                style: 'dark',
                backgroundColor: 'white',
                drawBehind: false
            },
            topBar: {
                title: {
                    color: '#172B4D',
                    alignment: 'center'
                },
                background: {
                    color: 'white'
                },
                elevation: 0
            }
        });
        AsyncStorage.getItem('auth_key')
            .then(data => {
                const key = JSON.parse(data) || '';
                console.log(key)
                if (key) {
                    dataStorage.token = key;
                    Navigation.setRoot({
                        root: {
                            stack: {
                                id: 'rootStack',
                                children: [{
                                    component: {
                                        name: LIST,
                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'NOVA ENERGY'
                                                }
                                            },
                                            statusBar: {
                                                style: 'dark'
                                            }
                                        }
                                    }
                                }]
                            }
                        }
                    });
                    SplashScreen.hide()
                } else {
                    Navigation.setRoot({
                        root: {
                            stack: {
                                id: 'rootStack',
                                children: [{
                                    component: {
                                        name: REGISTER,
                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'NOVA ENERGY'
                                                }
                                            },
                                            statusBar: {
                                                style: 'dark'
                                            }
                                        }
                                    }
                                }]
                            }
                        }
                    });
                    SplashScreen.hide()
                }
            })
            .catch(e => {
                Navigation.setRoot({
                    root: {
                        stack: {
                            id: 'rootStack',
                            children: [{
                                component: {
                                    name: REGISTER,
                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'NOVA ENERGY'
                                            }
                                        },
                                        statusBar: {
                                            style: 'dark'
                                        }
                                    }
                                }
                            }]
                        }
                    }
                });
                SplashScreen.hide()
            })
    };

}
