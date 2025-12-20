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

    const { token, admin } = response.data

    // Guardar en localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(admin))

    return response.data
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
   * Verificar token con el backend (opcional)
   * Útil para verificar si el token sigue siendo válido
   * @returns {Promise<object>}
   */
  async verifyToken() {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export default authService
