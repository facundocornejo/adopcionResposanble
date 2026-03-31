import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X } from 'lucide-react'
import Button from './Button'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  closeOnOverlay?: boolean
  showCloseButton?: boolean
  className?: string
  children?: ReactNode
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

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

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
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
      <div
        className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm animate-fadeIn"
        onClick={handleOverlayClick}
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white rounded-2xl shadow-xl',
          'animate-scaleIn',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-brown-100">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-brown-900">
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

        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}

interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

Modal.Footer = function ModalFooter({ className, children, ...props }: FooterProps) {
  return (
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
}

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

Modal.Confirm = function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
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
