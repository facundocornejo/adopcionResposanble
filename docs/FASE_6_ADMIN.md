# Fase 6: Panel de Administración

## Resumen

En esta fase implementamos el panel completo de administración:
1. **Dashboard**: Estadísticas y resumen de actividad
2. **Animals**: CRUD completo de animales
3. **AnimalForm**: Formulario de crear/editar con fotos
4. **Requests**: Gestión de solicitudes de adopción
5. **RequestDetail**: Vista detallada de cada solicitud
6. **AdminLayout**: Navegación y logout funcional

---

## Archivos Creados/Modificados

### Layout

```
src/components/layout/
└── AdminLayout.jsx    # Actualizado con logout y menú mobile
```

### Páginas Admin

```
src/pages/admin/
├── Dashboard.jsx      # Estadísticas y actividad reciente
├── Animals.jsx        # Listado CRUD de animales
├── AnimalForm.jsx     # Formulario crear/editar animal
├── Requests.jsx       # Listado de solicitudes
├── RequestDetail.jsx  # Detalle de una solicitud
├── Login.jsx          # (ya existía de Fase 5)
└── index.js           # Re-exports
```

---

## Dashboard

El Dashboard muestra un resumen ejecutivo:
- Estadísticas principales (animales, solicitudes)
- Solicitudes recientes
- Animales recientes
- Resumen de estados

### Estadísticas

```jsx
const [animalsData, requestsData] = await Promise.all([
  animalsService.getAll(),
  requestsService.getAll(),
])

const stats = {
  totalAnimales: animalsData.length,
  disponibles: animalsData.filter(a => a.estado === 'Disponible').length,
  adoptados: animalsData.filter(a => a.estado === 'Adoptado').length,
  nuevas: requestsData.filter(r => r.estado === 'Nueva').length,
  pendientes: requestsData.filter(r =>
    r.estado === 'Nueva' || r.estado === 'Contactada'
  ).length,
}
```

### StatCard Component

```jsx
const StatCard = ({ icon: Icon, value, label, color, highlight }) => (
  <div className={`card p-4 ${highlight ? 'ring-2 ring-amber-400' : ''}`}>
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-2xl font-bold text-brown-900">{value}</p>
    <p className="text-sm text-brown-500">{label}</p>
  </div>
)
```

---

## Animals (CRUD)

Listado completo con:
- Búsqueda por nombre
- Filtros por especie y estado
- Cambio de estado inline
- Eliminación con confirmación modal
- Vista tabla (desktop) y cards (mobile)

### Filtros

```jsx
const [filters, setFilters] = useState({
  busqueda: '',
  especie: '',
  estado: '',
})

const fetchAnimals = useCallback(async () => {
  const data = await animalsService.getAll(filters)
  setAnimals(data)
}, [filters])
```

### Cambio de Estado Inline

```jsx
const handleStatusChange = async (animal, newStatus) => {
  try {
    await animalsService.updateStatus(animal.id, newStatus)
    toast.success(`${animal.nombre} ahora está "${newStatus}"`)
    fetchAnimals()
  } catch (err) {
    toast.error(err.message || 'Error al cambiar estado')
  }
}

// En la tabla
<select
  value={animal.estado}
  onChange={(e) => handleStatusChange(animal, e.target.value)}
  className={`text-sm font-medium px-3 py-1 rounded-full
    ${animal.estado === 'Disponible' ? 'bg-sage-100 text-sage-700' : ''}
    ${animal.estado === 'En proceso' ? 'bg-amber-100 text-amber-700' : ''}
    ${animal.estado === 'Adoptado' ? 'bg-terracotta-100 text-terracotta-700' : ''}
  `}
>
  {ESTADOS_ANIMAL.map(e => <option key={e} value={e}>{e}</option>)}
</select>
```

### Modal de Eliminación

```jsx
const [deleteModal, setDeleteModal] = useState({
  isOpen: false,
  animal: null,
  isDeleting: false,
})

const confirmDelete = async () => {
  setDeleteModal(prev => ({ ...prev, isDeleting: true }))
  try {
    await animalsService.delete(deleteModal.animal.id)
    toast.success(`${deleteModal.animal.nombre} eliminado`)
    closeDeleteModal()
    fetchAnimals()
  } catch (err) {
    toast.error(err.message || 'Error al eliminar')
  }
}

<Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal} title="Eliminar animal">
  <p>¿Estás seguro de que querés eliminar a <strong>{deleteModal.animal?.nombre}</strong>?</p>
  <div className="flex gap-3 justify-end">
    <Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button>
    <Button variant="danger" onClick={confirmDelete} isLoading={deleteModal.isDeleting}>
      Eliminar
    </Button>
  </div>
</Modal>
```

---

## AnimalForm

Formulario completo para crear/editar animales.

### Modo Crear vs Editar

```jsx
const { id } = useParams()
const isEditing = Boolean(id)

// Título dinámico
<h1>{isEditing ? 'Editar Animal' : 'Nuevo Animal'}</h1>

// Botón dinámico
<Button type="submit">
  {isEditing ? 'Guardar' : 'Crear'}
</Button>
```

