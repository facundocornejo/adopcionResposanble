/**
 * Adoption Request Repository Interface (Port)
 * Define el contrato para acceso a solicitudes de adopción
 */

import type {
  SolicitudAdopcion,
  SolicitudInput,
  SolicitudFilters,
  SolicitudEstado
} from '../entities/adoption-request'
import type { Pagination } from './common'

export interface SolicitudesResponse {
  solicitudes: SolicitudAdopcion[]
  pagination: Pagination
}

export interface IRequestRepository {
  /**
   * Obtiene todas las solicitudes con filtros (requiere auth)
   */
  getAll(filters?: SolicitudFilters): Promise<SolicitudesResponse>

  /**
   * Obtiene solicitudes recientes para dashboard
   */
  getRecent(limit?: number): Promise<SolicitudAdopcion[]>

  /**
   * Obtiene una solicitud por ID (requiere auth)
   */
  getById(id: number | string): Promise<SolicitudAdopcion>

  /**
   * Crea una nueva solicitud (público, rate limited)
   */
  create(data: SolicitudInput): Promise<SolicitudAdopcion>

  /**
   * Actualiza el estado de una solicitud (requiere auth)
   */
  updateStatus(id: number | string, estado: SolicitudEstado): Promise<SolicitudAdopcion>

  /**
   * Elimina una solicitud (requiere auth)
   */
  delete(id: number | string): Promise<void>
}
