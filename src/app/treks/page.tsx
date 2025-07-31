"use client";
import React from "react";
import { treks, Trek } from "../treks-catalog";

export default function TreksCatalogPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans relative">
      {/* Logo and name in the right uppermost corner */}
      <div className="absolute top-6 left-8 z-30 flex items-center gap-2">
        <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" href="src/page.tsx"></path>
        </svg>
        <span className="text-white text-xl font-bold tracking-tighter">TrekMate</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tighter mb-12">Trek Catalog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map((trek: Trek) => (
            <div key={trek.id} className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 bg-stone-950">
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[var(--primary)] text-black text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                  {trek.price}
                </span>
              </div>
              <img alt={trek.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" src={trek.image} />
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)" }}></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{trek.name}</h3>
                <p className="text-stone-300">{trek.region} <span className="mx-2">•</span> {trek.difficulty}</p>
                <p className="text-stone-400 mt-2 text-sm">{trek.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
