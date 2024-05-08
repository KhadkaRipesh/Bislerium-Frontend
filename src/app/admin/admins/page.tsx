"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import AddAdmin from "./_components/AddAdmin";
import AdminTable from "./_components/AdminTable";

const Admins = () => {
  return (
    <div>
      <div className="flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl lg:text-3xl font-black text-gray-700">Admin</h1>
        <div className="flex justify-between items-center gap-5">
          <AddAdmin />
        </div>
      </div>
      <div>
        <AdminTable />
      </div>
    </div>
  );
};

export default Admins;
