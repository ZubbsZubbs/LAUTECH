"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setUser, restoreAuth } from "../../store/authSlice";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Restore authentication from localStorage
    dispatch(restoreAuth());
    setIsCheckingAuth(false);
  }, [dispatch]);

  useEffect(() => {
    // If not authenticated after restoration, redirect to login
    if (!isCheckingAuth && !isAuthenticated) {
      console.log("ProtectedRoute - Not authenticated, redirecting to login");
      router.push("/auth/login");
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  // Show loading spinner while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return children;
}
