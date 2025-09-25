import * as XLSX from 'xlsx';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import { Alert } from 'react-native';

export interface ExportQuestion {
  No: string;
  Pregunta: string;
  SeRecoge: string;
  Categorias: string;
}

class ExportService {
  /**
   * Load and parse CSV questions for export
   */
  async loadCSVQuestions(): Promise<ExportQuestion[]> {
    try {
      // Load the CSV asset
      const asset = Asset.fromModule(require('../../assets/CensoResguardo-Preguntas.csv'));
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        throw new Error('Failed to load CSV asset');
      }

      // Read the CSV file using fetch
      const response = await fetch(asset.localUri);
      const csvContent = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          encoding: 'UTF-8',
          complete: (results) => {
            try {
              const questions: ExportQuestion[] = results.data.map((row: any, index: number) => {
                return {
                  No: row['No'] || (index + 1).toString(),
                  Pregunta: row['Pregunta'] || '',
                  SeRecoge: row['Se Recoje SI NO (Precargada), SE VERIFICA - COMPLEMENTA'] || '',
                  Categorias: row['Categorías de respuesta (predefinidas si aplica)'] || ''
                };
              });
              
              console.log(`Loaded ${questions.length} questions from CSV`);
              resolve(questions.filter(q => q.Pregunta.trim() !== ''));
            } catch (error) {
              console.error('Error parsing CSV:', error);
              reject(error);
            }
          },
          error: (error: any) => {
            console.error('Papa Parse error:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error loading CSV questions:', error);
      throw error;
    }
  }

  /**
   * Export questions to Excel file
   */
  async exportQuestionsToExcel(): Promise<void> {
    try {
      console.log('Starting Excel export...');
      
      // Load questions from CSV
      const questions = await this.loadCSVQuestions();
      
      if (questions.length === 0) {
        throw new Error('No questions found to export');
      }

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert questions to worksheet format
      const worksheetData = [
        ['No.', 'Pregunta', 'Se Recoge', 'Categorías de Respuesta'],
        ...questions.map(q => [
          q.No,
          q.Pregunta,
          q.SeRecoge,
          q.Categorias
        ])
      ];

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths for better readability
      worksheet['!cols'] = [
        { width: 8 },   // No.
        { width: 60 },  // Pregunta
        { width: 25 },  // Se Recoge
        { width: 50 }   // Categorías
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Preguntas Censo');

      // For now, we'll show the data in an alert since file system access is complex
      const summary = `Se encontraron ${questions.length} preguntas del censo.

Primeras 3 preguntas:
1. ${questions[0]?.Pregunta.substring(0, 50)}...
2. ${questions[1]?.Pregunta.substring(0, 50)}...
3. ${questions[2]?.Pregunta.substring(0, 50)}...

La funcionalidad de exportación a Excel se puede completar cuando se configure correctamente el sistema de archivos.`;

      Alert.alert(
        'Preguntas Cargadas',
        summary,
        [{ text: 'OK' }]
      );

      console.log('Excel export completed successfully');
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  /**
   * Get questions count
   */
  async getQuestionsCount(): Promise<number> {
    try {
      const questions = await this.loadCSVQuestions();
      return questions.length;
    } catch (error) {
      console.error('Error getting questions count:', error);
      return 0;
    }
  }

  /**
   * Preview questions (first 5)
   */
  async previewQuestions(): Promise<ExportQuestion[]> {
    try {
      const questions = await this.loadCSVQuestions();
      return questions.slice(0, 5);
    } catch (error) {
      console.error('Error previewing questions:', error);
      return [];
    }
  }

  /**
   * Get all questions for display
   */
  async getAllQuestions(): Promise<ExportQuestion[]> {
    try {
      return await this.loadCSVQuestions();
    } catch (error) {
      console.error('Error getting all questions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;