import api from './api'

/**
 * Servicio de Animales
 * Maneja todas las operaciones CRUD de animales
 */
const animalsService = {
  /**
   * Obtener todos los animales (público)
   * @param {object} filters - Filtros opcionales
   * @param {string} filters.especie - 'Perro' | 'Gato'
   * @param {string} filters.estado - 'Disponible' | 'En proceso' | 'Adoptado' | 'En tránsito'
   * @param {string} filters.tamanio - 'Pequeño' | 'Mediano' | 'Grande'
   * @param {string} filters.busqueda - Búsqueda por nombre
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    // Construir query params
    const params = new URLSearchParams()

    if (filters.especie) params.append('especie', filters.especie)
    if (filters.estado) params.append('estado', filters.estado)
    if (filters.tamanio) params.append('tamanio', filters.tamanio)
    if (filters.busqueda) params.append('busqueda', filters.busqueda)

    const queryString = params.toString()
    const url = queryString ? `/api/animals?${queryString}` : '/api/animals'

    const response = await api.get(url)
    // La API devuelve { success, data: { animals, total } }
    return response.data?.data?.animals || response.data || []
  },

  /**
   * Obtener animales disponibles para adopción (público)
   * Filtro rápido solo para animales con estado "Disponible"
   * @returns {Promise<Array>}
   */
  async getAvailable() {
    return this.getAll({ estado: 'Disponible' })
  },

  /**
   * Obtener un animal por ID (público)
   * @param {number|string} id - ID del animal
   * @returns {Promise<object>}
   */
  async getById(id) {
    const response = await api.get(`/api/animals/${id}`)
    // La API devuelve { success, data: { animal } }
    return response.data?.data?.animal || response.data?.data || response.data
  },

  /**
   * Crear un nuevo animal (admin)
   * @param {object} data - Datos del animal
   * @returns {Promise<object>}
   */
  async create(data) {
    const response = await api.post('/api/animals', data)
    return response.data
  },

  /**
   * Actualizar un animal (admin)
   * @param {number|string} id - ID del animal
   * @param {object} data - Datos actualizados
   * @returns {Promise<object>}
   */
  async update(id, data) {
    const response = await api.put(`/api/animals/${id}`, data)
    return response.data
  },

  /**
   * Cambiar estado de un animal (admin)
   * @param {number|string} id - ID del animal
   * @param {string} estado - Nuevo estado
   * @returns {Promise<object>}
   */
  async updateStatus(id, estado) {
    const response = await api.patch(`/api/animals/${id}/status`, { estado })
    return response.data
  },

  /**
   * Eliminar un animal (admin)
   * @param {number|string} id - ID del animal
   * @returns {Promise<void>}
   */
  async delete(id) {
    await api.delete(`/api/animals/${id}`)
  },

  /**
   * Obtener estadísticas de animales (admin)
   * @returns {Promise<object>}
   */
  async getStats() {
    const response = await api.get('/api/animals/stats')
    return response.data
  },
}

export default animalsService
