import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../types';

interface Props {
  question: Question;
  value: string;
  onValueChange: (value: string) => void;
}

const RadioQuestion: React.FC<Props> = ({ question, value, onValueChange }) => {
  const options = question.opciones || [];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.numero}. {question.pregunta}
      </Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => onValueChange(option)}
          >
            <View style={[styles.radioCircle, value === option && styles.radioCircleSelected]}>
              {value === option && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#2E7D32',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});

export default RadioQuestion;