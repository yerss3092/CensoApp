import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import { Question, CSVQuestion } from '../types';

class SurveyService {
  private questions: Question[] = [];
  private isLoaded = false;

  /**
   * Load questions from the CSV file
   */
  async loadQuestions(): Promise<Question[]> {
    if (this.isLoaded) {
      return this.questions;
    }

    try {
      // Load the CSV asset
      const asset = Asset.fromModule(require('../../assets/CensoResguardo-Preguntas.csv'));
      await asset.downloadAsync();
      
      // Fetch the CSV content
      const response = await fetch(asset.localUri || asset.uri);
      const csvText = await response.text();

      // Parse CSV
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parseResult.errors && parseResult.errors.length > 0) {
        console.warn('CSV parsing errors:', parseResult.errors);
      }

      // Transform CSV data to Question objects
      this.questions = (parseResult.data as CSVQuestion[]).map((row: CSVQuestion, index: number) => {
        const question: Question = {
          id: `q_${row.numero || index}`,
          numero: row.numero || `${index + 1}`,
          pregunta: row.pregunta || '',
          tipo: this.determineQuestionType(row),
          required: true,
        };

        // Add options for select/radio questions
        if (row.opciones && (question.tipo === 'select' || question.tipo === 'radio' || question.tipo === 'checkbox')) {
          question.opciones = row.opciones.split('|').map((opt: string) => opt.trim());
        }

        return question;
      }).filter((q: Question) => q.pregunta.trim() !== ''); // Remove empty questions

      this.isLoaded = true;
      console.log(`Loaded ${this.questions.length} questions from CSV`);
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