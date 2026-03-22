export function GuestFooter() {
  return (
    <footer className="border-t border-vio-navy/[0.06] bg-vio-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-10 md:py-24">
        <div>
          <p className="font-heading text-xl text-vio-navy">VIO</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-vio-navy/50">
            Nghỉ dưỡng sang trọng, không gian dịu và ánh sáng tự nhiên — từng
            chi tiết được chăm chút.
          </p>
        </div>
        <p className="text-xs tracking-[0.2em] text-vio-navy/35">
          © {new Date().getFullYear()} VIO · Private Collection
        </p>
      </div>
    </footer>
  )
}
