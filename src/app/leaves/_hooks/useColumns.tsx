import { Avatar } from "x-react/avatar";
import { Chip } from "x-react/chip";
import { ColumnDefinition } from "x-react/datagrid";
import { TruncatedText } from "x-react/utils";

import { User } from "../typesTest";

export const useLeaveColumns = () => {
  const columns: ColumnDefinition<User>[] = [
    {
      field: "firstName",
      header: "Utilisateur",
      sortable: true,
      className: "w-[200px]",
      cell: (user: User) => (
        <div className="flex w-full items-center gap-2">
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
      className: "w-[150px]",
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
      header: (
        <TruncatedText className="max-w-[100px] truncate text-sm font-semibold text-foreground transition-all duration-200">
          Groupe sanguin smlkdmkdmksdk
        </TruncatedText>
      ),
      className: "w-[100px]",
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

      cell: (user) => user.company.name,
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
