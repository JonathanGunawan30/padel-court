'use client';
import React, { useEffect, useState } from "react";
import apiConfig from "@/config/api";
import crypto from "crypto";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from "react-toastify";
import { message } from "@/constants/message";
import { 
  InformationCircleIcon, 
  MapPinIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

export default function Detail({ params }: { params: { uuid: any } }) {
  const [field, setField] = useState<any>(null);
  const uuid = params.uuid;

  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) return;
      
      try {
        const serviceName = apiConfig.field.serviceName;
        const signatureKey = apiConfig.field.signatureKey;
        const requestAt = new Date().toISOString();
        const validateKey = `${serviceName}:${signatureKey}:${requestAt}`;
        const hash = crypto.createHash('sha256').update(validateKey);
        const apiKey = hash.digest('hex');

        const response = await axios.get(`${apiConfig.field.baseUrl}/api/v1/field/${uuid}`, {
          headers: {
            "x-service-name": serviceName,
            "x-request-at": requestAt,
            "x-api-key": apiKey,
          },
        });
        setField(response.data.data);
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK') {
          toast.error(message.general.ERR_NETWORK);
        } else {
          toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat data.");
        }
      }
    };

    fetchData();
  }, [uuid]);

  const amenities = [
    "Locker Room", "Wifi", "Bench Pemain", "Lampu Sorot LED", 
    "Kantin", "Parkir Area", "Toilet", "Charging Room", 
    "Mushola", "Tribun Penonton"
  ];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Gallery Section */}
        <div className="w-full lg:w-3/5 relative bg-gray-100">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full min-h-[400px]"
          >
            {field?.images?.length > 0 ? (
              field.images.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${field.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No images available.</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          
          {/* Status Badge */}
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-padel-neon text-padel-dark px-6 py-2 rounded-full font-black italic text-sm shadow-xl">
              AVAILABLE NOW
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-padel-dark opacity-50 mb-4">
              <InformationCircleIcon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Field Information</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-padel-dark mb-6 uppercase">
              {field?.name || "Loading..."}
            </h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <MapPinIcon className="w-6 h-6 text-padel-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tipe Lapangan</p>
                  <p className="text-lg font-bold text-padel-dark">{field?.type || "Outdoor"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <UsersIcon className="w-6 h-6 text-padel-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kapasitas</p>
                  <p className="text-lg font-bold text-padel-dark">4 - 4 Pemain</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <CurrencyDollarIcon className="w-6 h-6 text-padel-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Harga Sewa</p>
                  <p className="text-2xl font-black text-padel-dark italic">
                    {field?.price_per_hour ? `Rp ${field.price_per_hour.toLocaleString('id-ID')}` : "Loading..."} <span className="text-sm font-bold text-gray-300 not-italic">/ jam</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="font-black italic tracking-tight text-padel-dark mb-6">FASILITAS</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                {amenities.slice(0, 6).map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                    <CheckBadgeIcon className="w-5 h-5 text-padel-neon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
