"use client";
import React from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
            <span className="text-white text-2xl font-bold tracking-tighter">TrekMate</span>
          </Link>
        </div>

        {/* Success Content */}
        <div className="bg-stone-950 rounded-2xl p-8 shadow-xl border border-stone-800">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          
          <p className="text-stone-400 mb-8">
            Your trek booking has been confirmed. You will receive a confirmation email with all the details shortly.
          </p>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-[var(--primary)] text-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-stone-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-stone-700 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 