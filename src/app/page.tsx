"use client";
import React from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-stone-900 text-stone-200 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a className="flex items-center gap-3" href="#">
            <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
            <h2 className="text-white text-2xl font-bold tracking-tighter">TrekMate</h2>
          </a>
        
          <a className="hidden md:inline-flex items-center justify-center rounded-full h-12 px-6 bg-[var(--primary)] text-black text-base font-bold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105" href="#">
            Get Started
          </a>
          <button className="md:hidden text-white">
            <svg className="h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20, 16, 15, 0.7) 0%, rgba(20, 16, 15, 0.3) 100%), url('/070620-014-The-Tetons.jpg')",
          }}
        >
          <div className="px-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
              <span className="bg-gradient-to-r from-[var(--primary)] via-white to-[var(--primary)] bg-clip-text text-transparent">
                Explore the Unexplored
              </span>
              <span className="block text-2xl md:text-3xl font-bold tracking-tighter text-white">TrekMate is here to make your next adventure even more memorable!</span>
            </h1>
            <a className="mt-8 inline-flex items-center justify-center rounded-full h-14 px-8 bg-[var(--primary)] text-black text-lg font-bold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105" href="/treks">
              Explore Routes
            </a>
          </div>
        </section>

        {/* Featured Treks */}
        <section className="py-20 md:py-32 bg-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tighter mb-12">Featured Treks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Trek Card 1 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <img alt="Himalayan Ascent" className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANk6ByCSSSxo1CAyxMtkHNNQ5-udfS9umEnwjreSd_ZpjVtuHyTUXLrjLflfz9MEvA7R4oMgPK4hCoAnesilx-YMvFscST5c7iHjmNxRjoJOPjqj8YFY6vTVLLafgOt4bD_T1IVLhOq7PVXQk_WPFwEU4Yj6o6--a7ed0gFRvJPOfJ3Z-sSEURhcTsAHUNyyWfQC86XC-QHGhklm28JzUM0TQRxCj_GSkWlX2-yY6l0KYfNHgBLFRQgvFsagMJJt95_JCMRmmJPXE9" />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)" }}></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Himalayan Ascent</h3>
                  <p className="text-stone-300">Himalayas <span className="mx-2">•</span> Moderate</p>
                </div>
              </div>
              {/* Trek Card 2 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <img alt="Western Ghats Trail" className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxbz_f8z4l8AeavSpaDTbN0xZ9OBcqSrxe2JpWSo3Ilnpkr402d6kFxTT2A08HCsBnekWkh5is-vlgVmIwTc87bzCjs2RM8Je1U0IcWEUx8diRyH3Fs1JrTeYIgc8uYvQUKTSmTzPlEsozRFdRDVQ9F-zq3DpNwNh8LTQ-ZBOexfuaCDUO6vLeEIaPrWg0uhIMADehBZhxV3H5w1yu4IavYrmrNZe6IsHkSQlE8bdpsI7XTnd1V3hpMA0Arzi3bamnnMqZX_Tsk_eY" />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)" }}></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Western Ghats Trail</h3>
                  <p className="text-stone-300">Western Ghats <span className="mx-2">•</span> Challenging</p>
                </div>
              </div>
              {/* Trek Card 3 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <img alt="Eastern Peaks Expedition" className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgNZhH34KFnMZQ7wugn8aWB2FqNv8nXIuGu1Biihi6Atc8kfn6IXU-FIM3kFo4NPs4gPZZ_5U6mNWfNS9v5oPmuig-pjAJLVtFaIgKcrpoYoHwxgkVz2faJ1c2Xg5rMlqOMTxrrZF7oCYMGJfrwpzCCutF1mTCTMRnFMQQ4BpxoqWKcfJS59GVx690HTeOHtBiZDd59fffFhRIQuQcqhRUlzBnbdCaZLzFtQD01-2HslTnqnu8u9I9sTKACI3od3WpHgYqPc32Ttnt" />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)" }}></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Eastern Peaks Expedition</h3>
                  <p className="text-stone-300">Eastern India <span className="mx-2">•</span> Easy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 md:py-24 bg-stone-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-16">Simple Steps to Adventure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-700/50 hidden md:block"></div>
              {/* Step 1 */}
              <div className="relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)] text-black mb-6 z-10 border-8 border-stone-900">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Choose Your Plan</h3>
                <p className="text-stone-400 mt-2">Select the perfect trek that matches your spirit of adventure.</p>
              </div>
              {/* Step 2 */}
              <div className="relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)] text-black mb-6 z-10 border-8 border-stone-900">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Secure Face Login</h3>
                <p className="text-stone-400 mt-2">Quick and secure access to your personalized trek details.</p>
              </div>
              {/* Step 3 */}
              <div className="relative flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)] text-black mb-6 z-10 border-8 border-stone-900">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Start Your Trek</h3>
                <p className="text-stone-400 mt-2">Embark on your journey with your AI guide by your side.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tighter mb-12">From Our Trekkers</h2>
            <div
              className="relative rounded-2xl overflow-hidden bg-cover bg-center min-h-[400px] flex items-end p-8 md:p-12"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, rgba(20, 16, 15, 0.8) 0%, rgba(20, 16, 15, 0) 60%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOKX1R9rv573VDDHK66GA6HLbOmlx6JeYPt9XeKFOsvBZtqxJF-ZRQH9z_Ff-izFpDkbAxcb_G8XAQg-nGQGr2MsDFVDi1XBJVynxz-j1xrEZaSI5z70LySwPxFii8zQAVeh2uSc1GRLzSB-YYBa8emWLlpvZMR3wbfJttFpMj8g4p9NUxzxSWoFWaEQb1Z1sF6xvxERpuBkxp0jw-y4iKbjyQjIyexPfGQx0fn40bhGrNt9gxBm2BjckbFfgKH_EnJnCh4hvpD2AO')",
              }}
            >
              <div className="text-white max-w-2xl">
                <p className="text-2xl md:text-3xl font-medium italic leading-relaxed">
                  "TrekMate made my solo trek in the Himalayas unforgettable. The AI guide was incredibly helpful and felt like a friend on the trail!"
                </p>
                <p className="text-xl font-bold mt-6">- Sophia Bennett</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-32 text-center bg-stone-950">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Ready to Explore?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-stone-300">
              Join thousands of adventurers and start your journey today.
            </p>
            <a className="mt-8 inline-flex items-center justify-center rounded-full h-14 px-8 bg-[var(--primary)] text-black text-lg font-bold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105" href="#">
              Get Started Now
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
              <span className="text-white font-bold">TrekMate</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a className="text-stone-400 hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="text-stone-400 hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="text-stone-400 hover:text-white transition-colors" href="#">Contact Us</a>
            </div>
            <p className="text-stone-500 text-sm">© 2024 TrekMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
