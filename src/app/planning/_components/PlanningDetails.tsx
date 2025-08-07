"use client";

import { Select } from "@xefi/x-react/form";
import { Modal } from "@xefi/x-react/modal";
import { addToast } from "@xefi/x-react/toast";
import React, { ReactNode, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useUserStore } from "@/store/useUserStore";

interface Site {
  id: number;
  name: string;
}

interface FormValues {
  ids: Site[];
  id: string;
  name: string;
  documentation: File[];
}

interface LoadOptionsAdditional {
  page?: number;
}

interface LoadOptionsResponse {
  options: Site[];
  hasMore: boolean;
  additional?: LoadOptionsAdditional;
  selected?: boolean;
}

interface DocumentationModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  fetchDocuments: () => void;
  trigger: ReactNode;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  fetchDocuments,
  trigger,
}) => {
  const { t } = useTranslation();

  const [sites, setSites] = useState<Site[]>([]);
  const { currentUser } = useUserStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const watchedDocumentation = watch("documentation");

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
    reset(); // Reset form when modal closes
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const resultSite: number[] = [];
      values.ids.forEach((elem) => resultSite.push(elem.id));

      const sitesTab = values.ids.map((item) => item.id);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("creator_id", currentUser?.id?.toString() || "");
      formData.append("media[0][file]", values.documentation[0]);
      formData.append("media[0][collection]", "support_document");
      sitesTab.forEach((site, index) => {
        formData.append(`sites[${index}]`, site.toString());
      });

      // await congesService.post(
      //   `/v1/support-documents${selectAll ? "?allSites" : ""}`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   },
      // );

      addToast({
        description: values.id ? "successStore" : "successUpdate",
        color: "success",
      });

      fetchDocuments();
      toggleModal();
    } catch (err) {
      addToast({
        description: "Error",
        color: "danger",
      });
      console.error(err);
    }
  };

  const loadOptions = async (
    searchQuery: string,
    loadedOptions: Site[],
    additional?: LoadOptionsAdditional,
  ): Promise<LoadOptionsResponse> => {
    const currentPage = additional?.page || 1;

    try {
      const response = await congesService.post(
        `/v1/sites/search?&page=${currentPage}`,
        {
          search: {
            value: searchQuery,
          },
        },
      );

      const { data, meta } = response.data;

      const options: Site[] = data.map((site: any) => ({
        id: site.id,
        name: site.name,
      }));

      setSites((prev) => [...prev, ...options]);

      return {
        options,
        hasMore: meta.current_page < meta.last_page,
        additional: {
          page: currentPage + 1,
        },
        selected: selectAll,
      };
    } catch (err) {
      console.error("Erreur lors du chargement des sites :", err);

      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleRemoveFile = (): void => {
    setValue("documentation", []);
  };

  const handleSetFiles = (files: File[]): void => {
    setValue("documentation", files);
  };

  return (
    <Modal
      className="mx-4 max-h-[86vh] w-1/2 overflow-auto rounded-lg bg-background shadow-xl md:w-[900px]"
      aria-labelledby="documentation-modal"
      trigger={trigger}
      title={t("addDocument")}
      size="4xl"
    >
      <div className="mt-4 w-full p-4">
        <form onSubmit={handleSubmit(onSubmit)} id="documentation-form">
          <Controller
            name="name"
            control={control}
            rules={{
              required: t("requiredFields"),
            }}
            render={({ field }) => (
              <InputCustom
                {...field}
                type="text"
                label={t("titleDocument") + " *"}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="ids"
            control={control}
            rules={{
              required: t("requiredFields"),
              validate: (value) => value.length > 0 || t("requiredFields"),
            }}
            render={({ field }) => (
              <Select
                {...field}
                label={t("concernedSite")}
                placeholder="Rechercher des sites : "
                options={sites.map((site) => ({
                  label: site.name,
                  key: site.id.toString(),
                  id: site.id,
                }))}
              />
            )}
          />

          <div className="">
            <span className="mb-1 block text-xs font-medium text-gray-700">
              {t("file")} *
            </span>
            <Controller
              name="documentation"
              control={control}
              rules={{
                required: t("requiredFields"),
                validate: (value) => value.length > 0 || t("requiredFields"),
              }}
              render={({ field }) => (
                <FileUploader
                  type="fileUploader"
                  containerClass="mb-3 pb-4"
                  handleRemoveFile={handleRemoveFile}
                  files={watchedDocumentation}
                  setFiles={handleSetFiles}
                  name="documentation"
                  isMultiple={false}
                  error={errors.documentation?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-x-3">
            <ButtonSecondAction onClick={toggleModal} type="button">
              {t("cancel")}
            </ButtonSecondAction>
            <ButtonFirstAction type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("loading") : t("continue")}
            </ButtonFirstAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocumentationModal;
