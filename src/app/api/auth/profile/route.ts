import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        {
          status: false,
          pesan: error.message,
        },
        { status: 401 }
      );
    }

    const userId = data.user?.id || "";

    const { data: UserProfile, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      return NextResponse.json(
        {
          status: false,
          pesan: userError.message,
        },
        { status: 404 }
      );
    }

    const authData = data.user;
    const userProfileData = UserProfile;

    return NextResponse.json({
      status: true,
      data: {
        auth: authData,
        profile: userProfileData,
      },
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      {
        status: false,
        pesan: "Internal server error",
      },
      { status: 500 }
    );
  }
}
