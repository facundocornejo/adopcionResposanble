/**
 * Get Animals Use Case
 * Obtiene la lista de animales con filtros opcionales
 */

import type { AnimalFilters } from '@/domain/entities/animal'
import type { IAnimalRepository, AnimalsResponse } from '@/domain/interfaces/animal-repository'

export class GetAnimalsUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(filters?: AnimalFilters): Promise<AnimalsResponse> {
    return this.animalRepository.getAll(filters)
  }
}

// Factory function para crear el use case con el repository por defecto
export function createGetAnimalsUseCase(repository: IAnimalRepository): GetAnimalsUseCase {
  return new GetAnimalsUseCase(repository)
}
