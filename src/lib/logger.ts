// src/lib/logger.ts
// Utilidad para loguear operaciones y errores

export const logDebug = (message: string, ...optionalParams: any[]) => {
  console.debug(`[DEBUG] ${message}`, ...optionalParams);
};

export const logError = (error: any, context?: string) => {
  if (context) {
    console.error(`[ERROR] (${context})`, error);
  } else {
    console.error('[ERROR]', error);
  }
};

// Puedes importar y usar logDebug y logError en cualquier parte del proyecto.