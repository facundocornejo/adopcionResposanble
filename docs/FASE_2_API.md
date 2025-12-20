# FASE 2: Configuración de API y Servicios

**Fecha:** Diciembre 2025
**Objetivo:** Configurar la comunicación con el backend y crear utilidades

---

## Qué Hiciste (Lista de Archivos)

### Servicios (src/services/)
| Archivo | Descripción |
|---------|-------------|
| `api.js` | Configuración de Axios con interceptors |
| `auth.service.js` | Servicio de autenticación |
| `animals.service.js` | Servicio CRUD de animales |
| `requests.service.js` | Servicio de solicitudes de adopción |
| `index.js` | Re-exporta todos los servicios |

### Utilidades (src/utils/)
| Archivo | Descripción |
|---------|-------------|
| `validators.js` | Schemas de validación con Zod |
| `formatters.js` | Funciones de formateo (fechas, textos, etc.) |
| `constants.js` | Constantes globales (opciones, mensajes) |
| `index.js` | Re-exporta todas las utilidades |

---

## Por Qué Lo Hiciste (Justificación Técnica)

### 1. Axios en lugar de Fetch nativo

**¿Qué es Axios?**
Es una librería para hacer peticiones HTTP. Es una alternativa al `fetch()` nativo del navegador.

**¿Por qué Axios y no Fetch?**

| Característica | Fetch | Axios |
|----------------|-------|-------|
| Transformación JSON | Manual (`response.json()`) | Automática |
| Timeout | No soportado | Soportado |
| Interceptors | No soportado | Soportado |
| Cancelación | Compleja | Simple |
| Errores HTTP | No lanza error en 4xx/5xx | Configurable |

```javascript
// Con Fetch (más verboso)
const response = await fetch('/api/animales')
if (!response.ok) throw new Error('Error')
const data = await response.json()

// Con Axios (más simple)
const { data } = await axios.get('/api/animales')
```

### 2. Patrón de Interceptors

**¿Qué son los interceptors?**
Son funciones que se ejecutan automáticamente antes de enviar cada petición (request interceptor) o después de recibir cada respuesta (response interceptor).

**Request Interceptor - ¿Para qué?**
```javascript
// ANTES de cada petición:
// 1. Busca si hay token guardado
// 2. Si hay, lo agrega al header Authorization

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

Esto significa que NO tenés que agregar el token manualmente en cada petición. Lo hace automáticamente.

**Response Interceptor - ¿Para qué?**
```javascript
// DESPUÉS de cada respuesta con error:
// 1. Si es 401 (token inválido) → logout automático
// 2. Si es 500 → mostrar toast de error
// 3. Etc.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)
```

### 3. Patrón de Servicios (Service Layer)

**¿Qué es un servicio?**
Es un objeto que agrupa todas las operaciones relacionadas con una entidad. Por ejemplo, `animalsService` tiene todos los métodos para trabajar con animales.

**¿Por qué usar servicios?**

```javascript
// SIN servicios (disperso, difícil de mantener)
// En Componente A:
const response = await axios.get('/api/animales')

// En Componente B:
const response = await axios.get('/api/animales')

// En Componente C:
const response = await axios.get('/api/animales') // ¿Y si cambia la URL?
```

```javascript
// CON servicios (centralizado)
// En cualquier componente:
const animals = await animalsService.getAll()

// Si cambia la URL, solo modificás un lugar
```

**Beneficios:**
1. **Un solo lugar para cambios:** Si la API cambia, modificás un archivo
2. **Reutilizable:** Cualquier componente puede usar el servicio
3. **Testeable:** Podés mockear el servicio en tests
4. **Documentado:** Los métodos tienen JSDoc explicando qué hacen

### 4. Validación con Zod

**¿Qué es Zod?**
Una librería para definir "schemas" de validación. Definís cómo deben ser los datos y Zod valida que lo sean.

**¿Por qué Zod y no validación manual?**

```javascript
// Validación manual (repetitiva, propensa a errores)
if (!email) return 'El email es obligatorio'
if (!email.includes('@')) return 'Email inválido'
if (edad < 18) return 'Debés ser mayor de 18'
// ... repetir para cada campo
```

```javascript
// Con Zod (declarativo, reutilizable)
const schema = z.object({
  email: z.string().email('Email inválido'),
  edad: z.number().min(18, 'Debés ser mayor de 18'),
})

