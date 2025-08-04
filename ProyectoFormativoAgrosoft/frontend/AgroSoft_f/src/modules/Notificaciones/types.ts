export interface Notificacion {
  id: number;
  title: string;
  message: string; // Cambiado de 'content' a 'message' para coincidir con el backend
  notification_type: 'activity' | 'control' | 'system' | 'message'; // Usar unión de tipos para las opciones válidas
  is_read: boolean;
  created_at: string; // ISO string (puedes usar Date si prefieres parsearlo)
  metadata?: Record<string, any>; // Tipado más específico para metadata
}