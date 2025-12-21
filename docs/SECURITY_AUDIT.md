# SECURITY_AUDIT.md - Auditoría de Seguridad Completa

## Objetivo

Este documento define los estándares de seguridad que DEBEN cumplirse en todo el proyecto.
Claude Code debe revisar cada punto y corregir lo que no cumpla.

**Estándares aplicados:**
- OWASP Top 10 (2021)
- OWASP API Security Top 10
- Node.js Security Best Practices
- React Security Best Practices

---

## INSTRUCCIONES PARA CLAUDE CODE

```
Lee este documento completo.
Revisá TODO el código del proyecto (backend y frontend).
Para cada punto del checklist:
1. Verificá si se cumple
2. Si NO se cumple, corregilo
3. Documentá qué encontraste y qué cambiaste en docs/SECURITY_REVIEW.md

Al finalizar, generá un reporte con:
- ✅ Puntos que ya cumplían
- 🔧 Puntos que corregiste
- ⚠️ Puntos que requieren atención manual
```

---

## 1. AUTENTICACIÓN Y SESIONES

### 1.1 Contraseñas (OWASP A07:2021)

**Backend - Verificar en:** `src/services/`, `src/controllers/auth.controller.js`

```javascript
// ✅ DEBE EXISTIR: Hasheo con bcrypt, costo >= 10
const saltRounds = 10; // Mínimo 10, recomendado 12
const hash = await bcrypt.hash(password, saltRounds);

// ❌ BUSCAR Y ELIMINAR: Contraseñas en texto plano
password: req.body.password  // Sin hashear
```

**Checklist:**
- [ ] Contraseñas hasheadas con bcrypt (costo >= 10)
- [ ] Nunca se loguean contraseñas (ni en errores)
- [ ] No hay contraseñas hardcodeadas en el código
- [ ] Validación de contraseña segura (mínimo 8 caracteres)

### 1.2 JWT (RFC 7519)

**Backend - Verificar en:** `src/config/`, `src/middlewares/auth.js`

```javascript
// ✅ DEBE EXISTIR: JWT con expiración y secret desde env
const token = jwt.sign(
  { id: user.id },                    // Payload mínimo
  process.env.JWT_SECRET,             // Secret desde .env
  { expiresIn: '24h' }                // Expiración obligatoria
);

// ❌ BUSCAR Y ELIMINAR:
jwt.sign({ id, email, password }, 'secreto123');  // Secret hardcodeado
jwt.sign(payload);  // Sin expiración
```

**Checklist:**
- [ ] JWT_SECRET en variable de entorno (no hardcodeado)
- [ ] JWT_SECRET tiene mínimo 32 caracteres aleatorios
- [ ] Token tiene expiración (máximo 24h recomendado)
- [ ] Payload no contiene datos sensibles (contraseña, datos personales completos)
- [ ] Se valida el token en cada request protegida

### 1.3 Manejo de Sesiones

**Frontend - Verificar en:** `src/context/`, `src/services/`

```javascript
// ✅ CORRECTO: Guardar token en localStorage o sessionStorage
localStorage.setItem('token', token);

// ✅ CORRECTO: Limpiar al logout
localStorage.removeItem('token');

// ❌ INCORRECTO: Token en URL
navigate(`/dashboard?token=${token}`);
```

**Checklist:**
- [ ] Token guardado en localStorage (no en URL, no en cookies sin httpOnly)
- [ ] Token se elimina completamente en logout
- [ ] Se redirige a login cuando token expira (401)
- [ ] No se guarda información sensible en localStorage

---

## 2. INYECCIÓN (OWASP A03:2021)

### 2.1 SQL Injection

**Backend - Verificar en:** Todos los archivos que usan Prisma o queries

```javascript
// ✅ CORRECTO: Prisma usa queries parametrizadas automáticamente
const animal = await prisma.animal.findUnique({
  where: { id: parseInt(req.params.id) }
});

// ❌ BUSCAR Y ELIMINAR: Concatenación de strings en queries
const query = `SELECT * FROM animals WHERE id = ${req.params.id}`;
prisma.$queryRaw`SELECT * FROM animals WHERE name = ${req.body.name}`; // Cuidado con queryRaw
```

**Checklist:**
- [ ] No hay concatenación de strings en queries
- [ ] Se usa Prisma (queries parametrizadas) para todas las operaciones
- [ ] Si se usa $queryRaw, los parámetros están escapados
- [ ] IDs numéricos se parsean con parseInt() antes de usar

### 2.2 NoSQL Injection

**Backend - Verificar en:** Queries con objetos dinámicos

