import { clsx } from 'clsx'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

/**
 * Componente Alert para mensajes de feedback
 *
 * @param {object} props
 * @param {'info'|'success'|'warning'|'error'} props.variant - Tipo de alerta
 * @param {string} props.title - Título opcional
 * @param {boolean} props.dismissible - Si se puede cerrar
 * @param {function} props.onDismiss - Callback al cerrar
 * @param {React.ReactNode} props.children - Contenido
 */
const Alert = ({
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...props
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
    },
    success: {
      container: 'bg-sage-100 border-sage-200 text-sage-800',
      icon: CheckCircle,
      iconColor: 'text-sage-600',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500',
    },
  }

  const { container, icon: Icon, iconColor } = variants[variant]

  return (
    <div
      role="alert"
      className={clsx(
        'flex gap-3 p-4 border rounded-xl',
        container,
        className
      )}
      {...props}
    >
      {/* Ícono */}
      <div className={clsx('flex-shrink-0', iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium mb-1">{title}</h4>
        )}
        <div className={clsx(title && 'text-sm opacity-90')}>
          {children}
        </div>
      </div>

      {/* Botón cerrar */}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={clsx(
            'flex-shrink-0 p-1 rounded-lg transition-colors',
            'hover:bg-white/50'
          )}
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
