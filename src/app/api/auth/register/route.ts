import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import environment from "@/config/environment";

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirm_password } = await req.json();

    if (password !== confirm_password) {
      return NextResponse.json(
        {
          status: false,
          pesan: "Password atau Konfirmasi Password tidak sesuai !",
        },
        { status: 400 }
      );
    }

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

    const { data, error } = await supabase.auth.signUp({
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

    return NextResponse.json({
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      {
        status: false,
        pesan: "Internal server error",
      },
      { status: 500 }
    );
  }
}
