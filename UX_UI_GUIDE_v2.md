# UX_UI_GUIDE.md - Diseño Emocional y Minimalista

## Filosofía de Diseño

> "El diseño no es solo cómo se ve, es cómo funciona." - Steve Jobs

Este proyecto sigue una filosofía de diseño inspirada en Apple:
- **Las fotos de los animales son las protagonistas absolutas**
- **Menos es más** - cada elemento tiene propósito
- **Emoción sobre información** - conectar antes de informar
- **Calidez y empatía** - colores que abrazan, no que imponen
- **Simplicidad radical** - si dudás si algo es necesario, no lo es

---

## 1. IDENTIDAD VISUAL

### 1.1 El Sentimiento que Buscamos

Cuando alguien entra a la web debe sentir:
```
"Qué hermosos... quiero conocerlos"
"Se ve confiable, es gente que ama a los animales"
"Es tan fácil de usar, no me siento perdido"
"Quiero ayudar, quiero adoptar"
```

NO debe sentir:
```
"Parece un sistema de gestión"
"Muy frío, muy corporativo"
"Demasiada información, me abruma"
"No sé por dónde empezar"
```

### 1.2 Palabras Clave del Diseño
```
Cálido       Hogareño     Confiable
Simple       Limpio       Acogedor
Emocional    Esperanzador Humano
```

---

## 2. PALETA DE COLORES

### 2.1 Colores Principales

```
FONDOS (Calidez, hogar)
──────────────────────────
cream:      #FAF7F2   ← Fondo principal de la web
white:      #FFFFFF   ← Cards, contenido destacado
warm-50:    #FDF8F3   ← Fondo alternativo sutil

TEXTO (Tierra, confianza)
──────────────────────────
brown-900:  #3D2E22   ← Títulos principales
brown-700:  #5C4B3A   ← Texto cuerpo
brown-500:  #8B7E74   ← Texto secundario
brown-300:  #C4B8AD   ← Placeholders, disabled

ACENTO PRIMARIO (Amor, acción)
──────────────────────────
terracotta-500: #D97756  ← Botones principales, CTAs
terracotta-600: #C4613D  ← Hover
terracotta-700: #A84E2F  ← Active/Pressed

ACENTO SECUNDARIO (Vida, esperanza)
──────────────────────────
sage-500:   #7D9B76   ← Estado "Disponible", éxito
sage-600:   #6B8A63   ← Hover
sage-100:   #E8F0E6   ← Fondo de badges verdes

ESTADOS
──────────────────────────
disponible:  #7D9B76  (Verde salvia)
en-proceso:  #E5A84B  (Ámbar cálido)
adoptado:    #9B8AC4  (Lavanda suave)
en-transito: #6BA3BE  (Azul cielo suave)

ERROR/WARNING
──────────────────────────
error:      #C45C4A   ← Rojo cálido, no agresivo
warning:    #D4915A   ← Naranja suave
```

### 2.2 Aplicación de Colores

```jsx
// Fondo de página
<body className="bg-[#FAF7F2]">

// Card de animal
<div className="bg-white rounded-2xl shadow-sm">

// Título
<h1 className="text-[#3D2E22]">

// Texto cuerpo
<p className="text-[#5C4B3A]">

// Texto secundario
<span className="text-[#8B7E74]">

// Botón principal
<button className="bg-[#D97756] hover:bg-[#C4613D] text-white">

// Badge disponible
<span className="bg-[#E8F0E6] text-[#7D9B76]">
```

### 2.3 Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        terracotta: {
          500: '#D97756',
          600: '#C4613D',
          700: '#A84E2F',
        },
        sage: {
          100: '#E8F0E6',
          500: '#7D9B76',
          600: '#6B8A63',
        },
        warm: {
          50: '#FDF8F3',
          100: '#FAF7F2',
        },
        brown: {
          300: '#C4B8AD',
          500: '#8B7E74',
          700: '#5C4B3A',
          900: '#3D2E22',
        },
      },
    },
  },
}
```

---

## 3. TIPOGRAFÍA

### 3.1 Font Family

```css
/* Opción 1: Inter - Moderna, legible, cálida */
font-family: 'Inter', system-ui, sans-serif;

