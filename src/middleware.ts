import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/member/:path*",
    "/cashier/:path*",
  ],
};
