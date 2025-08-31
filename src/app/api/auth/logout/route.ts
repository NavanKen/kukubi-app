import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import environment from "@/config/environment";

export async function POST() {
  try {
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

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        {
          status: false,
          pesan: error.message,
        },
        { status: 400 }
      );
    }

    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");

    return NextResponse.json({
      status: true,
      pesan: "Berhasil Keluar",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      {
        status: false,
        pesan: "Internal server error",
      },
      { status: 500 }
    );
  }
}
