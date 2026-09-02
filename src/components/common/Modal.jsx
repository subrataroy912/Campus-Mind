export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-text-heading/50 p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}><section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>{children}</section></div>
}
