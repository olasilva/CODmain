export default function ImagePlaceholder({ label, className = '', rounded = 'rounded-2xl' }) {
  return (
    <div className={`img-placeholder ${rounded} ${className}`}>
      <span>{label}</span>
    </div>
  )
}
