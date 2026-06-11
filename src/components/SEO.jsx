import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../lib/schema'

const DEFAULT_TITLE = 'A2C International — Vehículos premium en República Dominicana'
const DEFAULT_DESC =
  'Concesionaria de vehículos seleccionados con garantía internacional, financiamiento flexible y entrega en República Dominicana.'
const DEFAULT_OG = '/logo-dark.png'

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image,
  url,
  type = 'website',
  jsonLd,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} · A2C International` : DEFAULT_TITLE
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const resolvedImage = image || DEFAULT_OG
  const fullImage = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${SITE_URL}${resolvedImage}`
  // El logo cuadrado por defecto no funciona como tarjeta ancha
  const twitterCard = image ? 'summary_large_image' : 'summary'

  return (
    <Helmet>
      <html lang="es-DO" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="es_DO" />
      <meta property="og:site_name" content="A2C International" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
