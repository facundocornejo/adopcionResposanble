/**
 * Organization API Adapter
 * Implementa operaciones para la organización actual
 */

import api from './axios-client'
import type { Organizacion, OrganizacionInput } from '@/domain/entities/organization'
import type { ApiResponse } from '@/domain/interfaces/common'

interface OrganizacionApiResponse {
  organizacion: Organizacion
}

class OrganizationApi {
  /**
   * Obtener datos de mi organización (admin)
   */
  async getMyOrganization(): Promise<Organizacion> {
    const response = await api.get<ApiResponse<OrganizacionApiResponse>>('/api/organization')
    return response.data.data.organizacion
  }

  /**
   * Actualizar datos de mi organización (admin)
   */
  async updateMyOrganization(data: OrganizacionInput): Promise<Organizacion> {
    const response = await api.put<ApiResponse<OrganizacionApiResponse>>('/api/organization', data)
    return response.data.data.organizacion
  }

  /**
   * Obtener datos públicos de una organización por slug
   */
  async getBySlug(slug: string): Promise<Organizacion> {
    const response = await api.get<ApiResponse<OrganizacionApiResponse>>(`/api/organization/${slug}`)
    return response.data.data.organizacion
  }
}

// Exportar instancia singleton
export const organizationApi = new OrganizationApi()

// También exportar la clase para testing
export { OrganizationApi }
