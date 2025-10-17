import { Suspense } from "react";
import AdminLoginForm from "../../../components/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
