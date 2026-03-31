/**
 * Upload API Adapter
 * Implementa IUploadService usando la API REST
 */

import api from './axios-client'
import type { IUploadService } from '@/domain/interfaces/upload-service'
import type { UploadResult, ApiResponse } from '@/domain/interfaces/common'

class UploadApi implements IUploadService {
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post<ApiResponse<UploadResult>>(
      '/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.data
  }

  async deleteImage(publicId: string): Promise<void> {
    // Reemplazar / por - en el publicId según documentación de la API
    const safePublicId = publicId.replace(/\//g, '-')
    await api.delete(`/api/upload/${safePublicId}`)
  }
}

// Exportar instancia singleton
export const uploadApi = new UploadApi()

// También exportar la clase para testing
export { UploadApi }
