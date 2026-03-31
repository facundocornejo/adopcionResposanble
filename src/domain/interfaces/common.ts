/**
 * Common Types for API/Repository interfaces
 */

// Paginación estándar
export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Respuesta paginada genérica
export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

// Respuesta de API exitosa
export interface ApiResponse<T> {
  success: true
  data: T
}

// Respuesta de API con error
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

// Resultado de upload de imagen
export interface UploadResult {
  url: string
  public_id: string
}