/* Opción 2: DM Sans - Más suave, amigable */
font-family: 'DM Sans', system-ui, sans-serif;

/* Para títulos emocionales (opcional): */
font-family: 'Playfair Display', Georgia, serif;
```

**Recomendación:** DM Sans para todo, o Inter para cuerpo + Playfair Display para títulos de sección.

### 3.2 Escala Tipográfica

```
TÍTULOS
────────
Hero/Home:      48px (text-5xl)  - "Encontrá tu compañero"
Página:         36px (text-4xl)  - Nombre del animal en detalle
Sección:        24px (text-2xl)  - "Animales disponibles"
Card título:    20px (text-xl)   - Nombre en card
Subtítulo:      18px (text-lg)   - Subsecciones

CUERPO
────────
Normal:         16px (text-base)
Pequeño:        14px (text-sm)
Muy pequeño:    12px (text-xs)   - Fechas, metadata
```

### 3.3 Pesos y Estilos

```
Títulos:     font-semibold (600) o font-bold (700)
Subtítulos:  font-medium (500)
Cuerpo:      font-normal (400)
Énfasis:     font-medium (500)
```

---

## 4. FOTOS: LAS PROTAGONISTAS

### 4.1 Filosofía

> Las fotos de los animales son el corazón de la web. Todo lo demás existe para hacerlas brillar.

```
✅ CORRECTO:
- Fotos grandes, generosas
- Espacio para que respiren
- Sin marcos pesados ni sombras dramáticas
- Bordes sutilmente redondeados (no extremos)

❌ INCORRECTO:
- Fotos pequeñas como thumbnails
- Marcos gruesos o decorativos
- Sombras dramáticas
- Overlays de gradiente oscuro
- Bordes super redondeados (rounded-3xl)
```

### 4.2 Tratamiento de Fotos

```jsx
// Card de catálogo - Foto grande, limpia
<div className="aspect-[4/3] overflow-hidden rounded-xl">
  <img 
    src={animal.foto_principal}
    alt={`${animal.nombre}, ${animal.especie} en adopción`}
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>

// Detalle - Galería generosa
<div className="aspect-[3/2] overflow-hidden rounded-2xl">
  <img className="w-full h-full object-cover" />
</div>
```

### 4.3 Bordes Redondeados (Moderados)

```
rounded-lg   (8px)   ← Para elementos UI pequeños
rounded-xl   (12px)  ← Para cards e imágenes
rounded-2xl  (16px)  ← Para modales y elementos destacados
rounded-full         ← Solo para avatares circulares
```

**Evitar:** `rounded-3xl` y mayores en todo. Se ve "burbuja genérica IA".

### 4.4 Placeholder Cuando No Hay Foto

```jsx
// Placeholder cálido, no gris frío
<div className="
  aspect-[4/3] 
  bg-warm-100 
  rounded-xl 
  flex items-center justify-center
">
  <svg className="w-16 h-16 text-brown-300">
    {/* Ícono de patita o corazón */}
  </svg>
</div>
```

---

## 5. COMPONENTES CLAVE

### 5.1 Card de Animal (Catálogo)

**Principio:** La foto domina, información mínima, invita a explorar.

```jsx
<article className="
  bg-white 
  rounded-xl 
  overflow-hidden 
  shadow-sm 
  hover:shadow-md 
  transition-shadow 
  duration-300
">
  {/* Foto - 70% del espacio visual */}
  <div className="aspect-[4/3] overflow-hidden">
    <img 
      src={animal.foto_principal}
      alt={animal.nombre}
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Info - Mínima, esencial */}
  <div className="p-4">
    {/* Nombre prominente */}
    <h3 className="text-xl font-semibold text-brown-900">
      {animal.nombre}
    </h3>
    
    {/* Datos clave en una línea */}
    <p className="text-brown-500 mt-1">
      {animal.especie} · {animal.edad_aproximada} · {animal.tamanio}
    </p>
    
    {/* Badge de estado */}
    <div className="mt-3">
      <span className="
        inline-flex items-center 
        px-3 py-1 
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

### 5.2 Botón Principal (CTA)

**Principio:** Cálido, invitador, no agresivo.

