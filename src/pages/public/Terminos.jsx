import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, Heart, CreditCard, Users, Scale } from 'lucide-react'

/**
 * Página de Términos y Condiciones
 * Incluye disclaimer legal sobre donaciones y uso de la plataforma
 */
const Terminos = () => {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-brown-800 to-brown-900 text-white py-12 md:py-16">
        <div className="container-app">
          <Link
            to="/"
            className="inline-flex items-center text-brown-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-brown-300 max-w-2xl">
            Por favor, leé atentamente estos términos antes de utilizar nuestra plataforma.
            Al usar este sitio, aceptás los siguientes términos y condiciones.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-12">
        <div className="container-app max-w-4xl">
          {/* Naturaleza de la plataforma */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-terracotta-600" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                1. Naturaleza de la Plataforma
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <p>
                <strong>Adopción Responsable</strong> es una plataforma tecnológica que actúa
                exclusivamente como <strong>intermediario digital</strong> entre rescatistas/refugios
                de animales y personas interesadas en adoptar.
              </p>
              <p>
                <strong>NO somos un refugio ni una organización de rescate.</strong> No tenemos
                la custodia, propiedad ni control sobre los animales publicados en la plataforma.
                Cada animal es responsabilidad exclusiva del rescatista u organización que lo publica.
              </p>
              <p>
                Nuestra función se limita a facilitar la conexión entre las partes, proporcionando
                un espacio para publicar animales en adopción y gestionar solicitudes.
              </p>
            </div>
          </div>

          {/* Deslinde de responsabilidad - Adopciones */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                2. Deslinde de Responsabilidad - Adopciones
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <p>
                <strong>Adopción Responsable</strong> no participa ni interviene en el proceso
                de adopción propiamente dicho. La evaluación, aprobación, entrega y seguimiento
                de cada animal es responsabilidad exclusiva del rescatista u organización correspondiente.
              </p>
              <p>
                <strong>No nos hacemos responsables por:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El estado de salud, comportamiento o condición de los animales publicados</li>
                <li>La veracidad de la información proporcionada por los rescatistas</li>
                <li>El resultado de las adopciones realizadas a través de la plataforma</li>
                <li>Conflictos que puedan surgir entre adoptantes y rescatistas</li>
                <li>El incumplimiento de acuerdos entre las partes</li>
                <li>Cualquier daño, perjuicio o pérdida derivada del uso de la plataforma</li>
              </ul>
              <p>
                Recomendamos a los adoptantes realizar su propia evaluación y verificación antes
                de proceder con cualquier adopción.
              </p>
            </div>
          </div>

          {/* Deslinde de responsabilidad - Donaciones */}
          <div className="bg-amber-50 rounded-2xl p-6 md:p-8 border border-amber-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                3. Deslinde de Responsabilidad - Donaciones
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <div className="bg-white rounded-xl p-4 border border-amber-300">
                <p className="font-semibold text-amber-800">
                  IMPORTANTE: Esta plataforma NO recibe, gestiona ni administra donaciones.
                </p>
              </div>
              <p>
                Los datos de donación mostrados en los perfiles de animales (alias de transferencia,
                CBU, cuentas de MercadoPago, etc.) son proporcionados directamente por cada
                rescatista u organización. Las transferencias se realizan de forma directa entre
                el donante y el rescatista.
              </p>
              <p>
                <strong>Adopción Responsable:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No recibe ningún porcentaje ni comisión de las donaciones</li>
                <li>No verifica la identidad ni la legitimidad de las cuentas de los rescatistas</li>
                <li>No garantiza el uso correcto de los fondos donados</li>
                <li>No puede realizar devoluciones ni reclamos sobre donaciones</li>
                <li>No se responsabiliza por posibles fraudes o uso indebido de fondos</li>
              </ul>
              <p className="font-medium text-amber-800">
                Las donaciones son voluntarias y a riesgo del donante. Recomendamos verificar
                la reputación y trayectoria del rescatista antes de realizar cualquier aporte económico.
              </p>
            </div>
          </div>

          {/* Uso de la plataforma */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-sage-600" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                4. Uso de la Plataforma
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <p>
                Al utilizar esta plataforma, los usuarios se comprometen a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar información veraz y actualizada</li>
                <li>No utilizar la plataforma con fines fraudulentos o ilegales</li>
                <li>Respetar a otros usuarios, rescatistas y adoptantes</li>
                <li>No publicar contenido falso, ofensivo o engañoso</li>
                <li>No suplantar la identidad de otras personas u organizaciones</li>
              </ul>
              <p>
                Nos reservamos el derecho de suspender o eliminar cuentas que incumplan
                estos términos sin previo aviso.
              </p>
            </div>
          </div>

          {/* Responsabilidades de los rescatistas */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-terracotta-600" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                5. Responsabilidades de los Rescatistas
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <p>
                Los rescatistas y organizaciones que publican animales en la plataforma son
                exclusivamente responsables de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La veracidad de la información publicada sobre los animales</li>
                <li>El estado de salud y bienestar de los animales bajo su cuidado</li>
                <li>La evaluación y selección de adoptantes</li>
                <li>El proceso de entrega y seguimiento post-adopción</li>
                <li>El cumplimiento de las leyes y normativas locales de protección animal</li>
                <li>El uso adecuado y transparente de las donaciones recibidas</li>
              </ul>
            </div>
          </div>

          {/* Limitación de responsabilidad */}
          <div className="bg-red-50 rounded-2xl p-6 md:p-8 border border-red-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Scale className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-brown-900">
                6. Limitación de Responsabilidad Legal
              </h2>
            </div>
            <div className="space-y-4 text-brown-700">
              <p>
                En la máxima medida permitida por la ley aplicable, <strong>Adopción Responsable</strong>,
                sus desarrolladores, colaboradores y operadores:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Quedan exentos de toda responsabilidad por daños directos, indirectos,
                  incidentales, consecuentes o punitivos derivados del uso de la plataforma
                </li>
                <li>
                  No garantizan la disponibilidad, continuidad o funcionamiento ininterrumpido
                  del servicio
                </li>
                <li>
                  No son responsables por la conducta de terceros que utilicen la plataforma
                </li>
              </ul>
              <p className="font-medium text-red-800">
                El uso de esta plataforma implica la aceptación total de estos términos y la
                renuncia a cualquier reclamo contra los operadores de la misma.
              </p>
            </div>
          </div>

          {/* Modificaciones */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-brown-900 mb-4">
              7. Modificaciones
            </h2>
            <p className="text-brown-700">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Las modificaciones serán efectivas desde su publicación en esta página.
              El uso continuado de la plataforma después de cualquier modificación
              constituye la aceptación de los nuevos términos.
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-brown-100 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-brown-900 mb-4">
              8. Contacto
            </h2>
            <p className="text-brown-700 mb-4">
              Si tenés preguntas sobre estos términos o querés reportar un uso indebido
              de la plataforma, podés contactarnos a través de:
            </p>
            <p className="text-brown-700">
              Email: <a href="mailto:contacto@adopcionresponsable.com" className="text-terracotta-500 hover:text-terracotta-600">
                contacto@adopcionresponsable.com
              </a>
            </p>
          </div>

          {/* Última actualización */}
          <p className="text-center text-sm text-brown-400 mt-8">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </section>
    </div>
  )
}

export default Terminos
