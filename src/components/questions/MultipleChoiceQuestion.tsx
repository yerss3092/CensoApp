
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  value: string[];
  onAnswerChange: (option: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, options, value, onAnswerChange }) => {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onAnswerChange(option); // This should be handled in the parent to remove the option
    } else {
      onAnswerChange(option); // This should be handled in the parent to add the option
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionContainer}
          onPress={() => toggleOption(option)}
        >
          <View style={styles.checkbox}>
            {value.includes(option) && <View style={styles.checked} />}
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
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checked: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
  },
});

export default MultipleChoiceQuestion;
