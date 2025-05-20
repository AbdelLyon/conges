import { PageContainer } from "@/components/PageContainer";
import { ServerQueryProvider } from "@/providers/ServerQueryProvider";
import { userService } from "@/services/api/UserService";

import Leaves from "./_components/Leaves";

export default function ProductsPage() {
  return (
    <PageContainer title="Mes congés & absences">
      <ServerQueryProvider
        prefetchFn={async (queryClient) => {
          await queryClient.prefetchInfiniteQuery({
            queryKey: ["users"],
            queryFn: (context) => userService.getUsers(context.pageParam),
            initialPageParam: 1,
          });
        }}
      >
        <Leaves />
      </ServerQueryProvider>
    </PageContainer>
  );
}