```javascript
// ❌ PELIGROSO: Objeto del request directo en query
const user = await prisma.user.findFirst({
  where: req.body  // El atacante puede inyectar operadores
});

// ✅ CORRECTO: Extraer solo los campos necesarios
const { email } = req.body;
const user = await prisma.user.findFirst({
  where: { email }
});
```

**Checklist:**
- [ ] Nunca se pasa req.body directo a queries
- [ ] Se extraen y validan campos específicos

### 2.3 Command Injection

**Backend - Verificar en:** Cualquier uso de exec, spawn, child_process

```javascript
// ❌ BUSCAR Y ELIMINAR: Ejecución de comandos con input del usuario
const { exec } = require('child_process');
exec(`convert ${req.body.filename} output.jpg`);  // PELIGROSO

// ✅ Si es necesario, usar arrays (no strings)
const { spawn } = require('child_process');
spawn('convert', [sanitizedFilename, 'output.jpg']);
```

**Checklist:**
- [ ] No se usa exec() con input del usuario
- [ ] No se usa eval() nunca
- [ ] No se usa Function() constructor con strings dinámicos

---

## 3. XSS - Cross Site Scripting (OWASP A03:2021)

### 3.1 Frontend React

**Frontend - Verificar en:** Todos los componentes JSX

```jsx
// ✅ CORRECTO: React escapa automáticamente
<p>{userInput}</p>
<div>{animal.descripcion}</div>

// ❌ BUSCAR Y ELIMINAR: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ⚠️ Si es absolutamente necesario, sanitizar primero:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

**Checklist:**
- [ ] No se usa dangerouslySetInnerHTML (o si se usa, está sanitizado con DOMPurify)
- [ ] No se inserta HTML dinámico sin sanitizar
- [ ] URLs de imágenes se validan antes de usar

### 3.2 Backend - Sanitización de Inputs

**Backend - Verificar en:** `src/middlewares/`, `src/controllers/`

```javascript
// ✅ DEBE EXISTIR: Sanitización con express-validator o similar
const { body, validationResult } = require('express-validator');

app.post('/api/animals', [
  body('nombre').trim().escape(),
  body('descripcion_historia').trim(),
  body('email').isEmail().normalizeEmail(),
], controller);

// O usar librería de sanitización
const sanitizeHtml = require('sanitize-html');
const cleanDescription = sanitizeHtml(req.body.descripcion, {
  allowedTags: [],  // Sin HTML
  allowedAttributes: {}
});
```

**Checklist:**
- [ ] Todos los inputs de texto se sanitizan con trim()
- [ ] Campos que van a mostrarse se escapan
- [ ] Emails se normalizan
- [ ] HTML no permitido se elimina

---

## 4. VALIDACIÓN DE DATOS

### 4.1 Backend - Validación de Inputs

**Backend - Verificar en:** `src/middlewares/`, `src/routes/`

```javascript
// ✅ DEBE EXISTIR: Validación completa
const animalValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('Nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres')
    .escape(),
  
  body('especie')
    .isIn(['Perro', 'Gato']).withMessage('Especie debe ser Perro o Gato'),
  
  body('edad')
    .optional()
    .isInt({ min: 0, max: 30 }).withMessage('Edad inválida'),
  
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
];
```

**Checklist:**
- [ ] Todos los endpoints con POST/PUT tienen validación
- [ ] Se valida tipo de dato (string, number, boolean)
- [ ] Se valida longitud de strings
- [ ] Se valida formato (email, teléfono, URL)
- [ ] Se validan enums (especie, estado, tipo_vivienda)
- [ ] Se valida edad >= 18 en solicitudes de adopción
- [ ] Errores de validación devuelven mensajes claros

### 4.2 Frontend - Validación con Zod

**Frontend - Verificar en:** `src/utils/validators.js`, formularios

```javascript
// ✅ DEBE EXISTIR: Esquemas de validación
import { z } from 'zod';

const adoptionSchema = z.object({
  nombre_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  edad: z.number().min(18, 'Debes ser mayor de 18'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  compromiso_castracion: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar el compromiso' })
  }),
});
```

**Checklist:**
- [ ] Formularios usan React Hook Form + Zod
- [ ] Validación en frontend coincide con backend
- [ ] Mensajes de error son claros y en español

---

## 5. CONTROL DE ACCESO (OWASP A01:2021)

### 5.1 Protección de Rutas - Backend

**Backend - Verificar en:** `src/middlewares/auth.js`, `src/routes/`

```javascript
// ✅ DEBE EXISTIR: Middleware de autenticación
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Token no proporcionado' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token inválido o expirado' }
    });
  }
};

