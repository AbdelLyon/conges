import { Avatar } from "x-react/avatar";
import { Chip } from "x-react/chip";
import { ColumnDefinition } from "x-react/datagrid";

import { User } from "../typesTest";

export const useLeaveColumns = () => {
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
      cell: (user: User) => (
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
  return {
    columns,
  };
};
