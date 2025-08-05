"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || "Login failed. Please check your credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
            <span className="text-white text-2xl font-bold tracking-tighter">TrekMate</span>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-stone-950 rounded-2xl p-8 shadow-xl border border-stone-800">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-[var(--primary)] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 