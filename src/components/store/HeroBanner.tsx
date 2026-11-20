import { StoreImage } from "@/components/store/StoreImage";
import { HERO_VIDEO_MP4_SRC, HERO_VIDEO_POSTER_SRC, HERO_VIDEO_WEBM_SRC } from "@/lib/brand-assets";

export function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas border-b border-hairline min-h-[min(82svh,720px)] flex items-center">
      {/* Full-bleed ambient video background with LCP poster & reduced-motion fallback */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <StoreImage
          src={HERO_VIDEO_POSTER_SRC}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />

        <video
          className="hidden motion-safe:block absolute inset-0 h-full w-full object-cover object-center"
          width={1920}
          height={1080}
          poster={HERO_VIDEO_POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_WEBM_SRC} type="video/webm" />
          <source src={HERO_VIDEO_MP4_SRC} type="video/mp4" />
        </video>

        {/* Directional editorial scrim preserving brand canvas tone & WCAG text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/90 via-canvas/82 to-canvas/55 lg:bg-gradient-to-r lg:from-canvas/95 lg:via-canvas/78 lg:to-canvas/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/45 via-transparent to-transparent" />
      </div>

      {/* Editorial copy */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-text">
            Sol, sal y acero 316L · Colombia
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink tracking-tight leading-[1.06]">
            Joyería marina en acero 316L, hecha para el sol y la sal.
          </h1>

          <p className="text-base sm:text-lg text-ink-muted max-w-xl leading-relaxed">
            Accesorios minimalistas resistentes al agua de mar, la piscina y el uso diario. Sin
            manchas verdes ni cambios de tono, listos para viajar contigo por toda Colombia.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-ink text-canvas text-sm font-semibold hover:bg-ocean transition-colors"
            >
              Ver colección
            </a>
            <a
              href="#materiales"
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink transition-colors"
            >
              Por qué acero 316L
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
