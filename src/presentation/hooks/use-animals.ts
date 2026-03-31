import { useState, useEffect, useCallback } from 'react'
import type { Animal, AnimalFilters } from '@/domain/entities/animal'
import { animalApi } from '@/infrastructure/api/animal-api'

interface UseAnimalsReturn {
  animals: Animal[]
  isLoading: boolean
  error: string | null
  filters: AnimalFilters
  updateFilters: (newFilters: AnimalFilters) => void
  refresh: () => void
  total: number
}

/**
 * Hook para manejar listado de animales con filtros
 */
export function useAnimals(initialFilters: AnimalFilters = {}): UseAnimalsReturn {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnimalFilters>(initialFilters)

  const fetchAnimals = useCallback(async (currentFilters: AnimalFilters = filters) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await animalApi.getAll(currentFilters)
      setAnimals(response.animales ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar animales'
      setError(message)
      setAnimals([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAnimals()
  }, [fetchAnimals])

  const updateFilters = useCallback((newFilters: AnimalFilters) => {
    setFilters(newFilters)
  }, [])

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

interface UseAnimalReturn {
  animal: Animal | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook para obtener un animal por ID
 */
export function useAnimal(id: number | string | undefined): UseAnimalReturn {
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await animalApi.getById(id)
        setAnimal(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar el animal'
        setError(message)
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
