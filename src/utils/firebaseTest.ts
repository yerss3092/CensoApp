import firebaseDataService from '../services/firebaseDataService';
import { Surveyor } from '../types';

// Función de prueba para verificar Firebase
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔥 Iniciando prueba de conexión Firebase...');
    
    // Crear un encuestador de prueba
    const testSurveyor: Surveyor = {
      id: '',
      name: 'Encuestador_Prueba_' + Date.now(),
      email: 'prueba@test.com',
      assignedArea: 'Área de prueba',
      loginTime: new Date().toISOString()
    };

    console.log('📝 Guardando encuestador de prueba...');
    const surveyorId = await firebaseDataService.saveSurveyor(testSurveyor);
    console.log('✅ Encuestador guardado con ID:', surveyorId);

    // Buscar el encuestador por nombre
    console.log('🔍 Buscando encuestador por nombre...');
    const foundSurveyor = await firebaseDataService.getSurveyorByName(testSurveyor.name);
    
    if (foundSurveyor) {
      console.log('✅ Encuestador encontrado:', foundSurveyor.name);
    } else {
      console.log('❌ No se pudo encontrar el encuestador');
      return false;
    }

    // Obtener estadísticas
    console.log('📊 Obteniendo estadísticas...');
    const stats = await firebaseDataService.getSurveyStats();
    console.log('✅ Estadísticas obtenidas:', stats);

    console.log('🎉 ¡Todas las pruebas de Firebase pasaron exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error en prueba Firebase:', error);
    return false;
  }
};

// Función para probar guardar una encuesta completa
export const testSurveySave = async (surveyorId: string) => {
  try {
    console.log('🔥 Probando guardado de encuesta...');
    
    const testSurvey = {
      id: 'test_survey_' + Date.now(),
      surveyorName: 'Encuestador de Prueba',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      responses: [
        {
          questionId: '1',
          answer: 'Respuesta de prueba',
          timestamp: new Date().toISOString()
        }
      ],
      status: 'completed' as const
    };

    const surveyFirebaseId = await firebaseDataService.saveSurvey(testSurvey, surveyorId);
    console.log('✅ Encuesta guardada con ID:', surveyFirebaseId);
    
    return surveyFirebaseId;
  } catch (error) {
    console.error('❌ Error guardando encuesta:', error);
    throw error;
  }
};