import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Question } from '../../types';

interface Props {
  question: Question;
  value: string;
  onValueChange: (value: string) => void;
}

const TextQuestion: React.FC<Props> = ({ question, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.numero}. {question.pregunta}
        {question.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onValueChange}
        placeholder="Escriba su respuesta aquí..."
        multiline={question.pregunta.length > 50}
        numberOfLines={question.pregunta.length > 50 ? 3 : 1}
      />
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
    marginBottom: 8,
    lineHeight: 24,
  },
  required: {
    color: '#f44336',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
  },
});

export default TextQuestion;