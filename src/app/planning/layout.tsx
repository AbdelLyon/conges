type Props = {
  children: React.ReactNode;
  planningBody: React.ReactNode;
  planningHeader: React.ReactNode;
  planningSidebar: React.ReactNode;
  planningToolbar: React.ReactNode;
};
export default function Layout({
  children,
  planningBody,
  planningHeader,
  planningSidebar,
  planningToolbar,
}: Props) {
  return (
    <>
      {children}
      <div className="flex w-full flex-col bg-background text-foreground">
        {planningToolbar}

        <div className="flex gap-2">
          {planningSidebar}

          <div className="flex-1 overflow-x-auto rounded-t-lg border border-border/70">
            {planningHeader}
            {planningBody}
          </div>
        </div>
      </div>
    </>
  );
}
