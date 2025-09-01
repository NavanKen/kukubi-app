import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

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
