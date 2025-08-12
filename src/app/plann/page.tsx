"use client";
import {
  type FilterConfig,
  type LegendConfig,
  Planning,
  type PlanningDay,
  type PlanningGroup,
  type PlanningItem,
  type PlanningUser,
  type ViewMode,
} from "@xefi/x-react/templates";
import dayjs from "dayjs";
import { useState } from "react";

// Types d'exemple pour un planning de congés
interface LeaveData {
  type: "vacation" | "sick" | "personal" | "training";
  status: "pending" | "approved" | "rejected";
  notes?: string;
  duration: number; // en jours
  isHalfDay: boolean;
}

interface EmployeeData {
  email: string;
  department: string;
  role: string;
  remainingDays: number;
  manager: string;
  avatar?: string;
}

interface TeamData {
  managerId: string;
  location: string;
  budget: number;
  color: string;
}

const CompletePlanningExample = () => {
  // État local
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "dev-team": true,
      "design-team": false,
      "marketing-team": false,
    },
  );

  // Données d'exemple
  const groups: PlanningGroup<TeamData, EmployeeData>[] = [
    {
      id: "dev-team",
      name: "Équipe Développement",
      count: 8,
      data: {
        managerId: "manager-1",
        location: "Paris",
        budget: 250000,
        color: "#3b82f6",
      },
      users: [
        {
          id: "emp-1",
          name: "Alice Martin",
          firstname: "Alice",
          lastname: "Martin",
          email: "alice.martin@company.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b9c3c3ba?w=32&h=32&fit=crop&crop=face",
          data: {
            email: "alice.martin@company.com",
            department: "Frontend",
            role: "Senior Developer",
            remainingDays: 25,
            manager: "manager-1",
          },
        },
        {
          id: "emp-2",
          name: "Bob Dupont",
          firstname: "Bob",
          lastname: "Dupont",
          email: "bob.dupont@company.com",
          data: {
            email: "bob.dupont@company.com",
            department: "Backend",
            role: "Tech Lead",
            remainingDays: 18,
            manager: "manager-1",
          },
        },
        {
          id: "emp-3",
          name: "Claire Moreau",
          firstname: "Claire",
          lastname: "Moreau",
          email: "claire.moreau@company.com",
          data: {
            email: "claire.moreau@company.com",
            department: "DevOps",
            role: "DevOps Engineer",
            remainingDays: 22,
            manager: "manager-1",
          },
        },
      ],
    },
    {
      id: "design-team",
      name: "Équipe Design",
      count: 5,
      data: {
        managerId: "manager-2",
        location: "Lyon",
        budget: 180000,
        color: "#10b981",
      },
      users: [
        {
          id: "emp-4",
          name: "David Chen",
          firstname: "David",
          lastname: "Chen",
          email: "david.chen@company.com",
          data: {
            email: "david.chen@company.com",
            department: "UX/UI",
            role: "Lead Designer",
            remainingDays: 20,
            manager: "manager-2",
          },
        },
        {
          id: "emp-5",
          name: "Emma Wilson",
          firstname: "Emma",
          lastname: "Wilson",
          email: "emma.wilson@company.com",
          data: {
            email: "emma.wilson@company.com",
            department: "Graphics",
            role: "Graphic Designer",
            remainingDays: 15,
            manager: "manager-2",
          },
        },
      ],
    },
    {
      id: "marketing-team",
      name: "Équipe Marketing",
      count: 4,
      data: {
        managerId: "manager-3",
        location: "Remote",
        budget: 120000,
        color: "#f59e0b",
      },
      users: [
        {
          id: "emp-6",
          name: "Frank Garcia",
          firstname: "Frank",
          lastname: "Garcia",
          email: "frank.garcia@company.com",
          data: {
            email: "frank.garcia@company.com",
            department: "Digital Marketing",
            role: "Marketing Manager",
            remainingDays: 12,
            manager: "manager-3",
          },
        },
      ],
    },
  ];

  const items: PlanningItem<LeaveData>[] = [
    {
      id: "leave-1",
      user_id: "emp-1",
      start_date: "2024-12-20",
      end_date: "2024-12-27",
      color: "#3b82f6",
      title: "Congés de Noël",
      data: {
        type: "vacation",
        status: "approved",
        notes: "Vacances famille",
        duration: 7,
        isHalfDay: false,
      },
    },
    {
      id: "leave-2",
      user_id: "emp-2",
      start_date: "2024-12-15",
      end_date: "2024-12-16",
      color: "#ef4444",
      title: "Congé maladie",
      data: {
        type: "sick",
        status: "approved",
        duration: 2,
        isHalfDay: false,
      },
    },
    {
      id: "leave-3",
      user_id: "emp-4",
      start_date: "2024-12-23",
      end_date: "2024-12-30",
      color: "#f59e0b",
      title: "Congés fin d'année",
      data: {
        type: "vacation",
        status: "pending",
        duration: 6,
        isHalfDay: false,
      },
    },
    {
      id: "leave-4",
      user_id: "emp-3",
      start_date: "2024-12-18",
      end_date: "2024-12-18",
      color: "#8b5cf6",
      title: "Formation Docker",
      data: {
        type: "training",
        status: "approved",
        duration: 0.5,
        isHalfDay: true,
      },
    },
  ];

  // Générer les jours de la période
  const periodDays: PlanningDay<dayjs.Dayjs>[] = Array.from(
    { length: 31 },
    (_, i) => {
      const date = currentDate.startOf("month").add(i, "day");
      return {
        date,
        isWeekend: date.day() === 0 || date.day() === 6,
        isHoliday: date.date() === 25, // Noël
        holidayName: date.date() === 25 ? "Noël" : undefined,
        isToday: date.isSame(dayjs(), "day"),
      };
    },
  );

  // Configuration des filtres
  const filters: FilterConfig[] = [
    {
      key: "department",
      label: "Département",
      type: "select",
      placeholder: "Tous les départements",
      options: [
        { key: "frontend", label: "Frontend", value: "Frontend" },
        { key: "backend", label: "Backend", value: "Backend" },
        { key: "devops", label: "DevOps", value: "DevOps" },
        { key: "design", label: "Design", value: "UX/UI" },
        { key: "marketing", label: "Marketing", value: "Digital Marketing" },
      ],
    },
    {
      key: "status",
      label: "Statut des congés",
      type: "multiselect",
      placeholder: "Tous les statuts",
      options: [
        {
          key: "pending",
          label: "En attente",
          value: "pending",
          color: "#f59e0b",
        },
        {
          key: "approved",
          label: "Approuvé",
          value: "approved",
          color: "#10b981",
        },
        {
          key: "rejected",
          label: "Rejeté",
          value: "rejected",
          color: "#ef4444",
        },
      ],
    },
    {
      key: "leaveType",
      label: "Type de congé",
      type: "multiselect",
      placeholder: "Tous les types",
      options: [
        {
          key: "vacation",
          label: "Vacances",
          value: "vacation",
          color: "#3b82f6",
        },
        { key: "sick", label: "Maladie", value: "sick", color: "#ef4444" },
        {
          key: "personal",
          label: "Personnel",
          value: "personal",
          color: "#8b5cf6",
        },
        {
          key: "training",
          label: "Formation",
          value: "training",
          color: "#10b981",
        },
      ],
    },
    {
      key: "search",
      label: "Recherche",
      type: "search",
      placeholder: "Rechercher un employé...",
    },
  ];

  // Configuration de la légende
  const legend: LegendConfig = {
    enabled: true,
    toggleable: true,
    items: [
      {
        id: "vacation",
        label: "Vacances",
        color: "#3b82f6",
        count: 2,
        visible: true,
      },
      {
        id: "sick",
        label: "Maladie",
        color: "#ef4444",
        count: 1,
        visible: true,
      },
      {
        id: "personal",
        label: "Personnel",
        color: "#8b5cf6",
        count: 0,
        visible: true,
      },
      {
        id: "training",
        label: "Formation",
        color: "#10b981",
        count: 1,
        visible: true,
      },
      {
        id: "pending",
        label: "En attente",
        color: "#f59e0b",
        count: 1,
        visible: true,
      },
      {
        id: "approved",
        label: "Approuvé",
        color: "#10b981",
        count: 3,
        visible: true,
      },
      {
        id: "weekend",
        label: "Week-end",
        color: "#6b7280",
        count: 8,
        visible: false,
      },
    ],
    onToggle: (itemId, visible) => {
      console.log(`Toggle legend item ${itemId}: ${visible}`);
    },
  };

  // Gestionnaires d'événements
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as ViewMode);
  };

  const handleNavigatePrevious = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const handleNavigateNext = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  const handleTodayClick = () => {
    setCurrentDate(dayjs());
  };

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleImport = async (file: File) => {
    console.log("Import file:", file.name);
    // Simulation d'import
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleExport = async (format: string) => {
    console.log("Export format:", format);
    // Simulation d'export
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleItemClick = (item: PlanningItem<LeaveData>) => {
    console.log("Item clicked:", item);
  };

  const handleCellClick = (
    user: PlanningUser<EmployeeData>,
    day: PlanningDay<dayjs.Dayjs>,
  ) => {
    console.log("Cell clicked:", user.name, day.date.format("DD/MM/YYYY"));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground-900">
          Planning des Congés - {currentDate.format("MMMM YYYY")}
        </h1>
        <p className="mt-2 text-foreground-600">
          Gérez efficacement les congés de votre équipe avec ce planning
          interactif complet.
        </p>
      </div>

      <Planning
        // Données
        groups={groups}
        items={items}
        periodDays={periodDays}
        // Configuration de la vue
        viewMode={viewMode}
        viewModes={[
          { key: "week", label: "Semaine" },
          { key: "month", label: "Mois" },
          { key: "twomonths", label: "2 Mois" },
          { key: "quarter", label: "Trimestre", disabled: true },
        ]}
        onViewModeChange={handleViewModeChange}
        // Navigation
        headerTitle={currentDate.format("MMMM YYYY")}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
        showNavigation={true}
        isLoading={true}
        // Toolbar
        toolbar={{
          enabled: true,
          filters,
          actions: [
            {
              key: "refresh",
              label: "Actualiser",
              icon: <span>🔄</span>,
              onClick: () => window.location.reload(),
              variant: "secondary",
            },
            {
              key: "settings",
              label: "Paramètres",
              icon: <span>⚙️</span>,
              onClick: () => console.log("Settings clicked"),
              variant: "default",
            },
          ],
          importExport: {
            enabled: true,
            formats: ["excel", "csv", "pdf"],
            onImport: handleImport,
            onExport: handleExport,
          },
          showToday: true,
          onTodayClick: handleTodayClick,
        }}
        // Sidebar
        sidebar={{
          enabled: true,
          width: 280,
          tabs: [
            { key: "teams", label: "Équipes", icon: <span>👥</span> },
            {
              key: "departments",
              label: "Départements",
              icon: <span>🏢</span>,
            },
          ],
          showBalances: true,
          showUserActions: true,
        }}
        // Légende
        legend={legend}
        // État
        expandedGroups={expandedGroups}
        onGroupToggle={handleGroupToggle}
        // Événements
        onItemClick={handleItemClick}
        onCellClick={handleCellClick}
        onUserClick={(user) => console.log("User clicked:", user)}
        // Rendu personnalisé de l'utilisateur dans la sidebar
        renderSidebarUser={(user, showDetails) => (
          <div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-default-100">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-8 rounded-full"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {user.firstname?.charAt(0) || user.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-foreground-500">
                  {user.data.role}
                </div>
              </div>
            </div>
            {showDetails && (
              <div className="text-right">
                <div className="text-xs font-medium text-primary">
                  {user.data.remainingDays} jours
                </div>
                <div className="text-xs text-foreground-500">restants</div>
              </div>
            )}
          </div>
        )}
        // Rendu personnalisé des éléments
        renderItem={(item, user, day) => {
          const isApproved = item.data.status === "approved";
          const isPending = item.data.status === "pending";
          const isStart =
            new Date(item.start_date).toDateString() ===
            day.date.toDate().toDateString();
          const isEnd =
            new Date(item.end_date).toDateString() ===
            day.date.toDate().toDateString();

          return (
            <div
              className={`absolute inset-0 cursor-pointer transition-all duration-200 hover:z-10 hover:shadow-lg ${
                isPending ? "animate-pulse" : ""
              }`}
              onClick={() => handleItemClick(item)}
              title={`${item.title} - ${item.data.status} (${item.data.duration} jour${item.data.duration > 1 ? "s" : ""})`}
            >
              <div
                className="h-4/5 w-full rounded-t"
                style={{
                  backgroundColor: item.color,
                  borderTopLeftRadius: isStart ? "4px" : "0",
                  borderTopRightRadius: isEnd ? "4px" : "0",
                }}
              />
              <div
                className={`h-1/5 w-full rounded-b ${
                  isApproved
                    ? "bg-green-500"
                    : isPending
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{
                  borderBottomLeftRadius: isStart ? "4px" : "0",
                  borderBottomRightRadius: isEnd ? "4px" : "0",
                }}
              />
            </div>
          );
        }}
        // Styling
        cellMinWidth="25px"
        className="rounded-xl border border-border shadow-sm"
        // Accessibilité
        ariaLabel="Planning des congés interactif"
        ariaDescription="Visualisez et gérez les congés de votre équipe"
      />
    </div>
  );
};

export default CompletePlanningExample;
