# FASE 1: Setup Inicial

**Fecha:** Diciembre 2025
**Objetivo:** Crear la base del proyecto React con todas las herramientas configuradas

---

## Qué Hiciste (Lista de Archivos)

### Archivos de Configuración (raíz del proyecto)
| Archivo | Estado |
|---------|--------|
| `package.json` | Creado |
| `vite.config.js` | Creado |
| `tailwind.config.js` | Creado |
| `postcss.config.js` | Creado |
| `index.html` | Creado |
| `.env` | Creado |
| `.env.example` | Creado |
| `.gitignore` | Creado |

### Archivos de la Aplicación (src/)
| Archivo | Estado |
|---------|--------|
| `src/main.jsx` | Creado |
| `src/App.jsx` | Creado |
| `src/router.jsx` | Creado |
| `src/styles/globals.css` | Creado |

### Layouts
| Archivo | Estado |
|---------|--------|
| `src/components/layout/PublicLayout.jsx` | Creado |
| `src/components/layout/AdminLayout.jsx` | Creado |

### Páginas Públicas (placeholder)
| Archivo | Estado |
|---------|--------|
| `src/pages/public/Home.jsx` | Creado |
| `src/pages/public/AnimalDetail.jsx` | Creado |
| `src/pages/public/AdoptionForm.jsx` | Creado |

### Páginas Admin (placeholder)
| Archivo | Estado |
|---------|--------|
| `src/pages/admin/Login.jsx` | Creado |
| `src/pages/admin/Dashboard.jsx` | Creado |
| `src/pages/admin/Animals.jsx` | Creado |
| `src/pages/admin/AnimalForm.jsx` | Creado |
| `src/pages/admin/Requests.jsx` | Creado |
| `src/pages/admin/RequestDetail.jsx` | Creado |

### Assets
| Archivo | Estado |
|---------|--------|
| `public/favicon.svg` | Creado |

---

## Por Qué Lo Hiciste (Justificación Técnica)

### 1. Vite en lugar de Create React App

**¿Qué es Vite?**
Vite es un "bundler" moderno - una herramienta que empaqueta todo tu código JavaScript, CSS, imágenes, etc. en archivos optimizados para el navegador.

**¿Por qué Vite y no Create React App (CRA)?**
- **Velocidad:** Vite arranca en milisegundos, CRA puede tardar 30+ segundos
- **Hot Module Replacement (HMR):** Cuando guardás un cambio, Vite lo refleja instantáneamente en el navegador sin recargar toda la página
- **Build más pequeño:** El código final es más liviano
- **Moderno:** Es el estándar actual en 2024-2025. CRA está prácticamente abandonado

```
CRA (viejo):  npm start → esperar 30-60 segundos → listo
Vite (nuevo): npm run dev → ~500ms → listo
```

### 2. Tailwind CSS en lugar de CSS tradicional

**¿Qué es Tailwind?**
Es un framework de CSS que te da clases utilitarias predefinidas. En lugar de escribir CSS en archivos separados, ponés clases directamente en el HTML/JSX.

**Ejemplo comparativo:**

```css
/* CSS tradicional - archivo separado */
.boton-primario {
  padding: 12px 24px;
  background-color: #D97756;
  color: white;
  border-radius: 12px;
}
```

```jsx
// Tailwind - directo en el componente
<button className="px-6 py-3 bg-terracotta-500 text-white rounded-xl">
  Click
</button>
```

**¿Por qué Tailwind?**
- **Mobile-first:** Las clases sin prefijo aplican a móvil, `md:` aplica desde 768px
- **No hay CSS muerto:** Solo se incluye el CSS que usás
- **Consistencia:** Todos los colores, espaciados y tamaños están predefinidos
- **Velocidad de desarrollo:** No saltás entre archivos CSS y JSX

### 3. React Router v6 para navegación

**¿Qué es React Router?**
React es una SPA (Single Page Application) - solo hay UN archivo HTML. React Router simula la navegación entre "páginas" sin recargar el navegador.

**¿Cómo funciona?**
```jsx
// Cuando el usuario va a /animal/123
// React Router muestra el componente AnimalDetail
// Sin recargar la página entera

<Route path="/animal/:id" element={<AnimalDetail />} />
```

### 4. Estructura de carpetas por feature

**¿Por qué esta estructura?**
```
src/
├── components/     → Piezas reutilizables de UI
├── pages/          → Pantallas completas
├── services/       → Llamadas a la API
├── hooks/          → Lógica reutilizable
├── context/        → Estado global
└── utils/          → Funciones helper
```

Esta estructura escala bien. Cuando el proyecto crece, sabés exactamente dónde buscar cada cosa:
- ¿Necesitás cambiar cómo se ve un botón? → `components/ui/Button.jsx`
- ¿Necesitás cambiar la página de login? → `pages/admin/Login.jsx`
- ¿Necesitás cambiar cómo se llama a la API? → `services/`

