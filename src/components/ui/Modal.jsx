import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

/**
 * Componente Modal reutilizable
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Si está abierto
 * @param {function} props.onClose - Función para cerrar
 * @param {string} props.title - Título del modal
 * @param {'sm'|'md'|'lg'|'xl'|'full'} props.size - Tamaño del modal
 * @param {boolean} props.closeOnOverlay - Cerrar al hacer click en overlay
 * @param {boolean} props.showCloseButton - Mostrar botón de cerrar
 * @param {React.ReactNode} props.children - Contenido
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
  children,
}) => {
  const modalRef = useRef(null)

  // Tamaños
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap básico
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm animate-fadeIn"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white rounded-2xl shadow-xl',
          'animate-fadeIn',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-brown-100">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-brown-900"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-brown-400 hover:text-brown-600 hover:bg-warm-50 rounded-lg transition-colors ml-auto"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

/**
 * Footer del modal para botones
 */
Modal.Footer = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 md:p-6 border-t border-brown-100 bg-warm-50',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

/**
 * Modal de confirmación prearmado
 */
Modal.Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}) => {
  const Button = require('./Button').default

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <p className="text-brown-600">{message}</p>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Modal
