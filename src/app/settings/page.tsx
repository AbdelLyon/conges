// // app/leaves/page.tsx
"use client";

import { Button } from "@xefi/x-react/button";
import { IconMenu } from "@xefi/x-react/icons";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function SettingsPage() {
  const { mobileMenuOpen, setMobileMenuOpen } = useSettingsStore();
  return (
    <div className="mb-2 flex items-center justify-between lg:hidden">
      <Button
        variant="light"
        size="sm"
        leftIcon={<IconMenu />}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        Menu
      </Button>
    </div>
  );
}
