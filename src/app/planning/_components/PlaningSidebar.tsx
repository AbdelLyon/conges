import { IconChevronDown } from "x-react/icons";
import { TabItem, Tabs } from "x-react/tabs";

import { Site } from "@/data/leaves";

interface PlanningSidebarProps {
  selectedTab: "sites" | "équipes";
  setSelectedTab: (tab: "sites" | "équipes") => void;
  expandedSites: Record<string, boolean>;
  setExpandedSites: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  sites: Site[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setHoveredUser: (userId: number | null) => void;
}

export const PlanningSidebar: React.FC<PlanningSidebarProps> = ({
  selectedTab,
  setSelectedTab,
  expandedSites,
  setExpandedSites,
  sites,
  setHoveredUser,
}) => {
  const toggleSiteExpand = (siteId: string) => {
    setExpandedSites((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  // Configuration des onglets
  const tabs: TabItem[] = [
    {
      key: "sites",
      title: "Sites",
      content: null,
    },
    {
      key: "équipes",
      title: "Équipes",
      content: null,
    },
  ];

  return (
    <div className="flex w-64 flex-col rounded-t-lg border border-border/70 bg-background">
      <Tabs
        items={tabs}
        defaultActiveTab={selectedTab}
        onTabChange={(key) => setSelectedTab(key as "sites" | "équipes")}
        variant="bordered"
        className="w-full border-b border-border/70 bg-gradient-to-b from-content1-50 to-content1-200/80 px-2 py-3"
        size="sm"
        radius="sm"
        color="primary"
        classNames={{
          tabList: "border-1 border-border/70 bg-white",
          tabContent: "text-primary font-bold",
        }}
      />
      <div className="mt-[22px] flex-1 overflow-auto px-2">
        <div className="mb-4 flex justify-end gap-2">
          <div className="text-xs">CP(N-1)</div>
          <div className="text-xs">CP(N)</div>
          <div className="text-xs">Pris</div>
        </div>
        {sites.map((site) => (
          <div key={site.id}>
            <div
              className="mb-1 flex cursor-pointer items-center justify-between rounded-md border border-border/70 bg-content1-200 p-1 transition-colors duration-200 hover:opacity-80"
              onClick={() => toggleSiteExpand(site.id)}
            >
              <div className="flex items-center">
                <IconChevronDown
                  className={`mr-2 transition-transform duration-200 ease-in-out ${expandedSites[site.id] ? "rotate-0" : "-rotate-90"}`}
                  size={16}
                />
                <span className="text-sm font-medium">{site.name}</span>
              </div>
              {site.users.length > 0 && (
                <span className="text-xs text-foreground-400">
                  {site.users.length}
                </span>
              )}
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSites[site.id]
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {site.users.map((user) => (
                <div
                  key={user.id}
                  className="group flex h-8 items-center justify-between p-2 transition-colors duration-150 hover:bg-content1-200"
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className="flex items-center">
                    <span className="text-xs">
                      {user.lastName} {user.firstName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-foreground-400">
                    <span className="w-6 text-center font-medium">
                      {user.badgeCount}
                    </span>
                    <span className="w-6 text-center">{user.hoursPerWeek}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
