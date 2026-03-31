/**
 * Update Request Status Use Case
 * Actualiza el estado de una solicitud (requiere auth)
 */

import type { SolicitudAdopcion, SolicitudEstado } from '@/domain/entities/adoption-request'
import type { IRequestRepository } from '@/domain/interfaces/request-repository'

export class UpdateRequestStatusUseCase {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async execute(id: number | string, estado: SolicitudEstado): Promise<SolicitudAdopcion> {
    return this.requestRepository.updateStatus(id, estado)
  }
}
