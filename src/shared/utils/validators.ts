/**
 * Schemas de validación con Zod
 * Tipados para TypeScript - Exportan tipos inferidos
 */

import { z } from 'zod'
import type { TipoVivienda } from '@/domain/entities/adoption-request'
import type { Especie, Tamanio, Sexo, AnimalEstado } from '@/domain/entities/animal'

// ============================================
// HELPERS DE TRANSFORMACIÓN
// ============================================

/**
 * Convierte string a boolean (required)
 * Útil para radio buttons que envían "true"/"false" como string
 */
const stringToBooleanRequired = z.preprocess((val) => {
  if (val === 'true' || val === true) return true
  if (val === 'false' || val === false) return false
  return undefined
}, z.boolean({
  required_error: 'Este campo es obligatorio',
}))

/**
 * Convierte string a boolean (optional/nullable)
 */
const stringToBooleanOptional = z.preprocess((val) => {
  if (val === 'true' || val === true) return true
  if (val === 'false' || val === false) return false
  if (val === '' || val === null || val === undefined) return null
  return val
}, z.boolean().nullable().optional())

/**
 * Requiere valor true (para checkboxes de aceptación)
 */
const literalTrue = z.preprocess((val) => {
  if (val === 'true' || val === true) return true
  if (val === 'false' || val === false) return false
  return val
}, z.literal(true))

/**
 * Boolean para checkboxes (siempre boolean, default false)
 */
const checkboxBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true || val === 'on') return true
  return false
}, z.boolean())

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

export type LoginInput = z.infer<typeof loginSchema>

// ============================================
// VALIDADOR: FORMULARIO DE ADOPCIÓN
// ============================================

const tiposVivienda: [TipoVivienda, ...TipoVivienda[]] = [
  'Casa con patio',
  'Casa sin patio',
  'Departamento',
  'Otro',
]

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
  tipo_vivienda: z.enum(tiposVivienda, {
    errorMap: () => ({ message: 'Seleccioná un tipo de vivienda' }),
  }),

  vivienda_propia: stringToBooleanRequired,

  permite_mascotas: stringToBooleanOptional,

  // Convivencia
  todos_de_acuerdo: literalTrue.refine((val) => val === true, {
    message: 'Todos los convivientes deben estar de acuerdo',
  }),

  cantidad_convivientes: z
    .number({
      required_error: 'Indicá la cantidad de convivientes',
      invalid_type_error: 'Ingresá un número válido',
    })
    .min(0, 'El número no puede ser negativo')
    .max(20, 'Ingresá un número válido'),

  hay_ninos: stringToBooleanRequired,

  edades_ninos: z.string().optional().nullable(),

  // Otros animales
  tiene_otros_animales: stringToBooleanRequired,

  descripcion_otros_animales: z.string().optional().nullable(),

  otros_animales_castrados: stringToBooleanOptional,

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
  compromiso_castracion: literalTrue.refine((val) => val === true, {
    message: 'Debés comprometerte a castrar al animal si no lo está',
  }),

  compromiso_seguimiento: literalTrue.refine((val) => val === true, {
    message: 'Debés aceptar el seguimiento post-adopción',
  }),

  // Animal solicitado
  animal_id: z
    .number({
      required_error: 'El ID del animal es obligatorio',
    })
    .positive('ID de animal inválido'),
})

export type AdoptionInput = z.infer<typeof adoptionSchema>

// Schema para el formulario (sin animal_id que se agrega en submit)
export const adoptionFormSchema = adoptionSchema.omit({ animal_id: true })
export type AdoptionFormInput = z.infer<typeof adoptionFormSchema>

// Schemas por pasos del formulario
export const adoptionStep1Schema = adoptionSchema.pick({
  nombre_completo: true,
  edad: true,
  email: true,
  telefono_whatsapp: true,
  ciudad_zona: true,
})
export type AdoptionStep1Input = z.infer<typeof adoptionStep1Schema>

export const adoptionStep2Schema = adoptionSchema.pick({
  tipo_vivienda: true,
  vivienda_propia: true,
  permite_mascotas: true,
  todos_de_acuerdo: true,
  cantidad_convivientes: true,
})
export type AdoptionStep2Input = z.infer<typeof adoptionStep2Schema>

export const adoptionStep3Schema = adoptionSchema.pick({
  hay_ninos: true,
  edades_ninos: true,
  tiene_otros_animales: true,
  descripcion_otros_animales: true,
  otros_animales_castrados: true,
})
export type AdoptionStep3Input = z.infer<typeof adoptionStep3Schema>

export const adoptionStep4Schema = adoptionSchema.pick({
  experiencia_previa: true,
  motivacion: true,
  compromiso_castracion: true,
  compromiso_seguimiento: true,
})
export type AdoptionStep4Input = z.infer<typeof adoptionStep4Schema>

// ============================================
// VALIDADOR: FORMULARIO DE ANIMAL (admin)
// ============================================

const especies: [Especie, ...Especie[]] = ['Perro', 'Gato']
const tamanios: [Tamanio, ...Tamanio[]] = ['Pequeño', 'Mediano', 'Grande']
const sexos: [Sexo, ...Sexo[]] = ['Macho', 'Hembra']
const estados: [AnimalEstado, ...AnimalEstado[]] = [
  'Disponible',
  'En proceso',
  'Adoptado',
  'En transito',
]

export const animalSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),

  especie: z.enum(especies, {
    errorMap: () => ({ message: 'Seleccioná una especie' }),
  }),

  tamanio: z.enum(tamanios, {
    errorMap: () => ({ message: 'Seleccioná un tamaño' }),
  }),

  edad_aproximada: z.string().min(1, 'La edad es obligatoria'),

  sexo: z.enum(sexos, {
    errorMap: () => ({ message: 'Seleccioná el sexo' }),
  }),

  raza_mezcla: z.string().optional().nullable(),

  estado_castracion: checkboxBoolean,

  estado_vacunacion: z.string().optional().nullable(),

  estado_desparasitacion: checkboxBoolean,

  estado: z.enum(estados, {
    errorMap: () => ({ message: 'Seleccioná un estado' }),
  }),

  descripcion_historia: z
    .string()
    .min(1, 'La historia es obligatoria')
    .min(50, 'Contanos más sobre la historia del animal (mínimo 50 caracteres)'),

  necesidades_especiales: z.string().optional().nullable(),

  tipo_hogar_ideal: z.string().optional().nullable(),

  // Socialización
  socializa_perros: stringToBooleanOptional,
  socializa_gatos: stringToBooleanOptional,
  socializa_ninos: stringToBooleanOptional,

  // Contacto del rescatista
  publicado_por: z
    .string()
    .min(1, 'El nombre del rescatista/refugio es obligatorio'),

  contacto_rescatista: z.string().optional().default(''),

  foto_principal: z.string().optional().nullable(),
})

export type AnimalSchemaInput = z.infer<typeof animalSchema>

// ============================================
// HELPERS DE VALIDACIÓN
// ============================================

export interface ValidationSuccess<T> {
  success: true
  data: T
}

export interface ValidationError {
  success: false
  errors: Record<string, string>
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError

/**
 * Valida datos contra un schema de Zod
 * Retorna resultado tipado con data o errores formateados
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Formatear errores para fácil acceso por campo
  const errors: Record<string, string> = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })

  return { success: false, errors }
}

/**
 * Valida un campo individual
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): string | null {
  const result = schema.safeParse(value)
  if (result.success) return null
  return result.error.issues[0]?.message || 'Valor inválido'
}
