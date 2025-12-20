import { clsx } from 'clsx'

/**
 * Componente Card reutilizable
 *
 * @param {object} props
 * @param {'default'|'elevated'|'outline'} props.variant - Estilo visual
 * @param {'none'|'sm'|'md'|'lg'} props.padding - Padding interno
 * @param {boolean} props.hoverable - Si tiene efecto hover
 * @param {boolean} props.clickable - Si es clickeable (agrega cursor y estilos)
 * @param {React.ReactNode} props.children - Contenido
 */
const Card = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md',
    outline: 'bg-white border border-brown-200',
  }

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  }

  return (
    <div
      className={clsx(
        'rounded-xl overflow-hidden',
        variants[variant],
        paddings[padding],
        hoverable && 'transition-shadow duration-300 hover:shadow-md',
        clickable && 'cursor-pointer active:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Subcomponentes para estructura común
Card.Header = ({ className, children, ...props }) => (
  <div
    className={clsx('pb-4 border-b border-brown-100', className)}
    {...props}
  >
    {children}
  </div>
)

Card.Title = ({ className, children, ...props }) => (
  <h3
    className={clsx('text-lg font-semibold text-brown-900', className)}
    {...props}
  >
    {children}
  </h3>
)

Card.Body = ({ className, children, ...props }) => (
  <div className={clsx('py-4', className)} {...props}>
    {children}
  </div>
)

Card.Footer = ({ className, children, ...props }) => (
  <div
    className={clsx('pt-4 border-t border-brown-100', className)}
    {...props}
  >
    {children}
  </div>
)

export default Card
