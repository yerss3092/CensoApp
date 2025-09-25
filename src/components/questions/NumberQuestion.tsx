import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Question } from '../../types';

interface Props {
  question: Question;
  value: string;
  onValueChange: (value: string) => void;
}

const NumberQuestion: React.FC<Props> = ({ question, value, onValueChange }) => {
  const handleValueChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    onValueChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.numero}. {question.pregunta}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleValueChange}
        placeholder="Ingrese un número..."
        keyboardType="numeric"
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
  },
});

export default NumberQuestion;