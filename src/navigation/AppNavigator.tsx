
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';

import SurveyScreen from '../screens/SurveyScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} options={{ title: 'Crear Perfil' }} />
        <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: 'Encuesta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
