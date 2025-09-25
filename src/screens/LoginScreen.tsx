import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import firebaseDataService from '../services/firebaseDataService';
import { Surveyor } from '../types';
import { testFirebaseConnection } from '../utils/firebaseTest';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [surveyorId, setSurveyorId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebase = async () => {
    Alert.alert(
      '🔥 Probar Firebase',
      '¿Quieres probar la conexión con Firebase?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Probar', 
          onPress: async () => {
            try {
              setLoading(true);
              const success = await testFirebaseConnection();
              
              if (success) {
                Alert.alert('✅ Éxito', 'Firebase está funcionando correctamente!');
              } else {
                Alert.alert('❌ Error', 'Hubo un problema con Firebase');
              }
            } catch (error) {
              Alert.alert('❌ Error', 'Error de conexión: ' + error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogin = async () => {
    if (!surveyorId.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingrese su ID de encuestador y contraseña');
      return;
    }

    setLoading(true);
    
    try {
      // Crear datos del encuestador
      const surveyorData: Surveyor = {
        id: '',
        name: surveyorId.trim(),
        email: undefined,
        assignedArea: undefined,
        loginTime: new Date().toISOString(),
      };

      console.log('Iniciando sesión encuestador:', surveyorData.name);
      
      try {
        // Intentar buscar encuestador existente en Firebase
        const existingSurveyor = await firebaseDataService.getSurveyorByName(surveyorData.name);
        
        if (existingSurveyor) {
          // Encuestador existe, actualizar última actividad
          await firebaseDataService.updateSurveyorLastActive(existingSurveyor.id);
          surveyorData.id = existingSurveyor.id;
          console.log('Encuestador encontrado en Firebase:', existingSurveyor.id);
        } else {
          // Encuestador nuevo, guardarlo en Firebase
          const newId = await firebaseDataService.saveSurveyor(surveyorData);
          surveyorData.id = newId;
          console.log('Nuevo encuestador guardado en Firebase:', newId);
        }
      } catch (firebaseError) {
        console.log('Error conectando con Firebase, usando modo offline:', firebaseError);
        // En modo offline, usar timestamp como ID temporal
        surveyorData.id = 'offline_' + Date.now();
      }

      // Guardar localmente (siempre funciona)
      await AsyncStorage.setItem('currentSurveyor', JSON.stringify(surveyorData));
      console.log('Datos guardados localmente, navegando...');
      
      // Navegar a lista de encuestas
      navigation.replace('SurveyList');
      
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Censo Resguardo</Text>
            <Text style={styles.subtitle}>Sistema de Encuestas</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Text style={styles.label}>ID de Encuestador</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su ID de encuestador"
              value={surveyorId}
              onChangeText={setSurveyorId}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            {/* Botón temporal para probar Firebase */}
            <TouchableOpacity
              style={[styles.testButton, loading && styles.loginButtonDisabled]}
              onPress={testFirebase}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                🔥 Probar Firebase
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Aplicación para el censo de población indígena
            </Text>
            <Text style={styles.versionText}>Versión 1.0.0</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '500',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5A5A5',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#F57C00',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default LoginScreen;