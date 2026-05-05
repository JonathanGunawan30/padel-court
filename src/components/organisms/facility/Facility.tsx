'use client'
import {
  BoltIcon,
  ShieldCheckIcon,
  TrophyIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { PADEL_IMAGES } from "@/constants/images";

const stats = [
  { value: "12+", label: "Padel Courts" },
  { value: "06–23", label: "Jam Operasi" },
  { value: "WPT", label: "Court Standard" },
  { value: "4.9", label: "Rating Pemain" },
];

const amenities = [
  "Glass Court Premium",
  "Lampu LED 1000 Lux",
  "Locker Room + Shower",
  "Pro Shop & Sewa Raket",
  "Cafe & Lounge",
  "Parkir Luas",
  "Mushola",
  "Free Wifi",
];

const highlights = [
  {
    icon: BoltIcon,
    title: "Court Spec Internasional",
    desc: "Kaca tempered 12mm, rumput sintetis berkualitas turnamen.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Aman & Terawat",
    desc: "Dibersihkan rutin, sirkulasi udara optimal untuk indoor.",
  },
  {
    icon: TrophyIcon,
    title: "Coach Bersertifikat",
    desc: "Tersedia private coaching & klinik padel reguler.",
  },
];

export default function Facility() {
  return (
    <section className="py-24 bg-padel-dark relative overflow-hidden" id="facility">
      {/* Decorative neon blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-padel-neon/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-padel-neon/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl lg:text-6xl italic text-white leading-[0.95]">
              DIRANCANG UNTUK<br />
              PEMAIN <span className="text-padel-neon">PADEL</span> SEJATI
            </h2>
          </div>
          <p className="text-white/60 font-medium max-w-md text-lg leading-relaxed">
            Bukan sekadar tempat sewa — kami bangun arena yang memenuhi standar
            World Padel Tour, lengkap dengan ekosistem komunitas dan coaching.
          </p>
        </div>

        {/* Bento layout: image + stats grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Big image */}
          <div className="lg:col-span-7 relative rounded-[2rem] overflow-hidden min-h-[420px]">
            <img
              src={PADEL_IMAGES.facility}
              alt="Padel Court"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-padel-dark via-padel-dark/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
              <p className="text-padel-neon font-black uppercase tracking-[0.2em] text-xs mb-3">
                Signature Court
              </p>
              <h3 className="font-display text-3xl lg:text-5xl italic text-white leading-[0.95] mb-4">
                CENTER COURT<br />
                <span className="text-padel-neon">ARENA</span>
              </h3>
              <p className="text-white/70 max-w-md font-medium">
                Lapangan utama dengan tribun penonton 100+ kursi untuk turnamen
                & pertandingan komunitas.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-[1.75rem] p-8 flex flex-col justify-between min-h-[200px] border ${
                  i % 3 === 0
                    ? "bg-padel-neon text-padel-dark border-padel-neon"
                    : "bg-white/5 text-white border-white/10"
                }`}
              >
                <span
                  className={`font-display text-5xl lg:text-6xl italic leading-none ${
                    i % 3 === 0 ? "text-padel-dark" : "text-white"
                  }`}
                >
                  {s.value}
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-[0.2em] mt-4 ${
                    i % 3 === 0 ? "text-padel-dark/70" : "text-white/50"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-3xl p-8 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-padel-neon text-padel-dark mb-6">
                <h.icon className="w-6 h-6" />
              </div>
              <h4 className="font-display text-white italic text-xl mb-2">
                {h.title}
              </h4>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Amenities pills */}
        <div className="md:flex md:flex-wrap md:items-center md:gap-3">
          <span className="hidden md:inline text-white/40 font-bold uppercase tracking-[0.2em] text-xs mr-2">
            Fasilitas:
          </span>
          <div className="md:hidden text-white/40 font-bold uppercase tracking-[0.2em] text-xs mb-3">
            Fasilitas:
          </div>
          <div className="flex md:contents gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 md:mx-0 md:px-0 md:pb-0 md:overflow-visible snap-x snap-mandatory">
            {amenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-semibold hover:border-padel-neon/40 hover:text-padel-neon transition-colors whitespace-nowrap flex-shrink-0 snap-start"
              >
                <CheckIcon className="w-4 h-4 text-padel-neon" />
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
