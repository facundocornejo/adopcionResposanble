# MOBILE_FIRST.md - Guía de Diseño Mobile-First

## Principio Fundamental

> **Diseñamos para el celular primero. Desktop es la adaptación, no al revés.**

El 100% de los rescatistas gestionan desde el celular.
La mayoría de adoptantes navegan desde el celular.
Mobile-first no es opcional, es el estándar.

---

## 1. CÓMO FUNCIONA EN TAILWIND

### 1.1 Las clases SIN prefijo son para MÓVIL

```jsx
// Tailwind es mobile-first por defecto
// Clases sin prefijo = móvil
// Clases con prefijo = pantallas más grandes

<div className="
  p-4          ← Móvil: padding 16px
  md:p-6       ← Tablet (768px+): padding 24px
  lg:p-8       ← Desktop (1024px+): padding 32px
">
```

### 1.2 Breakpoints de Tailwind

```
(default)    0px - 639px      Móvil
sm:          640px+           Móvil grande / Tablet pequeña
md:          768px+           Tablet
lg:          1024px+          Laptop
xl:          1280px+          Desktop
2xl:         1536px+          Pantalla grande
```

### 1.3 Patrón Mental

Siempre preguntate: **"¿Cómo se ve en el celu?"**

```jsx
// PRIMERO: ¿Cómo se ve en móvil?
<div className="flex flex-col">

// DESPUÉS: ¿Cómo cambia en desktop?
<div className="flex flex-col lg:flex-row">
```

---

## 2. LAYOUT MOBILE-FIRST

### 2.1 Contenedor Principal

```jsx
// Móvil: padding lateral mínimo
// Desktop: centrado con max-width
<div className="
  px-4              ← Móvil: 16px de padding
  md:px-6           ← Tablet: 24px
  lg:max-w-6xl      ← Desktop: ancho máximo
  lg:mx-auto        ← Desktop: centrado
">
```

### 2.2 Grid del Catálogo

```jsx
// Móvil: 1 columna (scroll vertical natural)
// Tablet: 2 columnas
// Desktop: 3 columnas
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  sm:gap-6
">
  {animals.map(animal => (
    <AnimalCard key={animal.id} animal={animal} />
  ))}
</div>
```

### 2.3 Detalle de Animal

```jsx
// Móvil: Todo en una columna
// Desktop: Foto + sidebar
<div className="
  flex flex-col          ← Móvil: columna
  lg:flex-row            ← Desktop: fila
  lg:gap-8
">
  {/* Foto - Siempre primero */}
  <div className="
    w-full               ← Móvil: ancho completo
    lg:w-2/3             ← Desktop: 2/3 del ancho
  ">
    <img />
  </div>
  
  {/* Info - Abajo en móvil, al lado en desktop */}
  <div className="
    w-full 
    lg:w-1/3
    mt-4 
    lg:mt-0
  ">
    {/* Contenido */}
  </div>
</div>
```

---

## 3. NAVEGACIÓN MOBILE

### 3.1 Header con Menú Hamburguesa

```jsx
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-brown-100 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-semibold text-brown-900">
            Adopta<span className="text-terracotta-500">.</span>
          </a>
          
          {/* Nav Desktop - Oculto en móvil */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/animales" className="text-brown-600">Animales</a>
            <a href="/nosotros" className="text-brown-600">Nosotros</a>
            <a href="/admin" className="px-4 py-2 bg-brown-900 text-white rounded-lg">
              Ingresar
            </a>
          </nav>
          
          {/* Botón Hamburguesa - Solo móvil */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-brown-900">
              {isMenuOpen ? <X /> : <Menu />}
            </svg>
          </button>
        </div>
        
        {/* Menú Móvil Expandible */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-brown-100 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="/animales" className="text-brown-700 py-2">
                Animales
              </a>
              <a href="/nosotros" className="text-brown-700 py-2">
                Nosotros
              </a>
              <a 
                href="/admin" 
                className="
                  py-3 
                  bg-brown-900 
                  text-white 
                  text-center 
                  rounded-xl
                "
              >
                Ingresar
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
```

### 3.2 Navegación Inferior (Opcional pero recomendado)

Para el panel admin, una bottom nav es más accesible en móvil:

```jsx
// Solo visible en móvil
<nav className="
  fixed bottom-0 left-0 right-0
  bg-white border-t border-brown-200
  md:hidden
  z-50
">
  <div className="flex justify-around py-2">
    <NavItem icon={<Home />} label="Inicio" href="/admin" />
    <NavItem icon={<PawPrint />} label="Animales" href="/admin/animals" />
    <NavItem icon={<Inbox />} label="Solicitudes" href="/admin/requests" />
    <NavItem icon={<User />} label="Perfil" href="/admin/profile" />
  </div>
</nav>

const NavItem = ({ icon, label, href }) => (
  <a 
    href={href}
    className="
      flex flex-col items-center 
      text-brown-500 
      hover:text-terracotta-500
      py-2 px-3
    "
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="text-xs mt-1">{label}</span>
  </a>
);
```

