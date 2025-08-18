import { Suspense } from "react";
import MessagePage from "./message_page";

export default function Message() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <MessagePage />
    </Suspense>
  );
}
