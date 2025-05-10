import { Suspense } from "react";

import { AbsenceTypesContent } from "../_components/absenceTypes/AbsenceTypesContent";
import { getRouteByKey } from "../_components/common/routes";
import { HolidaysContent } from "../_components/holidays/HolidaysContent";
import { LeaveTypeContent } from "../_components/leaveTypes/LeaveTypeContent";
import { WorkingDaysContent } from "../_components/workingDays/WorkingDaysContent";

interface SearchParams {
  name?: string;
}

const ContentLoader = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <p className="text-default-500">Chargement...</p>
  </div>
);

const ClientContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return children;
};

function renderContentByRouteKey(routeKey?: string) {
  switch (routeKey) {
    case "holidays":
      return <HolidaysContent />;

    case "leave-types":
      return <LeaveTypeContent />;

    case "absence-types":
      return <AbsenceTypesContent />;

    default:
      return <WorkingDaysContent />;
  }
}

const SettingsContent = async ({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) => {
  const resolvedParams = await Promise.resolve(searchParams);
  const { name } = resolvedParams;

  const route = name ? getRouteByKey(name) : undefined;

  return (
    <Suspense fallback={<ContentLoader />}>
      <ClientContentWrapper>
        {renderContentByRouteKey(route?.key)}
      </ClientContentWrapper>
    </Suspense>
  );
};

export default SettingsContent;
