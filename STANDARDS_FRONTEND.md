# STANDARDS_FRONTEND.md - Estándares Frontend React

## Objetivo
Este documento define los estándares que DEBEN aplicarse en todo el código frontend.
Claude Code debe seguir estas reglas en cada archivo que cree o modifique.

---

## 1. ESTRUCTURA DE COMPONENTES

### 1.1 Nomenclatura de Archivos
```
✅ CORRECTO: PascalCase para componentes
AnimalCard.jsx
AdoptionForm.jsx
ProtectedRoute.jsx

✅ CORRECTO: camelCase para utilidades y hooks
useAuth.js
formatDate.js
api.js

❌ INCORRECTO
animal-card.jsx
animal_card.jsx
animalcard.jsx
```

### 1.2 Estructura de un Componente
```jsx
// ✅ CORRECTO: Orden lógico
import { useState, useEffect } from 'react';      // 1. React imports
import { useNavigate } from 'react-router-dom';   // 2. Librerías externas
import { Button } from '../ui/Button';             // 3. Componentes internos
import { useAuth } from '../../hooks/useAuth';     // 4. Hooks propios
import { formatDate } from '../../utils/formatters'; // 5. Utilidades
import { animalService } from '../../services/animals.service'; // 6. Servicios

const AnimalCard = ({ animal, onAdopt }) => {     // 7. Componente
  // Estados
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Efectos
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    navigate(`/animal/${animal.id}`);
  };
  
  // Render
  return (
    <div>...</div>
  );
};

export default AnimalCard;                         // 8. Export
```

### 1.3 Componentes Funcionales (NO clases)
```jsx
// ✅ CORRECTO: Functional component con hooks
const AnimalCard = ({ animal }) => {
  const [isHovered, setIsHovered] = useState(false);
  return <div>...</div>;
};

// ❌ INCORRECTO: Class component (obsoleto)
class AnimalCard extends React.Component {
  render() {
    return <div>...</div>;
  }
}
```

---

## 2. NAMING CONVENTIONS

### 2.1 Componentes y Variables
```jsx
// ✅ CORRECTO
const AnimalCard = () => {};          // PascalCase para componentes
const [isLoading, setIsLoading] = useState();  // camelCase para estados
const handleSubmit = () => {};        // handle + Acción para handlers
const onAnimalClick = () => {};       // on + Sustantivo + Acción para props callback

// ❌ INCORRECTO
const animal_card = () => {};         // snake_case
const [loading, setloading] = useState(); // setloading sin camelCase
const submitHandler = () => {};       // Handler al final
```

### 2.2 Props de Componentes
```jsx
// ✅ CORRECTO: Props descriptivas
<AnimalCard 
  animal={animal}
  isLoading={isLoading}
  onAdoptClick={handleAdopt}
  showActions={true}
/>

// ❌ INCORRECTO: Props ambiguas
<AnimalCard 
  data={animal}
  loading={true}
  click={handleAdopt}
  flag={true}
/>
```

### 2.3 Constantes
```javascript
// ✅ CORRECTO: UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ANIMAL_STATES = ['Disponible', 'En proceso', 'Adoptado'];

// ❌ INCORRECTO
const apiUrl = 'https://api.example.com';
const maxFileSize = 5 * 1024 * 1024;
```

---

## 3. JSX BEST PRACTICES

### 3.1 Conditional Rendering
```jsx
// ✅ CORRECTO: Ternario para dos opciones
{isLoading ? <Spinner /> : <Content />}

// ✅ CORRECTO: && para mostrar/ocultar
{isAuthenticated && <AdminMenu />}

// ✅ CORRECTO: Early return para casos complejos
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <Content />;

// ❌ INCORRECTO: Ternarios anidados (ilegibles)
{isLoading ? <Spinner /> : error ? <Error /> : data ? <Content /> : null}
```

### 3.2 Listas y Keys
```jsx
// ✅ CORRECTO: Key única y estable
{animals.map((animal) => (
  <AnimalCard key={animal.id} animal={animal} />
))}

// ❌ INCORRECTO: Index como key (causa bugs)
{animals.map((animal, index) => (
  <AnimalCard key={index} animal={animal} />
))}

// ❌ INCORRECTO: Sin key
{animals.map((animal) => (
  <AnimalCard animal={animal} />
))}
```

### 3.3 Fragmentos
```jsx
// ✅ CORRECTO: Fragment cuando no necesitás wrapper
return (
  <>
    <Header />
    <Content />
  </>
);

// ❌ INCORRECTO: Div innecesario
return (
  <div>
    <Header />
    <Content />
  </div>
);
```

### 3.4 Props Booleanas
```jsx
// ✅ CORRECTO: Implícito para true
<Button disabled />
<Input required />

// ✅ CORRECTO: Explícito cuando es variable
<Button disabled={isSubmitting} />

// ❌ INCORRECTO: Explícito para true literal
<Button disabled={true} />
```

---

## 4. HOOKS

