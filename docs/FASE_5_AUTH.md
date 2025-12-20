# Fase 5: Autenticación

## Resumen

En esta fase implementamos el sistema completo de autenticación:
1. **AuthContext**: Estado global de autenticación
2. **useAuth Hook**: Acceso fácil al contexto
3. **Login funcional**: Página de login con validación
4. **ProtectedRoute mejorado**: Protección de rutas con loading
5. **Header dinámico**: Muestra opciones según estado de auth

---

## Archivos Creados/Modificados

### Contexto

```
src/context/
├── AuthContext.jsx    # Contexto y Provider
└── index.js           # Re-exports
```

### Hooks

```
src/hooks/
├── useAuth.js         # Hook para acceder al contexto
└── index.js           # Actualizado con useAuth
```

### Componentes Actualizados

```
src/components/layout/
├── Header.jsx           # Ahora muestra opciones según auth
└── ProtectedRoute.jsx   # Ahora usa useAuth + loading
```

### Páginas

```
src/pages/admin/
└── Login.jsx            # Login funcional con React Hook Form
```

### Entry Point

```
src/main.jsx             # Envuelve la app con AuthProvider
```

---

## AuthContext

El contexto de autenticación maneja:
- Estado del admin autenticado
- Estado de carga inicial (verificando token)
- Funciones de login/logout

