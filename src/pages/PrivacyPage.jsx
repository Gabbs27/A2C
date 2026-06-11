import SEO from '../components/SEO'
import { SITE_NAME, EMAIL, PHONE_DISPLAY, ADDRESS } from '../lib/siteConfig'
import './LegalPage.css'

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <SEO
        title="Política de privacidad"
        description={`Cómo ${SITE_NAME} recopila, usa y protege tus datos personales.`}
        url="/privacidad"
      />
      <div className="container legal-page__inner">
        <p className="eyebrow legal-page__eyebrow">Legal</p>
        <h1 className="display-xl legal-page__title">Política de privacidad.</h1>
        <p className="legal-page__updated">Última actualización: junio 2026</p>

        <section>
          <h2>Quiénes somos</h2>
          <p>
            {SITE_NAME} es una concesionaria de vehículos con operación en{' '}
            {ADDRESS.display}. Esta política describe cómo tratamos la
            información personal que nos compartes al usar este sitio web o al
            contactarnos.
          </p>
        </section>

        <section>
          <h2>Información que recopilamos</h2>
          <ul>
            <li>
              Datos de contacto que nos envías voluntariamente por WhatsApp,
              teléfono o correo electrónico (nombre, teléfono, email).
            </li>
            <li>
              Información sobre el vehículo que te interesa comprar o vender.
            </li>
            <li>
              Datos técnicos básicos de navegación (tipo de dispositivo y
              páginas visitadas) necesarios para el funcionamiento del sitio.
            </li>
          </ul>
          <p>
            Este sitio no utiliza cookies de publicidad ni vende datos
            personales a terceros.
          </p>
        </section>

        <section>
          <h2>Cómo usamos tu información</h2>
          <ul>
            <li>Responder a tus consultas sobre compra, venta o servicio.</li>
            <li>Coordinar citas, inspecciones y entregas.</li>
            <li>Cumplir obligaciones legales y fiscales aplicables.</li>
          </ul>
        </section>

        <section>
          <h2>Conservación y seguridad</h2>
          <p>
            Conservamos la información solo durante el tiempo necesario para
            atender tu solicitud o cumplir requerimientos legales. Aplicamos
            medidas razonables de seguridad para protegerla contra acceso no
            autorizado.
          </p>
        </section>

        <section>
          <h2>Tus derechos</h2>
          <p>
            Puedes solicitar acceso, corrección o eliminación de tus datos
            personales en cualquier momento escribiendo a{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> o llamando al{' '}
            {PHONE_DISPLAY}.
          </p>
        </section>

        <section>
          <h2>Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La versión vigente
            estará siempre publicada en esta página con su fecha de
            actualización.
          </p>
        </section>
      </div>
    </div>
  )
}
