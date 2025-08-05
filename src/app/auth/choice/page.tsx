"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthChoicePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      
      if (error) {
        setError(error.message || "Signup failed. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-stone-950 rounded-2xl p-8 shadow-xl border border-stone-800">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Account Created!</h2>
            <p className="text-stone-400">Please check your email to verify your account.</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Signup Form */}
        <div className="bg-stone-950 rounded-2xl p-8 shadow-xl border border-stone-800">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Get Started</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-stone-300 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-stone-300 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-400">
              Already registered?{" "}
              <Link href="/auth/login" className="text-[var(--primary)] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 