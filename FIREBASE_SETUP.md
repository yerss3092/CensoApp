# Configuración de Firebase para CensoApp

## 🔥 Paso 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombra tu proyecto (ej: `censo-resguardo-indigena`)
4. Acepta los términos y condiciones
5. Haz clic en **"Crear proyecto"**

## 📱 Paso 2: Configurar App Web

1. En el dashboard de tu proyecto, haz clic en el ícono **"Web"** (`</>`)
2. Registra tu app con un nombre (ej: `CensoApp`)
3. **NO** marques "Firebase Hosting" por ahora
4. Haz clic en **"Registrar app"**
5. Copia la configuración que aparece

## ⚙️ Paso 3: Configurar Credenciales

1. Abre el archivo `src/config/firebase.ts`
2. Reemplaza los valores de ejemplo con los de tu proyecto:

```typescript
export const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto-real.firebaseapp.com", 
  projectId: "tu-proyecto-id-real",
  storageBucket: "tu-proyecto-real.appspot.com",
  messagingSenderId: "tu-sender-id-real",
  appId: "tu-app-id-real"
};
```

## 🗄️ Paso 4: Configurar Firestore Database

1. En Firebase Console, ve al menú **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Empezar en modo de prueba"** para desarrollo
4. Elige una ubicación cercana (ej: `southamerica-east1` para Brasil)
5. Haz clic en **"Listo"**

## 🔐 Paso 5: Configurar Reglas de Seguridad (Opcional para desarrollo)

En Firestore > Rules, puedes usar estas reglas básicas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas reglas son solo para desarrollo. Para producción, implementa reglas de seguridad apropiadas.

## 🔍 Paso 6: Verificar la Conexión

1. Ejecuta la app: `npm start`
2. Ve a la pantalla de login
3. Crea un encuestador de prueba
4. Verifica en Firebase Console > Firestore que se creó la colección `surveyors`

## 📊 Estructura de Datos

La app creará automáticamente estas colecciones:

### `surveyors`
```json
{
  "id": "auto-generated-id",
  "name": "Nombre del Encuestador", 
  "email": "email@ejemplo.com",
  "assignedArea": "Área asignada",
  "loginTime": "timestamp",
  "createdAt": "timestamp",
  "lastActive": "timestamp"
}
```

### `surveys`
```json
{
  "id": "auto-generated-id",
  "surveyorName": "Nombre del Encuestador",
  "surveyorId": "id-del-encuestador", 
  "startTime": "timestamp",
  "endTime": "timestamp",
  "responses": [
    {
      "questionId": "1",
      "answer": "Respuesta",
      "timestamp": "timestamp"
    }
  ],
  "location": {
    "latitude": -4.123456,
    "longitude": -69.123456
  },
  "status": "completed",
  "synced": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🚀 Funcionalidades Firebase Implementadas

- ✅ **Guardar encuestas** en Firestore
- ✅ **Sincronización** automática cuando hay conexión
- ✅ **Gestión de encuestadores**
- ✅ **Estadísticas** de encuestas por estado
- ✅ **Consultas avanzadas** por encuestador y fechas
- ✅ **Almacenamiento offline** con AsyncStorage como respaldo

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar la app
npm start

# Verificar tipos TypeScript
npx tsc --noEmit

# Ver logs detallados
expo start --dev-client
```

## 📋 Troubleshooting

### Error: "Firebase not configured"
- Verifica que hayas copiado correctamente la configuración en `firebase.ts`

### Error: "Permission denied" 
- Verifica las reglas de Firestore Database
- Asegúrate de estar en "modo de prueba"

### No aparecen datos en Firebase Console
- Verifica la conexión a internet
- Revisa los logs de la consola para errores
- Asegúrate de que el proyecto ID sea correcto

## 🔄 Próximos Pasos

1. **Autenticación**: Implementar Firebase Auth para mayor seguridad
2. **Reglas de seguridad**: Configurar reglas más estrictas para producción  
3. **Cloud Functions**: Automatizar procesos y validaciones
4. **Analytics**: Implementar Firebase Analytics para métricas
5. **Backup**: Configurar exportación automática de datos

---

¿Necesitas ayuda? Revisa la [documentación oficial de Firebase](https://firebase.google.com/docs)