# FASE 3: Layout y Componentes Base

**Fecha:** Diciembre 2025
**Objetivo:** Crear componentes UI reutilizables y layouts responsivos

---

## Qué Hiciste (Lista de Archivos)

### Componentes UI (src/components/ui/)
| Archivo | Descripción |
|---------|-------------|
| `Button.jsx` | Botón con variantes (primary, secondary, danger, ghost) |
| `Input.jsx` | Input de texto con label, error y helper text |
| `Select.jsx` | Select estilizado con ícono |
| `Textarea.jsx` | Área de texto con contador de caracteres |
| `Checkbox.jsx` | Checkbox personalizado con label |
| `Card.jsx` | Contenedor con sombra y subcomponentes |
| `Badge.jsx` | Etiquetas de estado coloridas |
| `Spinner.jsx` | Indicador de carga animado |
| `Modal.jsx` | Diálogo modal con overlay |
| `Alert.jsx` | Mensajes de feedback (info, success, warning, error) |
| `index.js` | Re-exporta todos los componentes |

### Componentes Layout (src/components/layout/)
| Archivo | Descripción |
|---------|-------------|
| `Header.jsx` | Header responsivo con menú hamburguesa |
| `Footer.jsx` | Footer con links y redes sociales |
| `PublicLayout.jsx` | Layout para páginas públicas |
| `AdminLayout.jsx` | Layout para panel de admin |
| `ProtectedRoute.jsx` | Wrapper que protege rutas de admin |
| `index.js` | Re-exporta todos los layouts |

### Archivos Modificados
| Archivo | Cambio |
|---------|--------|
| `router.jsx` | Usa ProtectedRoute para rutas de admin |

---

## Por Qué Lo Hiciste (Justificación Técnica)

### 1. Componentes Atómicos (Atomic Design)

**¿Qué es Atomic Design?**
Es una metodología que divide la UI en niveles:

```
Átomos     → Elementos básicos (Button, Input, Badge)
Moléculas  → Combinación de átomos (SearchBar = Input + Button)
Organismos → Secciones completas (Header, AnimalCard)
Templates  → Layouts de página (PublicLayout)
Páginas    → Instancias con datos reales (Home, Dashboard)
```

**¿Por qué hacerlo así?**
- **Reutilización:** Un Button se usa en 50 lugares
- **Consistencia:** Todos los inputs se ven igual
- **Mantenibilidad:** Cambiar el estilo de todos los botones = modificar 1 archivo
- **Testing:** Podés testear cada componente aislado

### 2. El Patrón de Props en Componentes

Todos los componentes siguen un patrón similar:

```jsx
const Button = ({
  variant = 'primary',  // ← Valor por defecto
  size = 'md',
  isLoading = false,
  disabled = false,
  children,             // ← Contenido del botón
  className,            // ← Clases adicionales
  ...props              // ← Resto de props (onClick, type, etc.)
}) => {
  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}  // ← Spread de props extras
    >
      {children}
    </button>
  )
}
```

**Beneficios:**
- **Predecible:** Siempre sabés qué props acepta
- **Flexible:** `className` y `...props` permiten personalizar
- **Documentado:** Los valores por defecto están explícitos

### 3. forwardRef: Pasar Refs a Componentes

```jsx
// Sin forwardRef
const Input = (props) => {
  return <input {...props} />
}

// ❌ Esto NO funciona:
const inputRef = useRef()
<Input ref={inputRef} />  // ref se pierde

// Con forwardRef
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// ✅ Ahora SÍ funciona:
<Input ref={inputRef} />
```

**¿Por qué es importante?**
React Hook Form necesita refs para manejar inputs sin re-renders:
```jsx
<Input {...register('email')} />  // register devuelve ref
```

### 4. clsx: Clases Condicionales Limpias

```jsx
// Sin clsx (feo y propenso a errores)
className={`base ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}

// Con clsx (limpio y legible)
className={clsx(
  'base',
  isActive && 'active',
  isDisabled && 'disabled',
  {
    'otro-estilo': condicion,
  }
)}
```

### 5. Composición con Subcomponentes

El componente Card usa el patrón de subcomponentes:

```jsx
// Definición
Card.Header = ({ children }) => <div className="...">{children}</div>
Card.Body = ({ children }) => <div className="...">{children}</div>
Card.Footer = ({ children }) => <div className="...">{children}</div>

// Uso
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Body>
    Contenido...
  </Card.Body>
  <Card.Footer>
    <Button>Acción</Button>
  </Card.Footer>