### 4.1 Reglas de Hooks
```jsx
// ✅ CORRECTO: Hooks al inicio del componente
const MyComponent = () => {
  const [state, setState] = useState();
  const { data } = useContext(MyContext);
  
  useEffect(() => {}, []);
  
  return <div>...</div>;
};

// ❌ INCORRECTO: Hooks condicionales
const MyComponent = ({ showData }) => {
  if (showData) {
    const [data, setData] = useState(); // ERROR: Hook condicional
  }
};

// ❌ INCORRECTO: Hooks en loops
{items.map(item => {
  const [selected, setSelected] = useState(false); // ERROR
})}
```

### 4.2 useEffect - Dependencias
```jsx
// ✅ CORRECTO: Dependencias explícitas
useEffect(() => {
  fetchAnimal(animalId);
}, [animalId]);

// ✅ CORRECTO: Efecto solo al montar
useEffect(() => {
  initializeApp();
}, []);

// ❌ INCORRECTO: Sin array de dependencias (corre en cada render)
useEffect(() => {
  fetchData();
});

// ❌ INCORRECTO: Dependencias faltantes (causa bugs)
useEffect(() => {
  fetchAnimal(animalId); // animalId debería estar en dependencias
}, []);
```

### 4.3 Custom Hooks
```javascript
// ✅ CORRECTO: Nombre empieza con "use"
const useAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // ...
  return { animals, isLoading, fetchAnimals };
};

// ❌ INCORRECTO: No empieza con "use"
const getAnimals = () => { ... };
const animalsHook = () => { ... };
```

---

## 5. ESTADO Y PROPS

### 5.1 Estado Mínimo
```jsx
// ✅ CORRECTO: Derivar valores cuando sea posible
const [items, setItems] = useState([]);
const itemCount = items.length;  // Derivado, no estado
const hasItems = items.length > 0;  // Derivado

// ❌ INCORRECTO: Estado redundante
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);  // Redundante
const [hasItems, setHasItems] = useState(false);  // Redundante
```

### 5.2 Actualización de Estado
```jsx
// ✅ CORRECTO: Functional update cuando depende del estado previo
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);

// ❌ INCORRECTO: Puede causar race conditions
setCount(count + 1);
```

### 5.3 Props Destructuring
```jsx
// ✅ CORRECTO: Destructuring en parámetros
const AnimalCard = ({ animal, onAdopt, isLoading = false }) => {
  return <div>{animal.nombre}</div>;
};

// ✅ TAMBIÉN CORRECTO: Destructuring en body (cuando hay muchas props)
const AnimalCard = (props) => {
  const { animal, onAdopt, isLoading = false } = props;
  return <div>{animal.nombre}</div>;
};

// ❌ INCORRECTO: Acceder con props.
const AnimalCard = (props) => {
  return <div>{props.animal.nombre}</div>;
};
```

---

## 6. ESTILOS CON TAILWIND

### 6.1 Orden de Clases (Recomendado)
```jsx
// ✅ CORRECTO: Orden lógico
// 1. Layout (flex, grid)
// 2. Sizing (w, h)
// 3. Spacing (p, m)
// 4. Typography (text, font)
// 5. Colors (bg, text, border)
// 6. Effects (shadow, opacity)
// 7. States (hover, focus)

<div className="flex items-center w-full p-4 text-lg text-gray-800 bg-white shadow-md hover:shadow-lg">
```

### 6.2 Clases Condicionales
```jsx
// ✅ CORRECTO: Template literals
<button 
  className={`px-4 py-2 rounded ${
    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
  }`}
>

// ✅ CORRECTO: clsx o cn para múltiples condiciones
import { clsx } from 'clsx';

<button 
  className={clsx(
    'px-4 py-2 rounded',
    isActive && 'bg-blue-500 text-white',
    isDisabled && 'opacity-50 cursor-not-allowed',
    !isActive && !isDisabled && 'bg-gray-200 text-gray-700'
  )}
>
```

### 6.3 Componentes Reutilizables
```jsx
// ✅ CORRECTO: Variantes definidas
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button 
      className={`rounded font-medium ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## 7. FORMULARIOS

### 7.1 React Hook Form + Zod
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const LoginForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    // ...
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
};
```

### 7.2 Inputs Controlados vs No Controlados
```jsx
// ✅ CORRECTO: React Hook Form (no controlado, mejor performance)
<input {...register('nombre')} />

// ✅ CORRECTO: Controlado cuando necesitás el valor en tiempo real
const [search, setSearch] = useState('');
<input value={search} onChange={(e) => setSearch(e.target.value)} />

// ❌ INCORRECTO: Mezclar ambos
<input value={value} {...register('nombre')} />
```

---

## 8. MANEJO DE ERRORES

### 8.1 Try-Catch en Async
```jsx
// ✅ CORRECTO: Try-catch con estados
const fetchAnimals = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const data = await animalService.getAll();
    setAnimals(data);
  } catch (err) {
    setError(err.message || 'Error al cargar animales');
    toast.error('Error al cargar animales');
  } finally {
    setIsLoading(false);
  }
};

