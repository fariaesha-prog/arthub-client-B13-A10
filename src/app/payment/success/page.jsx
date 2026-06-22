import { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessPage />
    </Suspense>
  );
}