</Card>
```

**Beneficios:**
- **Semántico:** El código se lee como lo que es
- **Flexible:** Podés usar o no cada parte
- **Encapsulado:** Los estilos de cada parte están en un lugar

### 6. Portales para Modales

```jsx
import { createPortal } from 'react-dom'

// El modal se renderiza FUERA del árbol de componentes normal
return createPortal(
  <div className="modal">...</div>,
  document.body  // ← Se agrega al body, no donde está el componente
)
```

**¿Por qué usar portales?**
- El modal aparece encima de TODO
- No hay problemas de `overflow: hidden` del padre
- El `z-index` funciona correctamente

### 7. Accesibilidad en Componentes

Cada componente incluye atributos de accesibilidad:

```jsx
// Input con accesibilidad
<input
  id={inputId}                    // Para el htmlFor del label
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={`${inputId}-error`}  // Vincula con el mensaje de error
/>
{error && (
  <p id={`${inputId}-error`} role="alert">
    {error}
  </p>
)}

// Modal con accesibilidad
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Título</h2>
</div>
```

### 8. Header con Menú Hamburguesa (Mobile-First)

```jsx
// Estado para controlar si está abierto
const [isMenuOpen, setIsMenuOpen] = useState(false)

return (
  <header>
    {/* Logo siempre visible */}
    <Logo />

    {/* Nav desktop - Oculto en móvil */}
    <nav className="hidden md:flex">
      {links}
    </nav>

    {/* Botón hamburguesa - Solo en móvil */}
    <button className="md:hidden" onClick={toggle}>
      {isMenuOpen ? <X /> : <Menu />}
    </button>

    {/* Menú móvil - Se expande/contrae */}
    <div className={clsx(
      'md:hidden overflow-hidden transition-all',
      isMenuOpen ? 'max-h-64' : 'max-h-0'
    )}>
      {links}
    </div>
  </header>
)
```

### 9. ProtectedRoute: Protección de Rutas

```jsx
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    // Redirige a login
    return <Navigate to="/admin/login" />
  }

  // Si está autenticado, muestra el contenido
  return children
}

// Uso en router
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
```

---

## Dónde Lo Hiciste (Estructura)

```
src/
├── components/
│   ├── ui/                      ← Componentes base
│   │   ├── Button.jsx          ← Botones con variantes
│   │   ├── Input.jsx           ← Inputs de texto
│   │   ├── Select.jsx          ← Dropdowns
│   │   ├── Textarea.jsx        ← Áreas de texto
│   │   ├── Checkbox.jsx        ← Checkboxes
│   │   ├── Card.jsx            ← Contenedores
│   │   ├── Badge.jsx           ← Etiquetas de estado
│   │   ├── Spinner.jsx         ← Indicadores de carga
│   │   ├── Modal.jsx           ← Diálogos modales
│   │   ├── Alert.jsx           ← Mensajes de feedback
│   │   └── index.js            ← Exporta todo
│   │
│   └── layout/                  ← Estructura de páginas
│       ├── Header.jsx          ← Header responsivo
│       ├── Footer.jsx          ← Footer con links
│       ├── PublicLayout.jsx    ← Layout público
│       ├── AdminLayout.jsx     ← Layout admin
│       ├── ProtectedRoute.jsx  ← Protección de rutas
│       └── index.js            ← Exporta todo
│
└── router.jsx                   ← Actualizado con ProtectedRoute
```

---

## Cómo Usar los Componentes

### Button

```jsx
import { Button } from '../components/ui'

// Variantes
<Button variant="primary">Principal</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="danger">Eliminar</Button>
<Button variant="ghost">Link</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Normal</Button>
<Button size="lg">Grande</Button>

// Estados
<Button isLoading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>

// Con íconos
<Button leftIcon={<Plus />}>Agregar</Button>
<Button rightIcon={<ArrowRight />}>Siguiente</Button>

// Ancho completo
<Button fullWidth>Botón completo</Button>
```

### Input

```jsx
import { Input } from '../components/ui'

// Básico
<Input
  label="Email"
  placeholder="tu@email.com"
/>

// Con error
<Input
  label="Email"
  error="El email es inválido"
/>

// Con helper text
<Input
  label="Contraseña"
  type="password"
  helperText="Mínimo 6 caracteres"
/>

// Con íconos
<Input
  leftIcon={<Search />}
  placeholder="Buscar..."
/>

// Obligatorio
<Input label="Nombre" required />

// Con React Hook Form
<Input
  label="Email"
  error={errors.email?.message}
  {...register('email')}