// Validar
const result = schema.safeParse(data)
if (!result.success) {
  // result.error tiene todos los errores
}
```

**Beneficios:**
1. **TypeScript-like:** Define la forma de los datos
2. **Mensajes personalizados:** Cada regla puede tener su mensaje
3. **Composable:** Podés combinar schemas
4. **Integración con React Hook Form:** Funciona perfecto con `@hookform/resolvers`

### 5. Constantes Centralizadas

**¿Por qué centralizar constantes?**

```javascript
// SIN constantes (valores mágicos dispersos)
// En Componente A:
<select>
  <option value="Perro">Perro</option>
  <option value="Gato">Gato</option>
</select>

// En Componente B:
if (animal.especie === 'Perro') { ... }

// En Componente C:
const especies = ['Perro', 'Gato']
```

```javascript
// CON constantes (una sola fuente de verdad)
// En constants.js:
export const ESPECIES = [
  { value: 'Perro', label: 'Perro' },
  { value: 'Gato', label: 'Gato' },
]

// En cualquier componente:
import { ESPECIES } from '@/utils/constants'
```

---

## Dónde Lo Hiciste (Estructura)

```
src/
├── services/                    ← Comunicación con la API
│   ├── api.js                  ← Configuración base de Axios
│   ├── auth.service.js         ← Login, logout, verificación
│   ├── animals.service.js      ← CRUD de animales
│   ├── requests.service.js     ← CRUD de solicitudes
│   └── index.js                ← Exporta todos los servicios
│
└── utils/                       ← Funciones auxiliares
    ├── validators.js           ← Schemas de Zod
    ├── formatters.js           ← Formateo de datos
    ├── constants.js            ← Constantes globales
    └── index.js                ← Exporta todas las utilidades
```

---

## Explicación de Cada Archivo

### `src/services/api.js`

**¿Qué hace?**
Crea una instancia de Axios configurada con:
- URL base de la API
- Timeout de 15 segundos
- Interceptor de request: agrega token automáticamente
- Interceptor de response: maneja errores globalmente

```javascript
// Crear instancia configurada
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

// Interceptor de request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Token expirado → logout
    }
    return Promise.reject(error)
  }
)
```

### `src/services/auth.service.js`

**¿Qué hace?**
Maneja todo lo relacionado con autenticación:

```javascript
const authService = {
  // Iniciar sesión
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
  },

  // Verificar si hay sesión
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}
```

### `src/services/animals.service.js`

**¿Qué hace?**
CRUD completo de animales:

```javascript
const animalsService = {
  // Obtener todos (con filtros opcionales)
  async getAll(filters = {}) { ... },

  // Obtener uno por ID
  async getById(id) { ... },

  // Crear (con fotos)
  async create(formData) { ... },

  // Actualizar
  async update(id, formData) { ... },

  // Cambiar estado
  async updateStatus(id, estado) { ... },

  // Eliminar
  async delete(id) { ... },
}
```

### `src/services/requests.service.js`

**¿Qué hace?**
CRUD de solicitudes de adopción:

```javascript
const requestsService = {
  // Obtener todas (admin)
  async getAll(filters = {}) { ... },

  // Crear nueva (público - formulario de adopción)
  async create(data) { ... },

  // Actualizar estado
  async updateStatus(id, estado) { ... },
}
```

### `src/utils/validators.js`

**¿Qué hace?**
Define schemas de validación con Zod:

```javascript
// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// Schema para formulario de adopción (17 campos)
export const adoptionSchema = z.object({
  nombre_completo: z.string().min(3),
  edad: z.number().min(18),
  email: z.string().email(),
  // ... más campos
})

