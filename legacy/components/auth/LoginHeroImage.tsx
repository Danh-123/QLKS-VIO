export function LoginHeroImage() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-15 md:hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')",
        }}
        aria-hidden
      />

      <aside
        className="relative hidden h-screen w-1/2 overflow-hidden md:block"
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')",
            filter: 'grayscale(0.8) saturate(0.35)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/40" />

        <div className="absolute bottom-12 left-12 right-10 text-vio-white">
          <p className="max-w-md font-heading text-3xl font-normal leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            True luxury is found in the details.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.1em] text-vio-white/80">
            Grand Aurelia Hotel
          </p>
        </div>
      </aside>
    </>
  )
}
