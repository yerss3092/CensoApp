import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import * as Location from 'expo-location';
import { Question } from '../../types';

interface Props {
  question: Question;
  value: string;
  onValueChange: (value: string) => void;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const CoordinatesQuestion: React.FC<Props> = ({ question, value, onValueChange }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const coords = JSON.parse(value);
        setCoordinates(coords);
      } catch (error) {
        console.error('Error parsing coordinates:', error);
      }
    }
  }, [value]);

  const getCurrentLocation = async () => {
    setLoading(true);
    
    try {
      // For now, we'll use mock coordinates until expo-location is properly configured
      // In a real implementation, uncomment the Location.* code below
      
      /*
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      */
      
      // Mock coordinates for development
      const coords = {
        latitude: 4.6097 + (Math.random() - 0.5) * 0.01, // Colombia approximate
        longitude: -74.0817 + (Math.random() - 0.5) * 0.01,
      };
      
      setCoordinates(coords);
      onValueChange(JSON.stringify(coords));
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    setCoordinates(null);
    onValueChange('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.numero}. {question.pregunta}
        {question.required && <Text style={styles.required}> *</Text>}
      </Text>
      
      {coordinates ? (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesLabel}>Ubicación capturada:</Text>
          <Text style={styles.coordinatesText}>
            Latitud: {coordinates.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinatesText}>
            Longitud: {coordinates.longitude.toFixed(6)}
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={getCurrentLocation}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearLocation}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Text style={styles.captureButtonText}>
            {loading ? 'Obteniendo ubicación...' : '📍 Capturar Ubicación'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  required: {
    color: '#f44336',
  },
  captureButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  coordinatesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CoordinatesQuestion;