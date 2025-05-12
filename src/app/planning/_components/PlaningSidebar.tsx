"use client";

import { useState } from "react";
import { IconChevronDown, IconEye, IconEyeClosed } from "x-react/icons";
import { TabItem, Tabs } from "x-react/tabs";
import { Tooltip } from "x-react/tooltip";

import { sites } from "@/data/leaves";
import { usePlanningStore } from "@/store/usePlanningStore";

export const PlanningSidebar = () => {
  const {
    expandedSites,
    setExpandedSites,
    selectedTab,
    setSelectedTab,
    setHoveredUser,
    searchQuery,
  } = usePlanningStore();

  const toggleSiteExpand = (siteId: string) => {
    setExpandedSites({
      ...expandedSites,
      [siteId]: !expandedSites[siteId],
    });
  };

  const filteredSites = sites.map((site) => ({
    ...site,
    users: site.users.filter(
      (user) =>
        searchQuery === "" ||
        `${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

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

  const getLeaveBalance = (
    userId: number,
    leaveTypeId: number,
    isLastYear: boolean,
  ) => {
    const user = sites
      .flatMap((site) => site.users)
      .find((u) => u.id === userId);
    if (!user || !user.user_leave_counts) return 0;

    const leaveCount = user.user_leave_counts.find(
      (count) =>
        count.leave_type_id === leaveTypeId &&
        count.is_last_year === isLastYear,
    );

    return leaveCount ? leaveCount.balance : 0;
  };

  const [showBalances, setShowBalances] = useState<boolean>(false);

  return (
    <div className="flex w-[270px] flex-col rounded-t-lg border border-border bg-background">
      <div className="relative">
        <Tabs
          items={tabs}
          defaultActiveTab={selectedTab}
          onTabChange={(key) => setSelectedTab(key as "sites" | "équipes")}
          variant="bordered"
          className="w-full border-b border-border bg-gradient-to-b from-content1-100/40 to-content1/5 p-3 px-2 dark:from-content1-100/20 dark:to-content1-100/60"
          size="sm"
          radius="sm"
          color="primary"
          classNames={{
            tabList: "border-1 border-border bg-white",
            tabContent: "text-primary font-bold",
          }}
        />
        <div className="absolute right-2 top-5 flex items-center gap-1">
          <Tooltip
            content={
              showBalances ? "Masquer les soldes" : "Afficher les soldes"
            }
            trigger={
              <button
                className="flex size-6 items-center justify-center rounded-md bg-primary/90 text-white transition-colors duration-300 hover:bg-primary"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? (
                  <IconEyeClosed size={16} />
                ) : (
                  <IconEye size={16} />
                )}
              </button>
            }
          />
        </div>
      </div>

      <div className="mt-[22px] flex-1 overflow-auto px-2">
        <div
          className="mb-4 flex justify-end gap-2 text-foreground-500 transition-opacity duration-200"
          style={{ opacity: showBalances ? 1 : 0 }}
        >
          <div className="text-xs">CP(N-1)</div>
          <div className="text-xs">CP(N)</div>
          <div className="text-xs">Pris</div>
        </div>
        {filteredSites.map((site) => (
          <div key={site.id}>
            <div
              className="mb-1 flex cursor-pointer items-center justify-between rounded-md border border-border/40 bg-content1-100/50 px-2 py-1.5 transition-colors duration-300 hover:opacity-80 dark:bg-content1"
              onClick={() => toggleSiteExpand(site.id)}
            >
              <div className="flex items-center">
                <IconChevronDown
                  className={`mr-2 transition-transform duration-300 ease-in-out ${expandedSites[site.id] ? "rotate-0" : "-rotate-90"}`}
                  size={16}
                />
                <span className="text-xs font-medium">{site.name}</span>
              </div>
              {site.users.length > 0 && (
                <span className="text-xs text-foreground-500">
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
              {site.users.map((user) => {
                const cpLastYear = getLeaveBalance(user.id, 17, true);
                const cpCurrentYear = getLeaveBalance(user.id, 17, false);
                const cpTaken =
                  user.user_leave_counts?.find(
                    (count) =>
                      count.leave_type_id === 17 && !count.is_last_year,
                  )?.taken || 0;

                return (
                  <div
                    key={user.id}
                    className="group flex h-8 items-center justify-between p-2 transition-colors duration-150 hover:bg-content1-100"
                    onMouseEnter={() => setHoveredUser(user.id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <span className="truncate text-xs">
                      {user.lastname} {user.firstname}
                    </span>
                    <div
                      className="transition-opacity duration-300"
                      style={{ opacity: showBalances ? 1 : 0 }}
                    >
                      {showBalances && (
                        <div className="flex items-center space-x-2 text-xs text-foreground-500">
                          <span className="w-6 text-center font-medium">
                            {cpLastYear}
                          </span>
                          <span className="w-6 text-center">
                            {cpCurrentYear}
                          </span>
                          <span className="w-6 text-center">{cpTaken}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
