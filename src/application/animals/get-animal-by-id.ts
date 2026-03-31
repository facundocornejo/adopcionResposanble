/**
 * Get Animal By ID Use Case
 * Obtiene un animal específico por su ID
 */

import type { Animal } from '@/domain/entities/animal'
import type { IAnimalRepository } from '@/domain/interfaces/animal-repository'

export class GetAnimalByIdUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(id: number | string): Promise<Animal> {
    return this.animalRepository.getById(id)
  }
}
