"use client";
import SettingsForm from "./LeaveTypeForm";
import { LeaveTypesList } from "./LeaveTypesList";

export const LeaveTypeContent = () => {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
      <div className="md:col-span-5 lg:col-span-4">
        <LeaveTypesList />
      </div>
      <div className="md:col-span-7 lg:col-span-8">
        <SettingsForm />
      </div>
    </div>
  );
};