/>
```

### Select

```jsx
import { Select } from '../components/ui'
import { ESPECIES } from '../utils/constants'

<Select
  label="Especie"
  options={ESPECIES}
  placeholder="Seleccionar..."
  error={errors.especie?.message}
  {...register('especie')}
/>
```

### Textarea

```jsx
import { Textarea } from '../components/ui'

<Textarea
  label="Historia"
  rows={5}
  maxLength={500}
  showCount
  helperText="Contá la historia de este animalito"
  {...register('historia')}
/>
```

### Checkbox

```jsx
import { Checkbox } from '../components/ui'

<Checkbox
  label="Acepto los términos"
  description="Debés aceptar para continuar"
  error={errors.terminos?.message}
  {...register('terminos')}
/>
```

### Card

```jsx
import { Card } from '../components/ui'

// Simple
<Card>Contenido</Card>

// Con estructura
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Body>
    Contenido principal
  </Card.Body>
  <Card.Footer>
    <Button>Acción</Button>
  </Card.Footer>
</Card>

// Variantes
<Card variant="elevated">Más sombra</Card>
<Card variant="outline">Con borde</Card>

// Interactivo
<Card hoverable clickable onClick={handleClick}>
  Click me
</Card>
```

### Badge

```jsx
import { Badge } from '../components/ui'

// Variantes de color
<Badge variant="sage">Disponible</Badge>
<Badge variant="amber">En proceso</Badge>
<Badge variant="purple">Adoptado</Badge>
<Badge variant="sky">En tránsito</Badge>

// Con punto indicador
<Badge variant="blue" dot>Nueva</Badge>

// Helper para estados de animales
<Badge variant={Badge.getAnimalVariant(animal.estado)}>
  {animal.estado}
</Badge>

// Helper para estados de solicitudes
<Badge variant={Badge.getRequestVariant(solicitud.estado)}>
  {solicitud.estado}
</Badge>
```

### Spinner

```jsx
import { Spinner } from '../components/ui'

// Básico
<Spinner />

// Con texto
<Spinner text="Cargando..." />

// Centrado en contenedor
<Spinner center />

// Pantalla completa
<Spinner fullScreen />

// Tamaños y colores
<Spinner size="sm" color="white" />  // Para botones
<Spinner size="lg" color="terracotta" />
```

### Modal

```jsx
import { Modal, Button } from '../components/ui'

const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del Modal"
  size="md"
>
  <p>Contenido del modal</p>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button onClick={handleConfirm}>
      Confirmar
    </Button>
  </Modal.Footer>
</Modal>
```

### Alert

```jsx
import { Alert } from '../components/ui'

// Tipos
<Alert variant="info">Información importante</Alert>
<Alert variant="success">Operación exitosa</Alert>
<Alert variant="warning">Atención</Alert>
<Alert variant="error">Hubo un error</Alert>

// Con título
<Alert variant="success" title="Solicitud enviada">
  Nos pondremos en contacto pronto.
</Alert>

// Dismissible
<Alert
  variant="info"
  dismissible
  onDismiss={() => setShowAlert(false)}
>
  Podés cerrar esta alerta
</Alert>
```

---

## Conceptos Clave

### 1. Props Destructuring con Defaults

```jsx
// En lugar de:
const Button = (props) => {
  const variant = props.variant || 'primary'
  ...
}

// Usamos:
const Button = ({ variant = 'primary', ...props }) => {
  ...
}
```

### 2. Spread Props

```jsx
// Permite pasar cualquier prop adicional al elemento
<button {...props}>
  {/* onClick, type, aria-*, data-*, etc. */}
</button>
```

### 3. Conditional Rendering

```jsx
// Con &&
{isLoading && <Spinner />}

// Con ternario
{isLoading ? <Spinner /> : <Content />}

// Con early return
if (isLoading) return <Spinner />
return <Content />
```

### 4. displayName

```jsx
Button.displayName = 'Button'
```

Ayuda en React DevTools a identificar el componente (especialmente con forwardRef).

---

## Próxima Fase

**Fase 4: Páginas Públicas**
- Home con catálogo de animales y filtros
- Detalle de animal con galería de fotos
- Formulario de adopción de 17 campos en pasos

---

## Comandos Útiles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Verificar que todo compila
```

Probá los componentes navegando a:
- `/` - Home con Header y Footer nuevos
- `/admin/login` - Ahora redirige si no hay token
- `/admin` - Redirige a login (ProtectedRoute)
