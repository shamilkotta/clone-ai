"use client";

import { UserProfile } from "@clerk/nextjs";
import { ArrowLeftToLine } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const Profile = () => {
  const params = useSearchParams();
  const path = params.get("rf") || "/";

  return (
    <div className="flex w-full h-screen">
      <UserProfile>
        <UserProfile.Link
          url={path}
          label="Back"
          labelIcon={<ArrowLeftToLine size={20} />}
        />
      </UserProfile>
    </div>
  );
};

export default Profile;
