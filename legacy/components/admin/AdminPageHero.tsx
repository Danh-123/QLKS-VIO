type AdminPageHeroProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
}

export function AdminPageHero({
  eyebrow,
  title,
  description,
  imageUrl,
}: AdminPageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <img
        src={imageUrl}
        alt=""
        className="h-[220px] w-full object-cover md:h-[240px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-vio-navy/80 via-vio-navy/50 to-vio-navy/20" />

      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-vio-gold">{eyebrow}</p>
          <h1 className="mt-3 font-heading text-4xl font-normal text-vio-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-vio-white/85 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
