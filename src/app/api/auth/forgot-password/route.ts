import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/update-password",
      // redirectTo: "https://kukubi.vercel.app/auth/update-password",
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
      pesan: "Silahkan check email anda untuk memperbarui password",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: false,
        pesan: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
