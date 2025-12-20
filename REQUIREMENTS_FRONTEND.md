# REQUIREMENTS_FRONTEND.md - Frontend Plataforma de Adopción de Animales

## Información del Proyecto

- **Proyecto:** Plataforma Web de Adopción de Animales - Frontend
- **Tipo:** Trabajo Final Integrador (TFI) - UTN Paraná
- **Desarrollador:** Facundo Cornejo
- **Fecha:** Diciembre 2025

---

## Stack Tecnológico

```
Framework:      React 18+ (con Vite)
Routing:        React Router v6
HTTP Client:    Axios
Estilos:        Tailwind CSS
Formularios:    React Hook Form + Zod
Estado Global:  React Context (para auth)
Iconos:         Lucide React
Notificaciones: React Hot Toast
Deploy:         Vercel
```

---

## API Backend

**Producción:** `https://adopcion-api.onrender.com`
**Documentación:** `https://adopcion-api.onrender.com/api-docs`

Ver archivo `API_CONTRACT.md` para detalles de endpoints.

---

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes base (Button, Input, Card, etc.)
│   │   ├── layout/           # Header, Footer, Sidebar
│   │   └── animals/          # AnimalCard, AnimalGallery, etc.
│   │
│   ├── pages/                # Páginas/Vistas
│   │   ├── public/           # Páginas públicas
│   │   │   ├── Home.jsx
│   │   │   ├── AnimalDetail.jsx
│   │   │   └── AdoptionForm.jsx
│   │   │
│   │   └── admin/            # Panel de administración
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Animals.jsx
│   │       ├── AnimalForm.jsx
│   │       ├── Requests.jsx
│   │       └── RequestDetail.jsx
│   │
│   ├── context/              # Contextos de React
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useAnimals.js
│   │   └── useRequests.js
│   │
│   ├── services/             # Llamadas a la API
│   │   ├── api.js            # Configuración de Axios
│   │   ├── auth.service.js
│   │   ├── animals.service.js
│   │   └── requests.service.js
│   │
│   ├── utils/                # Funciones utilitarias
│   │   ├── formatters.js     # Formateo de fechas, textos
│   │   └── validators.js     # Validaciones con Zod
│   │
│   ├── styles/               # Estilos globales
│   │   └── globals.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx            # Configuración de rutas
│
├── public/
│   └── favicon.ico
│
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Páginas y Funcionalidades

### PÚBLICAS (sin autenticación)

#### 1. Home (`/`)
- Catálogo de animales disponibles
- Cards con: foto, nombre, edad, especie, tamaño, estado
- Filtros por: especie (Perro/Gato), tamaño, estado
- Buscador por nombre (opcional)
- Diseño responsive (mobile-first)
- Lazy loading de imágenes

#### 2. Detalle de Animal (`/animal/:id`)
- Galería de fotos (hasta 5)
- Información completa del animal
- Historia de rescate destacada
- Indicadores de socialización (perros/gatos/niños)
- Necesidades especiales (si tiene)
- Información de contacto del rescatista
- Botón "Quiero Adoptarlo" → abre formulario

#### 3. Formulario de Adopción (`/animal/:id/adoptar`)
- Formulario de 17 campos
- Validación en tiempo real
- Campos condicionales (ej: "otros animales castrados" solo si tiene otros animales)
- Confirmación antes de enviar
- Mensaje de éxito después de enviar

---

### ADMIN (requiere autenticación)

#### 4. Login (`/admin/login`)
- Email y contraseña
- Validación de campos
- Manejo de errores (credenciales inválidas)
- Redirección a dashboard después de login
- "Recordarme" (opcional)

#### 5. Dashboard (`/admin`)
- Estadísticas generales:
  - Total de animales por estado
  - Total de solicitudes por estado
  - Solicitudes de los últimos 7 días
  - Tasa de adopción
- Accesos rápidos a secciones
- Solicitudes recientes (últimas 5)

#### 6. Gestión de Animales (`/admin/animals`)
- Tabla/lista de todos los animales
- Filtros por estado y especie
- Acciones: Ver, Editar, Cambiar estado, Eliminar
- Botón "Nuevo Animal"
- Paginación (si hay muchos)

#### 7. Formulario de Animal (`/admin/animals/new`, `/admin/animals/:id/edit`)
- Crear o editar animal
- Upload de fotos (hasta 5)
- Preview de fotos antes de guardar
- Validación de campos obligatorios
- Guardar como borrador (opcional)

#### 8. Gestión de Solicitudes (`/admin/requests`)
- Tabla de todas las solicitudes
- Filtros por estado y animal
- Ver animal relacionado
- Marcar como vista
- Cambiar estado

#### 9. Detalle de Solicitud (`/admin/requests/:id`)
- Todos los campos del solicitante
- Datos de contacto destacados
- Animal solicitado (con link)
- Cambiar estado de la solicitud
- Botón para contactar (abre WhatsApp/email)