### 5. Lazy Loading para páginas admin

```jsx
// Carga directa (siempre se descarga)
import Home from './pages/public/Home'

// Lazy loading (se descarga solo cuando se necesita)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
```

**¿Por qué?**
- La Home se carga siempre porque es la página principal
- El panel admin solo lo usa el administrador, no tiene sentido que un visitante común descargue ese código
- Reduce el tiempo de carga inicial

### 6. Variables de entorno con VITE_

```
# .env
VITE_API_URL=https://adopcion-api.onrender.com
```

**¿Por qué el prefijo VITE_?**
Por seguridad. Vite solo expone al navegador las variables que empiezan con `VITE_`. Así no podés exponer accidentalmente secretos del servidor.

```jsx
// Acceso en el código
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Dónde Lo Hiciste (Estructura de Carpetas)

```
front/
├── docs/                          ← Esta documentación (no se sube a git)
│
├── public/                        ← Archivos estáticos públicos
│   └── favicon.svg               ← Ícono de la pestaña del navegador
│
├── src/                           ← Código fuente de la aplicación
│   │
│   ├── components/               ← Componentes reutilizables
│   │   ├── ui/                   ← Botones, inputs, cards (vacío por ahora)
│   │   ├── layout/               ← Estructura de páginas
│   │   │   ├── PublicLayout.jsx  ← Header + Footer para visitantes
│   │   │   └── AdminLayout.jsx   ← Sidebar + Header para admins
│   │   └── animals/              ← Componentes de animales (vacío por ahora)
│   │
│   ├── pages/                    ← Pantallas/Vistas
│   │   ├── public/               ← Páginas para visitantes
│   │   │   ├── Home.jsx          ← Catálogo de animales
│   │   │   ├── AnimalDetail.jsx  ← Detalle de un animal
│   │   │   └── AdoptionForm.jsx  ← Formulario de adopción
│   │   │
│   │   └── admin/                ← Panel de administración
│   │       ├── Login.jsx         ← Pantalla de login
│   │       ├── Dashboard.jsx     ← Estadísticas
│   │       ├── Animals.jsx       ← Lista de animales
│   │       ├── AnimalForm.jsx    ← Crear/editar animal
│   │       ├── Requests.jsx      ← Lista de solicitudes
│   │       └── RequestDetail.jsx ← Detalle de solicitud
│   │
│   ├── context/                  ← Estados globales (vacío por ahora)
│   ├── hooks/                    ← Custom hooks (vacío por ahora)
│   ├── services/                 ← Llamadas a la API (vacío por ahora)
│   ├── utils/                    ← Funciones auxiliares (vacío por ahora)
│   │
│   ├── styles/
│   │   └── globals.css           ← Estilos globales + Tailwind
│   │
│   ├── main.jsx                  ← Punto de entrada de la app
│   ├── App.jsx                   ← Componente raíz
│   └── router.jsx                ← Configuración de rutas
│
├── .env                          ← Variables de entorno (no se sube a git)
├── .env.example                  ← Plantilla de variables
├── .gitignore                    ← Archivos ignorados por git
├── index.html                    ← HTML base donde se monta React
├── package.json                  ← Dependencias y scripts
├── postcss.config.js             ← Config de PostCSS (para Tailwind)
├── tailwind.config.js            ← Config de Tailwind (colores custom)
└── vite.config.js                ← Config de Vite
```

---

## Explicación de Cada Archivo

### `package.json`
**¿Qué es?** El "DNI" del proyecto. Lista todas las dependencias y scripts.

```json
{
  "scripts": {
    "dev": "vite",           // npm run dev → arranca servidor de desarrollo
    "build": "vite build",   // npm run build → genera versión de producción
    "preview": "vite preview" // npm run preview → prueba el build localmente
  },
  "dependencies": {
    // Librerías que van al código final (producción)
    "react": "...",
    "react-router-dom": "...",
    "axios": "...",          // Para hacer llamadas HTTP a la API
    "react-hook-form": "...", // Para manejar formularios
    "zod": "...",            // Para validar datos
    "lucide-react": "...",   // Íconos bonitos
    "react-hot-toast": "...", // Notificaciones
    "clsx": "..."            // Para clases CSS condicionales
  },
  "devDependencies": {
    // Herramientas solo para desarrollo
    "vite": "...",
    "tailwindcss": "...",
    "@vitejs/plugin-react": "..."
  }
}
```

### `vite.config.js`
**¿Qué es?** Configuración de Vite (el bundler).

```javascript
export default defineConfig({
  plugins: [react()],  // Habilita soporte para React
  server: {
    port: 5173,        // Puerto del servidor de desarrollo
    open: true         // Abre el navegador automáticamente
  }
})
```

### `tailwind.config.js`
**¿Qué es?** Configuración de Tailwind con los colores personalizados de la guía UX.

```javascript
colors: {
  cream: '#FAF7F2',        // Fondo principal cálido
  terracotta: {            // Botones y CTAs
    500: '#D97756',
    600: '#C4613D',
  },
  sage: {                  // Verde para "Disponible"
    100: '#E8F0E6',
    500: '#7D9B76',
  },
  brown: {                 // Textos
    500: '#8B7E74',
    700: '#5C4B3A',
    900: '#3D2E22',
  }
}
```

### `postcss.config.js`
**¿Qué es?** PostCSS procesa el CSS. Tailwind usa PostCSS para generar las clases.

### `index.html`
**¿Qué es?** El único HTML de la aplicación. React se "monta" en el `<div id="root">`.

```html
<body class="bg-cream text-brown-700 antialiased">
  <div id="root"></div>  <!-- Acá se renderiza toda la app React -->
  <script type="module" src="/src/main.jsx"></script>
