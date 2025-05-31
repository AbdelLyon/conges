"use client";

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Checkbox, Input, SelectOption } from "x-react/form";
import { Modal } from "x-react/modal";

import { sites } from "@/data/leaves";
import { Site } from "@/services/types";

import { DocumentationModalProps, FormValues } from "../_types";

import { FilePicker } from "./FilePicker";
import { SiteMultiSelect } from "./SiteMultiSelect";
import { SubmitButton } from "./SubmitButton";

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  fetchDocuments,
  trigger,
}) => {
  console.log(fetchDocuments);

  const { t } = useTranslation();
  // const [sites, setSites] = useState<Site[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedSiteKeys, setSelectedSiteKeys] = useState<Set<string>>(
    new Set([]),
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      ids: [],
      id: "",
      name: "",
      documentation: [],
    },
    mode: "onSubmit",
  });

  const handleSiteSelectionChange = (keys: Set<string>): void => {
    setSelectedSiteKeys(keys);
    const selectedSites = sites.filter((site) => keys.has(site.id.toString()));
    setValue("ids", selectedSites);
  };

  const handleSelectAllChange = (value: boolean): void => {
    setSelectAll(value);
    if (value) {
      const allSiteKeys = new Set(sites.map((site) => site.id.toString()));
      setSelectedSiteKeys(allSiteKeys);
      setValue("ids", sites);
    } else {
      setSelectedSiteKeys(new Set([]));
      setValue("ids", []);
    }
  };

  const siteOptions: SelectOption[] = sites.map((site) => ({
    key: site.id.toString(),
    label: site.name,
  }));

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log("Form submitted:", values);
  };

  return (
    <Modal
      classNames={{
        base: "mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-2xl backdrop-blur-sm",
      }}
      aria-labelledby="documentation-modal"
      trigger={trigger}
      title={t("addDocument")}
      size="4xl"
      buttonCloseLabel="Annuler"
      buttonCloseProps={{
        className: "right-36 w-32",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="documentation-form"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {t("titleDocument")} <span className="text-danger">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: t("requiredFields"),
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      radius="sm"
                      type="text"
                      placeholder="Entrez le titre du document"
                      className="w-full transition-all duration-200 focus:scale-[1.01]"
                      classNames={{
                        input: !!errors.name?.message
                          ? "placeholder:text-danger"
                          : "",
                      }}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name?.message}
                    />
                  </div>
                )}
              />
            </div>

            {/* Sélection des sites */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {t("concernedSite")} <span className="text-danger">*</span>
              </label>
              <Controller
                name="ids"
                control={control}
                rules={{
                  required: t("requiredFields"),
                  validate: (value) => value.length > 0 || t("requiredFields"),
                }}
                render={() => (
                  <SiteMultiSelect
                    placeholder="Rechercher et sélectionner des sites"
                    options={siteOptions}
                    selectedKeys={selectedSiteKeys}
                    onSelectionChange={handleSiteSelectionChange}
                    error={errors.ids?.message}
                  />
                )}
              />
              {/* Checkbox sous le select */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
                <label
                  htmlFor="selectAll"
                  className="cursor-pointer text-sm font-medium transition-colors hover:text-primary"
                >
                  Sélectionner tous les sites
                </label>
              </div>
            </div>
          </div>

          {/* Upload de fichier avec le nouveau FilePicker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {t("file")} <span className="text-danger">*</span>
            </label>
            <Controller
              name="documentation"
              control={control}
              rules={{
                required: t("requiredFields"),
                validate: (value) => value.length > 0 || t("requiredFields"),
              }}
              render={({ field }) => (
                <FilePicker
                  onFilesChange={field.onChange}
                  value={field.value}
                  error={errors.documentation?.message}
                />
              )}
            />
          </div>
        </form>
      </div>

      <SubmitButton isSubmitting={isSubmitting} />
    </Modal>
  );
};
