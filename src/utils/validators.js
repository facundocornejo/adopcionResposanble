import { z } from 'zod'

// ============================================
// VALIDADOR: LOGIN
// ============================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Ingresá un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// ============================================
// VALIDADOR: FORMULARIO DE ADOPCIÓN (17 campos)
// ============================================
export const adoptionSchema = z.object({
  // Datos personales
  nombre_completo: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  edad: z
    .number({
      required_error: 'La edad es obligatoria',
      invalid_type_error: 'Ingresá un número válido',
    })
    .min(18, 'Debés ser mayor de 18 años para adoptar')
    .max(120, 'Ingresá una edad válida'),

  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Ingresá un email válido'),

  telefono_whatsapp: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .min(8, 'Ingresá un teléfono válido')
    .max(20, 'El teléfono es demasiado largo'),

  ciudad_zona: z
    .string()
    .min(1, 'La ciudad/zona es obligatoria')
    .min(3, 'Ingresá al menos 3 caracteres'),

  // Vivienda
  tipo_vivienda: z.enum(
    ['Casa con patio', 'Casa sin patio', 'Departamento', 'Otro'],
    { errorMap: () => ({ message: 'Seleccioná un tipo de vivienda' }) }
  ),

  vivienda_propia: z.boolean({
    required_error: 'Indicá si la vivienda es propia o alquilada',
  }),

  permite_mascotas: z
    .boolean()
    .optional()
    .nullable(),

  // Convivencia
  todos_de_acuerdo: z.literal(true, {
    errorMap: () => ({ message: 'Todos los convivientes deben estar de acuerdo' }),
  }),

  cantidad_convivientes: z
    .number({
      required_error: 'Indicá la cantidad de convivientes',
      invalid_type_error: 'Ingresá un número válido',
    })
    .min(0, 'El número no puede ser negativo')
    .max(20, 'Ingresá un número válido'),

  hay_ninos: z.boolean({
    required_error: 'Indicá si hay niños en el hogar',
  }),

  edades_ninos: z
    .string()
    .optional()
    .nullable(),

  // Otros animales
  tiene_otros_animales: z.boolean({
    required_error: 'Indicá si tenés otros animales',
  }),

  descripcion_otros_animales: z
    .string()
    .optional()
    .nullable(),

  otros_animales_castrados: z
    .boolean()
    .optional()
    .nullable(),

  // Experiencia y motivación
  experiencia_previa: z
    .string()
    .min(1, 'Contanos sobre tu experiencia')
    .min(10, 'Contanos un poco más sobre tu experiencia (mínimo 10 caracteres)'),

  motivacion: z
    .string()
    .min(1, 'Contanos por qué querés adoptar')
    .min(20, 'Contanos un poco más sobre tu motivación (mínimo 20 caracteres)'),

  // Compromisos
  compromiso_castracion: z.literal(true, {
    errorMap: () => ({ message: 'Debés comprometerte a castrar al animal si no lo está' }),
  }),

  compromiso_seguimiento: z.literal(true, {
    errorMap: () => ({ message: 'Debés aceptar el seguimiento post-adopción' }),
  }),

  // Animal solicitado
  animal_id: z
    .number({
      required_error: 'El ID del animal es obligatorio',
    })
    .positive('ID de animal inválido'),
})

// Schema para el formulario (sin animal_id que se agrega en submit)
export const adoptionFormSchema = adoptionSchema.omit({ animal_id: true })

// Schema para validación parcial (por pasos del formulario)
export const adoptionStep1Schema = adoptionSchema.pick({
  nombre_completo: true,
  edad: true,
  email: true,
  telefono_whatsapp: true,
  ciudad_zona: true,
})

export const adoptionStep2Schema = adoptionSchema.pick({
  tipo_vivienda: true,
  vivienda_propia: true,
  permite_mascotas: true,
  todos_de_acuerdo: true,
  cantidad_convivientes: true,
})

export const adoptionStep3Schema = adoptionSchema.pick({
  hay_ninos: true,
  edades_ninos: true,
  tiene_otros_animales: true,
  descripcion_otros_animales: true,
  otros_animales_castrados: true,
})

export const adoptionStep4Schema = adoptionSchema.pick({
  experiencia_previa: true,
  motivacion: true,
  compromiso_castracion: true,
  compromiso_seguimiento: true,
})

// Helper para convertir string a boolean o null
const stringToBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true) return true
  if (val === 'false' || val === false) return false
  if (val === '' || val === null || val === undefined) return null
  return val
}, z.boolean().nullable().optional())

// Helper para checkbox (siempre boolean)
const checkboxBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true || val === 'on') return true
  return false
}, z.boolean())

// ============================================
// VALIDADOR: FORMULARIO DE ANIMAL (admin)
// ============================================
export const animalSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),

  especie: z.enum(['Perro', 'Gato'], {
    errorMap: () => ({ message: 'Seleccioná una especie' }),
  }),

  tamanio: z.enum(['Pequeño', 'Mediano', 'Grande'], {
    errorMap: () => ({ message: 'Seleccioná un tamaño' }),
  }),

  edad_aproximada: z
    .string()
    .min(1, 'La edad es obligatoria'),

  sexo: z.enum(['Macho', 'Hembra'], {
    errorMap: () => ({ message: 'Seleccioná el sexo' }),
  }),

  raza_mezcla: z
    .string()
    .optional()
    .nullable(),

  estado_castracion: checkboxBoolean,

  estado_vacunacion: z
    .string()
    .optional()
    .nullable(),

  estado_desparasitacion: checkboxBoolean,

  estado: z.enum(['Disponible', 'En proceso', 'Adoptado', 'En transito'], {
    errorMap: () => ({ message: 'Seleccioná un estado' }),
  }),

  descripcion_historia: z
    .string()
    .min(1, 'La historia es obligatoria')
    .min(20, 'Contanos más sobre la historia del animal (mínimo 20 caracteres)'),

  necesidades_especiales: z
    .string()
    .optional()
    .nullable(),

  // Socialización (radio buttons: Sí/No/No sé)
  socializa_perros: stringToBoolean,
  socializa_gatos: stringToBoolean,
  socializa_ninos: stringToBoolean,

  // Contacto del rescatista
  publicado_por: z
    .string()
    .min(1, 'El nombre del rescatista/refugio es obligatorio'),

  contacto_rescatista: z
    .string()
    .min(1, 'El contacto es obligatorio'),

  foto_principal: z
    .string()
    .optional()
    .nullable(),
})

// ============================================
// HELPERS
// ============================================

/**
 * Valida datos contra un schema de Zod
 * @param {object} schema - Schema de Zod
 * @param {object} data - Datos a validar
 * @returns {{ success: boolean, data?: object, errors?: object }}
 */
export const validateData = (schema, data) => {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Formatear errores para fácil acceso
  const errors = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })

  return { success: false, errors }
}
