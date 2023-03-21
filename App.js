import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import IndexScreen from './view/IndexScreen';
import ModeScreen from './view/ModeScreen';
import LoadScreen from './view/LoadScreen';
import PlayerScreen from './view/PlayerScreen';
import GameScreen from './view/GameScreen';
import ComputerScreen from './view/ComputerScreen';
import SettingScreen from './view/SettingScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Index" component={IndexScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Load" component={LoadScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Mode" component={ModeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Computer" component={ComputerScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Player" component={PlayerScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Game" component={GameScreen} options={{headerShown:false,gestureEnabled:false}}/>
        <Stack.Screen name="Setting" component={SettingScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
