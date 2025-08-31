import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, "", options);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (!session) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/member") ||
      pathname.startsWith("/cashier")
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  const role = userProfile?.role;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/member")) {
    if (role !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname === "/member") {
      return NextResponse.redirect(new URL("/member/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/cashier")) {
    if (role !== "cashier") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname === "/cashier") {
      return NextResponse.redirect(new URL("/cashier/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/member/:path*",
    "/cashier/:path*",
  ],
};
