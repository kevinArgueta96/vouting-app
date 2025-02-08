"use client";

import React from "react";
import Image from "next/image";

interface CocktailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cocktail: {
    name: string;
    brand: string;
    description: string;
  };
  children?: React.ReactNode;
}

export const CocktailDetailModal: React.FC<CocktailDetailModalProps> = ({
  isOpen,
  onClose,
  cocktail,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#3B4992] shadow-2xl transition-all w-full max-w-lg">
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
           

            {/* Cocktail Details */}
            <div className="p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{cocktail.name}</h2>
              <h3 className="text-xl mb-4 opacity-90">{cocktail.brand}</h3>
              <p className="text-base opacity-80 leading-relaxed">
                {cocktail.description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
