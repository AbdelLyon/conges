"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnDefinition, DataGrid } from "x-react/datagrid";
import { Avatar } from "x-react/avatar";
import { Chip } from "x-react/chip";
import { Input, InfiniteSelect } from "x-react/form";

// Types
interface UserHair {
  color: string;
  type: string;
}

interface UserAddress {
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface UserBank {
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface UserCompany {
  name: string;
  department: string;
  title: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: UserHair;
  domain: string;
  ip: string;
  address: UserAddress;
  gender: string;
  university: string;
  bank: UserBank;
  company: UserCompany;
}

interface ApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

interface FetchUsersResult {
  items: User[];
  hasMore: boolean;
  total: number;
}

export default function UsersGridWithReactQuery() {
  // API calls
  const fetchUsers = async (pageParam = 0): Promise<ApiResponse> => {
    console.log(`Loading users: skip=${pageParam}, limit=10`);
    const response = await fetch(
      `https://dummyjson.com/users?limit=10&skip=${pageParam}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  };

  const fetchUsersForSelect = async (
    offset: number,
    limit: number,
  ): Promise<FetchUsersResult> => {
    const response = await fetch(
      `https://dummyjson.com/users?limit=${limit}&skip=${offset}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return {
      items: data.users,
      hasMore: offset + limit < data.total,
      total: data.total,
    };
  };

  // React Query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    ApiResponse,
    Error,
    { pages: ApiResponse[] },
    unknown[],
    number
  >({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });

  // Grid columns configuration
  const columns: ColumnDefinition<User>[] = [
    {
      field: "id",
      header: "ID",
      sortable: true,
    },
    {
      field: "firstName",
      header: "Utilisateur",
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            size="sm"
            className="mr-2"
          />
          <div>
            <div>{`${user.firstName} ${user.lastName}`}</div>
            <div className="text-xs text-gray-500">@{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "gender",
      header: "Genre",
      sortable: true,
      cell: (user) => {
        const genderColors: Record<
          string,
          "default" | "success" | "danger" | "warning" | "primary" | "secondary"
        > = {
          male: "primary",
          female: "secondary",
        };
        return (
          <Chip color={genderColors[user.gender] || "default"} variant="flat">
            {user.gender === "male" ? "Homme" : "Femme"}
          </Chip>
        );
      },
    },
    {
      field: "bloodGroup",
      header: "Groupe sanguin",
      cell: (user) => (
        <Chip
          variant="flat"
          color={user.bloodGroup.includes("-") ? "danger" : "success"}
        >
          {user.bloodGroup}
        </Chip>
      ),
    },
    {
      field: "company",
      header: "Entreprise",
      cell: (user) => <div>{user.company.name}</div>,
    },
    {
      field: "address",
      header: "Ville",
      cell: (user) => `${user.address.city}, ${user.address.state}`,
    },
    {
      field: "university",
      header: "Université",
      sortable: true,
    },
    {
      field: "birthDate",
      header: "Date de naissance",
      cell: (user) => new Date(user.birthDate).toLocaleDateString("fr-FR"),
    },
  ];

  // Event handlers
  const handleLoadMore = () => {
    console.log("LoadMore triggered, fetching next page...");
    fetchNextPage();
  };

  const handleSortChange = (column: keyof User, direction: "asc" | "desc") => {
    console.log(`Sorting by ${String(column)} in ${direction} order`);
    // Implement actual sorting logic here if needed
  };

  // Flatten the paginated data
  const users = data?.pages.flatMap((page) => page.users) || [];

  // Error handling
  if (isError) {
    return (
      <div className="p-4 text-center text-danger">
        <p>Error: {(error as Error).message}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <DataGrid
        rows={users}
        columns={columns}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        hasMoreData={!!hasNextPage}
        fetchNextPage={handleLoadMore}
        onSortChange={handleSortChange}
        isHeaderSticky
        className="overflow-hidden"
        topContentPlacement="outside"
        showSelectionCheckboxes
        selectionMode="multiple"
        isCompact
        topContent={
          <div className="flex gap-2 px-1">
            <Input
              placeholder="Search by name"
              className="h-10"
              radius="sm"
              classNames={{
                inputWrapper: "border border-border",
              }}
            />
            <Input
              placeholder="Search by email"
              className="h-10"
              radius="sm"
              classNames={{
                inputWrapper: "border border-border",
              }}
            />
            <Input
              placeholder="Filter by company"
              className="h-10"
              radius="sm"
              classNames={{
                inputWrapper: "border border-border",
              }}
            />
            <InfiniteSelect<User>
              fetchFunction={fetchUsersForSelect}
              limit={10}
              getItemKey={(user) => `user-${user.id}`}
              selectionMode="multiple"
              variant="bordered"
              placeholder="users..."
              isMultiline
              showScrollIndicators
              shouldFlip
              renderItem={(user) => (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    size="sm"
                  />
                  <div>
                    <div>{`${user.firstName} ${user.lastName}`}</div>
                    <div className="text-xs text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        }
        infiniteScrollOptions={{
          enabled: true,
          threshold: 0.1,
          rootMargin: "0px 0px 300px 0px",
          debounceTime: 100,
        }}
        loadingMoreContent={
          <div className="flex items-center justify-center gap-2 p-3">
            <span>Loading users...</span>
          </div>
        }
        noMoreDataContent={
          <div className="text-center p-3 text-gray-500">
            All users have been loaded
          </div>
        }
        classNames={{
          base: "max-h-[670px] overflow-scroll",
          table: "min-h-[400px]",
          wrapper: "border border-border p-0",
          th: "h-16 bg-content1",
        }}
      />

      <div className="mt-4 text-sm text-gray-500">
        {users.length > 0 && (
          <p>
            Showing {users.length} users out of {data?.pages[0].total || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
}
