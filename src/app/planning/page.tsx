"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { PageContainer } from "@/components/PageContainer";

import { Planning } from "./_components/Planning";

dayjs.extend(isBetween);

const PlanningPage = () => {
  return (
    <PageContainer title="Planning">
      <Planning />
    </PageContainer>
  );
};

export default PlanningPage;
