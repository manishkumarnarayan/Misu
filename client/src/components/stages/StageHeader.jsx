// Shared heading block for the three trials.
export default function StageHeader({ icon: Icon, kicker, title, children }) {
  return (
    <div className="card relative overflow-hidden rounded-3xl p-5 text-center sm:p-8">
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-200/50 blur-3xl" />
      <div aria-hidden className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="relative">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-pink-700">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {kicker}
        </span>
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        {children && <div className="mx-auto mt-2 max-w-md text-sm text-ink/70 sm:text-base">{children}</div>}
      </div>
    </div>
  )
}
