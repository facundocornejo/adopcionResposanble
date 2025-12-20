import { useState, useEffect, useCallback } from 'react'
import { animalsService } from '../services'

/**
 * Hook personalizado para manejar animales
 * Encapsula la lógica de carga, filtros y estados
 */
export const useAnimals = (initialFilters = {}) => {
  const [animals, setAnimals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  // Función para cargar animales
  const fetchAnimals = useCallback(async (currentFilters = filters) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await animalsService.getAll(currentFilters)
      setAnimals(data)
    } catch (err) {
      setError(err.message || 'Error al cargar animales')
      setAnimals([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Cargar al montar y cuando cambian los filtros
  useEffect(() => {
    fetchAnimals()
  }, [fetchAnimals])

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchAnimals()
  }, [fetchAnimals])

  return {
    animals,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh,
    total: animals.length,
  }
}

/**
 * Hook para obtener un animal por ID
 */
export const useAnimal = (id) => {
  const [animal, setAnimal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await animalsService.getById(id)
        setAnimal(data)
      } catch (err) {
        setError(err.message || 'Error al cargar el animal')
        setAnimal(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimal()
  }, [id])

  return { animal, isLoading, error }
}

export default useAnimals
