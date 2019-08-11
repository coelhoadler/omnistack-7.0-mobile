import { createAppContainer, createStackNavigator } from 'react-navigation';
import React from 'react';
import { Image, View } from 'react-native';

import Feed from './pages/Feed';
import New from './pages/New';

import logo from './assets/logo.png';

export default createAppContainer(
    createStackNavigator({
        Feed,
        New,
    }, {
        initialRouteName: 'Feed',
        defaultNavigationOptions: {
                headerTitle: <Image
                    source={logo} style={{
                        flex: 1, 
                        width: 60, 
                        height: 29, 
                        resizeMode: 'contain'
                    }} />,
            headerBackTitle: null,
            headerTintColor: '#000'
        },
        mode: 'modal',
        headerLayoutPreset: 'center',        
    })
);