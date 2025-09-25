
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface OpenQuestionProps {
  question: string;
  value: string;
  onAnswerChange: (text: string) => void;
}

const OpenQuestion: React.FC<OpenQuestionProps> = ({ question, value, onAnswerChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onAnswerChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});

export default OpenQuestion;