---

## 4. COMPONENTES MOBILE-FIRST

### 4.1 Card de Animal (Móvil Primero)

```jsx
<article className="
  bg-white 
  rounded-xl 
  overflow-hidden 
  shadow-sm
  active:shadow-md      ← Feedback táctil
  transition-shadow
">
  {/* Foto - Aspect ratio que funciona en vertical */}
  <div className="aspect-[4/3] overflow-hidden">
    <img 
      src={animal.foto_principal}
      alt={animal.nombre}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>
  
  {/* Info - Padding generoso para touch */}
  <div className="p-4">
    <h3 className="text-lg font-semibold text-brown-900">
      {animal.nombre}
    </h3>
    <p className="text-brown-500 text-sm mt-1">
      {animal.especie} · {animal.edad_aproximada}
    </p>
    
    {/* Badge con tamaño táctil */}
    <div className="mt-3">
      <span className="
        inline-flex items-center 
        px-3 py-1.5        ← Más padding vertical
        rounded-full 
        text-sm font-medium
        bg-sage-100 text-sage-600
      ">
        Disponible
      </span>
    </div>
  </div>
</article>
```

### 4.2 Botones Touch-Friendly

```jsx
// Mínimo 44px de alto para touch targets (Apple HIG)
<button className="
  w-full               ← Ancho completo en móvil
  md:w-auto            ← Auto en desktop
  px-6 
  py-3                 ← Mínimo 12px padding vertical = ~44px alto
  min-h-[44px]         ← Garantiza altura mínima
  bg-terracotta-500 
  text-white 
  rounded-xl
  font-medium
  text-base            ← 16px mínimo (evita zoom en iOS)
  active:bg-terracotta-600  ← Feedback táctil
">
  Quiero adoptarlo
</button>
```

### 4.3 Inputs Optimizados para Móvil

```jsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-brown-700">
    Tu email
  </label>
  <input 
    type="email"
    inputMode="email"           ← Teclado optimizado
    autoComplete="email"        ← Autocompletado
    className="
      w-full 
      px-4 
      py-3                      ← Altura cómoda para touch
      text-base                 ← 16px evita zoom en iOS
      bg-white
      border border-brown-200 
      rounded-xl
      text-brown-900
      placeholder:text-brown-400
      focus:outline-none 
      focus:border-terracotta-500
      focus:ring-1
      focus:ring-terracotta-500
    "
    placeholder="tu@email.com"
  />
</div>
```

### 4.4 Input Modes para Teclados Correctos

```jsx
// Email
<input type="email" inputMode="email" />

// Teléfono
<input type="tel" inputMode="tel" />

// Números
<input type="number" inputMode="numeric" />

// Edad (números sin decimales)
<input type="number" inputMode="numeric" pattern="[0-9]*" />

// Texto normal
<input type="text" inputMode="text" />

// URL
<input type="url" inputMode="url" />
```

---

## 5. FORMULARIOS MÓVILES

### 5.1 El formulario de 17 campos en móvil

En móvil, los formularios largos deben:
- Dividirse en pasos/secciones
- Tener campos de ancho completo
- Botones grandes y accesibles
- Mostrar progreso