### Gestión de Fotos

```jsx
const [existingPhotos, setExistingPhotos] = useState([])
const [newPhotos, setNewPhotos] = useState([])
const [photosToDelete, setPhotosToDelete] = useState([])

// Agregar fotos con preview
const handlePhotoSelect = (e) => {
  const files = Array.from(e.target.files)
  const photosWithPreview = files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
  }))
  setNewPhotos(prev => [...prev, ...photosWithPreview])
}

// Eliminar foto nueva (liberar memoria)
const removeNewPhoto = (index) => {
  setNewPhotos(prev => {
    const updated = [...prev]
    URL.revokeObjectURL(updated[index].preview) // Importante!
    updated.splice(index, 1)
    return updated
  })
}

// Eliminar foto existente (marcar para eliminar)
const removeExistingPhoto = (photoUrl) => {
  setExistingPhotos(prev => prev.filter(p => p !== photoUrl))
  setPhotosToDelete(prev => [...prev, photoUrl])
}
```

### Envío con FormData

```jsx
const onSubmit = async (data) => {
  const formData = new FormData()

  // Agregar campos del formulario
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      formData.append(key, data[key])
    }
  })

  // Agregar fotos nuevas
  newPhotos.forEach(photo => {
    formData.append('fotos', photo.file)
  })

  // Indicar fotos a eliminar (solo en edición)
  if (isEditing && photosToDelete.length > 0) {
    formData.append('fotos_eliminar', JSON.stringify(photosToDelete))
  }

  // Crear o actualizar
  if (isEditing) {
    await animalsService.update(id, formData)
  } else {
    await animalsService.create(formData)
  }
}
```

### RadioGroup para Socialización

```jsx
const RadioGroup = ({ label, name, register }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-brown-700">{label}</label>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="true"
          {...register(name, {
            setValueAs: v => v === 'true' ? true : v === 'false' ? false : null
          })}
        />
        <span>Sí</span>
      </label>
      <label>
        <input type="radio" value="false" {...register(name, {...})} />
        <span>No</span>
      </label>
      <label>
        <input type="radio" value="" {...register(name, {...})} />
        <span>No sé</span>
      </label>
    </div>
  </div>
)
```

---

## Requests (Solicitudes)

Listado de solicitudes con filtros por estado.

### Filtros por Estado

```jsx
const [filterEstado, setFilterEstado] = useState('')
const [allRequests, setAllRequests] = useState([])

// Contadores por estado
const counts = {
  all: allRequests.length,
  Nueva: allRequests.filter(r => r.estado === 'Nueva').length,
  Contactada: allRequests.filter(r => r.estado === 'Contactada').length,
  Aprobada: allRequests.filter(r => r.estado === 'Aprobada').length,
  Rechazada: allRequests.filter(r => r.estado === 'Rechazada').length,
}

// Aplicar filtro
useEffect(() => {
  if (filterEstado) {
    setRequests(allRequests.filter(r => r.estado === filterEstado))
  } else {
    setRequests(allRequests)
  }
}, [filterEstado, allRequests])
```

### FilterButton Component

```jsx
const FilterButton = ({ children, active, onClick, count, highlight }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
      ${active
        ? 'bg-terracotta-500 text-white'
        : highlight && count > 0
          ? 'bg-amber-100 text-amber-700'
          : 'bg-brown-100 text-brown-600'
      }
    `}
  >
    {children}
    {count > 0 && <span className="ml-1.5">({count})</span>}
  </button>
)
```

### Acciones Rápidas

```jsx
{(request.estado === 'Nueva' || request.estado === 'Contactada') && (
  <div className="flex gap-2 mt-4 pt-4 border-t border-brown-100">
    <button onClick={() => handleStatusChange(request, 'Aprobada')}>
      <CheckCircle /> Aprobar
    </button>
    <button onClick={() => handleStatusChange(request, 'Rechazada')}>
      <XCircle /> Rechazar
    </button>
  </div>
)}
```

---

## RequestDetail

Vista detallada de una solicitud con toda la información organizada.

### Secciones de Información

1. **Datos del Solicitante**: nombre, edad, email, teléfono, zona
2. **Vivienda**: tipo, propia/alquila, permite mascotas, convivientes
3. **Convivencia**: niños, otros animales, edades
4. **Experiencia y Motivación**: experiencia previa, motivación, compromisos

### InfoField Component

```jsx
const InfoField = ({ label, value, className = '', highlight = false }) => (
  <div className={className}>
    <p className="text-sm text-brown-500">{label}</p>
    <p className={`font-medium ${highlight ? 'text-red-600' : 'text-brown-900'}`}>
      {value || '-'}
    </p>
  </div>
)
```

### Acciones de Contacto

```jsx
// WhatsApp
<a
  href={getWhatsAppLink(
    request.telefono_whatsapp,
    `Hola ${request.nombre_completo}, te contacto por tu solicitud de adopción...`
  )}
  target="_blank"
  className="w-full flex items-center justify-center gap-2 py-3 bg-sage-500 text-white rounded-xl"
>
  <Phone /> Contactar por WhatsApp
