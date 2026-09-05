export default function ProfileSection({ title, description, children, action }) {
  return (
    <section aria-labelledby={`${title.toLowerCase().replaceAll(' ', '-')}-heading`} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h2 id={`${title.toLowerCase().replaceAll(' ', '-')}-heading`} className="text-lg font-bold text-text-heading">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  )
}
