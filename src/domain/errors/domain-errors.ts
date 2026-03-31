/**
 * Domain Errors
 * Errores específicos del dominio de negocio
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

// Errores de autenticación
export class AuthenticationError extends DomainError {
  constructor(message = 'No autorizado') {
    super(message, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class SessionExpiredError extends DomainError {
  constructor(message = 'La sesión ha expirado') {
    super(message, 'SESSION_EXPIRED')
    this.name = 'SessionExpiredError'
  }
}

// Errores de validación
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

// Errores de recursos
export class NotFoundError extends DomainError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

// Errores de red/API
export class NetworkError extends DomainError {
  constructor(message = 'Error de conexión') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class RateLimitError extends DomainError {
  constructor(message = 'Demasiadas solicitudes. Intenta más tarde.') {
    super(message, 'RATE_LIMIT')
    this.name = 'RateLimitError'
  }
}

// Helper para determinar si un error es de dominio
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError
}
