"use client";

import { Tabs } from "@xefi/x-react/tabs";

import { PageContainer } from "@/components/PageContainer";

import { SettingsCard } from "./_components/common/SettingsCard";

interface LayoutProps {
  children?: React.ReactNode;
  settingsContent: React.ReactNode;
  settingsSide: React.ReactNode;
}

const Layout = ({ settingsSide, settingsContent, children }: LayoutProps) => {
  const mainTabs = [
    {
      key: "leaves",
      title: "Congés",
      content: (
        <LeaveSettingsTabs
          settingsSide={settingsSide}
          settingsContent={settingsContent}
        >
          {children}
        </LeaveSettingsTabs>
      ),
    },
    {
      key: "counter",
      title: "Compteur",
      content: <CounterContent />,
    },
  ];

  return (
    <PageContainer
      title="Paramétrage des congés"
      classNames={{
        base: "xl:w-full 2xl:w-10/12",
      }}
    >
      <Tabs
        defaultActiveTab="leaves"
        defaultSelectedKey="leaves"
        variant="underlined"
        items={mainTabs}
      />
    </PageContainer>
  );
};

interface LeaveSettingsTabsProps {
  children?: React.ReactNode;
  settingsContent: React.ReactNode;
  settingsSide: React.ReactNode;
}

const LeaveSettingsTabs = ({
  children,
  settingsSide,
  settingsContent,
}: LeaveSettingsTabsProps) => {
  const leaveTabs = [
    {
      key: "defaultSettings",
      title: "Paramètrage par défaut",
      content: (
        <DefaultSettingsContent
          settingsSide={settingsSide}
          settingsContent={settingsContent}
        >
          {children}
        </DefaultSettingsContent>
      ),
    },
    {
      key: "sitesSettings",
      title: "Paramètrage par site",
      content: <SiteSettingsContent>{children}</SiteSettingsContent>,
    },
  ];

  return (
    <Tabs
      defaultActiveTab="defaultSettings"
      defaultSelectedKey="defaultSettings"
      variant="bordered"
      items={leaveTabs}
    />
  );
};

interface DefaultSettingsContentProps {
  children?: React.ReactNode;
  settingsContent: React.ReactNode;
  settingsSide: React.ReactNode;
}

const DefaultSettingsContent = ({
  children,
  settingsSide,
  settingsContent,
}: DefaultSettingsContentProps) => (
  <>
    {children}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      {settingsSide}
      <div className="md:block lg:col-span-9">
        <SettingsCard>{settingsContent}</SettingsCard>
      </div>
    </div>
  </>
);

interface SiteSettingsContentProps {
  children?: React.ReactNode;
}

const SiteSettingsContent = ({ children }: SiteSettingsContentProps) => (
  <>
    {children}
    <p>Paramètrage par site</p>
  </>
);

const CounterContent = () => <p>Compteur</p>;

export default Layout;
