import { useState, useEffect, useCallback, type ChangeEvent } from 'react'
import { Heart, Trash2, Edit3, Calendar, Upload, X, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { casosExitoApi } from '@/infrastructure/api/casosexito-api'
import api from '@/infrastructure/api/axios-client'
import { formatDate } from '@/shared/utils/formatters'
import { Button, Card, Spinner, Alert, Modal } from '@/presentation/components/ui'
import type { CasoExito } from '@/domain/entities/success-case'

interface EditFormData {
  titulo: string
  historia: string
  fecha_adopcion: string
  foto_actual_1: string | null
  foto_actual_2: string | null
  foto_actual_3: string | null
}

function CasosExitoAdmin() {
  const [casos, setCasos] = useState<CasoExito[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edición
  const [editingCaso, setEditingCaso] = useState<CasoExito | null>(null)
  const [editForm, setEditForm] = useState<EditFormData>({
    titulo: '', historia: '', fecha_adopcion: '',
    foto_actual_1: null, foto_actual_2: null, foto_actual_3: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState<number | null>(null)

  // Eliminación
  const [deleteTarget, setDeleteTarget] = useState<CasoExito | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCasos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const orgGroups = await casosExitoApi.getAll()
      // Aplanar todos los casos de todas las orgs
      const allCasos = orgGroups.flatMap(g => g.casos)
      setCasos(allCasos.sort((a, b) =>
        new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
      ))
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Error al cargar casos de éxito')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCasos()
  }, [fetchCasos])

  // Abrir edición
  const openEdit = (caso: CasoExito) => {
    setEditingCaso(caso)
    setEditForm({
      titulo: caso.titulo,
      historia: caso.historia,
      fecha_adopcion: caso.fecha_adopcion.split('T')[0],
      foto_actual_1: caso.foto_actual_1,
      foto_actual_2: caso.foto_actual_2,
      foto_actual_3: caso.foto_actual_3,
    })
  }

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingCaso) return
    if (!editForm.titulo.trim() || !editForm.historia.trim()) {
      toast.error('El título y la historia son obligatorios')
      return
    }

    setIsSubmitting(true)
    try {
      await casosExitoApi.update(editingCaso.id, editForm)
      toast.success('Caso de éxito actualizado')
      setEditingCaso(null)
      fetchCasos()
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Error al actualizar')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Subir foto
  const handlePhotoUpload = async (index: number, file: File | undefined) => {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB')
      return
    }

    setUploadingPhoto(index)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await api.post<{ success: boolean; data: { url: string } }>('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        const key = `foto_actual_${index + 1}` as keyof EditFormData
        setEditForm(prev => ({ ...prev, [key]: response.data.data.url }))
        toast.success('Foto subida')
      }
    } catch {
      toast.error('Error al subir la foto')
    } finally {
      setUploadingPhoto(null)
    }
  }

  const removeEditPhoto = (index: number) => {
    const key = `foto_actual_${index + 1}` as keyof EditFormData
    setEditForm(prev => ({ ...prev, [key]: null }))
  }

  // Eliminar
  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await casosExitoApi.delete(deleteTarget.id)
      toast.success('Caso de éxito eliminado')
      setDeleteTarget(null)
      fetchCasos()
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Error al eliminar')
    } finally {
      setIsDeleting(false)
    }
  }

  const editPhotos = [editForm.foto_actual_1, editForm.foto_actual_2, editForm.foto_actual_3]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          Casos de Éxito
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          {!isLoading && `${casos.length} casos publicados`}
        </p>
      </div>

      {isLoading && <Spinner center text="Cargando casos de éxito..." />}

      {error && !isLoading && (
        <Alert variant="error" title="Error">{error}</Alert>
      )}

      {!isLoading && !error && casos.length === 0 && (
        <Card className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-brown-300" />
          <h3 className="text-lg font-semibold text-brown-900 mb-2">
            No hay casos de éxito
          </h3>
          <p className="text-brown-500">
            Los casos se crean cuando marcás un animal como adoptado
          </p>
        </Card>
      )}

      {!isLoading && !error && casos.length > 0 && (
        <div className="space-y-4">
          {casos.map((caso) => (
            <Card key={caso.id} className="p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Foto */}
                <div className="sm:w-40 sm:h-40 h-48 flex-shrink-0">
                  <img
                    src={caso?.foto_actual_1 || caso?.animal?.foto_principal || ''}
                    alt={caso.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-brown-900 truncate">
                        {caso.titulo}
                      </h3>
                      <p className="text-sm text-brown-500 mt-1">
                        Animal: <strong>{caso.animal.nombre}</strong> ({caso.animal.especie})
                      </p>
                      <p className="text-sm text-brown-600 mt-2 line-clamp-2">
                        {caso.historia}
                      </p>
                      <p className="text-xs text-brown-400 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Adopción: {formatDate(caso.fecha_adopcion)}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(caso)}
                        className="p-2 text-brown-400 hover:text-terracotta-500 hover:bg-terracotta-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(caso)}
                        className="p-2 text-brown-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <Modal
        isOpen={!!editingCaso}
        onClose={() => setEditingCaso(null)}
        title="Editar caso de éxito"
        size="lg"
        closeOnOverlay={false}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Título *</label>
            <input
              type="text"
              value={editForm.titulo}
              onChange={(e) => setEditForm(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Historia *</label>
            <textarea
              value={editForm.historia}
              onChange={(e) => setEditForm(prev => ({ ...prev, historia: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Fecha de adopción *</label>
            <input
              type="date"
              value={editForm.fecha_adopcion}
              onChange={(e) => setEditForm(prev => ({ ...prev, fecha_adopcion: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors"
            />
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-2">Fotos actuales</label>
            <div className="grid grid-cols-3 gap-3">
              {editPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl border-2 border-dashed border-brown-200 overflow-hidden relative bg-brown-50"
                >
                  {photo ? (
                    <>
                      <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEditPhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4 text-brown-600" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-brown-100 transition-colors">
                      {uploadingPhoto === index ? (
                        <div className="w-6 h-6 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-brown-400 mb-1" />
                          <span className="text-xs text-brown-400">Subir</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handlePhotoUpload(index, e.target.files?.[0])}
                        className="hidden"
                        disabled={uploadingPhoto !== null}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingCaso(null)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal.Confirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar caso de éxito"
        message={`¿Estás seguro de eliminar "${deleteTarget?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CasosExitoAdmin
