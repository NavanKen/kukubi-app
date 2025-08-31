import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import environment from "@/config/environment";

export async function GET() {
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
