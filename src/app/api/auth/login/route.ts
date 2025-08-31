import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import environment from "@/config/environment";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cookieStore = await cookies();

    const supabase = createServerClient(
      environment.SUPABASE_URL!,
      environment.SUPABASE_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set(name, value, options);
          },
          remove(name, options) {
            cookieStore.set(name, "", options);
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          status: false,
          pesan: error.message,
        },
        { status: 400 }
      );
    }

    if (data.session) {
      cookieStore.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      cookieStore.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        status: false,
        pesan: "Internal server error",
      },
      { status: 500 }
    );
  }
}
