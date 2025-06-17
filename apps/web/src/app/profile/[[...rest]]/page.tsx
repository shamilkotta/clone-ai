"use client";

import ModelsList from "@/components/ModelsList";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeftToLine, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const Profile = () => {
  const params = useSearchParams();
  const path = params.get("ref") || "/";

  return (
    <div className="flex w-full h-screen">
      <UserProfile>
        <UserProfile.Page
          url="/models"
          label="Modles"
          labelIcon={<Package size={16} />}
        >
          <ModelsList />
        </UserProfile.Page>
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
