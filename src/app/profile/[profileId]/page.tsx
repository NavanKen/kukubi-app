import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileComponent from "@/components/admin/profile";

export default async function ProfilePage({
  params,
}: {
  params: { profileId: string };
}) {
  const supabase = await createClient();
  const profileIdFromUrl = params.profileId;

  const { data: authData } = await supabase.auth.getUser();

  const currentUserId = authData.user?.id;

  if (profileIdFromUrl !== currentUserId) {
    return notFound();
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", currentUserId)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  return <ProfileComponent profileId={profile.id} profile={profile} />;
}
