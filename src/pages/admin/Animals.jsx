import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye, PawPrint, MoreVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { animalsService } from '../../services'
import { ESPECIES, ESTADOS_ANIMAL } from '../../utils/constants'
import { Button, Badge, Spinner, Alert, Modal, Card } from '../../components/ui'

/**
 * Página de gestión de animales (admin)
 * Lista todos los animales con filtros, búsqueda y acciones CRUD
 */
const Animals = () => {
  const [animals, setAnimals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtros
  const [filters, setFilters] = useState({
    busqueda: '',
    especie: '',
    estado: '',
  })

  // Modal de confirmación para eliminar
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    animal: null,
    isDeleting: false,
  })

  // Cargar animales
  const fetchAnimals = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await animalsService.getAll(filters)
      setAnimals(data)
    } catch (err) {
      setError(err.message || 'Error al cargar animales')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAnimals()
  }, [fetchAnimals])

  // Manejar cambio de filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Cambiar estado de animal
  const handleStatusChange = async (animal, newStatus) => {
    try {
      await animalsService.updateStatus(animal.id, newStatus)
      toast.success(`${animal.nombre} ahora está "${newStatus}"`)
      fetchAnimals()
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado')
    }
  }

  // Abrir modal de eliminar
  const openDeleteModal = (animal) => {
    setDeleteModal({ isOpen: true, animal, isDeleting: false })
  }

  // Cerrar modal de eliminar
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, animal: null, isDeleting: false })
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.animal) return

    setDeleteModal(prev => ({ ...prev, isDeleting: true }))

    try {
      await animalsService.delete(deleteModal.animal.id)
      toast.success(`${deleteModal.animal.nombre} eliminado`)
      closeDeleteModal()
      fetchAnimals()
    } catch (err) {
      toast.error(err.message || 'Error al eliminar')
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
            Animales
          </h1>
          <p className="text-brown-500 text-sm mt-1">
            {!isLoading && `${animals.length} animales registrados`}
          </p>
        </div>
        <Link to="/admin/animals/new">
          <Button leftIcon={<Plus className="w-5 h-5" />}>
            Nuevo Animal
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
            <input
              type="text"
              value={filters.busqueda}
              onChange={(e) => handleFilterChange('busqueda', e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors"
            />
          </div>
          <select
            value={filters.especie}
            onChange={(e) => handleFilterChange('especie', e.target.value)}
            className="px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors bg-white"
          >
            <option value="">Todas las especies</option>
            {ESPECIES.map(e => (
              <option key={e} value={e}>{e}s</option>
            ))}
          </select>
          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 transition-colors bg-white"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_ANIMAL.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Estado de carga */}
      {isLoading && <Spinner center text="Cargando animales..." />}

      {/* Error */}
      {error && !isLoading && (
        <Alert variant="error" title="Error al cargar">
          {error}
        </Alert>
      )}

      {/* Lista vacía */}
      {!isLoading && !error && animals.length === 0 && (
        <Card className="text-center py-12">
          <PawPrint className="w-16 h-16 mx-auto mb-4 text-brown-300" />
          <h3 className="text-lg font-semibold text-brown-900 mb-2">
            No hay animales
          </h3>
          <p className="text-brown-500 mb-4">
            {filters.busqueda || filters.especie || filters.estado
              ? 'No se encontraron animales con esos filtros'
              : 'Agregá el primer animal para empezar'}
          </p>
          {!filters.busqueda && !filters.especie && !filters.estado && (
            <Link to="/admin/animals/new">
              <Button>Agregar Animal</Button>
            </Link>
          )}
        </Card>
      )}

      {/* Lista de animales */}
      {!isLoading && !error && animals.length > 0 && (
        <Card className="overflow-hidden p-0">
          {/* Tabla Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-50 border-b border-brown-100">
                <tr>
                  <th className="text-left p-4 font-medium text-brown-700">Animal</th>
                  <th className="text-left p-4 font-medium text-brown-700">Especie</th>
                  <th className="text-left p-4 font-medium text-brown-700">Tamaño</th>
                  <th className="text-left p-4 font-medium text-brown-700">Estado</th>
                  <th className="text-right p-4 font-medium text-brown-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown-100">
                {animals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-warm-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {animal.foto_principal ? (
                          <img
                            src={animal.foto_principal}
                            alt={animal.nombre}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-brown-100 rounded-lg flex items-center justify-center">
                            <PawPrint className="w-5 h-5 text-brown-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-brown-900">{animal.nombre}</p>
                          <p className="text-sm text-brown-500">{animal.edad_aproximada}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-brown-600">{animal.especie}</td>
                    <td className="p-4 text-brown-600">{animal.tamanio}</td>
                    <td className="p-4">
                      <select
                        value={animal.estado}
                        onChange={(e) => handleStatusChange(animal, e.target.value)}
                        className={`text-sm font-medium px-3 py-1 rounded-full border-0 cursor-pointer
                          ${animal.estado === 'Disponible' ? 'bg-sage-100 text-sage-700' : ''}
                          ${animal.estado === 'En proceso' ? 'bg-amber-100 text-amber-700' : ''}
                          ${animal.estado === 'Adoptado' ? 'bg-terracotta-100 text-terracotta-700' : ''}
                          ${animal.estado === 'En tránsito' ? 'bg-sky-100 text-sky-700' : ''}
                        `}
                      >
                        {ESTADOS_ANIMAL.map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/animal/${animal.id}`}
                          target="_blank"
                          className="p-2 text-brown-500 hover:text-brown-700 hover:bg-brown-100 rounded-lg transition-colors"
                          title="Ver en sitio"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/animals/${animal.id}/edit`}
                          className="p-2 text-terracotta-500 hover:text-terracotta-700 hover:bg-terracotta-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(animal)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden divide-y divide-brown-100">
            {animals.map((animal) => (
              <div key={animal.id} className="p-4">
                <div className="flex items-start gap-3">
                  {animal.foto_principal ? (
                    <img
                      src={animal.foto_principal}
                      alt={animal.nombre}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-brown-100 rounded-xl flex items-center justify-center">
                      <PawPrint className="w-8 h-8 text-brown-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-brown-900">{animal.nombre}</p>
                        <p className="text-sm text-brown-500">
                          {animal.especie} · {animal.tamanio} · {animal.edad_aproximada}
                        </p>
                      </div>
                      <Badge variant={Badge.getAnimalVariant(animal.estado)} size="sm">
                        {animal.estado}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        to={`/admin/animals/${animal.id}/edit`}
                        className="flex-1 text-center py-2 text-sm font-medium text-terracotta-500 bg-terracotta-50 rounded-lg"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/animal/${animal.id}`}
                        target="_blank"
                        className="px-3 py-2 text-brown-500 bg-brown-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(animal)}
                        className="px-3 py-2 text-red-500 bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Eliminar animal"
      >
        <div className="space-y-4">
          <p className="text-brown-700">
            ¿Estás seguro de que querés eliminar a <strong>{deleteModal.animal?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={closeDeleteModal}
              disabled={deleteModal.isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={deleteModal.isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Animals