</body>
```

### `src/main.jsx`
**¿Qué es?** El punto de entrada. Conecta React con el HTML.

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>      {/* Habilita navegación */}
      <App />            {/* Tu aplicación */}
      <Toaster />        {/* Sistema de notificaciones */}
    </BrowserRouter>
  </StrictMode>
)
```

### `src/router.jsx`
**¿Qué es?** Define qué componente se muestra en cada URL.

```jsx
<Routes>
  {/* Rutas públicas - usan PublicLayout (header + footer) */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/animal/:id" element={<AnimalDetail />} />
  </Route>

  {/* Rutas admin - usan AdminLayout (sidebar) */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="animals" element={<Animals />} />
  </Route>
</Routes>
```

### `src/styles/globals.css`
**¿Qué es?** Los estilos globales. Las primeras 3 líneas son OBLIGATORIAS para Tailwind:

```css
@tailwind base;       /* Reset de estilos del navegador */
@tailwind components; /* Tus componentes CSS personalizados */
@tailwind utilities;  /* Todas las clases de Tailwind (flex, p-4, etc.) */
```

### `src/components/layout/PublicLayout.jsx`
**¿Qué es?** El "marco" de las páginas públicas. Tiene header arriba, footer abajo, y el contenido en el medio.

```jsx
<div>
  <header>...</header>
  <main>
    <Outlet />  {/* Acá se renderiza Home, AnimalDetail, etc. */}
  </main>
  <footer>...</footer>
</div>
```

### `src/components/layout/AdminLayout.jsx`
**¿Qué es?** El "marco" del panel admin. Sidebar en desktop, bottom nav en móvil.

---

## Cómo Probarlo

1. **Abrir terminal en la carpeta del proyecto**
2. **Instalar dependencias** (si es la primera vez):
   ```bash
   npm install
   ```
3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. **Abrir en el navegador**: http://localhost:5173

### URLs disponibles:
- `/` → Home (catálogo)
- `/animal/1` → Detalle de animal (placeholder)
- `/animal/1/adoptar` → Formulario de adopción (placeholder)
- `/admin/login` → Login de admin
- `/admin` → Dashboard
- `/admin/animals` → Lista de animales
- `/admin/animals/new` → Crear animal
- `/admin/requests` → Lista de solicitudes
- `/admin/requests/1` → Detalle de solicitud

---

## Conceptos Clave de React para Entender

### 1. Componentes
Un componente es una función que retorna JSX (HTML con superpoderes).

```jsx
// Un componente simple
const Saludo = () => {
  return <h1>Hola mundo</h1>
}

// Usando el componente
<Saludo />
```

### 2. Props
Las props son como parámetros que le pasás a un componente.

```jsx
// Componente que recibe props
const Saludo = ({ nombre }) => {
  return <h1>Hola {nombre}</h1>
}

// Usando el componente con props
<Saludo nombre="Facundo" />
```

### 3. JSX
JSX es HTML dentro de JavaScript. Las diferencias principales:
- `class` → `className`
- `for` → `htmlFor`
- Los atributos son camelCase: `onclick` → `onClick`
- Podés poner JavaScript dentro de `{}`

```jsx
const nombre = "Luna"
const edad = 3

return (
  <div className="card">
    <h1>{nombre}</h1>
    <p>Tiene {edad} años</p>
    {edad > 2 && <span>Ya es adulto</span>}
  </div>
)
```

### 4. Mobile-First con Tailwind
Las clases SIN prefijo aplican a móvil. Los prefijos aplican desde ese breakpoint en adelante.

```jsx
<div className="
  p-4          // Móvil: padding 16px
  md:p-6       // Tablet (768px+): padding 24px
  lg:p-8       // Desktop (1024px+): padding 32px

  flex flex-col    // Móvil: columna
  md:flex-row      // Tablet+: fila
">
```

---

## Próxima Fase

**Fase 2: Configuración de API y Servicios**
- Configurar Axios con interceptors
- Crear servicios para animales, solicitudes y auth
- Manejar tokens de autenticación
- Manejar errores de la API

---

## Comandos Útiles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Generar build de producción
npm run preview  # Previsualizar el build localmente
```
