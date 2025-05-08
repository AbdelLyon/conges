import { PageContainer } from "@/components/PageContainer";

type Props = {
  children: React.ReactNode;
  planningBody: React.ReactNode;
  planningHeader: React.ReactNode;
  planningSidebar: React.ReactNode;
  planningToolbar: React.ReactNode;
};
const Layout = ({
  children,
  planningBody,
  planningHeader,
  planningSidebar,
}: Props) => {
  return (
    <PageContainer title="Planning">
      <div className="flex w-full flex-col bg-background text-foreground">
        {children}

        <div className="flex gap-2">
          {planningSidebar}

          <div className="flex-1 overflow-x-auto rounded-t-lg border border-border/70">
            {planningHeader}
            {planningBody}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Layout;
