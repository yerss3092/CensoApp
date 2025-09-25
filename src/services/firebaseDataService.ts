import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseService';
import { SurveyResponse, Surveyor } from '../types';

export interface FirebaseSurveyResponse {
  id?: string;
  surveyorName: string;
  startTime: Timestamp;
  endTime?: Timestamp | undefined;
  responses: any[];
  location?: {
    latitude: number;
    longitude: number;
  } | undefined;
  status: 'draft' | 'completed' | 'submitted';
  createdAt: any;
  updatedAt: any;
  surveyorId: string;
  synced: boolean;
}

export interface FirebaseSurveyor {
  id: string;
  name: string;
  email?: string | undefined;
  assignedArea?: string | undefined;
  loginTime: Timestamp;
  createdAt: any;
  lastActive: any;
}

class FirebaseDataService {
  
  // Collections
  private surveysCollection = 'surveys';
  private surveyorsCollection = 'surveyors';

  /**
   * Save survey response to Firebase
   */
  async saveSurvey(survey: SurveyResponse, surveyorId: string): Promise<string> {
    try {
      const surveyData: any = {
        ...survey,
        startTime: Timestamp.fromDate(new Date(survey.startTime)),
        surveyorId,
        synced: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Solo agregar endTime si existe
      if (survey.endTime) {
        surveyData.endTime = Timestamp.fromDate(new Date(survey.endTime));
      }

      const docRef = await addDoc(collection(db, this.surveysCollection), surveyData);
      console.log('Survey saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving survey to Firebase:', error);
      throw error;
    }
  }

  /**
   * Update existing survey in Firebase
   */
  async updateSurvey(surveyId: string, updates: Partial<SurveyResponse>): Promise<void> {
    try {
      const surveyRef = doc(db, this.surveysCollection, surveyId);
      
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      if (updates.startTime) {
        updateData.startTime = Timestamp.fromDate(new Date(updates.startTime));
      }
      
      if (updates.endTime) {
        updateData.endTime = Timestamp.fromDate(new Date(updates.endTime));
      }

      await updateDoc(surveyRef, updateData);
      console.log('Survey updated in Firebase:', surveyId);
    } catch (error) {
      console.error('Error updating survey in Firebase:', error);
      throw error;
    }
  }

  /**
   * Get all surveys for a specific surveyor
   */
  async getSurveysBySurveyor(surveyorId: string): Promise<SurveyResponse[]> {
    try {
      const q = query(
        collection(db, this.surveysCollection),
        where('surveyorId', '==', surveyorId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const surveys: SurveyResponse[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseSurveyResponse;
        const survey: SurveyResponse = {
          id: doc.id,
          surveyorName: data.surveyorName,
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime?.toDate().toISOString(),
          responses: data.responses,
          status: data.status
        };
        
        if (data.location) {
          survey.location = data.location;
        }
        
        surveys.push(survey);
      });
      
      return surveys;
    } catch (error) {
      console.error('Error getting surveys by surveyor:', error);
      throw error;
    }
  }

  /**
   * Get all surveys (for admin view)
   */
  async getAllSurveys(): Promise<SurveyResponse[]> {
    try {
      const q = query(
        collection(db, this.surveysCollection),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const surveys: SurveyResponse[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseSurveyResponse;
        const survey: SurveyResponse = {
          id: doc.id,
          surveyorName: data.surveyorName,
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime?.toDate().toISOString(),
          responses: data.responses,
          status: data.status
        };
        
        if (data.location) {
          survey.location = data.location;
        }
        
        surveys.push(survey);
      });
      
      return surveys;
    } catch (error) {
      console.error('Error getting all surveys:', error);
      throw error;
    }
  }

  /**
   * Get a single survey by ID
   */
  async getSurveyById(surveyId: string): Promise<SurveyResponse | null> {
    try {
      const docRef = doc(db, this.surveysCollection, surveyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as FirebaseSurveyResponse;
        const survey: SurveyResponse = {
          id: docSnap.id,
          surveyorName: data.surveyorName,
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime?.toDate().toISOString(),
          responses: data.responses,
          status: data.status
        };
        
        if (data.location) {
          survey.location = data.location;
        }
        
        return survey;
      } else {
        console.log('No such survey!');
        return null;
      }
    } catch (error) {
      console.error('Error getting survey:', error);
      throw error;
    }
  }

  /**
   * Delete a survey
   */
  async deleteSurvey(surveyId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.surveysCollection, surveyId));
      console.log('Survey deleted from Firebase:', surveyId);
    } catch (error) {
      console.error('Error deleting survey:', error);
      throw error;
    }
  }

  /**
   * Save surveyor data
   */
  async saveSurveyor(surveyor: Surveyor): Promise<string> {
    try {
      const surveyorData = {
        name: surveyor.name,
        ...(surveyor.email && { email: surveyor.email }),
        ...(surveyor.assignedArea && { assignedArea: surveyor.assignedArea }),
        loginTime: Timestamp.fromDate(new Date(surveyor.loginTime)),
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.surveyorsCollection), surveyorData);
      console.log('Surveyor saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving surveyor to Firebase:', error);
      throw error;
    }
  }

  /**
   * Update surveyor last active time
   */
  async updateSurveyorLastActive(surveyorId: string): Promise<void> {
    try {
      const surveyorRef = doc(db, this.surveyorsCollection, surveyorId);
      await updateDoc(surveyorRef, {
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating surveyor last active:', error);
      throw error;
    }
  }

  /**
   * Get surveyor by name
   */
  async getSurveyorByName(name: string): Promise<Surveyor | null> {
    try {
      const q = query(
        collection(db, this.surveyorsCollection),
        where('name', '==', name)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as FirebaseSurveyor;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          assignedArea: data.assignedArea,
          loginTime: data.loginTime.toDate().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting surveyor by name:', error);
      throw error;
    }
  }

  /**
   * Get all surveyors
   */
  async getAllSurveyors(): Promise<Surveyor[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.surveyorsCollection));
      const surveyors: Surveyor[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseSurveyor;
        surveyors.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          assignedArea: data.assignedArea,
          loginTime: data.loginTime.toDate().toISOString()
        });
      });
      
      return surveyors;
    } catch (error) {
      console.error('Error getting all surveyors:', error);
      throw error;
    }
  }

  /**
   * Get surveys count by status
   */
  async getSurveyStats(): Promise<{
    total: number;
    completed: number;
    draft: number;
    submitted: number;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, this.surveysCollection));
      const stats = {
        total: 0,
        completed: 0,
        draft: 0,
        submitted: 0
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        stats.total++;
        
        if (data['status'] === 'completed') {
          stats.completed++;
        } else if (data['status'] === 'draft') {
          stats.draft++;
        } else if (data['status'] === 'submitted') {
          stats.submitted++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting survey stats:', error);
      throw error;
    }
  }

  /**
   * Sync local surveys with Firebase
   */
  async syncLocalSurveys(localSurveys: SurveyResponse[], surveyorId: string): Promise<void> {
    try {
      console.log(`Syncing ${localSurveys.length} local surveys...`);
      
      for (const survey of localSurveys) {
        if (survey.status === 'completed' || survey.status === 'submitted') {
          await this.saveSurvey(survey, surveyorId);
        }
      }
      
      console.log('Local surveys synced successfully');
    } catch (error) {
      console.error('Error syncing local surveys:', error);
      throw error;
    }
  }
}

export default new FirebaseDataService();