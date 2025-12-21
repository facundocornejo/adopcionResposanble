import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Building2,
  Plus,
  Users,
  PawPrint,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone
} from 'lucide-react'
import { Button, Card, Spinner, Alert, Badge } from '../../components/ui'
import api from '../../services/api'

/**
 * Panel super-admin: Lista de organizaciones
 */
const SuperAdminOrganizations = () => {
  const [organizaciones, setOrganizaciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrganizaciones = async () => {
    try {
      const response = await api.get('/api/super-admin/organizations')
      setOrganizaciones(response.data.data.organizaciones)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error al cargar organizaciones')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizaciones()
  }, [])

  const handleToggle = async (id) => {
    try {
      const response = await api.put(`/api/super-admin/organizations/${id}/toggle`)
      toast.success(response.data.data.message)
      fetchOrganizaciones()
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Error al actualizar')
    }
  }

  if (isLoading) {
    return <Spinner center text="Cargando organizaciones..." />
  }

  if (error) {
    return (
      <Alert variant="error" title="Error">
        {error}
      </Alert>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
            Organizaciones
          </h1>
          <p className="text-brown-500 text-sm mt-1">
            Gestionar refugios y rescatistas de la plataforma
          </p>
        </div>
        <Link to="/admin/super/organizations/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Nueva Organización
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-terracotta-500">
            {organizaciones.length}
          </p>
          <p className="text-sm text-brown-500">Total</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-sage-500">
            {organizaciones.filter(o => o.activa).length}
          </p>
          <p className="text-sm text-brown-500">Activas</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-brown-400">
            {organizaciones.filter(o => !o.activa).length}
          </p>
          <p className="text-sm text-brown-500">Inactivas</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-amber-500">
            {organizaciones.reduce((acc, o) => acc + o._count.animales, 0)}
          </p>
          <p className="text-sm text-brown-500">Animales</p>
        </Card>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {organizaciones.map((org) => (
          <Card key={org.id} className={!org.activa ? 'opacity-60' : ''}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-terracotta-500" />
                  <h3 className="font-semibold text-brown-900 text-lg">
                    {org.nombre}
                  </h3>
                  <Badge variant={org.activa ? 'success' : 'default'} size="sm">
                    {org.activa ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-brown-600">
                  {org.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {org.email}
                    </span>
                  )}
                  {org.telefono && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {org.telefono}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {org._count.administradores} admin(s)
                  </span>
                  <span className="flex items-center gap-1">
                    <PawPrint className="w-4 h-4" />
                    {org._count.animales} animales
                  </span>
                </div>

                {org.administradores.length > 0 && (
                  <div className="mt-2 text-xs text-brown-400">
                    Admins: {org.administradores.map(a => a.username).join(', ')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(org.id)}
                  title={org.activa ? 'Desactivar' : 'Activar'}
                >
                  {org.activa ? (
                    <ToggleRight className="w-6 h-6 text-sage-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-brown-400" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {organizaciones.length === 0 && (
          <Card className="text-center py-8">
            <Building2 className="w-12 h-12 text-brown-300 mx-auto mb-3" />
            <p className="text-brown-500">No hay organizaciones registradas</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SuperAdminOrganizations