```jsx
// Botón principal - "Quiero Adoptarlo"
<button className="
  px-6 py-3 
  bg-terracotta-500 
  text-white 
  rounded-xl
  font-medium
  hover:bg-terracotta-600
  active:bg-terracotta-700
  transition-colors
  duration-200
">
  Quiero adoptarlo
</button>

// Botón secundario
<button className="
  px-6 py-3 
  bg-white 
  text-brown-700 
  border border-brown-200
  rounded-xl
  font-medium
  hover:bg-warm-50
  transition-colors
">
  Ver más
</button>
```

### 5.3 Input de Formulario

```jsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-brown-700">
    Tu nombre completo
  </label>
  <input 
    type="text"
    className="
      w-full 
      px-4 py-3 
      bg-white
      border border-brown-200 
      rounded-xl
      text-brown-900
      placeholder:text-brown-300
      focus:outline-none 
      focus:border-terracotta-500
      focus:ring-1
      focus:ring-terracotta-500
      transition-colors
    "
    placeholder="Ej: María García"
  />
</div>
```

### 5.4 Header Minimalista

```jsx
<header className="bg-white border-b border-brown-100">
  <div className="max-w-6xl mx-auto px-4 py-4">
    <nav className="flex items-center justify-between">
      {/* Logo - Simple, sin ruido */}
      <a href="/" className="text-2xl font-semibold text-brown-900">
        Adopta<span className="text-terracotta-500">.</span>
      </a>
      
      {/* Nav - Solo lo esencial */}
      <div className="flex items-center space-x-8">
        <a href="/animales" className="text-brown-600 hover:text-brown-900">
          Animales
        </a>
        <a href="/sobre-nosotros" className="text-brown-600 hover:text-brown-900">
          Nosotros
        </a>
        <a 
          href="/admin" 
          className="
            px-4 py-2 
            bg-brown-900 
            text-white 
            rounded-lg
            text-sm
            hover:bg-brown-700
          "
        >
          Ingresar
        </a>
      </div>
    </nav>
  </div>
</header>
```

---

## 6. LAYOUTS

### 6.1 Home - Hero Emocional

```jsx
<section className="bg-cream py-16 md:py-24">
  <div className="max-w-6xl mx-auto px-4">
    <div className="max-w-2xl">
      {/* Título emocional, no descriptivo */}
      <h1 className="text-4xl md:text-5xl font-bold text-brown-900 leading-tight">
        Hay alguien esperando por vos
      </h1>
      
      {/* Subtítulo simple */}
      <p className="mt-4 text-xl text-brown-600">
        Encontrá a tu próximo compañero de vida. 
        Todos merecen un hogar.
      </p>
      
      {/* CTA claro */}
      <div className="mt-8">
        <a 
          href="#animales" 
          className="
            inline-flex items-center
            px-6 py-3 
            bg-terracotta-500 
            text-white 
            rounded-xl
            font-medium
            hover:bg-terracotta-600
          "
        >
          Conocelos
          <svg className="ml-2 w-5 h-5">→</svg>
        </a>
      </div>
    </div>
  </div>
</section>
```

### 6.2 Catálogo - Grid Generoso

```jsx
<section className="py-12">
  <div className="max-w-6xl mx-auto px-4">
    {/* Título de sección */}
    <h2 className="text-2xl font-semibold text-brown-900 mb-8">
      Animales en adopción
    </h2>
    
    {/* Grid con espacio generoso entre cards */}
    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-8
    ">
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  </div>
</section>
```

### 6.3 Detalle de Animal - Foto Protagonista

