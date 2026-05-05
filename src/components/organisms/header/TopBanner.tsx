import React from "react";
import { InformationCircleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function TopBanner() {
  return (
    <div className="bg-padel-neon text-padel-dark py-2.5 px-4 relative z-[60]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-2 md:gap-8">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-black italic uppercase tracking-tight">
              Disclaimer: This website is a personal demo project. No actual products are sold.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-4 w-px bg-padel-dark/20 hidden md:block" />
            <p className="text-[10px] md:text-xs font-bold uppercase flex items-center gap-2">
              For testing, use 
              <a 
                href="https://simulator.sandbox.midtrans.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-padel-dark text-padel-neon px-2 py-0.5 rounded font-black hover:bg-padel-dark/90 transition-colors"
              >
                Midtrans Simulator
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}