# Fase 4: Páginas Públicas

## Resumen

En esta fase implementamos las tres páginas públicas principales de la aplicación:
1. **Home**: Catálogo de animales con filtros
2. **AnimalDetail**: Detalle completo de un animal
3. **AdoptionForm**: Formulario de adopción en 4 pasos

---

## Archivos Creados/Modificados

### Componentes de Animales

```
src/components/animals/
├── AnimalCard.jsx       # Card para el catálogo
├── AnimalFilters.jsx    # Filtros de búsqueda
├── AnimalGallery.jsx    # Galería de fotos
└── index.js             # Re-exports
```

### Custom Hooks

```
src/hooks/
├── useAnimals.js        # Hook para lista y detalle de animales
└── index.js             # Re-exports
```

### Páginas

```
src/pages/public/
├── Home.jsx             # Catálogo con hero + filtros
├── AnimalDetail.jsx     # Perfil completo del animal
└── AdoptionForm.jsx     # Formulario wizard 4 pasos
```

---

## Componentes de Animales

### AnimalCard

Componente que muestra la preview de un animal en el catálogo.

**Características:**
- Foto con fallback si no hay imagen
- Badge de estado (Disponible, En proceso, Adoptado)
- Info básica: nombre, especie, sexo, edad, tamaño
- Ubicación del rescatista
- Link a la página de detalle

```jsx
import { AnimalCard } from '../components/animals'

<AnimalCard animal={animal} />
```

**Props del animal esperadas:**
```js
{
  id: number,
  nombre: string,
  especie: 'Perro' | 'Gato',
  sexo: 'Macho' | 'Hembra',
  edad_aproximada: string,
  tamanio: 'Pequeño' | 'Mediano' | 'Grande',
  foto_principal: string | null,
  estado: 'Disponible' | 'En proceso' | 'Adoptado',
  zona_rescatista: string | null
}
```

### AnimalFilters

Componente de filtros para el catálogo.

**Características:**
- Búsqueda por texto (nombre, descripción)
- Filtro por especie (Todos, Perro, Gato)
- Filtro por tamaño (Todos, Pequeño, Mediano, Grande)
- Contador de resultados
- Diseño colapsable en móvil

```jsx
import { AnimalFilters } from '../components/animals'

<AnimalFilters
  filters={filters}
  onFilterChange={updateFilters}
  totalResults={total}
/>
```

### AnimalGallery

Galería de fotos para la página de detalle.

**Características:**
- Navegación con flechas
- Thumbnails clickeables
- Indicadores de posición (dots)
- Soporte para una o múltiples fotos
- Fallback cuando no hay fotos

```jsx
import { AnimalGallery } from '../components/animals'

<AnimalGallery
  fotos={['url1.jpg', 'url2.jpg']}
  nombre="Luna"
/>
```

---

## Custom Hook: useAnimals

### useAnimals (lista)

Hook para obtener lista de animales con filtros.

```jsx
import { useAnimals } from '../hooks'

const {
  animals,       // Array de animales
  isLoading,     // Boolean
  error,         // String o null
  filters,       // Objeto con filtros actuales
  updateFilters, // Función para cambiar filtros
  refresh,       // Función para recargar
  total,         // Número total de resultados
} = useAnimals({ estado: 'Disponible' })
```

**Cómo funciona:**
1. Recibe filtros iniciales opcionales
2. Hace fetch al montar el componente
3. Se vuelve a ejecutar cuando cambian los filtros
4. Maneja estados de carga y error automáticamente

### useAnimal (detalle)

Hook para obtener un animal por ID.

```jsx
import { useAnimal } from '../hooks'

const { animal, isLoading, error } = useAnimal(id)
```

---

## Página Home

La página principal que muestra el catálogo de animales.

### Estructura

1. **Hero Section**
   - Título emocional: "Hay alguien esperando por vos"
   - Subtítulo descriptivo
   - CTA que scrollea al catálogo

2. **Catálogo**
   - Filtros (colapsables en móvil)
   - Grid responsive de AnimalCards
   - Estados: cargando, error, vacío

3. **Sección Informativa**
   - "¿Cómo funciona la adopción?"
   - 3 pasos explicados visualmente

### Código Relevante

```jsx
// Inicializar con filtro de estado
const { animals, isLoading, filters, updateFilters } = useAnimals({
  estado: 'Disponible'
})

// Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {animals.map((animal) => (
    <AnimalCard key={animal.id} animal={animal} />
  ))}
</div>
```

---

## Página AnimalDetail

Muestra toda la información de un animal.

### Estructura

1. **Breadcrumb** - Volver al catálogo
2. **Galería de fotos** - Componente AnimalGallery
3. **Info Principal** - Nombre, especie, edad, tamaño, ubicación
4. **Historia** - Descripción del animal (si existe)
5. **Características** - Castrado, vacunado, desparasitado
6. **Socialización** - Con perros, gatos, niños
7. **Necesidades especiales** (si existen)
8. **Card de Adopción** (sticky) - CTA o estado actual
9. **Contacto del Rescatista**

### Layout

Usa un grid de 3 columnas en desktop:
- 2 columnas: contenido principal
- 1 columna: sidebar con CTA y contacto

```jsx
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-6">
    {/* Contenido principal */}
  </div>
  <div className="space-y-6">
    {/* Sidebar sticky */}
    <Card className="sticky top-24">
      {/* CTA o estado */}
    </Card>
  </div>
</div>
```

