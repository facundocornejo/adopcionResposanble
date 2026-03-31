/**
 * Animal Repository Interface (Port)
 * Define el contrato para acceso a datos de animales
 */

import type { Animal, AnimalInput, AnimalFilters, AnimalEstado } from '../entities/animal'
import type { Pagination } from './common'

export interface AnimalsResponse {
  animales: Animal[]
  pagination: Pagination
}

export interface IAnimalRepository {
  /**
   * Obtiene todos los animales con filtros opcionales
   * Sin auth: solo estados públicos (Disponible, En proceso, En transito)
   * Con auth: todos los de la organización
   */
  getAll(filters?: AnimalFilters): Promise<AnimalsResponse>

  /**
   * Obtiene un animal por su ID
   */
  getById(id: number | string): Promise<Animal>

  /**
   * Crea un nuevo animal (requiere auth)
   */
  create(data: AnimalInput): Promise<Animal>

  /**
   * Actualiza un animal existente (requiere auth)
   */
  update(id: number | string, data: Partial<AnimalInput>): Promise<Animal>

  /**
   * Cambia el estado de un animal (requiere auth)
   */
  updateStatus(id: number | string, estado: AnimalEstado): Promise<Animal>

  /**
   * Elimina un animal (soft delete, requiere auth)
   */
  delete(id: number | string): Promise<void>
}
