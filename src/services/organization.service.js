import api from './api'

/**
 * Servicio de Organización
 * Maneja los datos de la organización del admin
 */
const organizationService = {
  /**
   * Obtener datos de mi organización (admin)
   * @returns {Promise<object>}
   */
  async getMyOrganization() {
    const response = await api.get('/api/organization')
    return response.data?.data?.organizacion || response.data?.data || response.data
  },

  /**
   * Actualizar datos de mi organización (admin)
   * @param {object} data - Datos a actualizar
   * @returns {Promise<object>}
   */
  async updateMyOrganization(data) {
    const response = await api.put('/api/organization', data)
    return response.data
  },

  /**
   * Obtener datos públicos de una organización por slug
   * @param {string} slug - Slug de la organización
   * @returns {Promise<object>}
   */
  async getBySlug(slug) {
    const response = await api.get(`/api/organization/${slug}`)
    return response.data?.data?.organizacion || response.data?.data || response.data
  },
}

export default organizationService
