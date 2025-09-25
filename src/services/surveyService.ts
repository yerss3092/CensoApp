import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import { Question, CSVQuestion } from '../types';

class SurveyService {
  private questions: Question[] = [];
  private isLoaded = false;

  /**
   * Load questions from hardcoded data (temporary solution)
   */
  async loadQuestions(): Promise<Question[]> {
    if (this.isLoaded) {
      return this.questions;
    }

    try {
      // Temporary hardcoded questions for testing
      const sampleQuestions: Question[] = [
        {
          id: '1',
          numero: '1',
          tipo: 'text',
          pregunta: '¿Cuál es su nombre completo?',
          required: true,
        },
        {
          id: '2',
          numero: '2',
          tipo: 'number',
          pregunta: '¿Cuál es su edad?',
          required: true,
        },
        {
          id: '3',
          numero: '3',
          tipo: 'radio',
          pregunta: '¿Cuál es su género?',
          required: true,
          opciones: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']
        },
        {
          id: '4',
          numero: '4',
          tipo: 'radio',
          pregunta: '¿En qué tipo de vivienda vive?',
          required: true,
          opciones: ['Casa propia', 'Casa arrendada', 'Apartamento', 'Otro']
        },
        {
          id: '5',
          numero: '5',
          tipo: 'checkbox',
          pregunta: '¿Qué servicios públicos tiene? (Seleccione todos los que apliquen)',
          required: false,
          opciones: ['Agua', 'Luz', 'Gas', 'Internet', 'Teléfono']
        }
      ];

      this.questions = sampleQuestions;
      this.isLoaded = true;
      
      console.log(`Loaded ${this.questions.length} sample questions`);
      return this.questions;

    } catch (error) {
      console.error('Error loading questions:', error);
      throw new Error('Failed to load survey questions');
    }
  }

  /**
   * Determine question type based on CSV data
   */
  private determineQuestionType(row: CSVQuestion): Question['tipo'] {
    const pregunta = row.pregunta?.toLowerCase() || '';
    const opciones = row.opciones;

    // Coordinates questions
    if (pregunta.includes('coordenadas') || pregunta.includes('ubicación') || pregunta.includes('localización')) {
      return 'coordinates';
    }

    // Number questions
    if (pregunta.includes('edad') || pregunta.includes('año') || pregunta.includes('número') || 
        pregunta.includes('cantidad') || pregunta.includes('cuántos') || pregunta.includes('cuántas')) {
      return 'number';
    }

    // Multiple choice questions
    if (opciones && opciones.includes('|')) {
      const optionCount = opciones.split('|').length;
      // If it's a yes/no or small set, use radio
      if (optionCount <= 4) {
        return 'radio';
      }
      return 'select';
    }

    // Default to text
    return 'text';
  }

  /**
   * Get questions by page for pagination
   */
  getQuestionsByPage(page: number, pageSize: number = 10): Question[] {
    const start = page * pageSize;
    const end = start + pageSize;
    return this.questions.slice(start, end);
  }

  /**
   * Get total number of pages
   */
  getTotalPages(pageSize: number = 10): number {
    return Math.ceil(this.questions.length / pageSize);
  }

  /**
   * Get question by ID
   */
  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  /**
   * Get all questions
   */
  getAllQuestions(): Question[] {
    return this.questions;
  }

  /**
   * Check if questions are loaded
   */
  isQuestionsLoaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const surveyService = new SurveyService();
export default surveyService;