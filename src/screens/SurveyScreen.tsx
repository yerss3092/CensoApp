import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, SurveyResponse } from '../types';
import surveyService from '../services/SurveyService';

// Question components
import TextQuestion from '../components/questions/TextQuestion';
import NumberQuestion from '../components/questions/NumberQuestion';
import RadioQuestion from '../components/questions/RadioQuestion';
import CoordinatesQuestion from '../components/questions/CoordinatesQuestion';

interface Props {
  navigation: any;
  route: any;
}

const SurveyScreen: React.FC<Props> = ({ navigation, route }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [surveyId] = useState<string>(route.params?.surveyId || `survey_${Date.now()}`);

  useEffect(() => {
    initializeSurvey();
  }, [surveyId]);

  const initializeSurvey = async () => {
    try {
      setLoading(true);
      
      // Load questions from CSV
      const loadedQuestions = await surveyService.loadQuestions();
      setQuestions(loadedQuestions);

      // Load existing responses if continuing a survey
      if (route.params?.surveyId) {
        await loadExistingResponses();
      }

    } catch (error) {
      console.error('Error initializing survey:', error);
      Alert.alert('Error', 'No se pudieron cargar las preguntas de la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingResponses = async () => {
    try {
      const savedSurveys = await AsyncStorage.getItem('savedSurveys');
      if (savedSurveys) {
        const surveys: SurveyResponse[] = JSON.parse(savedSurveys);
        const existingSurvey = surveys.find(s => s.id === surveyId);
        
        if (existingSurvey) {
          const responseMap: { [key: string]: string } = {};
          existingSurvey.responses.forEach(response => {
            responseMap[response.questionId] = response.answer as string;
          });
          setResponses(responseMap);
          
          // Find the last answered question
          const lastAnsweredIndex = existingSurvey.responses.length > 0 
            ? existingSurvey.responses.length - 1 
            : 0;
          setCurrentQuestionIndex(Math.min(lastAnsweredIndex, questions.length - 1));
        }
      }
    } catch (error) {
      console.error('Error loading existing responses:', error);
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const saveSurvey = async (status: 'draft' | 'completed' = 'draft') => {
    setSaving(true);
    
    try {
      const surveyorData = await AsyncStorage.getItem('currentSurveyor');
      const surveyor = surveyorData ? JSON.parse(surveyorData) : null;

      const surveyResponse: SurveyResponse = {
        id: surveyId,
        surveyorName: surveyor?.name || 'Unknown',
        startTime: new Date(),
        responses: Object.entries(responses).map(([questionId, answer]) => ({
          questionId,
          answer,
          timestamp: new Date(),
        })),
        status,
      };

      // Load existing surveys
      const savedSurveys = await AsyncStorage.getItem('savedSurveys');
      const existingSurveys: SurveyResponse[] = savedSurveys ? JSON.parse(savedSurveys) : [];
      
      // Update or add the current survey
      const existingIndex = existingSurveys.findIndex(s => s.id === surveyId);
      if (existingIndex >= 0) {
        existingSurveys[existingIndex] = surveyResponse;
      } else {
        existingSurveys.push(surveyResponse);
      }

      await AsyncStorage.setItem('savedSurveys', JSON.stringify(existingSurveys));
      
      if (status === 'completed') {
        Alert.alert(
          'Encuesta Completada',
          'La encuesta ha sido guardada exitosamente.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }

    } catch (error) {
      console.error('Error saving survey:', error);
      Alert.alert('Error', 'No se pudo guardar la encuesta');
    } finally {
      setSaving(false);
    }
  };

  const goToNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const currentResponse = responses[currentQuestion.id];

    // Validate required fields
    if (currentQuestion.required && (!currentResponse || currentResponse.trim() === '')) {
      Alert.alert('Campo Requerido', 'Por favor responda esta pregunta antes de continuar.');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question - complete survey
      saveSurvey('completed');
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.tipo) {
      case 'number':
        return (
          <NumberQuestion
            question={question}
            value={value}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'radio':
        return (
          <RadioQuestion
            question={question}
            value={value}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'coordinates':
        return (
          <CoordinatesQuestion
            question={question}
            value={value}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      default:
        return (
          <TextQuestion
            question={question}
            value={value}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          />
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudieron cargar las preguntas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeSurvey}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Pregunta no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} de {questions.length}
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
        {renderQuestion(currentQuestion)}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>



        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={async () => {
            await saveSurvey('draft');
            goToNextQuestion();
          }}
        >
          <Text style={styles.navButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#2E7D32',
  },
  navButtonDisabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SurveyScreen;