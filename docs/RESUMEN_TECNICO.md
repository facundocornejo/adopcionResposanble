# Resumen Técnico - Frontend

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| React 18 | Librería UI |
| Vite | Build tool |
| React Router 6 | Enrutamiento |
| React Hook Form + Zod | Formularios y validación |
| Tailwind CSS | Estilos |
| Axios | HTTP client |
| Lucide React | Iconos |

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/           # Button, Input, Modal, Spinner, etc.
│   ├── layout/       # Header, Footer, AdminLayout
│   └── admin/        # CasoExitoModal
├── pages/
│   ├── public/       # Home, AnimalDetail, AdoptionForm, CasosExito
│   └── admin/        # Dashboard, Animals, Requests, Settings
├── services/         # API calls (axios)
├── hooks/            # useAuth, useAnimals, etc.
├── context/          # AuthContext
├── utils/            # validators, constants, formatters
└── router.jsx        # Configuración de rutas
```

## Características Implementadas

### Público
- Catálogo de animales con filtros
- Detalle de animal con galería
- Formulario de adopción (4 pasos)
- Casos de éxito
- Páginas informativas

### Admin
- Dashboard con estadísticas
- CRUD de animales
- Gestión de solicitudes
- Creación de casos de éxito
- Configuración de organización

### Técnicas
- Lazy loading de páginas
- Error boundaries con retry
- Scroll to top automático
- Validación dual (frontend + backend)
- Diseño mobile-first

## Patrones Utilizados

- **Context API**: Estado global de autenticación
- **Custom Hooks**: Lógica reutilizable (useAuth, useAnimals)
- **Compound Components**: Componentes UI compuestos
- **Controlled Forms**: React Hook Form
- **Code Splitting**: React.lazy + Suspense

## Flujo de Datos

```
Usuario interactúa
       │
       ▼
Componente React
       │
       ▼
Custom Hook (useAnimals, etc.)
       │
       ▼
Service (animalsService)
       │
       ▼
Axios → API Backend
       │
       ▼
Actualiza estado → Re-render
```

## Validación de Formularios

Usando Zod para schemas tipados:

```javascript
const adoptionSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  edad: z.number().min(18, 'Debes ser mayor de 18'),
  // ...
})
```

## Autenticación

- JWT almacenado en localStorage
- Context provider para estado global
- ProtectedRoute para rutas de admin
- Interceptor de Axios para headers

## Responsive Design

- Mobile-first con Tailwind
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Componentes adaptativos (tabla → cards en mobile)
