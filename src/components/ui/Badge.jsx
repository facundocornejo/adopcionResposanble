import { clsx } from 'clsx'

/**
 * Componente Badge reutilizable
 *
 * @param {object} props
 * @param {'sage'|'amber'|'purple'|'sky'|'red'|'blue'|'gray'} props.variant - Color
 * @param {'sm'|'md'} props.size - Tamaño
 * @param {boolean} props.dot - Mostrar punto indicador
 * @param {React.ReactNode} props.children - Contenido
 */
const Badge = ({
  variant = 'gray',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    // Estados de animales
    sage: 'bg-sage-100 text-sage-600',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-600',
    sky: 'bg-sky-100 text-sky-600',
    // Estados de solicitudes y otros
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-brown-100 text-brown-600',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Punto indicador */}
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            variant === 'sage' && 'bg-sage-500',
            variant === 'amber' && 'bg-amber-500',
            variant === 'purple' && 'bg-purple-500',
            variant === 'sky' && 'bg-sky-500',
            variant === 'red' && 'bg-red-500',
            variant === 'blue' && 'bg-blue-500',
            variant === 'gray' && 'bg-brown-500'
          )}
        />
      )}
      {children}
    </span>
  )
}

/**
 * Helper para obtener variante según estado de animal
 */
Badge.getAnimalVariant = (estado) => {
  const map = {
    'Disponible': 'sage',
    'En proceso': 'amber',
    'Adoptado': 'purple',
    'En transito': 'sky',
  }
  return map[estado] || 'gray'
}

/**
 * Helper para obtener variante según estado de solicitud
 */
Badge.getRequestVariant = (estado) => {
  const map = {
    'Nueva': 'blue',
    'Revisada': 'amber',
    'En evaluación': 'sky',
    'Aprobada': 'sage',
    'Rechazada': 'red',
  }
  return map[estado] || 'gray'
}

export default Badge
