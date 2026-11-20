import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-canvas border-t border-ink/15 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-canvas/15">
          {/* Brand summary */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-canvas"
            >
              <img
                src="/images/marea-mark.svg"
                alt=""
                width={36}
                height={36}
                aria-hidden="true"
                className="w-9 h-9 rounded-full"
              />
              <span className="font-display text-2xl font-semibold tracking-[0.12em] text-canvas uppercase">
                Marea Travel
              </span>
            </Link>

            <p className="text-sm text-canvas/85 max-w-sm leading-relaxed">
              Joyería y accesorios minimalistas en acero inoxidable 316L pensados para resistir el
              agua de mar, la piscina y el clima colombiano.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-canvas/90">
              Navegación
            </h2>
            <ul className="space-y-2.5 text-sm text-canvas/85">
              <li>
                <Link
                  href="/#catalogo"
                  className="inline-block py-0.5 hover:text-canvas hover:underline underline-offset-4 focus-visible:outline-canvas"
                >
                  Colección
                </Link>
              </li>
              <li>
                <Link
                  href="/#materiales"
                  className="inline-block py-0.5 hover:text-canvas hover:underline underline-offset-4 focus-visible:outline-canvas"
                >
                  Acero quirúrgico 316L
                </Link>
              </li>
              <li>
                <Link
                  href="/#historia"
                  className="inline-block py-0.5 hover:text-canvas hover:underline underline-offset-4 focus-visible:outline-canvas"
                >
                  Nuestra historia
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com/mareatravel.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-0.5 hover:text-canvas hover:underline underline-offset-4 focus-visible:outline-canvas"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Honest payment & shipping details */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-canvas/90">
              Pagos y envíos en Colombia
            </h2>
            <p className="text-sm text-canvas/85 leading-relaxed">
              Coordinamos tu pedido directamente por WhatsApp con medios locales:
            </p>
            <p className="text-xs font-medium text-canvas/90 tracking-wide">
              Nequi · Daviplata · Transferencia Bancolombia · Contra entrega
            </p>
            <p className="text-xs text-canvas/80">
              Despachos nacionales de 2 a 5 días hábiles. Envío gratis desde $120.000 COP.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-canvas/80">
          <p>© {new Date().getFullYear()} Marea Travel Colombia. Todos los derechos reservados.</p>
          <Link
            href="/admin"
            className="inline-block py-0.5 text-canvas/85 hover:text-canvas underline underline-offset-4 transition-colors focus-visible:outline-canvas"
          >
            Panel administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
