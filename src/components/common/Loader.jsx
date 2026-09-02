export default function Loader({ label = 'Loading' }) {
  return <div className="flex items-center gap-2 text-text-muted" role="status"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="sr-only">{label}</span></div>
}
