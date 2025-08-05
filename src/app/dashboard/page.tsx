"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Trek, Booking } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [availableTreks, setAvailableTreks] = useState<Trek[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/choice");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  const fetchUserData = async () => {
    try {
      // Fetch user bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        // If bookings table doesn't exist, use empty array
        setUserBookings([]);
      } else {
        setUserBookings(bookings || []);
      }

      // Fetch available treks
      const { data: treks, error: treksError } = await supabase
        .from('treks')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (treksError) {
        console.error('Error fetching treks:', treksError);
        // Fallback to static trek data if database is not available
        const staticTreks = [
          {
            id: 'himalayan-ascent',
            name: 'Himalayan Ascent',
            region: 'Himalayas',
            difficulty: 'Moderate' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk6ByCSSSxo1CAyxMtkHNNQ5-udfS9umEnwjreSd_ZpjVtuHyTUXLrjLflfz9MEvA7R4oMgPK4hCoAnesilx-YMvFscST5c7iHjmNxRjoJOPjqj8YFY6vTVLLafgOt4bD_T1IVLhOq7PVXQk_WPFwEU4Yj6o6--a7ed0gFRvJPOfJ3Z-sSEURhcTsAHUNyyWfQC86XC-QHGhklm28JzUM0TQRxCj_GSkWlX2-yY6l0KYfNHgBLFRQgvFsagMJJt95_JCMRmmJPXE9',
            description: 'A breathtaking trek through the mighty Himalayas, perfect for those seeking adventure and stunning vistas.',
            price: '₹12,000',
            duration_days: 7,
            max_altitude: 4500,
            group_size: 12,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'western-ghats-trail',
            name: 'Western Ghats Trail',
            region: 'Western Ghats',
            difficulty: 'Challenging' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxbz_f8z4l8AeavSpaDTbN0xZ9OBcqSrxe2JpWSo3Ilnpkr402d6kFxTT2A08HCsBnekWkh5is-vlgVmIwTc87bzCjs2RM8Je1U0IcWEUx8diRyH3Fs1JrTeYIgc8uYvQUKTSmTzPlEsozRFdRDVQ9F-zq3DpNwNh8LTQ-ZBOexfuaCDUO6vLeEIaPrWg0uhIMADehBZhxV3H5w1yu4IavYrmrNZe6IsHkSQlE8bdpsI7XTnd1V3hpMA0Arzi3bamnnMqZX_Tsk_eY',
            description: 'A challenging trail through the lush Western Ghats, known for its biodiversity and scenic beauty.',
            price: '₹9,500',
            duration_days: 5,
            max_altitude: 2800,
            group_size: 8,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'eastern-peaks-expedition',
            name: 'Eastern Peaks Expedition',
            region: 'Eastern India',
            difficulty: 'Easy' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNZhH34KFnMZQ7wugn8aWB2FqNv8nXIuGu1Biihi6Atc8kfn6IXU-FIM3kFo4NPs4gPZZ_5U6mNWfNS9v5oPmuig-pjAJLVtFaIgKcrpoYoHwxgkVz2faJ1c2Xg5rMlqOMTxrrZF7oCYMGJfrwpzCCutF1mTCTMRnFMQQ4BpxoqWKcfJS59GVx690HTeOHtBiZDd59fffFhRIQuQcqhRUlzBnbdCaZLzFtQD01-2HslTnqnu8u9I9sTKACI3od3WpHgYqPc32Ttnt',
            description: 'An easy and enjoyable trek across the beautiful peaks of Eastern India, suitable for beginners and families.',
            price: '₹7,000',
            duration_days: 4,
            max_altitude: 2200,
            group_size: 15,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'ladakh-high-altitude',
            name: 'Ladakh High Altitude Trek',
            region: 'Ladakh',
            difficulty: 'Challenging' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxbz_f8z4l8AeavSpaDTbN0xZ9OBcqSrxe2JpWSo3Ilnpkr402d6kFxTT2A08HCsBnekWkh5is-vlgVmIwTc87bzCjs2RM8Je1U0IcWEUx8diRyH3Fs1JrTeYIgc8uYvQUKTSmTzPlEsozRFdRDVQ9F-zq3DpNwNh8LTQ-ZBOexfuaCDUO6vLeEIaPrWg0uhIMADehBZhxV3H5w1yu4IavYrmrNZe6IsHkSQlE8bdpsI7XTnd1V3hpMA0Arzi3bamnnMqZX_Tsk_eY',
            description: 'Experience the raw beauty of Ladakh with this high-altitude trek through stunning mountain passes and ancient monasteries.',
            price: '₹15,500',
            duration_days: 10,
            max_altitude: 5200,
            group_size: 6,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'nilgiri-hills-walk',
            name: 'Nilgiri Hills Walk',
            region: 'Nilgiri Hills',
            difficulty: 'Easy' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNZhH34KFnMZQ7wugn8aWB2FqNv8nXIuGu1Biihi6Atc8kfn6IXU-FIM3kFo4NPs4gPZZ_5U6mNWfNS9v5oPmuig-pjAJLVtFaIgKcrpoYoHwxgkVz2faJ1c2Xg5rMlqOMTxrrZF7oCYMGJfrwpzCCutF1mTCTMRnFMQQ4BpxoqWKcfJS59GVx690HTeOHtBiZDd59fffFhRIQuQcqhRUlzBnbdCaZLzFtQD01-2HslTnqnu8u9I9sTKACI3od3WpHgYqPc32Ttnt',
            description: 'A gentle walk through the picturesque Nilgiri Hills, featuring tea gardens, waterfalls, and colonial architecture.',
            price: '₹6,500',
            duration_days: 3,
            max_altitude: 1800,
            group_size: 20,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'spiti-valley-adventure',
            name: 'Spiti Valley Adventure',
            region: 'Spiti Valley',
            difficulty: 'Moderate' as const,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk6ByCSSSxo1CAyxMtkHNNQ5-udfS9umEnwjreSd_ZpjVtuHyTUXLrjLflfz9MEvA7R4oMgPK4hCoAnesilx-YMvFscST5c7iHjmNxRjoJOPjqj8YFY6vTVLLafgOt4bD_T1IVLhOq7PVXQk_WPFwEU4Yj6o6--a7ed0gFRvJPOfJ3Z-sSEURhcTsAHUNyyWfQC86XC-QHGhklm28JzUM0TQRxCj_GSkWlX2-yY6l0KYfNHgBLFRQgvFsagMJJt95_JCMRmmJPXE9',
            description: 'Explore the mystical Spiti Valley with its dramatic landscapes, ancient monasteries, and unique culture.',
            price: '₹11,800',
            duration_days: 8,
            max_altitude: 3800,
            group_size: 10,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setAvailableTreks(staticTreks);
      } else {
        setAvailableTreks(treks || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set empty arrays as fallback
      setUserBookings([]);
      setAvailableTreks([]);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleBookTrek = (trekId: string) => {
    router.push(`/payment?trekId=${trekId}`);
  };

  const handleStartNavigation = (trekId: string) => {
    router.push(`/navigation?trekId=${trekId}`);
  };

  const getTrekDetails = (trekId: string) => {
    return availableTreks.find(t => t.id === trekId);
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
          
          <div className="flex items-center gap-4">
            <span className="text-stone-300">Welcome, {user.email}</span>
            <Link href="/auth/logout" className="text-[var(--primary)] hover:underline">
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tighter mb-12">Your Dashboard</h1>

          {/* Previous Treks Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Your Previous Treks</h2>
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-400 text-lg mb-4">You haven't booked any treks yet.</p>
                <p className="text-stone-500">Start your adventure by choosing a trek below!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBookings.map((booking) => {
                  const trekDetails = getTrekDetails(booking.trek_id);
                  return (
                    <div key={booking.id} className="bg-stone-950 rounded-2xl p-6 border border-stone-800">
                      {trekDetails && (
                        <img 
                          src={trekDetails.image} 
                          alt={booking.trek_name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">{booking.trek_name}</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-stone-400">
                          <span className="font-medium">Price:</span> {booking.trek_price}
                        </p>
                        <p className="text-stone-400">
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            booking.payment_status === 'completed' 
                              ? 'bg-green-900 text-green-300' 
                              : booking.payment_status === 'pending'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {booking.payment_status}
                          </span>
                        </p>
                        <p className="text-stone-400">
                          <span className="font-medium">Booked:</span> {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                        {booking.participants_count > 1 && (
                          <p className="text-stone-400">
                            <span className="font-medium">Participants:</span> {booking.participants_count}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Choose New Treks Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Choose New Treks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableTreks.map((trek: Trek) => (
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
                    {trek.duration_days && (
                      <p className="text-stone-400 text-xs mb-2">
                        Duration: {trek.duration_days} days • Max Altitude: {trek.max_altitude}m
                      </p>
                    )}
                    <button
                      onClick={() => handleBookTrek(trek.id)}
                      className="bg-[var(--primary)] text-black font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => handleStartNavigation(trek.id)}
                      className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 ml-2"
                    >
                      🗺️ Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 