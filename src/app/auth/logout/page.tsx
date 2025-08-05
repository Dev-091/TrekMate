"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push("/");
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p>Signing out...</p>
      </div>
    </div>
  );
} 