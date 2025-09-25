
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  CreateProfile: undefined;
  Survey: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario o Correo Electrónico"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />
      <Button title="Ingresar" onPress={() => {}} />
      <View style={styles.createProfileButtonContainer}>
        <Button title="Crear Perfil" onPress={() => navigation.navigate('CreateProfile')} color="#841584" />
      </View>
      <View style={styles.tempSurveyButtonContainer}>
        <Button title="Ir a Encuesta (Temporal)" onPress={() => navigation.navigate('Survey')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 8,
  },
  createProfileButtonContainer: {
    marginTop: 10,
  },
});

export default LoginScreen;
