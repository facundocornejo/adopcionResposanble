import { type HTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'
import type { AnimalEstado } from '@/domain/entities/animal'
import type { SolicitudEstado } from '@/domain/entities/adoption-request'

export type BadgeVariant = 'sage' | 'amber' | 'purple' | 'sky' | 'red' | 'blue' | 'gray'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children?: ReactNode
}

const variants: Record<BadgeVariant, string> = {
  sage: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300',
  amber: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
  purple: 'bg-purple-100 text-purple-700 ring-1 ring-purple-300',
  sky: 'bg-sky-100 text-sky-700 ring-1 ring-sky-300',
  red: 'bg-red-100 text-red-700 ring-1 ring-red-300',
  blue: 'bg-blue-100 text-blue-700 ring-1 ring-blue-300',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-300',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
}

const dotColors: Record<BadgeVariant, string> = {
  sage: 'bg-emerald-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  sky: 'bg-sky-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
}

function Badge({
  variant = 'gray',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}

/**
 * Helper para obtener variante según estado de animal
 */
function getAnimalVariant(estado: AnimalEstado): BadgeVariant {
  const map: Record<AnimalEstado, BadgeVariant> = {
    Disponible: 'sage',
    'En proceso': 'amber',
    Adoptado: 'purple',
    'En transito': 'sky',
  }
  return map[estado] || 'gray'
}

/**
 * Helper para obtener variante según estado de solicitud
 */
function getRequestVariant(estado: SolicitudEstado): BadgeVariant {
  const map: Record<SolicitudEstado, BadgeVariant> = {
    Nueva: 'blue',
    Revisada: 'amber',
    'En evaluación': 'sky',
    Aprobada: 'sage',
    Rechazada: 'red',
  }
  return map[estado] || 'gray'
}

Badge.getAnimalVariant = getAnimalVariant
Badge.getRequestVariant = getRequestVariant

export default Badge
