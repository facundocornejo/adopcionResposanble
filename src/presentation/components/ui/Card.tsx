import { type HTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

export type CardVariant = 'default' | 'elevated' | 'outline'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  clickable?: boolean
  children?: ReactNode
}

const variants: Record<CardVariant, string> = {
  default: 'bg-white shadow-sm',
  elevated: 'bg-white shadow-md',
  outline: 'bg-white border border-brown-200',
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
}

function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  children,
  ...props
}: CardProps) {
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

interface SubComponentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

Card.Header = function CardHeader({ className, children, ...props }: SubComponentProps) {
  return (
    <div className={clsx('pb-4 border-b border-brown-100', className)} {...props}>
      {children}
    </div>
  )
}

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

Card.Title = function CardTitle({ className, children, ...props }: TitleProps) {
  return (
    <h3 className={clsx('text-lg font-semibold text-brown-900', className)} {...props}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ className, children, ...props }: SubComponentProps) {
  return (
    <div className={clsx('py-4', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ className, children, ...props }: SubComponentProps) {
  return (
    <div className={clsx('pt-4 border-t border-brown-100', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
