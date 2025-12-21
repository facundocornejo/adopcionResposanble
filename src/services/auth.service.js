import api from './api'

/**
 * Servicio de Autenticación
 * Maneja login, logout y verificación de sesión
 */
const authService = {
  /**
   * Iniciar sesión
   * @param {string} email - Email del administrador
   * @param {string} password - Contraseña
   * @returns {Promise<{token: string, admin: object}>}
   */
  async login(email, password) {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    })

    // La API devuelve { success: true, data: { token, admin, organizacion } }
    const { token, admin, organizacion } = response.data.data

    // Guardar en localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(admin))

    return { token, admin, organizacion }
  },

  /**
   * Cerrar sesión
   * Limpia el localStorage
   */
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
  },

  /**
   * Obtener el token guardado
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token')
  },

  /**
   * Obtener el admin guardado
   * @returns {object|null}
   */
  getAdmin() {
    const admin = localStorage.getItem('admin')
    return admin ? JSON.parse(admin) : null
  },

  /**
   * Verificar si hay sesión activa
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken()
    return !!token
  },

  /**
   * Verificar token con el backend
   * Útil para verificar si el token sigue siendo válido
   * @returns {Promise<object>} - Datos del admin
   */
  async verifyToken() {
    const response = await api.get('/api/auth/me')
    // La API devuelve { success: true, data: { admin } }
    return response.data.data?.admin || response.data.data
  },
}

export default authService
