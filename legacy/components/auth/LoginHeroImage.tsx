export function LoginHeroImage() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-5 md:hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')",
        }}
        aria-hidden
      />

      <aside
        className="relative hidden h-screen w-1/2 overflow-hidden bg-gray-100 md:block"
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')",
            filter: 'grayscale(0.9) contrast(0.95)',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-12 left-12 right-10">
          <p className="max-w-md font-light text-3xl leading-tight text-white">
            True luxury is found in the details.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.15em] text-white/70">
            Grand Aurelia Hotel
          </p>
        </div>
      </aside>
    </>
  )
}
