import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { CaseScreen } from '../screens/CaseScreen';

const Tab = createBottomTabNavigator();

export const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cases" component={CaseScreen} />
    </Tab.Navigator>
  );
};
