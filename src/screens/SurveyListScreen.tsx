import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Surveyor, SurveyResponse } from '../types';
import firebaseDataService from '../services/firebaseDataService';

interface Props {
  navigation: any;
}

interface SurveyItem {
  id: string;
  title: string;
  status: 'new' | 'draft' | 'completed';
  lastModified?: Date;
  progress?: number;
}

const SurveyListScreen: React.FC<Props> = ({ navigation }) => {
  const [surveyor, setSurveyor] = useState<Surveyor | null>(null);
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await loadSurveyorData();
      await loadSurveys();
      await syncWithFirebase();
    };
    initialize();
  }, []);

  const loadSurveyorData = async () => {
    try {
      const surveyorData = await AsyncStorage.getItem('currentSurveyor');
      if (surveyorData) {
        setSurveyor(JSON.parse(surveyorData));
      }
    } catch (error) {
      console.error('Error loading surveyor data:', error);
    }
  };

  const loadSurveys = async () => {
    try {
      const savedSurveys = await AsyncStorage.getItem('savedSurveys');
      if (savedSurveys) {
        const parsedSurveys: SurveyResponse[] = JSON.parse(savedSurveys);
        const surveyItems: SurveyItem[] = parsedSurveys.map((survey, index) => ({
          id: survey.id,
          title: `Encuesta ${index + 1}`,
          status: survey.status === 'completed' ? 'completed' : 'draft',
          lastModified: new Date(survey.startTime),
          progress: survey.responses.length > 0 ? Math.round((survey.responses.length / 268) * 100) : 0,
        }));
        setSurveys(surveyItems);
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  const syncWithFirebase = async () => {
    if (!surveyor?.id) {
      console.log('No hay ID de encuestador, saltando sincronización');
      return;
    }

    try {
      console.log('Iniciando sincronización con Firebase...');
      
      // Obtener encuestas locales
      const savedSurveys = await AsyncStorage.getItem('savedSurveys');
      if (savedSurveys) {
        const localSurveys: SurveyResponse[] = JSON.parse(savedSurveys);
        
        // Sincronizar encuestas completadas que no estén en Firebase
        const completedSurveys = localSurveys.filter(s => 
          s.status === 'completed' && !s.id.includes('firebase')
        );
        
        if (completedSurveys.length > 0) {
          await firebaseDataService.syncLocalSurveys(completedSurveys, surveyor.id);
          console.log(`${completedSurveys.length} encuestas sincronizadas con Firebase`);
        }

        // Obtener estadísticas de Firebase
        const stats = await firebaseDataService.getSurveyStats();
        console.log('Estadísticas Firebase:', stats);
      }
    } catch (error) {
      console.log('Error en sincronización Firebase (modo offline):', error);
      // No mostrar error al usuario, seguir funcionando offline
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSurveys();
    await syncWithFirebase();
    setRefreshing(false);
  };

  const startNewSurvey = () => {
    const newSurveyId = `survey_${Date.now()}`;
    navigation.navigate('Survey', { surveyId: newSurveyId });
  };

  const continueSurvey = (surveyId: string) => {
    navigation.navigate('Survey', { surveyId });
  };

  const deleteSurvey = async (surveyId: string) => {
    Alert.alert(
      'Eliminar Encuesta',
      '¿Está seguro que desea eliminar esta encuesta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const savedSurveys = await AsyncStorage.getItem('savedSurveys');
              if (savedSurveys) {
                const parsedSurveys: SurveyResponse[] = JSON.parse(savedSurveys);
                const filteredSurveys = parsedSurveys.filter(s => s.id !== surveyId);
                await AsyncStorage.setItem('savedSurveys', JSON.stringify(filteredSurveys));
                loadSurveys();
              }
            } catch (error) {
              console.error('Error deleting survey:', error);
              Alert.alert('Error', 'No se pudo eliminar la encuesta');
            }
          },
        },
      ]
    );
  };

  const logout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await AsyncStorage.removeItem('currentSurveyor');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'draft':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'draft':
        return 'Borrador';
      default:
        return 'Nueva';
    }
  };

  const renderSurveyItem = ({ item }: { item: SurveyItem }) => (
    <TouchableOpacity
      style={styles.surveyItem}
      onPress={() => continueSurvey(item.id)}
    >
      <View style={styles.surveyItemContent}>
        <View style={styles.surveyItemHeader}>
          <Text style={styles.surveyTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        
        {item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progreso: {item.progress}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
        )}
        
        {item.lastModified && (
          <Text style={styles.lastModified}>
            Última modificación: {item.lastModified.toLocaleDateString()}
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteSurvey(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.surveyorName}>{surveyor?.name || 'Encuestador'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* New Survey Button */}
      <TouchableOpacity style={styles.newSurveyButton} onPress={startNewSurvey}>
        <Text style={styles.newSurveyButtonText}>+ Nueva Encuesta</Text>
      </TouchableOpacity>

      {/* Survey List */}
      <FlatList
        data={surveys}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id}
        style={styles.surveyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No hay encuestas guardadas
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Toque "Nueva Encuesta" para comenzar
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  surveyorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 14,
  },
  newSurveyButton: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newSurveyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  surveyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  surveyItem: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  surveyItemContent: {
    flex: 1,
  },
  surveyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  lastModified: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default SurveyListScreen;