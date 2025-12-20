import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

/**
 * Página de Preguntas Frecuentes (FAQ)
 */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      categoria: 'Sobre la Adopción',
      preguntas: [
        {
          pregunta: '¿Cuáles son los requisitos para adoptar?',
          respuesta: 'Debes ser mayor de 18 años, contar con un espacio adecuado para el animal, tener estabilidad económica para cubrir sus necesidades básicas (alimentación, salud), y comprometerte a brindarle amor y cuidados durante toda su vida.'
        },
        {
          pregunta: '¿La adopción tiene algún costo?',
          respuesta: 'La adopción es gratuita. Sin embargo, todos nuestros animales se entregan castrados, vacunados y desparasitados. Aceptamos donaciones voluntarias que nos ayudan a seguir rescatando animales.'
        },
        {
          pregunta: '¿Cuánto tiempo demora el proceso de adopción?',
          respuesta: 'El proceso suele demorar entre 3 a 7 días. Incluye la revisión de tu solicitud, una entrevista (puede ser virtual), y coordinamos una visita para que conozcas al animal antes de la adopción definitiva.'
        },
        {
          pregunta: '¿Puedo adoptar si vivo en departamento?',
          respuesta: 'Sí, muchos de nuestros animales se adaptan perfectamente a departamentos. Evaluamos cada caso en particular según el tamaño y necesidades del animal. Lo importante es que tenga espacio suficiente y reciba paseos diarios si es un perro.'
        },
        {
          pregunta: '¿Qué pasa si ya tengo otras mascotas?',
          respuesta: 'No es un impedimento. En la ficha de cada animal indicamos si socializa bien con otros perros o gatos. Podemos coordinar una presentación previa para asegurarnos de que sean compatibles.'
        }
      ]
    },
    {
      categoria: 'Sobre los Animales',
      preguntas: [
        {
          pregunta: '¿Los animales están vacunados y castrados?',
          respuesta: 'Sí, todos nuestros animales se entregan con el esquema de vacunación al día (o en proceso en el caso de cachorros), desparasitados y castrados. En caso de cachorros muy pequeños, se coordina la castración cuando tengan la edad adecuada.'
        },
        {
          pregunta: '¿Qué edad tienen los animales disponibles?',
          respuesta: 'Tenemos animales de todas las edades: desde cachorros de pocos meses hasta adultos mayores. Cada etapa tiene sus ventajas. Los adultos suelen ser más tranquilos y ya están educados.'
        },
        {
          pregunta: '¿Puedo conocer al animal antes de decidir?',
          respuesta: 'Por supuesto. Coordinamos visitas para que puedas conocer al animal, interactuar con él y asegurarte de que sea el indicado para vos y tu familia.'
        },
        {
          pregunta: '¿Qué incluye la adopción?',
          respuesta: 'Entregamos al animal con su cartilla de vacunación, certificado de castración (o compromiso de castración), y toda la información sobre su historia, personalidad y cuidados específicos.'
        }
      ]
    },
    {
      categoria: 'Después de la Adopción',
      preguntas: [
        {
          pregunta: '¿Qué pasa si no puedo seguir cuidando al animal?',
          respuesta: 'Te pedimos que nos contactes antes de tomar cualquier decisión. Podemos ayudarte a buscar soluciones o, en último caso, el animal puede volver al refugio. Nunca lo abandones en la calle.'
        },
        {
          pregunta: '¿Hacen seguimiento post-adopción?',
          respuesta: 'Sí, realizamos seguimiento durante los primeros meses para asegurarnos de que tanto el animal como la familia se estén adaptando bien. Estamos disponibles para consultas en cualquier momento.'
        },
        {
          pregunta: '¿Ofrecen asesoramiento sobre cuidados?',
          respuesta: 'Sí, brindamos orientación sobre alimentación, salud, educación y cualquier duda que tengas. También podemos recomendarte veterinarios y entrenadores de confianza.'
        }
      ]
    },
    {
      categoria: 'Cómo Colaborar',
      preguntas: [
        {
          pregunta: '¿Cómo puedo ayudar si no puedo adoptar?',
          respuesta: 'Hay muchas formas de ayudar: ser voluntario, hacer donaciones de alimento o dinero, ser hogar de tránsito temporal, o simplemente compartir nuestras publicaciones para dar visibilidad a los animales.'
        },
        {
          pregunta: '¿Qué es un hogar de tránsito?',
          respuesta: 'Es un hogar temporal que cuida al animal mientras busca familia definitiva. El refugio cubre los gastos de alimentación y salud. Es una gran ayuda ya que nos permite rescatar más animales.'
        },
        {
          pregunta: '¿Aceptan donaciones?',
          respuesta: 'Sí, aceptamos donaciones de alimento balanceado, medicamentos, mantas, juguetes, y también donaciones monetarias que destinamos a gastos veterinarios y mantenimiento del refugio.'
        }
      ]
    }
  ]

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  let globalIndex = 0

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brown-800 to-brown-900 text-white py-16 md:py-20">
        <div className="container-app text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg md:text-xl text-brown-200 max-w-2xl mx-auto">
            Respondemos las dudas más comunes sobre el proceso de adopción
            y cómo podés ayudar.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-16">
        <div className="container-app max-w-4xl">
          {faqs.map((categoria, catIndex) => (
            <div key={catIndex} className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-brown-900 mb-4 pb-2 border-b-2 border-terracotta-200">
                {categoria.categoria}
              </h2>
              <div className="space-y-3">
                {categoria.preguntas.map((item, qIndex) => {
                  const currentIndex = globalIndex++
                  const isOpen = openIndex === currentIndex

                  return (
                    <div
                      key={qIndex}
                      className="bg-white rounded-xl border border-brown-100 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(currentIndex)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-warm-50 transition-colors"
                      >
                        <span className="font-medium text-brown-900">
                          {item.pregunta}
                        </span>
                        <ChevronDown
                          className={clsx(
                            'w-5 h-5 text-brown-400 flex-shrink-0 transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      <div
                        className={clsx(
                          'overflow-hidden transition-all duration-200',
                          isOpen ? 'max-h-96' : 'max-h-0'
                        )}
                      >
                        <p className="px-5 pb-4 text-brown-600 leading-relaxed">
                          {item.respuesta}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-terracotta-50">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
            ¿Tenés otra pregunta?
          </h2>
          <p className="text-brown-600 mb-6 max-w-xl mx-auto">
            Si no encontraste la respuesta que buscabas, no dudes en contactarnos.
            Estamos para ayudarte.
          </p>
          <a
            href="mailto:contacto@patitasfelices.org"
            className="inline-flex px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
          >
            Envianos un mensaje
          </a>
        </div>
      </section>
    </div>
  )
}

export default FAQ
