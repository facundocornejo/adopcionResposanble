import api from './api'

/**
 * Servicio de Solicitudes de Adopción
 * Maneja las solicitudes de adopción
 */
const requestsService = {
  /**
   * Obtener todas las solicitudes (admin)
   * @param {object} filters - Filtros opcionales
   * @param {string} filters.estado - 'Nueva' | 'Contactada' | 'Aprobada' | 'Rechazada'
   * @param {number} filters.animalId - ID del animal
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams()

    if (filters.estado) params.append('estado', filters.estado)
    if (filters.animalId) params.append('animal_id', filters.animalId)

    const queryString = params.toString()
    const url = queryString ? `/api/adoption-requests?${queryString}` : '/api/adoption-requests'

    const response = await api.get(url)
    return response.data
  },

  /**
   * Obtener solicitudes recientes (admin)
   * Para el dashboard
   * @param {number} limit - Cantidad de solicitudes a obtener
   * @returns {Promise<Array>}
   */
  async getRecent(limit = 5) {
    const response = await api.get(`/api/adoption-requests?limit=${limit}&sort=recent`)
    return response.data
  },

  /**
   * Obtener una solicitud por ID (admin)
   * @param {number|string} id - ID de la solicitud
   * @returns {Promise<object>}
   */
  async getById(id) {
    const response = await api.get(`/api/adoption-requests/${id}`)
    return response.data
  },

  /**
   * Crear una nueva solicitud (público)
   * Envía el formulario de adopción
   * @param {object} data - Datos del formulario de adopción
   * @returns {Promise<object>}
   */
  async create(data) {
    const response = await api.post('/api/adoption-requests', data)
    return response.data
  },

  /**
   * Actualizar estado de una solicitud (admin)
   * @param {number|string} id - ID de la solicitud
   * @param {string} estado - Nuevo estado
   * @returns {Promise<object>}
   */
  async updateStatus(id, estado) {
    const response = await api.patch(`/api/adoption-requests/${id}`, { estado })
    return response.data
  },

  /**
   * Marcar solicitud como vista (admin)
   * @param {number|string} id - ID de la solicitud
   * @returns {Promise<object>}
   */
  async markAsViewed(id) {
    const response = await api.patch(`/api/adoption-requests/${id}/vista`)
    return response.data
  },

  /**
   * Obtener estadísticas de solicitudes (admin)
   * @returns {Promise<object>}
   */
  async getStats() {
    const response = await api.get('/api/adoption-requests/stats')
    return response.data
  },

  /**
   * Eliminar una solicitud (admin)
   * @param {number|string} id - ID de la solicitud
   * @returns {Promise<void>}
   */
  async delete(id) {
    await api.delete(`/api/adoption-requests/${id}`)
  },
}

export default requestsService
