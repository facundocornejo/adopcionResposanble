/**
 * Update Animal Status Use Case
 * Cambia el estado de un animal (requiere auth)
 */

import type { Animal, AnimalEstado } from '@/domain/entities/animal'
import type { IAnimalRepository } from '@/domain/interfaces/animal-repository'

export class UpdateAnimalStatusUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(id: number | string, estado: AnimalEstado): Promise<Animal> {
    return this.animalRepository.updateStatus(id, estado)
  }
}
