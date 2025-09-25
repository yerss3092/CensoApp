
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Perfil de Encuestador</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
      />
      <Button title="Crear Perfil" onPress={() => {}} />
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
});

export default CreateProfileScreen;