---

## Formulario de Adopción (Wizard)

Formulario de 17 campos dividido en 4 pasos.

### Paso 1: Datos Personales
- nombre_completo
- edad (mínimo 18)
- email
- telefono_whatsapp
- ciudad_zona

### Paso 2: Vivienda
- tipo_vivienda (Casa con patio, Casa sin patio, Departamento, Otro)
- vivienda_propia (Sí/No)
- permite_mascotas (solo si alquila) - **Campo condicional**
- cantidad_convivientes
- todos_de_acuerdo (checkbox obligatorio)

### Paso 3: Convivencia
- hay_ninos (Sí/No)
- edades_ninos (solo si hay niños) - **Campo condicional**
- tiene_otros_animales (Sí/No)
- descripcion_otros_animales (solo si tiene) - **Campo condicional**
- otros_animales_castrados (solo si tiene) - **Campo condicional**

### Paso 4: Motivación
- experiencia_previa
- motivacion
- compromiso_castracion (checkbox obligatorio)
- compromiso_seguimiento (checkbox obligatorio)

### Validación por Pasos

Usamos schemas de Zod separados para cada paso:

```jsx
// En validators.js
export const adoptionStep1Schema = adoptionSchema.pick({
  nombre_completo: true,
  edad: true,
  email: true,
  telefono_whatsapp: true,
  ciudad_zona: true,
})

// En el componente
const validateCurrentStep = async () => {
  const currentStepConfig = STEPS[currentStep - 1]
  const fieldsToValidate = Object.keys(currentStepConfig.schema.shape)
  return await trigger(fieldsToValidate)
}
```

### Campos Condicionales

Usamos `watch` de React Hook Form para mostrar/ocultar campos:

```jsx
const viviendaPropia = watch('vivienda_propia')
const hayNinos = watch('hay_ninos')
const tieneOtrosAnimales = watch('tiene_otros_animales')

// En el render
{viviendaPropia === false && (
  <RadioGroup ... /> // ¿Permite mascotas?
)}

{hayNinos === true && (
  <Input ... /> // Edades de niños
)}

{tieneOtrosAnimales === true && (
  <>
    <Textarea ... /> // Descripción
    <RadioGroup ... /> // ¿Castrados?
  </>
)}
```

### Progress Indicator

Indicador visual de pasos con estados:
- **Completado**: círculo verde con check, clickeable
- **Activo**: círculo terracotta con ícono
- **Pendiente**: círculo gris

```jsx
<button
  className={`
    ${isCompleted ? 'bg-sage-500 text-white'
      : isActive ? 'bg-terracotta-500 text-white'
      : 'bg-brown-100 text-brown-400'}
  `}
>
  {isCompleted ? <Check /> : <StepIcon />}
</button>
```

### Estados del Formulario

1. **Cargando animal**: Spinner
2. **Error al cargar**: Alert + link a catálogo
3. **Animal no encontrado**: Mensaje + link
4. **Animal no disponible**: Mensaje emocional + link
5. **Formulario activo**: Wizard de 4 pasos
6. **Éxito al enviar**: Card de confirmación

---

## Conceptos Clave Aprendidos

### 1. Custom Hooks

Los custom hooks permiten extraer lógica reutilizable:

```jsx
// Hook personalizado
export const useAnimal = (id) => {
  const [animal, setAnimal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnimal = async () => {
      setIsLoading(true)
      try {
        const data = await animalsService.getById(id)
        setAnimal(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnimal()
  }, [id])

  return { animal, isLoading, error }
}
```

### 2. Formularios Wizard (Multi-Step)

Patrón para dividir formularios largos en pasos:

1. **Estado del paso actual**: `useState(1)`
2. **Validación por paso**: Solo los campos del paso actual
3. **Navegación**: nextStep, prevStep, goToStep
4. **Campos condicionales**: watch + renderizado condicional
5. **Submit final**: Solo en el último paso

### 3. React Hook Form - Funciones Clave

```jsx
const {
  register,      // Conectar inputs al form
  handleSubmit,  // Wrapper para onSubmit
  watch,         // Observar valores de campos
  trigger,       // Validar campos específicos
  formState: { errors }, // Acceder a errores
} = useForm({
  mode: 'onChange', // Validar mientras escribe
  defaultValues: { ... }
})

// Validar solo algunos campos
await trigger(['campo1', 'campo2'])

// Observar valor de un campo
const valor = watch('campo')
```

### 4. Responsive Design Mobile-First

```jsx
// Grid que adapta columnas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Ocultar en móvil, mostrar en desktop
<div className="hidden md:block">

// Mostrar en móvil, ocultar en desktop
<div className="md:hidden">

// Padding adaptativo
<section className="py-12 md:py-16">
```

---

## Próximos Pasos (Fase 5)

1. Implementar autenticación
   - AuthContext para estado global
   - Página de Login funcional
   - Protección de rutas admin

---

## Resumen de Archivos

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| AnimalCard.jsx | ~80 | Card de animal para catálogo |
| AnimalFilters.jsx | ~120 | Filtros colapsables |
| AnimalGallery.jsx | ~150 | Galería con navegación |
| useAnimals.js | ~90 | Hooks para animales |
| Home.jsx | ~160 | Catálogo + hero |
| AnimalDetail.jsx | ~310 | Perfil completo |
| AdoptionForm.jsx | ~780 | Formulario wizard |

**Total: ~1690 líneas de código en esta fase**
