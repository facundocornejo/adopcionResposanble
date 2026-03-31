import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  to?: string
  onClick?: () => void
  className?: string
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl md:text-2xl',
  lg: 'text-2xl md:text-3xl',
}

function Logo({ size = 'md', variant = 'dark', to = '/', onClick, className }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-brown-900' : 'text-white'

  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx('font-bold tracking-tight', sizes[size], textColor, className)}
    >
      Adopta<span className="text-terracotta-500">.</span>
    </Link>
  )
}

export default Logo