---

## Componentes Reutilizables

### UI Base
- `Button` - Variantes: primary, secondary, danger, ghost
- `Input` - Con label, error, helper text
- `Select` - Dropdown estilizado
- `Checkbox` - Con label
- `Textarea` - Para textos largos
- `Card` - Contenedor con sombra
- `Modal` - Diálogos y confirmaciones
- `Badge` - Estados, etiquetas
- `Spinner` - Loading indicator
- `Alert` - Mensajes de error/éxito/warning

### Layout
- `Header` - Navegación pública
- `Footer` - Links, contacto
- `AdminLayout` - Sidebar + header para admin
- `ProtectedRoute` - Wrapper para rutas protegidas

### Animals
- `AnimalCard` - Card para el catálogo
- `AnimalGallery` - Galería de fotos
- `AnimalInfo` - Información detallada
- `AnimalFilters` - Filtros del catálogo
- `SocializationBadges` - Indicadores de socialización

### Forms
- `AdoptionForm` - Formulario de 17 campos
- `AnimalForm` - Formulario de crear/editar animal
- `ImageUploader` - Upload de fotos con preview

---

## Autenticación

### Flujo de Login
1. Usuario ingresa email y contraseña
2. POST a `/api/auth/login`
3. Si éxito: guardar token en localStorage
4. Redirigir a `/admin`
5. Si error: mostrar mensaje

### Protección de Rutas
- Componente `ProtectedRoute` verifica si hay token
- Si no hay token → redirige a `/admin/login`
- Si token expirado (401) → logout y redirigir

### Context de Auth
```javascript
// Valores que debe proveer
{
  admin: { id, username, email, organizacion },
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (email, password) => Promise,
  logout: () => void
}
```

---

## Manejo de Estado

### Local (useState)
- Estados de UI (modals abiertos, tabs activos)
- Formularios simples

### Context
- Autenticación (AuthContext)

### Fetch on demand
- Datos de la API se obtienen cuando se necesitan
- Usar custom hooks para encapsular lógica

---

## Validaciones (Zod)

### Formulario de Adopción
```javascript
const adoptionSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  edad: z.number().min(18, 'Debes ser mayor de 18 años'),
  email: z.string().email('Email inválido'),
  telefono_whatsapp: z.string().min(8, 'Teléfono inválido'),
  ciudad_zona: z.string().min(3, 'Indica tu ciudad/zona'),
  tipo_vivienda: z.enum(['Casa con patio', 'Casa sin patio', 'Departamento', 'Otro']),
  todos_de_acuerdo: z.literal(true, { errorMap: () => ({ message: 'Todos deben estar de acuerdo' }) }),
  experiencia_previa: z.string().min(10, 'Contanos tu experiencia'),
  motivacion: z.string().min(20, 'Contanos por qué querés adoptar'),
  compromiso_castracion: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar el compromiso' }) }),
  // ... resto de campos
});
```

---

## Variables de Entorno

```env
# API
VITE_API_URL=https://adopcion-api.onrender.com

# Opcional: Analytics, etc.
VITE_GA_ID=
```

---

## Responsive Breakpoints (Tailwind)

```
sm:  640px   (móvil grande)
md:  768px   (tablet)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (pantalla grande)
```

**Estrategia:** Mobile-first para páginas públicas.

---

## Performance

- Lazy loading de imágenes (`loading="lazy"`)
- Code splitting por rutas (`React.lazy`)
- Imágenes optimizadas desde Cloudinary
- Evitar re-renders innecesarios (`React.memo`, `useMemo`)

---

## Accesibilidad Básica

- Labels en todos los inputs
- Alt text en imágenes
- Contraste de colores suficiente
- Navegación por teclado
- Focus visible en elementos interactivos
- Roles ARIA donde corresponda

---

## Orden de Implementación

### Fase 1: Setup
1. Crear proyecto con Vite
2. Instalar dependencias
3. Configurar Tailwind
4. Estructura de carpetas
5. Configurar variables de entorno

### Fase 2: Base
6. Configurar Axios con interceptors
7. Crear servicios de API
8. Layout público (Header, Footer)
9. Componentes UI base

### Fase 3: Páginas Públicas
10. Home (catálogo)
11. Componente AnimalCard
12. Detalle de animal
13. Formulario de adopción

### Fase 4: Autenticación
14. AuthContext
15. Página de Login
16. ProtectedRoute
17. Layout Admin

### Fase 5: Panel Admin
18. Dashboard
19. Listado de animales
20. Formulario de animal + upload
21. Listado de solicitudes
22. Detalle de solicitud

### Fase 6: Polish
23. Loading states
24. Manejo de errores
25. Notificaciones toast
26. Responsive final
27. Deploy a Vercel
