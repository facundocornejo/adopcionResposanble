# Credenciales de Administrador

## Super Admin

| Campo | Valor |
|-------|-------|
| Email | `proyectoperritos@hotmail.com` |
| Password | `Admin123` |
| Rol | Super Administrador (acceso total) |

---

## Rescatistas (Admins de Organizaciones)

| Organización | Username | Email | Password |
|--------------|----------|-------|----------|
| Refugio Patitas Felices | `admin` | `contacto@patitasfelices.org` | _(consultar)_ |
| Refugio Huellas de Amor | `huellas_admin` | `huellas@ejemplo.com` | _(consultar)_ |
| Huellitas de Amor | _(sin admin)_ | `info@huellitasdeamor.org` | - |
| refugio india | `facu` | _(verificar)_ | `12345678` |

> **Nota**: Las contraseñas de los rescatistas no se almacenan en texto plano. Si necesitás resetear una contraseña, debés hacerlo desde la base de datos o crear una funcionalidad de reset.

---

## URLs de Acceso

| Entorno | URL |
|---------|-----|
| Desarrollo | http://localhost:5173/admin/login |
| Producción | https://adopcion-resposanble.vercel.app/admin/login |

---

## Permisos por Rol

### Super Admin
- Ver todas las organizaciones
- Crear/editar/eliminar organizaciones
- Crear admins para cada organización
- Ver solicitudes de contacto de rescatistas
- Acceso total al sistema

### Admin (Rescatista)
- Ver solo su organización
- Crear/editar/eliminar animales de su organización
- Ver solicitudes de adopción de sus animales
- Editar datos de su organización

---

## Crear nuevo Rescatista

Como Super Admin:
1. Ir a la sección de Organizaciones
2. Click en "Nueva Organización"
3. Completar datos de la organización
4. Completar datos del admin (username, email, password)
5. Guardar y enviar credenciales al rescatista

---

## Notas

- Las contraseñas deben tener al menos 6 caracteres
- El email del admin debe ser único en todo el sistema
- El username también debe ser único