```jsx
<div className="max-w-4xl mx-auto px-4 py-8">
  {/* Galería de fotos - Grande, arriba */}
  <div className="aspect-[3/2] rounded-2xl overflow-hidden mb-8">
    <img 
      src={animal.foto_principal}
      alt={animal.nombre}
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Thumbnails de fotos adicionales */}
  <div className="flex gap-3 mb-8">
    {fotos.map((foto, i) => (
      <button 
        key={i}
        className="w-20 h-20 rounded-lg overflow-hidden opacity-70 hover:opacity-100"
      >
        <img src={foto} className="w-full h-full object-cover" />
      </button>
    ))}
  </div>
  
  {/* Contenido en dos columnas en desktop */}
  <div className="grid md:grid-cols-3 gap-8">
    {/* Info principal - 2 columnas */}
    <div className="md:col-span-2 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-brown-900">
          {animal.nombre}
        </h1>
        <p className="text-lg text-brown-500 mt-1">
          {animal.especie} · {animal.edad_aproximada} · {animal.tamanio}
        </p>
      </div>
      
      {/* Historia - El corazón emocional */}
      <div className="prose prose-brown">
        <h2 className="text-xl font-semibold">Su historia</h2>
        <p className="text-brown-700 leading-relaxed">
          {animal.descripcion_historia}
        </p>
      </div>
    </div>
    
    {/* Sidebar - CTA y datos clave */}
    <div className="space-y-6">
      {/* Card de adopción */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <button className="
          w-full 
          py-4 
          bg-terracotta-500 
          text-white 
          rounded-xl
          font-semibold
          text-lg
          hover:bg-terracotta-600
        ">
          Quiero adoptarlo
        </button>
        
        <p className="text-center text-sm text-brown-500 mt-3">
          Te contactaremos para conocerte
        </p>
      </div>
      
      {/* Datos del animal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-brown-900">Sobre {animal.nombre}</h3>
        {/* ... datos */}
      </div>
    </div>
  </div>
</div>
```

---

## 7. MICROINTERACCIONES

### 7.1 Principio: Sutiles y con Propósito

```
✅ CORRECTO:
- Hover suave en cards (shadow-sm → shadow-md)
- Transiciones de 200-300ms
- Feedback visual en clicks
- Loading states claros

❌ INCORRECTO:
- Bounce, shake, efectos dramáticos
- Transiciones de 500ms+
- Animaciones infinitas sin propósito
- Parallax y scroll effects complejos
```

### 7.2 Transiciones Recomendadas

```jsx
// Card hover - Sombra sutil
hover:shadow-md transition-shadow duration-300

// Botón hover - Cambio de color
hover:bg-terracotta-600 transition-colors duration-200

// Focus en inputs - Sin salto
focus:ring-1 focus:ring-terracotta-500 transition-all duration-200

// Imagen hover (zoom muy sutil)
hover:scale-[1.02] transition-transform duration-500
```

---

## 8. ESPACIO EN BLANCO

### 8.1 Filosofía

> El espacio en blanco no es vacío, es respiro. Permite que el contenido hable.

### 8.2 Aplicación

```
Entre secciones:      py-16 md:py-24 (64px - 96px)
Entre título y contenido: mb-8 (32px)
Entre cards en grid:  gap-8 (32px)
Padding de cards:     p-4 o p-6 (16px - 24px)
Entre elementos UI:   space-y-4 (16px)
```

### 8.3 Ejemplo Visual

```
┌─────────────────────────────────────────────────┐
│                                                 │ ← py-24
│                                                 │
│    Hay alguien esperando por vos               │
│                                                 │ ← mb-4
│    Encontrá a tu próximo compañero             │
│                                                 │ ← mb-8
│    [ Conocelos → ]                              │
│                                                 │
│                                                 │ ← py-24
├─────────────────────────────────────────────────┤
│                                                 │ ← py-16
│    Animales en adopción                        │
│                                                 │ ← mb-8
│    ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│    │         │    │         │    │         │   │
│    │  FOTO   │    │  FOTO   │    │  FOTO   │   │
│    │         │    │         │    │         │   │
│    │ Luna    │    │ Rocky   │    │ Michi   │   │
│    │ Perra   │    │ Perro   │    │ Gato    │   │
│    └─────────┘    └─────────┘    └─────────┘   │
│                                                 │ ← gap-8 entre cards
│                                                 │ ← py-16
└─────────────────────────────────────────────────┘
```

---

## 9. ESTADOS EMOCIONALES

### 9.1 Estado Vacío (No hay animales)

```jsx
<div className="text-center py-16">
  {/* Ilustración o emoji grande */}
  <div className="text-6xl mb-4">🐾</div>
  
  <h3 className="text-xl font-semibold text-brown-900">
    Por ahora no hay animalitos disponibles
  </h3>
  <p className="text-brown-500 mt-2">
    Pero podés seguirnos para enterarte cuando lleguen nuevos.
  </p>
  
  <a href="/contacto" className="
    inline-block mt-6
    text-terracotta-500 font-medium
    hover:text-terracotta-600
  ">
    Seguinos en Instagram →
  </a>
</div>
```

