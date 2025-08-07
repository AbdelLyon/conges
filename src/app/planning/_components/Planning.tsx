import { IconLoader2 } from "@xefi/x-react/icons";
import { useEffect } from "react";

import { leaveService } from "@/services/api/leave/LeaveTypeService";
import { userService } from "@/services/api/UserService";
import { PostSearchRequest, User } from "@/services/types";
import { usePlanningStore } from "@/store/usePlanningStore";
import { useUserStore } from "@/store/useUserStore";

import { PlanningSidebar } from "./PlaningSidebar";
import { PlanningBody } from "./PlanningBody";
import { PlanningHeader } from "./PlanningHeader";
import { PlanningToolbar } from "./PlanningToolbar";

const getFullname = (user: User): string =>
  `${user.firstname} ${user.lastname}`.trim();

export const Planning = () => {
  const { currentUser } = useUserStore();

  // Utilisation du store pour tous les états
  const {
    // États existants
    page,
    setPage,

    // Nouveaux états du store
    leaveTypes,
    setLeaveTypes,
    setLeaveTypesN1,
    users,
    addUsers,
    resetUsers,
    setUsersGroupedBySite,
    allUserLength,
    setAllUserLength,
    filters,
    isTagsDisplay,
    isLoading,
    setIsLoading,
  } = usePlanningStore();

  // Permissions utilisateur
  const isAdmin = ["ADMINISTRATEUR", "ADMINISTRATEURMANAGER"].includes(
    currentUser?.profile?.label ?? "",
  );
  const isDirector = currentUser?.profile?.label === "DIRECTOR";

  const fetchLeaveTypes = async () => {
    try {
      const { data } = await leaveService.search({
        sort: [{ field: "order_appearance", direction: "asc" }],
      });

      const normalizeColor = (color: string) =>
        color.replace(/0xFF|0xff/g, "#");

      const normalizedLeaveTypes = data.map((lt) => ({
        ...lt,
        color: normalizeColor(lt.color),
      }));

      setLeaveTypes(normalizedLeaveTypes);

      const n1Types = data
        .filter(({ needs_count }) => needs_count)
        .flatMap((lt) => {
          const baseType = { ...lt, color: normalizeColor(lt.color) };

          return lt.is_pay
            ? [{ ...baseType, name: `${lt.name} N-1` }, baseType]
            : [baseType];
        });

      setLeaveTypesN1(n1Types);
    } catch (error) {
      console.error("Erreur lors du chargement des types de congés:", error);
      setLeaveTypes([]);
      setLeaveTypesN1([]);
    }
  };

  const extractSitesAndTagsFromUsers = (userList: User[]) => {
    const grouped = Object.entries(
      userList.reduce(
        (acc, user) => {
          const key =
            isTagsDisplay && user.tag_id
              ? `tag_${user.tag_label}_${user.tag_id}`
              : `site_${user.site?.name}_${user.site?.id}`;

          acc[key] ??= [];
          acc[key].push(user);
          return acc;
        },
        {} as Record<string, User[]>,
      ),
    ).map(([name, users]) => ({
      name,
      users: users
        .map((user) => ({ ...user, name: getFullname(user) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

    setUsersGroupedBySite(grouped);
  };

  const buildSearchRequest = (): PostSearchRequest => {
    const filtersWithoutPeriod = filters.filter(
      ({ field }) => !["start_date", "end_date"].includes(field),
    );

    const baseRequest: PostSearchRequest = {
      filters: filtersWithoutPeriod,
      sort: [
        { field: "site.name", direction: "asc" },
        { field: "lastname", direction: "asc" },
      ],
      aggregates: [
        {
          relation: "directors",
          type: "exists",
          filters: [
            {
              field: "directors.director_id",
              operator: "=",
              value: currentUser?.id as number,
            },
          ],
        },
      ],
    };

    if (!isTagsDisplay && !isAdmin && !isDirector) {
      baseRequest.scopes = [{ name: "viewUndirectManagedUsers" }];
    }

    return baseRequest;
  };

  const fetchUsers = async (resetData = false) => {
    setIsLoading(true);

    try {
      const searchRequest = buildSearchRequest();

      const response = await userService.searchUsersForPlanning(
        searchRequest,
        page,
        30,
        isTagsDisplay,
      );

      setAllUserLength(response.meta.total);

      if (resetData) {
        resetUsers();
      }

      addUsers(response.data);
      extractSitesAndTagsFromUsers(
        resetData ? response.data : users.concat(response.data),
      );
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setPage(page + 1);
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchUsers();
    }
  }, [page]);

  const canLoadMore = users.length < allUserLength;

  return (
    <div className="flex w-full flex-col bg-background text-foreground">
      <PlanningToolbar leaveTypes={leaveTypes} />

      <div className="flex gap-2">
        <PlanningSidebar />

        <div className="flex-1 overflow-x-auto rounded-t-lg border border-border/60">
          <PlanningHeader />
          <PlanningBody />
        </div>
      </div>

      <div className="relative mb-8 mt-4 flex items-center justify-center">
        {canLoadMore && (
          <button
            className="ml-[300px] cursor-pointer rounded bg-[#E20917] px-3 py-2 text-sm text-white hover:bg-[#B10713] disabled:opacity-50"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              "Charger plus de collaborateurs"
            )}
          </button>
        )}

        <p className="absolute right-4 text-xs opacity-70">
          Collaborateurs: {users.length} / {allUserLength}
        </p>
      </div>
    </div>
  );
};
