import {
  RocketLaunchIcon,
  CalendarDaysIcon,
  TrophyIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const items = [
  {
    icon: RocketLaunchIcon,
    title: "Mudah & Cepat",
    desc: "Booking hanya dalam beberapa langkah.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Jadwal Fleksibel",
    desc: "Pilih waktu sesuai kebutuhanmu.",
  },
  {
    icon: TrophyIcon,
    title: "Lapangan Terbaik",
    desc: "Kualitas lapangan terjamin.",
  },
  {
    icon: TagIcon,
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi.",
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="bg-padel-dark rounded-3xl p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((it) => (
            <div key={it.title} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-padel-neon text-padel-dark">
                <it.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-white italic text-lg mb-1">
                  {it.title}
                </h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed">
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
