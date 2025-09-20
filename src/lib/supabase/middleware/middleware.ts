import environment from "@/config/environment";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    environment.SUPABASE_URL!,
    environment.SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/member") ||
      pathname.startsWith("/cashier")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userProfile?.role;

  let redirectUrl: string | null = null;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (pathname === "/admin") redirectUrl = "/admin/dashboard";
  } else if (pathname.startsWith("/member")) {
    if (role !== "user") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  } else if (pathname.startsWith("/cashier")) {
    if (role !== "cashier") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (pathname === "/cashier") redirectUrl = "/cashier/dashboard";
  }

  if (redirectUrl) {
    const res = NextResponse.redirect(new URL(redirectUrl, request.url));
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
      res.cookies.set(name, value);
    });
    return res;
  }

  return supabaseResponse;
}