### Estructura del Provider

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar sesión al cargar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          const adminData = await authService.verifyToken()
          setAdmin(adminData)
          setIsAuthenticated(true)
        }
      } catch {
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setAdmin(data.admin)
    setIsAuthenticated(true)
    return data
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setAdmin(null)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Envolver la App

```jsx
// src/main.jsx
import { AuthProvider } from './context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster ... />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
```

---

## Hook useAuth

Hook personalizado para acceder al contexto de forma segura.

```jsx
// src/hooks/useAuth.js
import { useContext } from 'react'
import { AuthContext } from '../context'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}
```

### Uso en Componentes

```jsx
import { useAuth } from '../hooks'

const MiComponente = () => {
  const { admin, isAuthenticated, login, logout, isLoading } = useAuth()

  if (isLoading) return <Spinner />

  if (isAuthenticated) {
    return <p>Hola, {admin.nombre}</p>
  }

  return <button onClick={() => login(email, password)}>Ingresar</button>
}
```

---

## Página de Login

Login funcional con:
- React Hook Form + Zod para validación
- Manejo de errores (401, 429, conexión)
- Botón para mostrar/ocultar contraseña
- Redirección post-login a la ruta original

### Flujo de Login

```
Usuario entra a /admin/animales (protegida)
       ↓
ProtectedRoute detecta que no está autenticado
       ↓
Redirige a /admin/login con state: { from: '/admin/animales' }
       ↓
Usuario completa el formulario y hace submit
       ↓
Login exitoso → Redirige a '/admin/animales' (la ruta original)
```

### Código Relevante

```jsx
// Obtener ruta de redirección
const from = location.state?.from?.pathname || '/admin'

// Si ya está autenticado, redirigir
if (isAuthenticated) {
  navigate(from, { replace: true })
  return null
}

// Después del login exitoso
const onSubmit = async (data) => {
  try {
    await login(data.email, data.password)
    toast.success('¡Bienvenido!')
    navigate(from, { replace: true })
  } catch (error) {
    // Manejar errores...
  }
}
```

### Manejo de Errores

```jsx
if (error.response?.status === 401) {
  setLoginError('Email o contraseña incorrectos')
} else if (error.response?.status === 429) {
  setLoginError('Demasiados intentos. Esperá unos minutos.')
} else if (!error.response) {
  setLoginError('Error de conexión. Verificá tu internet.')
} else {
  setLoginError(error.message || 'Error al iniciar sesión')
}
```

---

## ProtectedRoute Mejorado

Ahora usa el contexto y maneja el estado de carga.

### Comportamiento

1. **isLoading = true**: Muestra spinner (verificando token)
2. **isAuthenticated = false**: Redirige a login
3. **isAuthenticated = true**: Muestra el contenido

```jsx
const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  // Mientras verifica el token
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Verificando sesión..." />
      </div>
    )
  }

  // No autenticado → login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}
```

---

## Header Dinámico

El Header ahora muestra diferentes opciones según el estado de auth.

### No Autenticado

```
[Logo] [Animales] [Nosotros]        [Ingresar]
```

### Autenticado

```
[Logo] [Animales] [Nosotros]   👤 Nombre  [Panel] [🚪]
```

### Código Relevante

```jsx
const { isAuthenticated, admin, logout } = useAuth()

// En el render
{isAuthenticated ? (
  <div className="flex items-center gap-3">
    <span className="text-sm text-brown-500">
      <User /> {admin?.nombre || 'Admin'}
    </span>
    <Link to="/admin">
      <LayoutDashboard /> Panel
    </Link>
    <button onClick={handleLogout}>
      <LogOut />
    </button>
  </div>
) : (
  <Link to="/admin/login">Ingresar</Link>
)}
```

---

## Conceptos Clave Aprendidos

### 1. Context API

React Context permite compartir estado sin pasar props manualmente.

```jsx
// Crear contexto
const MiContexto = createContext(null)

// Proveer valor
<MiContexto.Provider value={valor}>
  {children}
</MiContexto.Provider>

// Consumir valor
const valor = useContext(MiContexto)
```

### 2. Custom Hooks con Context

Encapsular la lógica del contexto en un hook mejora la API.

```jsx
// ❌ Sin hook
const context = useContext(AuthContext)
if (!context) throw new Error('...')

// ✅ Con hook
const { login, logout } = useAuth()
```

### 3. Estado de Carga Inicial

Es importante manejar el estado mientras se verifica el token:

```jsx
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  verificarToken().finally(() => setIsLoading(false))
}, [])

if (isLoading) return <Spinner />
```

### 4. Redirección con Estado

`useLocation` y `Navigate` permiten guardar la ruta original:

```jsx
// Guardar ruta
<Navigate to="/login" state={{ from: location }} />

// Recuperar ruta
const from = location.state?.from?.pathname || '/default'
navigate(from, { replace: true })
```

### 5. useCallback para Funciones Estables

En el contexto, usamos `useCallback` para que las funciones no cambien en cada render:

```jsx
const login = useCallback(async (email, password) => {
  // ...
}, [])

const logout = useCallback(() => {
  // ...
}, [])
```

---

## Flujo Completo de Autenticación

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP CARGA                                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  AuthProvider.useEffect()                                       │
│  - Busca token en localStorage                                  │
│  - Si hay token → verifyToken() con API                         │
│  - Si válido → setAdmin(data), setIsAuthenticated(true)         │
│  - Si inválido → logout()                                       │
│  - Finalmente → setIsLoading(false)                             │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│    RUTA PÚBLICA         │      │    RUTA PROTEGIDA       │
│    /                    │      │    /admin/*             │
│    /animal/:id          │      │                         │
│    /animal/:id/adoptar  │      │  ProtectedRoute         │
│                         │      │  - isLoading → Spinner  │
│  Header muestra         │      │  - !auth → /login       │
│  opciones según auth    │      │  - auth → children      │
└─────────────────────────┘      └─────────────────────────┘
```

---

## Próximos Pasos (Fase 6)

1. Panel de Administración completo
   - Dashboard con estadísticas
   - CRUD de animales funcional
   - Gestión de solicitudes de adopción

---

## Resumen de Archivos

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| AuthContext.jsx | ~85 | Contexto y Provider de auth |
| useAuth.js | ~30 | Hook para acceder al contexto |
| Login.jsx | ~155 | Página de login funcional |
| ProtectedRoute.jsx | ~45 | Protección de rutas mejorada |
| Header.jsx | ~195 | Header con opciones dinámicas |
| main.jsx | ~42 | Entry point con AuthProvider |

**Total: ~550 líneas de código en esta fase**
