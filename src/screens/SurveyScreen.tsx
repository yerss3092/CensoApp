
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { getSurveyQuestions, SurveyQuestion } from '../services/surveyService';
import OpenQuestion from '../components/questions/OpenQuestion';
import SingleChoiceQuestion from '../components/questions/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion';

const SurveyScreen = () => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const surveyQuestions = await getSurveyQuestions();
      setQuestions(surveyQuestions);

      const savedAnswers = await AsyncStorage.getItem('surveyAnswers');
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('surveyAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (questionNo: string, answer: any, type: string) => {
    setAnswers(prevAnswers => {
      if (type === 'multiple-choice') {
        const existingAnswers = prevAnswers[questionNo] || [];
        if (existingAnswers.includes(answer)) {
          return { ...prevAnswers, [questionNo]: existingAnswers.filter((a: any) => a !== answer) };
        } else {
          return { ...prevAnswers, [questionNo]: [...existingAnswers, answer] };
        }
      } else {
        return { ...prevAnswers, [questionNo]: answer };
      }
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Geolocalización',
            message: 'Esta aplicación necesita acceso a su ubicación para guardar la encuesta.',
            buttonNeutral: 'Pregúntame Luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log({ ...answers, location: position });
          // Here you would typically save the data to Firebase
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const getQuestionType = (question: SurveyQuestion) => {
    const responseType = question['Categorías de respuesta (predefinidas si aplica)'];
    if (responseType.includes('Marque todas las que apliquen:')) {
      return 'multiple-choice';
    }
    if (responseType === '_' || responseType === 'Abierta') {
      return 'open';
    }
    if (/^\d+\..*\n/m.test(responseType)) {
      return 'single-choice';
    }
    return 'unknown';
  };

  const parseOptions = (optionsString: string) => {
    return optionsString.split('\n').filter(option => option.trim() !== '' && !option.includes('Marque todas las que apliquen:'));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encuesta</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.No}
        renderItem={({ item }) => {
          const questionType = getQuestionType(item);
          const questionText = `${item.No}. ${item.Pregunta}`;

          if (questionType === 'open') {
            return <OpenQuestion question={questionText} value={answers[item.No] || ''} onAnswerChange={(text) => handleAnswerChange(item.No, text, 'open')} />;
          } else if (questionType === 'single-choice') {
            const options = parseOptions(item['Categorías de respuesta (predefinidas si aplica)']);
            return <SingleChoiceQuestion question={questionText} options={options} value={answers[item.No] || null} onAnswerChange={(option) => handleAnswerChange(item.No, option, 'single-choice')} />;
          } else if (questionType === 'multiple-choice') {
            const options = parseOptions(item['Categorías de respuesta (predefinidas si aplica)']);
            return <MultipleChoiceQuestion question={questionText} options={options} value={answers[item.No] || []} onAnswerChange={(option) => handleAnswerChange(item.No, option, 'multiple-choice')} />;
          }

          return (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{questionText}</Text>
            </View>
          );
        }}
        ListFooterComponent={() => <Button title="Guardar" onPress={handleSave} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});

export default SurveyScreen;
