/**
 * Picture — WebP with original fallback.
 * Assumes a WebP counterpart exists at the same path with .webp extension.
 * If not available, the browser falls back to the original via <img>.
 */
export default function Picture({
  src,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  width,
  height,
}) {
  if (!src) return null
  const webp = src.replace(/\.(jpe?g|png)(\?.*)?$/i, '.webp$2')
  const hasWebp = webp !== src
  return (
    <picture className={className}>
      {hasWebp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      />
    </picture>
  )
}
