import { Question, CSVQuestion } from '../types';

class SurveyService {
  private questions: Question[] = [];
  private isLoaded = false;

  /**
   * Load questions from JSON file (real census questions)
   */
  async loadQuestions(): Promise<Question[]> {
    if (this.isLoaded) {
      return this.questions;
    }

    try {
      // Load questions from JSON file
      const questionsData = require('../../assets/questions.json');
      
      const questions = this.parseQuestionsFromData(questionsData);
      this.questions = questions;
      this.isLoaded = true;
      
      console.log(`Loaded ${this.questions.length} real census questions`);
      return this.questions;

    } catch (error) {
      console.error('Error loading questions:', error);
      throw new Error('Failed to load survey questions');
    }
  }

  /**
   * Parse questions data from JSON and convert to Question format
   */
  private parseQuestionsFromData(questionsData: any[]): Question[] {
    try {
      const questions: Question[] = questionsData
        .map((row: any, index: number) => {
          const pregunta = row.pregunta?.trim();
          const seRecoge = row.seRecoge?.trim();
          const categorias = row.categorias?.trim();
          const numero = row.numero?.trim() || (index + 1).toString();

          // Skip empty questions
          if (!pregunta || pregunta === '') {
            return null;
          }

          const question: Question = {
            id: numero,
            numero: numero,
            pregunta: pregunta,
            tipo: this.determineQuestionType({ 
              numero, 
              pregunta, 
              opciones: categorias, 
              seRecoge 
            }),
            required: seRecoge === 'SI'
          };

          // Add options if they exist
          if (categorias && categorias !== '' && categorias !== '_') {
            question.opciones = this.parseOptions(categorias);
          }

          return question;
        })
        .filter((q: Question | null) => q !== null) as Question[];
      
      console.log(`Parsed ${questions.length} questions from JSON`);
      return questions;
    } catch (error) {
      console.error('Error parsing questions:', error);
      throw error;
    }
  }

  /**
   * Parse options from category string
   */
  private parseOptions(categorias: string): string[] {
    if (!categorias || categorias === '_') return [];
    
    // Split by different delimiters commonly used in the CSV
    const options = categorias
      .split(/[;\n]/)  // Split by semicolon or newline
      .map(option => option.trim())
      .filter(option => option !== '' && !option.match(/^\d+\.?\s*$/)) // Remove empty or number-only options
      .map(option => {
        // Clean up option text
        return option
          .replace(/^\d+\.\s*/, '') // Remove leading numbers like "1. "
          .replace(/^[A-Z]\.\s*/, '') // Remove leading letters like "A. "
          .trim();
      })
      .filter(option => option.length > 0);

    return options.slice(0, 10); // Limit to 10 options to avoid UI issues
  }

  /**
   * Determine question type based on CSV data
   */
  private determineQuestionType(row: CSVQuestion): Question['tipo'] {
    const pregunta = row.pregunta?.toLowerCase() || '';
    const opciones = row.opciones || '';

    // Coordinates questions
    if (pregunta.includes('coordenadas') || pregunta.includes('ubicación') || pregunta.includes('localización')) {
      return 'coordinates';
    }

    // Number questions
    if (pregunta.includes('edad') || pregunta.includes('año') || pregunta.includes('número') || 
        pregunta.includes('cantidad') || pregunta.includes('cuántos') || pregunta.includes('cuántas') ||
        pregunta.includes('valor') || pregunta.includes('$') || pregunta.includes('precio') ||
        pregunta.includes('consecutivo')) {
      return 'number';
    }

    // Multiple choice questions - check for numbered lists or multiple options
    if (opciones && (
        opciones.includes('1.') || 
        opciones.includes('2.') || 
        opciones.includes('A.') ||
        opciones.includes('SI') && opciones.includes('NO') ||
        opciones.split('\n').length > 1 ||
        opciones.includes(';')
      )) {
      const optionsList = this.parseOptions(opciones);
      
      // If it's a yes/no or small set, use radio
      if (optionsList.length <= 6) {
        return 'radio';
      }
      return 'select';
    }

    // Text input for open questions
    if (opciones === '_' || opciones === 'Abierta' || opciones.includes('_____')) {
      return 'text';
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