// ❌ INCORRECTO: Sin manejo de error
const fetchAnimals = async () => {
  const data = await animalService.getAll();
  setAnimals(data);
};
```

### 8.2 Error Boundaries
```jsx
// ✅ CORRECTO: Envolver secciones críticas
<ErrorBoundary fallback={<ErrorPage />}>
  <AnimalGallery />
</ErrorBoundary>
```

---

## 9. PERFORMANCE

### 9.1 Memoización
```jsx
// ✅ CORRECTO: useMemo para cálculos costosos
const sortedAnimals = useMemo(() => {
  return [...animals].sort((a, b) => a.nombre.localeCompare(b.nombre));
}, [animals]);

// ✅ CORRECTO: useCallback para funciones pasadas como props
const handleAdopt = useCallback((animalId) => {
  // ...
}, []);

// ❌ INCORRECTO: Memoizar todo (overhead innecesario)
const simpleValue = useMemo(() => 1 + 1, []);  // Overkill
```

### 9.2 Lazy Loading
```jsx
// ✅ CORRECTO: Lazy loading de páginas
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

<Suspense fallback={<Spinner />}>
  <AdminDashboard />
</Suspense>
```

### 9.3 Imágenes
```jsx
// ✅ CORRECTO: Lazy loading nativo
<img 
  src={animal.foto_principal} 
  alt={animal.nombre}
  loading="lazy"
/>
```

---

## 10. ACCESIBILIDAD (a11y)

### 10.1 Semántica HTML
```jsx
// ✅ CORRECTO: Elementos semánticos
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<footer>...</footer>

// ❌ INCORRECTO: Todo con divs
<div className="header">...</div>
<div className="nav">...</div>
```

### 10.2 Labels e Inputs
```jsx
// ✅ CORRECTO: Label asociado
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ CORRECTO: Label envolvente
<label>
  Email
  <input type="email" />
</label>

// ❌ INCORRECTO: Sin label
<input type="email" placeholder="Email" />
```

### 10.3 Alt Text
```jsx
// ✅ CORRECTO: Alt descriptivo
<img src={animal.foto} alt={`Foto de ${animal.nombre}, ${animal.especie}`} />

// ✅ CORRECTO: Alt vacío para decorativas
<img src="/decoracion.png" alt="" />

// ❌ INCORRECTO: Alt genérico o faltante
<img src={animal.foto} alt="imagen" />
<img src={animal.foto} />
```

### 10.4 Botones vs Links
```jsx
// ✅ CORRECTO: Button para acciones
<button onClick={handleSubmit}>Guardar</button>

// ✅ CORRECTO: Link para navegación
<Link to="/animals">Ver animales</Link>

// ❌ INCORRECTO: Div clickeable
<div onClick={handleSubmit}>Guardar</div>
```

---

## 11. SEGURIDAD FRONTEND

### 11.1 XSS Prevention
```jsx
// ✅ CORRECTO: React escapa automáticamente
<p>{userInput}</p>

// ⚠️ PELIGROSO: Evitar dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // Evitar si es posible
```

### 11.2 URLs y Links
```jsx
// ✅ CORRECTO: Validar URLs externas
<a href={url} target="_blank" rel="noopener noreferrer">

// ❌ INCORRECTO: Sin rel en target blank
<a href={url} target="_blank">
```

### 11.3 Tokens
```javascript
// ✅ CORRECTO: Guardar en localStorage (para SPAs simples)
localStorage.setItem('token', token);

// ✅ MEJOR: HttpOnly cookies (requiere configuración en backend)
// El token nunca es accesible desde JS

// ❌ INCORRECTO: Token en la URL
navigate(`/dashboard?token=${token}`);
```

---

## 12. TESTING (Opcional pero recomendado)

### 12.1 Nombres de Tests
```javascript
// ✅ CORRECTO: Descriptivo
describe('AnimalCard', () => {
  it('should render animal name', () => {});
  it('should call onAdopt when button is clicked', () => {});
  it('should show loading state while fetching', () => {});
});

// ❌ INCORRECTO: Vago
describe('AnimalCard', () => {
  it('works', () => {});
  it('test 1', () => {});
});
```

---

## RESUMEN: Reglas de Oro

1. **Componentes:** Funcionales con hooks, PascalCase
2. **Estado:** Mínimo necesario, derivar cuando sea posible
3. **Efectos:** Siempre con dependencias correctas
4. **Props:** Destructuring, nombres descriptivos
5. **Estilos:** Tailwind con orden lógico
6. **Formularios:** React Hook Form + Zod
7. **Errores:** Siempre try-catch en async
8. **Accesibilidad:** HTML semántico, labels, alt text
9. **Performance:** Lazy loading, memoización donde importa
10. **Seguridad:** No confiar en inputs del usuario
