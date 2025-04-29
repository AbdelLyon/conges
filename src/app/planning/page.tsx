"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { PlanningToolbar } from "./_components/PlanningToolbar";

dayjs.extend(isBetween);

const PlanningComponent: React.FC = () => {
  return <PlanningToolbar />;
};

export default PlanningComponent;