// ✅ APLICADO a todas las rutas protegidas
router.post('/animals', authMiddleware, createAnimal);
router.put('/animals/:id', authMiddleware, updateAnimal);
router.delete('/animals/:id', authMiddleware, deleteAnimal);
router.get('/adoption-requests', authMiddleware, getRequests);
```

**Checklist:**
- [ ] Middleware de auth existe y funciona
- [ ] Todas las rutas de admin están protegidas
- [ ] Las rutas públicas están claramente identificadas
- [ ] Se verifica propiedad del recurso (no editar animales de otra organización)

### 5.2 Protección de Rutas - Frontend

**Frontend - Verificar en:** `src/router.jsx`, `src/components/ProtectedRoute.jsx`

```jsx
// ✅ DEBE EXISTIR: Componente ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// ✅ APLICADO en router
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="animals" element={<Animals />} />
</Route>
```

**Checklist:**
- [ ] ProtectedRoute existe y funciona
- [ ] Todas las rutas /admin/* están protegidas
- [ ] Redirección a login cuando no hay token
- [ ] Redirección a login cuando token expira (401)

### 5.3 Autorización (Ownership)

**Backend - Verificar en:** Controllers de animales y solicitudes

```javascript
// ✅ DEBE EXISTIR: Verificar propiedad del recurso
const updateAnimal = async (req, res) => {
  const animal = await prisma.animal.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  
  // Verificar que el animal pertenece a la organización del admin
  if (animal.organizacion_id !== req.admin.organizacion_id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'No tenés permiso para editar este animal' }
    });
  }
  
  // Proceder con la actualización...
};
```

**Checklist:**
- [ ] Se verifica ownership antes de editar/eliminar
- [ ] Un admin no puede ver/editar datos de otra organización
- [ ] Las solicitudes solo son visibles para la organización del animal

---

## 6. CONFIGURACIÓN DE SEGURIDAD

### 6.1 Variables de Entorno

**Backend - Verificar en:** `.env`, `.env.example`, código

```bash
# ✅ .env debe tener (y NO estar en git):
DATABASE_URL=postgresql://...
JWT_SECRET=string_aleatorio_de_minimo_32_caracteres
CLOUDINARY_API_SECRET=...
SMTP_PASS=...

# ✅ .env.example debe existir (SÍ en git):
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=tu_secreto_aqui_minimo_32_caracteres
CLOUDINARY_API_SECRET=tu_api_secret
SMTP_PASS=tu_password
```

**Checklist:**
- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` existe con todas las variables
- [ ] No hay secretos hardcodeados en el código
- [ ] JWT_SECRET tiene mínimo 32 caracteres

### 6.2 Headers de Seguridad

**Backend - Verificar en:** `src/app.js`

```javascript
// ✅ DEBE EXISTIR: Helmet para headers de seguridad
const helmet = require('helmet');
app.use(helmet());

// O configuración manual mínima:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

**Checklist:**
- [ ] Helmet está instalado y configurado
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY (previene clickjacking)
- [ ] HSTS habilitado en producción

### 6.3 CORS

**Backend - Verificar en:** `src/app.js`

```javascript
// ✅ CORRECTO: CORS restrictivo
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// ❌ INCORRECTO: CORS abierto a todos
app.use(cors());  // Permite cualquier origen
app.use(cors({ origin: '*' }));  // Igual de malo
```

**Checklist:**
- [ ] CORS configurado con origin específico
- [ ] No usar origin: '*' en producción
- [ ] FRONTEND_URL en variable de entorno

### 6.4 Rate Limiting

**Backend - Verificar en:** `src/app.js` o `src/middlewares/`

```javascript
// ✅ DEBE EXISTIR: Rate limiting
const rateLimit = require('express-rate-limit');

// Limitar requests generales
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,  // 100 requests por ventana
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Demasiadas solicitudes, intentá más tarde' }
  }
});

// Limitar login (más estricto)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 intentos de login por ventana
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Demasiados intentos, esperá 15 minutos' }
  }
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', loginLimiter);
```

**Checklist:**
- [ ] Rate limiting general instalado
- [ ] Rate limiting más estricto en login
- [ ] Rate limiting en endpoints públicos (formulario de adopción)

---

## 7. MANEJO DE ARCHIVOS

### 7.1 Upload de Imágenes

**Backend - Verificar en:** `src/routes/upload.routes.js`, `src/controllers/upload.controller.js`

```javascript
// ✅ DEBE EXISTIR: Validación de archivos
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB máximo
    files: 5  // Máximo 5 archivos
  },
  fileFilter
});
```

**Checklist:**
- [ ] Validación de tipo MIME
- [ ] Límite de tamaño (máximo 5MB)
- [ ] Límite de cantidad de archivos
- [ ] No se guardan archivos en el servidor (usar Cloudinary)
- [ ] Nombres de archivo no vienen del usuario

---

## 8. DEPENDENCIAS

### 8.1 Auditoría de Dependencias

**Backend y Frontend - Ejecutar:**

```bash
# Verificar vulnerabilidades
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix

# Ver dependencias desactualizadas
npm outdated
```

**Checklist:**
- [ ] `npm audit` no muestra vulnerabilidades críticas o altas
- [ ] Dependencias actualizadas regularmente
- [ ] No hay dependencias innecesarias

### 8.2 Dependencias de Seguridad Requeridas

**Backend - Verificar en:** `package.json`

```json
{
  "dependencies": {
    "bcrypt": "^5.x",           // Hasheo de contraseñas
    "helmet": "^7.x",           // Headers de seguridad
    "express-rate-limit": "^7.x", // Rate limiting
    "express-validator": "^7.x",  // Validación/sanitización
    "jsonwebtoken": "^9.x"       // JWT
  }
}
```

---

## 9. LOGS Y ERRORES

### 9.1 No Exponer Información Sensible

**Backend - Verificar en:** `src/middlewares/errorHandler.js`

```javascript
// ✅ CORRECTO: Error handler que no expone detalles internos
const errorHandler = (err, req, res, next) => {
  // Loguear error completo internamente
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Devolver mensaje genérico al cliente
  const statusCode = err.status || 500;
  const message = statusCode === 500 
    ? 'Error interno del servidor' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message
      // ❌ NO incluir: stack, query, datos internos
    }
  });
};

// ❌ INCORRECTO: Exponer stack trace al cliente
res.status(500).json({ error: err.stack });
```

**Checklist:**
- [ ] Stack traces no se envían al cliente
- [ ] Errores de base de datos no exponen estructura
- [ ] Mensajes de error son genéricos en producción
- [ ] Se loguean errores internamente para debugging

### 9.2 No Loguear Datos Sensibles

```javascript
// ❌ BUSCAR Y ELIMINAR:
console.log('Login attempt:', { email, password });  // Loguea contraseña
console.log('User data:', user);  // Puede incluir datos sensibles

// ✅ CORRECTO:
console.log('Login attempt:', { email });
console.log('User logged in:', { id: user.id, email: user.email });
```

**Checklist:**
- [ ] No se loguean contraseñas
- [ ] No se loguean tokens completos
- [ ] No se loguean datos personales innecesarios

---

## 10. HTTPS Y PRODUCCIÓN

### 10.1 HTTPS Obligatorio

**Verificar en:** Configuración de Render/Vercel

```javascript
// ✅ DEBE EXISTIR: Redirección a HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

**Checklist:**
- [ ] HTTPS habilitado en producción
- [ ] Certificado SSL válido
- [ ] Cookies con flag Secure en producción

### 10.2 Variables de Producción

```bash
# ✅ Verificar que existan en Render/Vercel:
NODE_ENV=production
DATABASE_URL=...
JWT_SECRET=...  # Diferente al de desarrollo
FRONTEND_URL=https://tu-frontend.vercel.app
```

---

## 11. CHECKLIST RESUMEN FINAL

### Backend
- [ ] Contraseñas hasheadas con bcrypt (costo >= 10)
- [ ] JWT con expiración y secret seguro
- [ ] Todas las rutas protegidas usan middleware de auth
- [ ] Validación de todos los inputs
- [ ] Sanitización de inputs de texto
- [ ] Rate limiting implementado
- [ ] Helmet configurado
- [ ] CORS restrictivo
- [ ] Validación de uploads (tipo, tamaño)
- [ ] Error handler que no expone info sensible
- [ ] Variables de entorno para secretos
- [ ] npm audit sin vulnerabilidades críticas

### Frontend
- [ ] No se usa dangerouslySetInnerHTML
- [ ] Token guardado en localStorage
- [ ] Token eliminado en logout
- [ ] ProtectedRoute implementado
- [ ] Validación de formularios con Zod
- [ ] Manejo de errores 401 (redirect a login)
- [ ] No hay secretos en el código

### Infraestructura
- [ ] HTTPS en producción
- [ ] .env en .gitignore
- [ ] .env.example existe
- [ ] Variables de entorno configuradas en hosting

---

## REPORTE FINAL

Después de revisar todo, creá el archivo `docs/SECURITY_REVIEW.md` con:

```markdown
# Reporte de Auditoría de Seguridad

Fecha: [fecha]
Revisado por: Claude Code

## Resumen
- Total de puntos revisados: X
- ✅ Cumplidos: X
- 🔧 Corregidos: X
- ⚠️ Requieren atención: X

## Detalles

### ✅ Puntos Cumplidos
[Lista]

### 🔧 Correcciones Realizadas
[Lista con descripción de qué se cambió]

### ⚠️ Requieren Atención Manual
[Lista con recomendaciones]

## Archivos Modificados
[Lista de archivos que se tocaron]
```
