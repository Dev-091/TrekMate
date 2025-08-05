"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { treks, Trek } from "../treks-catalog";

export default function TreksCatalogPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleBookTrek = (trekId: string) => {
    if (!user) {
      // Redirect to auth choice if not authenticated
      router.push("/auth/choice");
      return;
    }
    
    // If authenticated, redirect to dashboard
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans relative">
      {/* Logo and name in the right uppermost corner */}
      <div className="absolute top-6 left-8 z-30 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" ></path>
          </svg>
          <span className="text-white text-xl font-bold tracking-tighter">TrekMate</span>
        </Link>
      </div>

      {/* User status indicator */}
      {user && (
        <div className="absolute top-6 right-8 z-30">
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <span>Welcome, {user.email}</span>
            <Link href="/dashboard" className="text-[var(--primary)] hover:underline">
              Dashboard
            </Link>
            <Link href="/auth/logout" className="text-[var(--primary)] hover:underline">
              Logout
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tighter mb-12">Trek Catalog</h1>
        
        {!user && (
          <div className="text-center mb-8">
            <p className="text-stone-400 mb-4">Sign in to access your personalized dashboard!</p>
            <Link
              href="/auth/choice"
              className="inline-flex items-center justify-center rounded-full h-12 px-6 bg-[var(--primary)] text-black text-base font-bold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        )}

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
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <h3 className="text-2xl font-bold">{trek.name}</h3>
                <p className="text-stone-300">{trek.region} <span className="mx-2">•</span> {trek.difficulty}</p>
                <p className="text-stone-400 mt-2 text-sm mb-4">{trek.description}</p>
                <button
                  onClick={() => handleBookTrek(trek.id)}
                  className="bg-[var(--primary)] text-black font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  {user ? "View in Dashboard" : "Sign in to Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
