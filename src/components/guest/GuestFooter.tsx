export function GuestFooter() {
  return (
    <footer className="border-t border-vio-navy/[0.06] bg-vio-white/80">
      <div className="vio-container py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-2xl font-medium tracking-wide text-vio-navy">VIO</p>
            <p className="mt-4 text-sm leading-relaxed tracking-[0.02em] text-vio-navy/55">
              Nghỉ dưỡng sang trọng, không gian dịu và ánh sáng tự nhiên.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-vio-navy/45">Lưu trú</p>
            <ul className="mt-4 space-y-3 text-sm text-vio-navy/60">
              <li>Deluxe Collection</li>
              <li>Executive Suites</li>
              <li>Private Villas</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-vio-navy/45">Liên hệ</p>
            <ul className="mt-4 space-y-3 text-sm text-vio-navy/60">
              <li>reservations@vio.vn</li>
              <li>+84 28 1234 5678</li>
              <li>Vinh Hy Bay, Viet Nam</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-vio-navy/45">Kết nối</p>
            <ul className="mt-4 space-y-3 text-sm text-vio-navy/60">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Journal</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-vio-navy/[0.06] pt-6 text-xs tracking-[0.2em] text-vio-navy/35">
          © {new Date().getFullYear()} VIO · Private Collection
        </p>
      </div>
    </footer>
  )
}
