"use client";

import { useState } from "react";
import { Card } from "x-react/card";
import { Checkbox } from "x-react/form";
import { mergeTailwindClasses } from "x-react/utils";

const HOLIDAYS = [
  { name: "Jour de l'an", date: "(Mercredi 01 janvier)", value: "new-year" },
  { name: "Noël", date: "(Jeudi 25 décembre)", value: "christmas" },
  { name: "Lundi de Pâques", date: "(Lundi 21 avril)", value: "easter-monday" },
  { name: "Fête du Travail", date: "(Jeudi 01 mai)", value: "labor-day" },
  { name: "Victoire 1945", date: "(Jeudi 08 mai)", value: "victory-1945" },
  { name: "Ascension", date: "(Jeudi 29 mai)", value: "ascension" },
  {
    name: "Lundi de Pentecôte",
    date: "(Lundi 09 juin)",
    value: "pentecost-monday",
  },
  { name: "Fête nationale", date: "(Lundi 14 juillet)", value: "national-day" },
  { name: "Assomption", date: "(Vendredi 15 août)", value: "assumption" },
  { name: "Toussaint", date: "(Samedi 01 novembre)", value: "all-saints" },
  {
    name: "Armistice 1918",
    date: "(Mardi 11 novembre)",
    value: "armistice-1918",
  },
];

export const HolidaysContent = () => {
  const [selectedHolidays, setSelectedHolidays] = useState(
    HOLIDAYS.map((holiday) => holiday.value),
  );

  const handleHolidayChange = (value: string) => {
    if (selectedHolidays.includes(value)) {
      setSelectedHolidays(selectedHolidays.filter((item) => item !== value));
    } else {
      setSelectedHolidays([...selectedHolidays, value]);
    }
  };

  // Gestion de la sélection/désélection de tous les jours fériés
  const allSelected = selectedHolidays.length === HOLIDAYS.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedHolidays([]);
    } else {
      setSelectedHolidays(HOLIDAYS.map((h) => h.value));
    }
  };

  return (
    <Card
      radius="lg"
      shadow="none"
      className="border border-border dark:bg-background"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium opacity-50">
          Sélectionnez les jours fériés à prendre en compte
        </p>

        <div
          className={mergeTailwindClasses(
            "flex cursor-pointer select-none items-center gap-2 rounded-md border border-border p-2 transition-all hover:border-outline/10",
            {
              "border-outline/10 bg-outline/5": allSelected,
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
        {HOLIDAYS.map((holiday) => (
          <div
            key={holiday.value}
            className={`flex cursor-pointer select-none items-center gap-3 rounded-md border 
              border-border p-2 transition-all 
              hover:border-outline/10 ${
                selectedHolidays.includes(holiday.value)
                  ? "border-outline/10 bg-outline/5"
                  : ""
              }`}
            onClick={() => handleHolidayChange(holiday.value)}
          >
            <Checkbox
              isSelected={selectedHolidays.includes(holiday.value)}
              onValueChange={() => handleHolidayChange(holiday.value)}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
            <div>
              <span className="font-medium">{holiday.name}</span>{" "}
              <span className="text-default-500">{holiday.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
