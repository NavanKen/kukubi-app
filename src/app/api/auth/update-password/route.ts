import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { password } = await req.json();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          status: false,
          pesan: error.message || "Terjadi Kesalahan",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        pesan: "Password Berhasil Diperbarui",
      },
      { status: 201 }
    );
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
