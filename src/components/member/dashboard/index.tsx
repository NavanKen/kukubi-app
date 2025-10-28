"use client";

import { useEffect, useState } from "react";
import ProfileCard from "./ui/profile-card";
import RecentTransactions from "./ui/recent-transaction";
import { getProfileUser } from "@/service/auth";
import { useUserOrders } from "@/hooks/use-user-orders";
import { IUserProfile } from "@/types/auth.type";

const DashboardMember = () => {
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { orders } = useUserOrders(userId);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    const res = await getProfileUser();
    if (res.status && res.data) {
      setUserId(res.data.auth.id);
      setProfile(res.data.profile);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-20">
        <ProfileCard profile={profile} orders={orders} />
        <RecentTransactions orders={orders} />
      </div>
    </>
  );
};

export default DashboardMember;
