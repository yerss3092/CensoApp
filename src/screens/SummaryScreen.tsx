import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface Props {
  navigation: any;
  route: any;
}

const SummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const responses = route.params?.responses || {};

  const goBackToList = () => {
    navigation.navigate('SurveyList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de Encuesta</Text>
          <Text style={styles.subtitle}>Encuesta completada exitosamente</Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total de respuestas: {Object.keys(responses).length}
          </Text>
          <Text style={styles.summaryText}>
            Fecha de finalización: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={goBackToList}>
          <Text style={styles.backButtonText}>Volver a Lista de Encuestas</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  summary: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SummaryScreen;