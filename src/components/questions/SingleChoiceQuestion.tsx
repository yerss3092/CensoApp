
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SingleChoiceQuestionProps {
  question: string;
  options: string[];
  value: string | null;
  onAnswerChange: (option: string) => void;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ question, options, value, onAnswerChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionContainer}
          onPress={() => onAnswerChange(option)}
        >
          <View style={styles.radioCircle}>
            {value === option && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
  },
});

export default SingleChoiceQuestion;
