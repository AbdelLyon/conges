// // app/leaves/page.tsx
"use client";

import { Button } from "x-react/button";
import { IconMenu } from "x-react/icons";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function SettingsPage() {
  const { mobileMenuOpen, setMobileMenuOpen } = useSettingsStore();
  return (
    <div className="mb-2 flex items-center justify-between lg:hidden">
      <Button
        variant="light"
        size="sm"
        startContent={<IconMenu />}
        onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        Menu
      </Button>
    </div>
  );
}