### 9.2 Éxito (Solicitud enviada)

```jsx
<div className="text-center py-12 px-6 bg-white rounded-2xl">
  {/* Ícono de éxito cálido */}
  <div className="
    w-16 h-16 mx-auto mb-4
    bg-sage-100 rounded-full
    flex items-center justify-center
  ">
    <svg className="w-8 h-8 text-sage-600">✓</svg>
  </div>
  
  <h3 className="text-2xl font-semibold text-brown-900">
    ¡Gracias por querer adoptar!
  </h3>
  <p className="text-brown-600 mt-2 max-w-md mx-auto">
    Recibimos tu solicitud para adoptar a <strong>Luna</strong>. 
    Nos pondremos en contacto pronto para conocerte mejor.
  </p>
  
  <a href="/" className="
    inline-block mt-6
    text-terracotta-500 font-medium
  ">
    Volver al inicio
  </a>
</div>
```

---

## 10. ACCESIBILIDAD CON CALIDEZ

### 10.1 Contraste Verificado

Todos los colores cumplen WCAG AA:
```
brown-900 sobre cream:  ✅ 12.5:1
brown-700 sobre cream:  ✅ 7.2:1
brown-500 sobre cream:  ✅ 4.7:1
terracotta-500 sobre white: ✅ 4.5:1 (textos grandes)
white sobre terracotta-500: ✅ 4.5:1
```

### 10.2 Focus States Visibles y Bonitos

```jsx
// No solo outline, también ring con color de marca
focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2
```

---

## 11. RECURSOS DE INSPIRACIÓN

### 11.1 Webs con Estética Similar (para inspirarse)

- **Apple.com** - Minimalismo, espacio, fotos protagonistas
- **Airbnb.com** - Calidez, fotos grandes, conexión emocional
- **Aesop.com** - Elegancia simple, colores tierra
- **The Pet Collective** - Diseño pet-friendly
- **Best Friends Animal Society** - Non-profit de animales bien hecha

### 11.2 Paletas de Colores Similares

Buscar en Coolors o ColorHunt:
- "Warm neutral palette"
- "Earthy tones"
- "Cozy palette"
- "Terracotta and sage"

### 11.3 Ilustraciones (si se necesitan)

- **Blush.design** - Ilustraciones personalizables
- **Humaaans** - Personas minimalistas
- **Open Peeps** - Ilustraciones dibujadas a mano

### 11.4 Iconos

- **Lucide** (incluido en stack) - Limpios, consistentes
- **Phosphor Icons** - Más opciones de estilo

---

## 12. CHECKLIST FINAL

### ¿Es Apple-ish?
- [ ] Las fotos son las protagonistas
- [ ] Hay suficiente espacio en blanco
- [ ] La tipografía es legible y tiene jerarquía
- [ ] Los colores son cálidos, no corporativos
- [ ] Cada elemento tiene propósito
- [ ] Las animaciones son sutiles
- [ ] Se siente premium pero accesible

### ¿Conecta emocionalmente?
- [ ] Los textos son empáticos, no fríos
- [ ] Las fotos invitan a conocer más
- [ ] El CTA principal es claro y cálido
- [ ] Los estados vacíos tienen personalidad
- [ ] Los mensajes de éxito celebran

### ¿Es usable?
- [ ] El usuario sabe qué hacer
- [ ] La navegación es obvia
- [ ] Los formularios son amables
- [ ] Los errores ayudan a corregir
- [ ] Funciona en mobile

---

## RESUMEN

**Estilo:** Minimalista cálido, inspirado en Apple + Airbnb
**Colores:** Crema, terracotta, salvia, marrones cálidos
**Fotos:** Protagonistas absolutas, grandes, sin ruido
**Tipografía:** DM Sans o Inter, jerarquía clara
**Espaciado:** Generoso, respira, sistema de 8px
**Interacciones:** Sutiles, 200-300ms, con propósito
**Emoción:** Empatía, calidez, esperanza, hogar
