import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import SurveyListScreen from './src/screens/SurveyListScreen';
import SurveyScreen from './src/screens/SurveyScreen';
import SummaryScreen from './src/screens/SummaryScreen';

// Define navigation types
export type RootStackParamList = {
  Login: undefined;
  SurveyList: undefined;
  Survey: { surveyId?: string };
  Summary: { responses: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: 'Censo Resguardo',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="SurveyList" 
          component={SurveyListScreen} 
          options={{ 
            title: 'Lista de Encuestas',
            headerLeft: () => null, // Prevent going back
          }} 
        />
        <Stack.Screen 
          name="Survey" 
          component={SurveyScreen} 
          options={{ title: 'Encuesta' }} 
        />
        <Stack.Screen 
          name="Summary" 
          component={SummaryScreen} 
          options={{ title: 'Resumen' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}