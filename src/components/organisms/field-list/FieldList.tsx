'use client'
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import crypto from "crypto";
import { Hash } from "node:crypto";
import apiConfig from "@/config/api";
import Link from "next/link";
import { toast } from "react-toastify";
import { message } from "@/constants/message";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { PADEL_IMAGES } from "@/constants/images";
import {
  UsersIcon,
  MapPinIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type Field = {
  uuid: string;
  name: string;
  code: string;
  price_per_hour: number;
  images: string[] | null;
  description?: string;
  type?: string;
};

type SortKey = "newest" | "price_asc" | "price_desc";

const formatRupiah = (n: number) =>
  `Rp${(n || 0).toLocaleString("id-ID")}`;

function FieldCard({ field, index = 0 }: { field: Field; index?: number }) {
  const fallback =
    PADEL_IMAGES.fieldFallbacks[index % PADEL_IMAGES.fieldFallbacks.length];
  const cover = (field.images && field.images[0]) || fallback;
  return (
    <Link
      href={`/booking/${field.uuid}`}
      className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full"
    >
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={cover}
          alt={field.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-padel-neon text-padel-dark px-4 py-1.5 rounded-full font-black text-sm shadow-lg">
          {formatRupiah(field.price_per_hour)}
          <span className="font-medium opacity-70"> / jam</span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-padel-neon p-2.5 rounded-full text-padel-dark shadow-lg">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl text-padel-dark italic group-hover:text-padel-dark transition-colors">
            {field.name}
          </h3>
          <div className="bg-gray-50 p-2 rounded-full group-hover:bg-padel-neon transition-colors">
            <ChevronRightIcon className="w-5 h-5 text-padel-dark" />
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium">
          {field.description ||
            "Lapangan dengan fasilitas lengkap dan pencahayaan premium."}
        </p>
        <div className="flex items-center space-x-6 pt-6 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPinIcon className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {field.type || "Outdoor"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <UsersIcon className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              4 - 4 Pemain
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FieldList() {
  const [fields, setFields] = useState<Field[]>([]);
  const [sort, setSort] = useState<SortKey>("newest");
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const serviceName: string | undefined = apiConfig.field.serviceName;
        const signatureKey: string | undefined = apiConfig.field.signatureKey;
        const requestAt: string = new Date().toISOString();
        const validateKey: string = `${serviceName}:${signatureKey}:${requestAt}`;
        const hash: Hash = crypto.createHash("sha256");
        hash.update(validateKey);
        const apiKey: string = hash.digest("hex");
        const response = await axios.get(
          `${apiConfig.field.baseUrl}/api/v1/field`,
          {
            headers: {
              "x-service-name": serviceName,
              "x-request-at": requestAt,
              "x-api-key": apiKey,
            },
          }
        );
        setFields(response.data.data || []);
      } catch (error: any) {
        if (error.code === "ERR_NETWORK") {
          toast.error(message.general.ERR_NETWORK);
        } else {
          toast.error(
            error.response?.data?.message || "Terjadi kesalahan saat memuat data."
          );
        }
      }
    };
    fetchFields();
  }, []);

  const sortedFields = useMemo(() => {
    const arr = [...fields];
    if (sort === "price_asc") arr.sort((a, b) => a.price_per_hour - b.price_per_hour);
    else if (sort === "price_desc") arr.sort((a, b) => b.price_per_hour - a.price_per_hour);
    return arr;
  }, [fields, sort]);

  const hasFields = sortedFields.length > 0;

  return (
    <section className="py-24 bg-white" id="field-list">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl italic text-padel-dark mb-4">
              PILIH LAPANGAN
            </h2>
            <p className="text-gray-500 font-medium">
              Temukan lapangan terbaik untuk permainanmu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Urutkan:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 font-bold text-sm text-padel-dark focus:outline-none focus:ring-2 focus:ring-padel-neon/50"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRightIcon className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {!hasFields ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">
              Tidak ada lapangan yang tersedia.
            </h3>
          </div>
        ) : (
          <>
            {/* Mobile / Tablet: Carousel */}
            <div className="lg:hidden relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1.1}
                pagination={{
                  clickable: true,
                  bulletClass:
                    "inline-block w-2 h-2 rounded-full bg-gray-200 mx-1 cursor-pointer transition-all",
                  bulletActiveClass: "!bg-padel-dark !w-6 rounded-full",
                }}
                breakpoints={{
                  640: { slidesPerView: 2.1, spaceBetween: 24 },
                }}
                onBeforeInit={(s) => {
                  swiperRef.current = s;
                }}
                className="!pb-12"
              >
                {sortedFields.map((field, i) => (
                  <SwiperSlide key={field.uuid} className="h-auto">
                    <FieldCard field={field} index={i} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                aria-label="Sebelumnya"
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 -ml-1 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-padel-dark hover:bg-padel-neon transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                aria-label="Selanjutnya"
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 -mr-1 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-padel-dark hover:bg-padel-neon transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-8">
              {sortedFields.map((field, i) => (
                <FieldCard key={field.uuid} field={field} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
