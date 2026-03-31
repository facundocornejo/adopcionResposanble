/**
 * Casos de Éxito API Adapter
 */

import api from './axios-client'
import type { CasoExito, CasoExitoInput, CasosPorOrganizacion } from '@/domain/entities/success-case'
import type { ApiResponse } from '@/domain/interfaces/common'

interface CasosExitoApiResponse {
  organizaciones: CasosPorOrganizacion[]
}

class CasosExitoApi {
  async getAll(): Promise<CasosPorOrganizacion[]> {
    const response = await api.get<ApiResponse<CasosExitoApiResponse>>('/api/casos-exito')
    // La API devuelve 'casosExito', mapeamos a 'casos' que espera el dominio
    return response.data.data.organizaciones.map((org: any) => ({
      organizacion: { id: org.id, nombre: org.nombre, slug: org.slug },
      casos: org.casosExito || []
    }))
  }

  async create(data: CasoExitoInput): Promise<CasoExito> {
    const response = await api.post<ApiResponse<{ casoExito: CasoExito }>>('/api/casos-exito', data)
    return response.data.data.casoExito
  }

  async update(id: number, data: Partial<CasoExitoInput>): Promise<CasoExito> {
    const response = await api.put<ApiResponse<{ casoExito: CasoExito }>>(`/api/casos-exito/${id}`, data)
    return response.data.data.casoExito
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/api/casos-exito/${id}`)
  }
}

export const casosExitoApi = new CasosExitoApi()
export { CasosExitoApi }
