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
      className: "max-w-[200px] truncate",
      sortable: true,
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            size="sm"
            className="mr-2"
          />
          <p>{`${user.firstName} ${user.lastName}`}</p>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
      className: "max-w-[200px] truncate",
    },
    {
      field: "gender",
      header: "Genre",
      sortable: true,
      className: "max-w-24 truncate",
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
      className: "w-[40px] truncate",

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
      className: "max-w-[200px] truncate",

      cell: (user) => (
        <p className="max-w-[100px] truncate">{user.company.name}</p>
      ),
    },
    {
      field: "address",
      header: "Ville",

      cell: (user) => (
        <p className="max-w-[100px] truncate">{`${user.address.city}, ${user.address.state}`}</p>
      ),
    },
    {
      field: "university",
      header: "Université",
      className: "max-w-[400px] truncate",
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
