/**
 * Adoption Request API Adapter
 * Implementa IRequestRepository usando la API REST
 */

import api from './axios-client'
import type {
  SolicitudAdopcion,
  SolicitudInput,
  SolicitudFilters,
  SolicitudEstado
} from '@/domain/entities/adoption-request'
import type {
  IRequestRepository,
  SolicitudesResponse
} from '@/domain/interfaces/request-repository'
import type { ApiResponse } from '@/domain/interfaces/common'

// Tipo de respuesta de la API
interface SolicitudesApiResponse {
  solicitudes: SolicitudAdopcion[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface SolicitudApiResponse {
  solicitud: SolicitudAdopcion
}

class RequestApi implements IRequestRepository {
  async getAll(filters: SolicitudFilters = {}): Promise<SolicitudesResponse> {
    const params = new URLSearchParams()

    if (filters.estado_solicitud) params.append('estado_solicitud', filters.estado_solicitud)
    if (filters.animal_id) params.append('animal_id', filters.animal_id.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = queryString ? `/api/adoption-requests?${queryString}` : '/api/adoption-requests'

    const response = await api.get<ApiResponse<SolicitudesApiResponse>>(url)

    const data = response.data.data
    return {
      solicitudes: data.solicitudes,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages
      }
    }
  }

  async getRecent(limit = 5): Promise<SolicitudAdopcion[]> {
    const response = await api.get<ApiResponse<SolicitudesApiResponse>>(
      `/api/adoption-requests?limit=${limit}&sort=recent`
    )
    return response.data.data.solicitudes
  }

  async getById(id: number | string): Promise<SolicitudAdopcion> {
    const response = await api.get<ApiResponse<SolicitudApiResponse>>(
      `/api/adoption-requests/${id}`
    )
    return response.data.data.solicitud
  }

  async create(data: SolicitudInput): Promise<SolicitudAdopcion> {
    const response = await api.post<ApiResponse<SolicitudAdopcion>>(
      '/api/adoption-requests',
      data
    )
    return response.data.data
  }

  async updateStatus(id: number | string, estado: SolicitudEstado): Promise<SolicitudAdopcion> {
    const response = await api.patch<ApiResponse<SolicitudAdopcion>>(
      `/api/adoption-requests/${id}`,
      { estado_solicitud: estado }
    )
    return response.data.data
  }

  async delete(id: number | string): Promise<void> {
    await api.delete(`/api/adoption-requests/${id}`)
  }
}

// Exportar instancia singleton
export const requestApi = new RequestApi()

// También exportar la clase para testing
export { RequestApi }
