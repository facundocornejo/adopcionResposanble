import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { Button } from '../ui'
import { ESPECIES, TAMANIOS, ESTADOS_ANIMAL } from '../../utils/constants'

/**
 * Filtros para el catálogo de animales
 * Mobile-first: en móvil se expanden/colapsan
 */
const AnimalFilters = ({ filters, onFilterChange, totalResults }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      busqueda: '',
      especie: '',
      tamanio: '',
      estado: '',
    })
  }

  const hasActiveFilters = filters.especie || filters.tamanio || filters.estado

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      {/* Barra de búsqueda - Siempre visible */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.busqueda || ''}
            onChange={(e) => handleChange('busqueda', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-brown-200 rounded-xl text-brown-900 placeholder:text-brown-400 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
          />
        </div>

        {/* Botón de filtros en móvil */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            'md:hidden flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors',
            hasActiveFilters
              ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600'
              : 'border-brown-200 text-brown-600'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-terracotta-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filtros - Siempre visibles en desktop, colapsables en móvil */}
      <div className={clsx(
        'mt-4 grid gap-3',
        'md:grid-cols-4 md:mt-4',
        isExpanded ? 'grid-cols-1' : 'hidden md:grid'
      )}>
        {/* Especie */}
        <select
          value={filters.especie || ''}
          onChange={(e) => handleChange('especie', e.target.value)}
          className="w-full px-4 py-2.5 border border-brown-200 rounded-xl text-brown-700 focus:outline-none focus:border-terracotta-500 appearance-none bg-white"
        >
          <option value="">Todas las especies</option>
          {ESPECIES.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        {/* Tamaño */}
        <select
          value={filters.tamanio || ''}
          onChange={(e) => handleChange('tamanio', e.target.value)}
          className="w-full px-4 py-2.5 border border-brown-200 rounded-xl text-brown-700 focus:outline-none focus:border-terracotta-500 appearance-none bg-white"
        >
          <option value="">Todos los tamaños</option>
          {TAMANIOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Estado */}
        <select
          value={filters.estado || ''}
          onChange={(e) => handleChange('estado', e.target.value)}
          className="w-full px-4 py-2.5 border border-brown-200 rounded-xl text-brown-700 focus:outline-none focus:border-terracotta-500 appearance-none bg-white"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_ANIMAL.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        {/* Botón limpiar */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Contador de resultados */}
      {totalResults !== undefined && (
        <p className="text-sm text-brown-500 mt-4">
          {totalResults === 0
            ? 'No se encontraron animales'
            : `${totalResults} ${totalResults === 1 ? 'animal encontrado' : 'animales encontrados'}`
          }
        </p>
      )}
    </div>
  )
}

export default AnimalFilters
