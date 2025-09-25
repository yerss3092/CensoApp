
import RNFS from 'react-native-fs';
import Papa from 'papaparse';

export interface SurveyQuestion {
  No: string;
  Pregunta: string;
  'Se Recoje SI NO (Precargada), SE VERIFICA - COMPLEMENTA': string;
  'Categorías de respuesta (predefinidas si aplica)': string;
}

export const getSurveyQuestions = async (): Promise<SurveyQuestion[]> => {
  try {
    const csvString = await RNFS.readFileAssets('CensoResguardo-Preguntas.csv', 'utf8');
    const parsedData = Papa.parse(csvString, { header: true });
    return parsedData.data as SurveyQuestion[];
  } catch (error) {
    console.error("An error occurred while reading the survey questions:", error);
    return [];
  }
};
