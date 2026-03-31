/**
 * Submit Adoption Request Use Case
 * Envía una solicitud de adopción (público)
 */

import type { SolicitudAdopcion, SolicitudInput } from '@/domain/entities/adoption-request'
import type { IRequestRepository } from '@/domain/interfaces/request-repository'
import { ValidationError } from '@/domain/errors'

export class SubmitAdoptionRequestUseCase {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async execute(data: SolicitudInput): Promise<SolicitudAdopcion> {
    // Validaciones de negocio críticas
    if (!data.todos_de_acuerdo) {
      throw new ValidationError(
        'Todos los integrantes del hogar deben estar de acuerdo',
        'todos_de_acuerdo'
      )
    }

    if (!data.compromiso_castracion) {
      throw new ValidationError(
        'Debes aceptar el compromiso de castración',
        'compromiso_castracion'
      )
    }

    if (data.edad < 18) {
      throw new ValidationError(
        'Debes ser mayor de 18 años para adoptar',
        'edad'
      )
    }

    if (data.motivacion && data.motivacion.length < 20) {
      throw new ValidationError(
        'La motivación debe tener al menos 20 caracteres',
        'motivacion'
      )
    }

    return this.requestRepository.create(data)
  }
}
