import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { Share2, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  generateShareMessage,
  shareToWhatsApp,
  getFacebookShareUrl,
  shareNative,
  copyForInstagram,
  isMobile,
  type ShareableAnimal,
} from '@/shared/utils/share'

export interface ShareButtonsProps {
  animal: ShareableAnimal
  size?: 'sm' | 'md'
  /** @deprecated Se detecta mobile automáticamente */
  useNativeShare?: boolean
  className?: string
}

/**
 * Botones para compartir un animal en redes sociales
 * sm: solo iconos (para cards), md: icono + label con layout vertical en mobile
 */
function ShareButtons({ animal, size = 'md', className = '' }: ShareButtonsProps) {
  const message = generateShareMessage(animal)
  const mobile = isMobile()

  const handleWhatsApp = () => {
    shareToWhatsApp(message)
  }

  const handleFacebook = async () => {
    await navigator.clipboard.writeText(message)
    toast.success('Texto copiado. Abriendo Facebook...', { duration: 3000 })
    setTimeout(() => {
      window.open(getFacebookShareUrl(animal.id, message), '_blank', 'noopener,noreferrer')
    }, 1500)
  }

  const handleInstagram = async () => {
    if (mobile) {
      // En mobile: usar Web Share API que permite compartir a Instagram Stories
      const shared = await shareNative(animal)
      if (!shared) {
        // Fallback: copiar al clipboard
        await copyForInstagram(message)
        toast.success('Texto copiado. Pegalo en Instagram.', { duration: 3000 })
      }
    } else {
      // En desktop: copiar y abrir Instagram
      await copyForInstagram(message)
      toast.success('Texto copiado. Abriendo Instagram...', { duration: 3000 })
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
      }, 1500)
    }
  }

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(message)
    toast.success('Texto copiado al portapapeles')
  }

  const isSmall = size === 'sm'

  if (isSmall) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
          title="Compartir en WhatsApp"
        >
          <FaWhatsapp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleFacebook}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          title="Compartir en Facebook"
        >
          <FaFacebookF className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleInstagram}
          className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-colors"
          title={mobile ? 'Compartir en Instagram' : 'Copiar texto para Instagram'}
        >
          <FaInstagram className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleWhatsApp}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
      >
        <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
        <span>Compartir por WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleFacebook}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        <FaFacebookF className="w-5 h-5 flex-shrink-0" />
        <span>Compartir en Facebook</span>
      </button>

      <button
        type="button"
        onClick={handleInstagram}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white transition-colors"
      >
        {mobile ? (
          <>
            <Share2 className="w-5 h-5 flex-shrink-0" />
            <span>Compartir en Instagram Stories</span>
          </>
        ) : (
          <>
            <FaInstagram className="w-5 h-5 flex-shrink-0" />
            <span>Copiar texto para Instagram</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleCopyAll}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium bg-brown-100 hover:bg-brown-200 text-brown-700 transition-colors"
      >
        <Copy className="w-5 h-5 flex-shrink-0" />
        <span>Copiar texto</span>
      </button>
    </div>
  )
}

export default ShareButtons