</a>

// Email
<a
  href={`mailto:${request.email}?subject=Solicitud de adopción - ${request.animal?.nombre}`}
  className="w-full flex items-center justify-center gap-2 py-3 border border-brown-200 text-brown-700 rounded-xl"
>
  <Mail /> Enviar email
</a>
```

### Cambiar Estado

```jsx
const handleStatusUpdate = async () => {
  if (newStatus === request.estado) return

  setIsUpdating(true)
  try {
    await requestsService.updateStatus(id, newStatus)
    setRequest(prev => ({ ...prev, estado: newStatus }))
    toast.success(`Estado actualizado a "${newStatus}"`)
  } catch (err) {
    toast.error(err.message || 'Error al actualizar')
  } finally {
    setIsUpdating(false)
  }
}
```

---

## AdminLayout Actualizado

### Logout Funcional

```jsx
const { admin, logout } = useAuth()

const handleLogout = () => {
  logout()
  toast.success('Sesión cerrada')
  navigate('/')
}

// Botón de logout
<button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl"
>
  <LogOut className="w-5 h-5" />
  <span>Cerrar sesión</span>
</button>
```

### Mostrar Info del Admin

```jsx
// En el sidebar
<div className="p-4 border-t border-brown-100">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-terracotta-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-brown-900 truncate">
        {admin?.nombre || 'Admin'}
      </p>
      <p className="text-xs text-brown-500 truncate">
        {admin?.email}
      </p>
    </div>
  </div>
</div>
```

---

## Conceptos Clave Aprendidos

### 1. Estado Local vs Derivado

```jsx
// ❌ Duplicar estado
const [filteredRequests, setFilteredRequests] = useState([])

// ✅ Derivar del estado existente
useEffect(() => {
  const filtered = allRequests.filter(r => r.estado === filterEstado)
  setRequests(filtered)
}, [filterEstado, allRequests])
```

### 2. FormData para Archivos

FormData permite enviar archivos junto con datos JSON:

```jsx
const formData = new FormData()
formData.append('nombre', 'Firulais')
formData.append('fotos', file1)  // Mismo nombre, múltiples archivos
formData.append('fotos', file2)
```

### 3. URL.createObjectURL para Previews

```jsx
// Crear preview temporal
const preview = URL.createObjectURL(file)

// IMPORTANTE: Liberar memoria cuando no se use
URL.revokeObjectURL(preview)
```

### 4. Render Condicional con Múltiples Estados

```jsx
// Patrón: Loading → Error → Empty → Content
if (isLoading) return <Spinner />
if (error) return <Alert variant="error">{error}</Alert>
if (items.length === 0) return <EmptyState />
return <List items={items} />
```

### 5. Estado de Modal

```jsx
// Agrupar estado relacionado
const [modal, setModal] = useState({
  isOpen: false,
  item: null,
  isProcessing: false,
})

// Actualizar parcialmente
setModal(prev => ({ ...prev, isProcessing: true }))
```

---

## Flujo de Gestión de Solicitud

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLICITUD NUEVA                              │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Admin ve en Dashboard "Solicitudes Nuevas: 1"                  │
│  (Indicador amarillo de atención)                               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Requests → Filtro "Nuevas" resaltado                           │
│  Click en "Ver detalle"                                         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  RequestDetail                                                  │
│  - Revisa información completa                                  │
│  - Click "Contactar por WhatsApp"                               │
│  - Cambia estado a "Contactada"                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│    APROBAR              │      │    RECHAZAR             │
│                         │      │                         │
│  - Cambiar estado       │      │  - Cambiar estado       │
│  - Animal → En proceso  │      │  - Notificar motivo     │
│  - Coordinar entrega    │      │                         │
└─────────────────────────┘      └─────────────────────────┘
```

---

## Responsive Design

### Tabla Desktop / Cards Mobile

```jsx
// Tabla visible solo en desktop
<div className="hidden md:block">
  <table>...</table>
</div>

// Cards visibles solo en mobile
<div className="md:hidden">
  {items.map(item => <Card key={item.id}>...</Card>)}
</div>
```

### Grid Responsive

```jsx
// Stats: 2 columnas mobile, 4 desktop
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

// Formulario: 1 columna mobile, 3 desktop (2+1)
<div className="grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">...</div>
  <div>...</div>
</div>
```

---

## Resumen de Archivos

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| Dashboard.jsx | ~285 | Estadísticas y actividad reciente |
| Animals.jsx | ~360 | CRUD de animales con tabla/cards |
| AnimalForm.jsx | ~510 | Formulario crear/editar con fotos |
| Requests.jsx | ~245 | Listado de solicitudes con filtros |
| RequestDetail.jsx | ~330 | Vista detallada de solicitud |
| AdminLayout.jsx | ~180 | Layout con navegación y logout |

**Total: ~1,910 líneas de código en esta fase**

---

## Próximos Pasos (Fase 7)

1. **Deploy a Vercel**
   - Configurar proyecto en Vercel
   - Variables de entorno (VITE_API_URL)
   - Verificar funcionamiento en producción
