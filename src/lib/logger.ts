// src/lib/logger.ts
// Utilidad para loguear operaciones y errores

export const logError = (error: any, context?: string) => {
  if (context) {
    console.error(`[ERROR] (${context})`, error);
  } else {
    console.error('[ERROR]', error);
  }
};

// Puedes importar y usar logError en cualquier parte del proyecto.