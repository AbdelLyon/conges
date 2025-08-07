"use client";

import { Checkbox } from "@xefi/x-react/form";
import { mergeTailwindClasses } from "@xefi/x-react/utils";
import { useState } from "react";

const WORKING_DAYS = [
  { name: "Lundi", value: "monday" },
  { name: "Mardi", value: "tuesday" },
  { name: "Mercredi", value: "wednesday" },
  { name: "Jeudi", value: "thursday" },
  { name: "Vendredi", value: "friday" },
  { name: "Samedi", value: "saturday" },
  { name: "Dimanche", value: "sunday" },
];

export const WorkingDaysContent = () => {
  const [selectedDays, setSelectedDays] = useState(
    WORKING_DAYS.slice(0, 5).map((day) => day.value),
  );

  const handleDayChange = (value: string) => {
    if (selectedDays.includes(value)) {
      setSelectedDays(selectedDays.filter((item) => item !== value));
    } else {
      setSelectedDays([...selectedDays, value]);
    }
  };

  const allSelected = selectedDays.length === WORKING_DAYS.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDays([]);
    } else {
      setSelectedDays(WORKING_DAYS.map((day) => day.value));
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium opacity-50">
          Sélectionnez les jours de la semaine considérés comme ouvrés
        </p>

        <div
          className={mergeTailwindClasses(
            "flex cursor-pointer select-none items-center gap-2 rounded-md border border-border p-2 transition-all hover:border-outline/15",
            {
              "border-outline/15 bg-outline/5": allSelected,
            },
          )}
          onClick={handleSelectAll}
        >
          <Checkbox
            isSelected={allSelected}
            onValueChange={() => handleSelectAll()}
            onClick={(e) => e.stopPropagation()}
            color="primary"
          />
          <span className="text-sm font-medium">Tout sélectionner</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {WORKING_DAYS.map((day) => (
          <div
            key={day.value}
            className={`flex cursor-pointer select-none items-center gap-3 rounded-md border border-border 
              p-2 transition-all hover:border-outline/15 ${
                selectedDays.includes(day.value)
                  ? "border-outline/15 bg-outline/5"
                  : ""
              }`}
            onClick={() => handleDayChange(day.value)}
          >
            <Checkbox
              isSelected={selectedDays.includes(day.value)}
              onValueChange={() => handleDayChange(day.value)}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
            <span className="font-medium">{day.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};
