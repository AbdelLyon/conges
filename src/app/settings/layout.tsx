import { PageContainer } from "@/components/PageContainer";

import { SettingsCard } from "./_components/SettingsCard";
import { SettingsHeader } from "./_components/SettingsHeader";

type Props = {
  children: React.ReactNode;
  settingsForm: React.ReactNode;
  settingsLeave: React.ReactNode;
  settingsSide: React.ReactNode;
};

const Layout = ({ settingsSide, settingsForm, settingsLeave }: Props) => {
  return (
    <PageContainer
      title="Paramétrage des congés"
      classNames={{
        base: "xl:w-full 2xl:w-10/12",
      }}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="mb-2 flex items-center justify-between lg:hidden">
          <SettingsHeader />
        </div>
        {settingsSide}

        <div className={`md:block lg:col-span-9`}>
          <SettingsCard
            header={
              <div className="flex w-full flex-col items-start justify-between rounded-t-lg border border-border/70 bg-content1-100 p-4 sm:flex-row sm:items-center">
                <h2 className="text-xl font-medium">Type de congé</h2>
                <div className="hidden sm:block">
                  <SettingsHeader isHeaderButton />
                </div>
              </div>
            }
          >
            <div className="mb-3 flex justify-end">
              <SettingsHeader isCreateButton />
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
              <div className="md:col-span-5 lg:col-span-4">{settingsLeave}</div>
              <div className="md:col-span-7 lg:col-span-8">{settingsForm}</div>
            </div>
          </SettingsCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default Layout;
