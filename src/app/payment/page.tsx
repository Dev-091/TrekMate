"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { treks, Trek } from "../treks-catalog";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trekId = searchParams.get("trekId");
  const { user, loading } = useAuth();
  
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push("/auth/choice");
      return;
    }

    if (trekId) {
      const trek = treks.find(t => t.id === trekId);
      if (trek) {
        setSelectedTrek(trek);
      } else {
        router.push("/treks");
      }
    } else {
      router.push("/treks");
    }
  }, [trekId, router, user, loading]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    setError("");

    try {
      // First, ensure user profile exists in public.users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist in public.users table, create it
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user?.id,
            email: user?.email || '',
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || ''
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          setError("Failed to create user profile. Please try again.");
          setPaymentLoading(false);
          return;
        }
      } else if (userError) {
        console.error('Error checking user profile:', userError);
        setError("Failed to verify user profile. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Get trek details
      const selectedTrek = treks.find(t => t.id === trekId);
      if (!selectedTrek) {
        setError("Trek not found. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id,
          trek_id: trekId,
          trek_name: selectedTrek.name,
          trek_price: selectedTrek.price,
          payment_status: 'pending',
          booking_date: new Date().toISOString().split('T')[0],
          participants_count: 1
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        setError("Failed to create booking. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: selectedTrek.price,
          currency: 'INR',
          payment_method: 'card',
          status: 'completed',
          transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });

      if (paymentError) {
        console.error('Error creating payment:', paymentError);
        setError("Payment recorded but booking failed. Please contact support.");
        setPaymentLoading(false);
        return;
      }

      // Update booking status to completed
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'completed' })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Error updating booking status:', updateError);
        // Don't fail the payment for this, just log it
      }

      // Redirect to success page
      router.push('/payment/success');
    } catch (err) {
      console.error('Payment error:', err);
      setError("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedTrek) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p>Loading trek details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
            <h2 className="text-white text-2xl font-bold tracking-tighter">TrekMate</h2>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trek Details */}
            <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800">
              <h2 className="text-2xl font-bold text-white mb-6">Trek Details</h2>
              
              <div className="space-y-4">
                <img 
                  src={selectedTrek.image} 
                  alt={selectedTrek.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedTrek.name}</h3>
                  <p className="text-stone-400">{selectedTrek.region} • {selectedTrek.difficulty}</p>
                  <p className="text-stone-300 mt-2">{selectedTrek.description}</p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-stone-800">
                  <span className="text-lg font-medium text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-[var(--primary)]">{selectedTrek.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
              
              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-stone-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    id="cardholderName"
                    name="cardholderName"
                    type="text"
                    value={paymentData.cardholderName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Name on card"
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-stone-300 mb-2">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={16}
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-stone-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      required
                      maxLength={5}
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-stone-300 mb-2">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      required
                      maxLength={4}
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      placeholder="123"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full bg-[var(--primary)] text-black font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? "Processing Payment..." : `Pay ${selectedTrek.price}`}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stone-400 text-sm">
                  Your payment is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 