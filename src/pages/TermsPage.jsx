import SEO from '../components/SEO'
import { SITE_NAME, EMAIL, ADDRESS } from '../lib/siteConfig'
import './LegalPage.css'

export default function TermsPage() {
  return (
    <div className="legal-page">
      <SEO
        title="Términos y condiciones"
        description={`Condiciones de uso del sitio web de ${SITE_NAME}.`}
        url="/terminos"
      />
      <div className="container legal-page__inner">
        <p className="eyebrow legal-page__eyebrow">Legal</p>
        <h1 className="display-xl legal-page__title">Términos y condiciones.</h1>
        <p className="legal-page__updated">Última actualización: junio 2026</p>

        <section>
          <h2>Uso del sitio</h2>
          <p>
            Este sitio web es operado por {SITE_NAME} ({ADDRESS.display}) con
            fines informativos: presentar nuestro inventario de vehículos y
            facilitar el contacto con nuestro equipo. Al usarlo aceptas estos
            términos.
          </p>
        </section>

        <section>
          <h2>Información del inventario</h2>
          <ul>
            <li>
              Los precios se publican en dólares estadounidenses (USD); el
              equivalente en pesos dominicanos (DOP) es referencial y depende
              de la tasa de cambio vigente al momento de la operación.
            </li>
            <li>
              La disponibilidad, especificaciones y precios de los vehículos
              pueden cambiar sin previo aviso. La información publicada no
              constituye una oferta vinculante.
            </li>
            <li>
              Toda compraventa se formaliza únicamente mediante contrato
              firmado entre las partes.
            </li>
          </ul>
        </section>

        <section>
          <h2>Calculadora de financiamiento</h2>
          <p>
            Las cuotas estimadas por la calculadora son ilustrativas y no
            constituyen una oferta de crédito. Las condiciones finales de
            financiamiento dependen de la entidad financiera que apruebe la
            solicitud.
          </p>
        </section>

        <section>
          <h2>Propiedad intelectual</h2>
          <p>
            El nombre, logo y contenidos de este sitio son propiedad de{' '}
            {SITE_NAME}. No está permitida su reproducción con fines
            comerciales sin autorización escrita.
          </p>
        </section>

        <section>
          <h2>Limitación de responsabilidad</h2>
          <p>
            {SITE_NAME} no se hace responsable por decisiones tomadas
            exclusivamente con base en la información publicada en este sitio.
            Te invitamos a verificar cualquier dato directamente con nuestro
            equipo antes de concretar una operación.
          </p>
        </section>

        <section>
          <h2>Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, escríbenos a{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
