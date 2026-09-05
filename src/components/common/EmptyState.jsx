import { Inbox } from 'lucide-react'
import Button from './Button.jsx'

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
    <Inbox className="mx-auto text-primary" aria-hidden="true" />
    <h2 className="mt-3 text-lg font-bold text-text-heading">{title}</h2>
    {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">{description}</p>}
    {action && <Button to={action.to} className="mt-5">{action.label}</Button>}
  </div>
}
