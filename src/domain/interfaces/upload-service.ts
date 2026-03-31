/**
 * Upload Service Interface (Port)
 * Define el contrato para subida de imágenes
 */

import type { UploadResult } from './common'

export interface IUploadService {
  /**
   * Sube una imagen al servidor
   * @param file Archivo de imagen (máx 5MB, JPEG/PNG/WEBP)
   * @returns URL e ID público de la imagen
   */
  uploadImage(file: File): Promise<UploadResult>

  /**
   * Elimina una imagen del servidor
   * @param publicId ID público de la imagen (con / reemplazado por -)
   */
  deleteImage(publicId: string): Promise<void>
}