// Schemas parciales para validar por pasos
export const adoptionStep1Schema = adoptionSchema.pick({
  nombre_completo: true,
  edad: true,
  email: true,
})
```

### `src/utils/formatters.js`

**¿Qué hace?**
Funciones para formatear datos:

```javascript
// Formatear fecha
formatDate('2025-12-20') // → '20/12/2025'

// Tiempo relativo
timeAgo('2025-12-20T10:00:00') // → 'Hace 2 horas'

// Truncar texto largo
truncate('Texto muy largo...', 50) // → 'Texto muy lar...'

// Link de WhatsApp
getWhatsAppLink('1155551234', 'Hola!')
// → 'https://wa.me/5491155551234?text=Hola!'

// Clase CSS según estado
getAnimalStatusClass('Disponible') // → 'badge-disponible'
```

### `src/utils/constants.js`

**¿Qué hace?**
Centraliza valores constantes:

```javascript
// Opciones para selectores
export const ESPECIES = [
  { value: 'Perro', label: 'Perro' },
  { value: 'Gato', label: 'Gato' },
]

export const ESTADOS_ANIMAL = [
  { value: 'Disponible', label: 'Disponible', color: 'sage' },
  { value: 'En proceso', label: 'En proceso', color: 'amber' },
  // ...
]

// Mensajes reutilizables
export const MESSAGES = {
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  NETWORK_ERROR: 'Error de conexión',
  // ...
}

// Límites
export const LIMITS = {
  MAX_PHOTOS: 5,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
}
```

---

## Cómo Usar los Servicios

### Ejemplo: Obtener animales en un componente

```jsx
import { useState, useEffect } from 'react'
import { animalsService } from '../services'

const AnimalList = () => {
  const [animals, setAnimals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setIsLoading(true)
        const data = await animalsService.getAll()
        setAnimals(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimals()
  }, [])

  if (isLoading) return <Spinner />
  if (error) return <Error message={error} />

  return (
    <div>
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  )
}
```

### Ejemplo: Login con validación

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../utils/validators'
import { authService } from '../services'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    try {
      await authService.login(data.email, data.password)
      // Redirigir a dashboard
    } catch (error) {
      // Error ya manejado por el interceptor
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
```

---

## Conceptos Clave

### Async/Await

```javascript
// Forma tradicional con .then()
animalsService.getAll()
  .then(data => setAnimals(data))
  .catch(err => setError(err))

// Con async/await (más legible)
const fetchAnimals = async () => {
  try {
    const data = await animalsService.getAll()
    setAnimals(data)
  } catch (err) {
    setError(err)
  }
}
```

### Try-Catch

```javascript
// SIEMPRE envolver operaciones async en try-catch
const handleSubmit = async () => {
  try {
    // Código que puede fallar
    await animalsService.create(data)
  } catch (error) {
    // Manejar el error
    console.error(error)
  }
}
```

### LocalStorage

```javascript
// Guardar
localStorage.setItem('token', 'abc123')
localStorage.setItem('admin', JSON.stringify({ name: 'Juan' }))

// Leer
const token = localStorage.getItem('token') // 'abc123'
const admin = JSON.parse(localStorage.getItem('admin')) // { name: 'Juan' }

// Borrar
localStorage.removeItem('token')
```

---

## Flujo de una Petición

```
1. Componente llama: animalsService.getAll()
           ↓
2. Servicio hace: api.get('/api/animales')
           ↓
3. Request Interceptor:
   - Busca token en localStorage
   - Agrega header: Authorization: Bearer <token>
           ↓
4. Petición va al servidor
           ↓
5. Servidor responde
           ↓
6. Response Interceptor:
   - Si es 401 → logout automático
   - Si es error → muestra toast
           ↓
7. Servicio recibe: response.data
           ↓
8. Componente recibe los datos
```

---

## Próxima Fase

**Fase 3: Layout y Componentes Base**
- Header responsivo con menú hamburguesa
- Footer
- Componentes UI: Button, Input, Select, Card, Badge, Modal
- Sistema de loading y error states

---

## Comandos Útiles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Verificar que todo compila
```