```jsx
const AdoptionForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  return (
    <div className="px-4 py-6">
      {/* Indicador de progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-brown-500 mb-2">
          <span>Paso {step} de {totalSteps}</span>
          <span>{Math.round((step/totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-brown-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-terracotta-500 transition-all duration-300"
            style={{ width: `${(step/totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Título del paso */}
      <h2 className="text-xl font-semibold text-brown-900 mb-6">
        {step === 1 && 'Tus datos'}
        {step === 2 && 'Tu vivienda'}
        {step === 3 && 'Tu experiencia'}
        {step === 4 && 'Motivación'}
      </h2>
      
      {/* Campos del paso actual */}
      <div className="space-y-4">
        {step === 1 && (
          <>
            <Input label="Nombre completo" name="nombre" />
            <Input label="Edad" name="edad" type="number" inputMode="numeric" />
            <Input label="Email" name="email" type="email" />
            <Input label="WhatsApp" name="telefono" type="tel" />
          </>
        )}
        {/* ... más pasos */}
      </div>
      
      {/* Navegación de pasos */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="
              flex-1 py-3 
              border border-brown-200 
              text-brown-700 
              rounded-xl
              font-medium
            "
          >
            Anterior
          </button>
        )}
        
        <button 
          onClick={() => step < totalSteps ? setStep(step + 1) : handleSubmit()}
          className="
            flex-1 py-3 
            bg-terracotta-500 
            text-white 
            rounded-xl
            font-medium
          "
        >
          {step < totalSteps ? 'Siguiente' : 'Enviar solicitud'}
        </button>
      </div>
    </div>
  );
};
```

### 5.2 Campos Condicionales

```jsx
// Mostrar/ocultar según respuesta anterior
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-brown-700 mb-2">
      ¿Tenés otros animales?
    </label>
    <div className="flex gap-3">
      <button 
        type="button"
        onClick={() => setTieneOtros(true)}
        className={`
          flex-1 py-3 rounded-xl font-medium border
          ${tieneOtros === true 
            ? 'bg-terracotta-500 text-white border-terracotta-500' 
            : 'bg-white text-brown-700 border-brown-200'
          }
        `}
      >
        Sí
      </button>
      <button 
        type="button"
        onClick={() => setTieneOtros(false)}
        className={`...`}
      >
        No
      </button>
    </div>
  </div>
  
  {/* Solo aparece si tiene otros animales */}
  {tieneOtros && (
    <div className="animate-fadeIn">
      <label className="block text-sm font-medium text-brown-700 mb-2">
        ¿Están castrados?
      </label>
      {/* ... */}
    </div>
  )}
</div>
```

---

## 6. GESTOS Y FEEDBACK TÁCTIL

### 6.1 Estados Táctiles

```jsx
// active: = cuando tocás el elemento
<button className="
  bg-terracotta-500
  active:bg-terracotta-600    ← Feedback inmediato
  active:scale-[0.98]         ← Micro-animación de presión
  transition-all
">

// Para cards clickeables
<div className="
  bg-white
  active:bg-warm-50           ← Feedback visual
  transition-colors
">
```

### 6.2 Scroll Suave

```jsx
// Scroll horizontal para galería de fotos
<div className="
  flex 
  gap-3 
  overflow-x-auto 
  snap-x 
  snap-mandatory
  -mx-4 px-4           ← Extiende al borde pero con padding
  scrollbar-hide       ← Oculta scrollbar (requiere plugin)
">
  {fotos.map((foto, i) => (
    <div 
      key={i}
      className="
        flex-shrink-0 
        w-[85vw]           ← Casi ancho completo
        snap-center        ← Centra al hacer scroll
      "
    >
      <img src={foto} className="w-full rounded-xl" />
    </div>
  ))}
</div>
```

### 6.3 Pull to Refresh (Concepto)

```jsx
// Para listas que se actualizan
// Usar librería como react-pull-to-refresh
<PullToRefresh onRefresh={fetchAnimals}>
  <AnimalList animals={animals} />
</PullToRefresh>
```

---

## 7. TIPOGRAFÍA MÓVIL

### 7.1 Tamaños Legibles

```
Móvil (base):
- Títulos página:    text-2xl (24px)
- Títulos sección:   text-xl (20px)
- Títulos card:      text-lg (18px)
- Cuerpo:            text-base (16px)  ← MÍNIMO
- Secundario:        text-sm (14px)
- Metadata:          text-xs (12px)

Desktop (escalado):
- Títulos página:    text-4xl (36px)
- Títulos sección:   text-2xl (24px)
- etc.
```

### 7.2 Ejemplo de Escalado

```jsx
<h1 className="
  text-2xl          ← Móvil: 24px
  md:text-3xl       ← Tablet: 30px
  lg:text-4xl       ← Desktop: 36px
  font-bold 
  text-brown-900
">
  Hay alguien esperando por vos
</h1>
```

---

## 8. IMÁGENES MÓVILES

### 8.1 Aspect Ratios para Móvil

```jsx
// Card en lista vertical: 4:3 funciona bien
<div className="aspect-[4/3]">

// Hero o detalle: 3:2 o 16:9
<div className="aspect-[3/2] md:aspect-video">

// Galería cuadrada (tipo Instagram)
<div className="aspect-square">
```

### 8.2 Lazy Loading Obligatorio

```jsx
// Todas las imágenes deben tener lazy loading
<img 
  src={animal.foto}
  alt={animal.nombre}
  loading="lazy"           ← Obligatorio
  decoding="async"         ← Mejora performance
  className="w-full h-full object-cover"
/>
```

### 8.3 Placeholder Mientras Carga

```jsx
const [loaded, setLoaded] = useState(false);

<div className="aspect-[4/3] bg-warm-100 rounded-xl overflow-hidden">
  {!loaded && (
    <div className="w-full h-full animate-pulse bg-brown-100" />
  )}
  <img 
    src={foto}
    onLoad={() => setLoaded(true)}
    className={`
      w-full h-full object-cover
      transition-opacity duration-300
      ${loaded ? 'opacity-100' : 'opacity-0'}
    `}
  />
