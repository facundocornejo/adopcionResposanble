# Fase 7: Deploy a Vercel

## Resumen

En esta fase desplegamos la aplicación en Vercel:
1. **vercel.json**: Configuración de rewrites para SPA
2. **Variables de entorno**: Configuración en Vercel
3. **Deploy automático**: Conectar con GitHub

---

## Archivos Creados

```
├── vercel.json      # Configuración de Vercel
├── .env.example     # Variables de entorno (ya existía)
└── .gitignore       # Actualizado para incluir docs/
```

---

## Configuración de Vercel

### vercel.json

Este archivo configura cómo Vercel maneja las rutas de la SPA:

```json
{
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### ¿Por qué es necesario?

React Router maneja las rutas en el cliente (browser). Cuando un usuario accede directamente a `/animal/5` o recarga la página, el servidor de Vercel buscaría un archivo `/animal/5/index.html` que no existe.

El **rewrite** dice: "para cualquier ruta que no sea `/assets/*`, devolvé `/index.html`". Así React Router toma el control.

### Headers de Cache

Los assets (JS, CSS, imágenes) tienen nombres únicos generados por Vite (`index-CDuSIwC4.js`). Como el nombre cambia con cada build, podemos cachearlos por 1 año (`immutable`).

---

## Pasos para Deploy

### Opción 1: Deploy desde GitHub (Recomendado)

#### 1. Subir código a GitHub

```bash
# Si no tenés repositorio, crearlo en GitHub y luego:
git init
git add .
git commit -m "Initial commit - Adopción de Animales Frontend"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/adopcion-animales-frontend.git
git push -u origin main
```

#### 2. Conectar con Vercel

1. Ir a [vercel.com](https://vercel.com) y loguearse con GitHub
2. Click en **"Add New Project"**
3. Seleccionar el repositorio `adopcion-animales-frontend`
4. Vercel detecta automáticamente que es Vite/React

#### 3. Configurar Variables de Entorno

En la pantalla de configuración, agregar:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://adopcion-api.onrender.com` |

**Importante**: Las variables de Vite deben empezar con `VITE_` para estar disponibles en el frontend.

#### 4. Deploy

Click en **"Deploy"**. Vercel:
- Clona el repositorio
- Ejecuta `npm install`
- Ejecuta `npm run build`
- Sube la carpeta `dist/` a su CDN global

#### 5. URL de Producción

Vercel asigna una URL tipo:
```
https://adopcion-animales-frontend.vercel.app
```

Podés configurar un dominio personalizado después.

---

### Opción 2: Deploy desde CLI

#### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
# Desde la carpeta del proyecto
cd B:/TFI/front
vercel
```

Seguir las instrucciones:
- Link to existing project? **No**
- Project name: **adopcion-animales-frontend**
- Directory with code: **.** (actual)
- Want to override settings? **No**

#### 4. Deploy a Producción

```bash
vercel --prod
```

---

## Variables de Entorno en Vercel

### Desde el Dashboard

1. Ir a **Project Settings** → **Environment Variables**
2. Agregar:

```
VITE_API_URL = https://adopcion-api.onrender.com
```

3. Seleccionar entornos: **Production**, **Preview**, **Development**
4. Click **Save**

### Desde CLI

```bash
vercel env add VITE_API_URL
# Ingresar el valor cuando lo pida
```

---

## Verificación Post-Deploy

### Checklist

- [ ] La home carga correctamente
- [ ] Las imágenes de animales se ven (vienen del backend)
- [ ] La navegación funciona (React Router)
- [ ] Recargar `/animal/1` no da error 404
- [ ] El login funciona
- [ ] El panel admin carga
- [ ] Se pueden crear/editar animales
- [ ] Las solicitudes se envían correctamente

### Errores Comunes

#### 1. Error 404 en rutas

**Causa**: Falta `vercel.json` o está mal configurado.

**Solución**: Verificar que el archivo existe y tiene los rewrites correctos.

#### 2. "Network Error" en API

**Causa**: Variable `VITE_API_URL` no configurada en Vercel.

**Solución**: Agregar la variable en Project Settings → Environment Variables.

#### 3. CORS Error

**Causa**: El backend no tiene configurado el dominio de Vercel.

**Solución**: Agregar el dominio de Vercel a los orígenes permitidos en el backend:
```python
# En el backend (FastAPI)
origins = [
    "http://localhost:5173",
    "https://adopcion-animales-frontend.vercel.app",  # Agregar esto
]
```

#### 4. Imágenes no cargan

**Causa**: Las URLs de las fotos apuntan a localhost.

**Solución**: Verificar que el backend devuelve URLs completas de producción.

---

## Deploys Automáticos

Una vez conectado con GitHub, Vercel hace deploy automático:

### Production Deploy
- Cuando se hace push/merge a `main`
- URL fija: `tu-proyecto.vercel.app`

### Preview Deploy
- Cuando se abre un Pull Request
- URL única por PR: `tu-proyecto-abc123.vercel.app`
- Permite probar cambios antes de mergear

---

## Dominio Personalizado (Opcional)

### Agregar Dominio

1. Ir a **Project Settings** → **Domains**
2. Agregar dominio: `adopciones.tudominio.com`
3. Vercel da instrucciones de DNS

### Configurar DNS

En tu proveedor de dominio, agregar:

```
Tipo: CNAME
Nombre: adopciones
Valor: cname.vercel-dns.com
```

O para dominio raíz:

```
Tipo: A
Nombre: @
Valor: 76.76.21.21
```

---

## Estructura Final del Proyecto

```
adopcion-animales-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── admin/
│   │   └── public/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/                    # Documentación por fase
│   ├── FASE_1_SETUP.md
│   ├── FASE_2_API.md
│   ├── FASE_3_COMPONENTES.md
│   ├── FASE_4_PUBLICAS.md
│   ├── FASE_5_AUTH.md
│   ├── FASE_6_ADMIN.md
│   └── FASE_7_DEPLOY.md
├── .env                     # Variables locales (NO commitear)
├── .env.example             # Ejemplo de variables
├── .gitignore
├── vercel.json              # Configuración de Vercel
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Resumen de Tamaño del Build

```
dist/
├── index.html                    1.01 kB
├── assets/
│   ├── index.css                32.86 kB (gzip: 6.16 kB)
│   ├── index.js                259.55 kB (gzip: 85.22 kB)
│   ├── validators.js            81.05 kB (gzip: 22.18 kB)
│   └── [chunks por página]      ~70 kB total
```

**Total**: ~445 kB (gzip: ~121 kB)

Esto es muy bueno para una SPA completa. El code splitting de Vite divide el código por rutas, así que los usuarios solo cargan lo que necesitan.

---

## Comandos Útiles

```bash
# Build local
npm run build

# Preview del build
npm run preview

# Deploy a Vercel (preview)
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls
```

---

## Próximos Pasos (Mejoras Futuras)

1. **Analytics**: Agregar Google Analytics o Vercel Analytics
2. **SEO**: Mejorar meta tags, agregar sitemap
3. **PWA**: Convertir en Progressive Web App
4. **Tests**: Agregar tests con Vitest
5. **CI/CD**: GitHub Actions para lint/test antes del deploy
