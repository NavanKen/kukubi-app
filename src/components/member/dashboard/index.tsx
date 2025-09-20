"use client";

import { useEffect } from "react";
import ProfileCard from "./ui/profile-card";
import RecentTransactions from "./ui/recent-transaction";

const DashboardMember = () => {
  useEffect(() => {}, []);

  return (
    <>
      <div className="space-y-6 pb-20">
        <ProfileCard />
        <RecentTransactions />
      </div>
    </>
  );
};

export default DashboardMember;