</div>
```

---

## 9. PANEL ADMIN EN MÓVIL

### 9.1 Sidebar → Bottom Nav

```jsx
// Desktop: Sidebar lateral
// Móvil: Bottom navigation

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-cream">
    {/* Sidebar - Solo desktop */}
    <aside className="
      hidden 
      lg:block 
      fixed left-0 top-0 
      w-64 h-full 
      bg-brown-900
    ">
      {/* Nav items */}
    </aside>
    
    {/* Contenido principal */}
    <main className="
      lg:ml-64 
      pb-20              ← Espacio para bottom nav en móvil
      lg:pb-0
    ">
      {children}
    </main>
    
    {/* Bottom Nav - Solo móvil */}
    <nav className="
      lg:hidden 
      fixed bottom-0 left-0 right-0
      bg-white border-t border-brown-200
      safe-area-inset-bottom    ← Respeta notch/home bar
    ">
      <div className="flex justify-around py-2">
        <BottomNavItem icon={<Home />} label="Dashboard" href="/admin" />
        <BottomNavItem icon={<PawPrint />} label="Animales" href="/admin/animals" />
        <BottomNavItem icon={<Inbox />} label="Solicitudes" href="/admin/requests" />
      </div>
    </nav>
  </div>
);
```

### 9.2 Tablas → Cards en Móvil

```jsx
// Desktop: Tabla tradicional
// Móvil: Lista de cards

<div className="hidden md:block">
  <table>
    {/* Tabla normal */}
  </table>
</div>

<div className="md:hidden space-y-3">
  {solicitudes.map(sol => (
    <div key={sol.id} className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-brown-900">{sol.nombre_completo}</p>
          <p className="text-sm text-brown-500">Para: {sol.animal.nombre}</p>
        </div>
        <span className="text-xs bg-sage-100 text-sage-600 px-2 py-1 rounded-full">
          {sol.estado}
        </span>
      </div>
      <p className="text-sm text-brown-500 mt-2">{sol.fecha}</p>
    </div>
  ))}
</div>
```

---

## 10. SAFE AREAS (iPhone notch, etc.)

### 10.1 Configuración en Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
}
```

### 10.2 Uso

```jsx
// Header que respeta el notch
<header className="pt-safe-top bg-white">

// Bottom nav que respeta home bar
<nav className="pb-safe-bottom bg-white">
```

### 10.3 En CSS (index.css)

```css
/* Viewport que incluye safe areas */
html {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

---

## 11. TESTING MÓVIL

### 11.1 Device Mode en Chrome

1. Abrí DevTools (F12)
2. Click en ícono de dispositivo (o Ctrl+Shift+M)
3. Probá en: iPhone SE, iPhone 12, Pixel 5, Samsung Galaxy

### 11.2 Dispositivos a Probar

```
MÍNIMO:
- iPhone SE (375px)      ← El más chico común
- iPhone 12/13 (390px)   ← El más común
- Android medio (360px)  ← Muy común en Argentina

IDEAL:
- Tablet (768px)
- Laptop (1024px)
- Desktop (1280px+)
```

### 11.3 Checklist Mobile

- [ ] ¿Se ve bien en 360px de ancho?
- [ ] ¿Los botones tienen mínimo 44px de alto?
- [ ] ¿El texto es mínimo 16px?
- [ ] ¿Los inputs no causan zoom al tocar?
- [ ] ¿La navegación es accesible con el pulgar?
- [ ] ¿Las imágenes tienen lazy loading?
- [ ] ¿El formulario es completable con una mano?
- [ ] ¿Hay feedback táctil en elementos clickeables?

---

## 12. RESUMEN

### Reglas de Oro Mobile-First

1. **Clases base = móvil** - Siempre empezar sin prefijos
2. **Una columna por defecto** - Luego expandir con `md:`, `lg:`
3. **Touch targets 44px mínimo** - Botones e inputs grandes
4. **Texto 16px mínimo** - Evita zoom en iOS
5. **Bottom nav para admin** - El pulgar agradece
6. **Formularios en pasos** - No scrolls eternos
7. **Lazy loading siempre** - Datos móviles son caros
8. **Feedback táctil** - `active:` states
9. **Safe areas** - Respetar notch y home bar
10. **Probar en 360px** - El mínimo real

### Patrón Mental

```
1. ¿Cómo se ve en el celu con una mano?
2. ¿Puedo tocar este botón con el pulgar?
3. ¿Tengo que scrollear mucho?
4. ¿Se entiende sin hover? (no hay hover en touch)
5. ¿Carga rápido en 4G malo?
```
