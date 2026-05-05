'use client'
import { PhotoIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { PADEL_IMAGES } from "@/constants/images";

type Tile = {
  src: string;
  label: string;
  tag: string;
  className: string; // grid placement classes
};

const tiles: Tile[] = [
  {
    src: PADEL_IMAGES.gallery.feature,
    label: "Center Court Arena",
    tag: "Indoor · Premium",
    className: "lg:col-span-7 lg:row-span-2 min-h-[400px] lg:min-h-0",
  },
  {
    src: PADEL_IMAGES.gallery.a,
    label: "Glass Court A",
    tag: "Indoor",
    className: "lg:col-span-5 min-h-[260px]",
  },
  {
    src: PADEL_IMAGES.gallery.b,
    label: "Twilight Court",
    tag: "Outdoor",
    className: "lg:col-span-3 min-h-[260px]",
  },
  {
    src: PADEL_IMAGES.gallery.c,
    label: "Open Air B",
    tag: "Outdoor",
    className: "lg:col-span-2 min-h-[260px]",
  },
  {
    src: PADEL_IMAGES.gallery.d,
    label: "Match Day",
    tag: "Action",
    className: "lg:col-span-4 min-h-[260px]",
  },
  {
    src: PADEL_IMAGES.gallery.e,
    label: "Pro Shop & Lounge",
    tag: "Facility",
    className: "lg:col-span-8 min-h-[260px]",
  },
];

export default function Gallery() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="gallery-list">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-padel-dark/60 mb-6">
              <PhotoIcon className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                Arena Gallery
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-6xl italic text-padel-dark leading-[0.95]">
              GALERI <span className="bg-padel-neon px-3">LAPANGAN</span><br />
              PADEL KAMI
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
            Setiap court dirancang berbeda — dari indoor premium dengan AC,
            hingga outdoor twilight untuk pengalaman bermain malam yang ikonik.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[260px] gap-4 lg:gap-5">
          {tiles.map((t) => (
            <div
              key={t.label}
              className={`group relative rounded-[1.75rem] overflow-hidden cursor-pointer ${t.className}`}
            >
              <img
                src={t.src}
                alt={t.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-padel-dark/90 via-padel-dark/20 to-transparent" />

              {/* Tag */}
              <div className="absolute top-5 left-5">
                <span className="inline-flex items-center gap-1.5 bg-padel-neon text-padel-dark px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em]">
                  {t.tag}
                </span>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-padel-neon group-hover:text-padel-dark transition-all duration-300">
                <ArrowUpRightIcon className="w-5 h-5" />
              </div>

              {/* Label */}
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="font-display text-white italic text-2xl lg:text-3xl leading-[0.95]">
                  {t.label.toUpperCase()}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
