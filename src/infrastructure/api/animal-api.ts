/**
 * Animal API Adapter
 * Implementa IAnimalRepository usando la API REST
 */

import api from './axios-client'
import type {
  Animal,
  AnimalInput,
  AnimalFilters,
  AnimalEstado
} from '@/domain/entities/animal'
import type {
  IAnimalRepository,
  AnimalsResponse
} from '@/domain/interfaces/animal-repository'
import type { ApiResponse } from '@/domain/interfaces/common'

// Tipo de respuesta de la API para animales
interface AnimalsApiResponse {
  animals: Animal[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface AnimalApiResponse {
  animal: Animal
}

class AnimalApi implements IAnimalRepository {
  async getAll(filters: AnimalFilters = {}): Promise<AnimalsResponse> {
    const params = new URLSearchParams()

    if (filters.especie) params.append('especie', filters.especie)
    if (filters.estado) params.append('estado', filters.estado)
    if (filters.tamanio) params.append('tamanio', filters.tamanio)
    if (filters.busqueda) params.append('busqueda', filters.busqueda)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = queryString ? `/api/animals?${queryString}` : '/api/animals'

    const response = await api.get<ApiResponse<AnimalsApiResponse>>(url)

    const data = response.data.data
    return {
      animales: data.animals,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages
      }
    }
  }

  async getById(id: number | string): Promise<Animal> {
    const response = await api.get<ApiResponse<AnimalApiResponse>>(`/api/animals/${id}`)
    return response.data.data.animal
  }

  async create(data: AnimalInput): Promise<Animal> {
    const response = await api.post<ApiResponse<AnimalApiResponse>>('/api/animals', data)
    return response.data.data.animal
  }

  async update(id: number | string, data: Partial<AnimalInput>): Promise<Animal> {
    const response = await api.put<ApiResponse<Animal>>(`/api/animals/${id}`, data)
    return response.data.data
  }

  async updateStatus(id: number | string, estado: AnimalEstado): Promise<Animal> {
    const response = await api.patch<ApiResponse<Animal>>(`/api/animals/${id}/status`, { estado })
    return response.data.data
  }

  async delete(id: number | string): Promise<void> {
    await api.delete(`/api/animals/${id}`)
  }
}

// Exportar instancia singleton
export const animalApi = new AnimalApi()

// También exportar la clase para testing
export { AnimalApi }
