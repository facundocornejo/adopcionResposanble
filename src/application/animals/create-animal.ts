/**
 * Create Animal Use Case
 * Crea un nuevo animal (requiere auth)
 */

import type { Animal, AnimalInput } from '@/domain/entities/animal'
import type { IAnimalRepository } from '@/domain/interfaces/animal-repository'
import { ValidationError } from '@/domain/errors'

export class CreateAnimalUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(data: AnimalInput): Promise<Animal> {
    // Validaciones de negocio
    if (!data.nombre?.trim()) {
      throw new ValidationError('El nombre es requerido', 'nombre')
    }

    if (!data.foto_principal) {
      throw new ValidationError('La foto principal es requerida', 'foto_principal')
    }

    if (data.descripcion_historia && data.descripcion_historia.length < 50) {
      throw new ValidationError('La historia debe tener al menos 50 caracteres', 'descripcion_historia')
    }

    return this.animalRepository.create(data)
  }
}
