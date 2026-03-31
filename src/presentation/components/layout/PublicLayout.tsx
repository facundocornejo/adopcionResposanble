import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

function PublicLayout() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 50)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main
        className={`flex-1 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
