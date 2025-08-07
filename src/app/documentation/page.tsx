// import congesService from "@data/congesService";
"use client";
import {
  IconArrowDownToArc,
  IconArrowRight,
  IconPlus,
  IconTrack,
} from "@xefi/x-react/icons";
import { Spinner } from "@xefi/x-react/spiner";
import { t } from "i18next";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
// import { addToast } from "@xefi/x-react/toast";

import empty from "@/assets/lottie/empty.json";
import { PageContainer } from "@/components/PageContainer";

import { DocumentationModal } from "./_components/DocumentationModal";
// import { useUserStore } from "@/store/useUserStore";

const Documentation = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //   const { currentUser } = useUserStore();

  //   const isAdmin = ["ADMINISTRATEURMANAGER", "ADMINISTRATEUR"].includes(
  //     currentUser?.profile.label,
  //   );

  const isAdmin = true;

  // const fetchDocuments = async () => {
  //   try {
  //     const response = await congesService.post("/v1/support-documents/search");
  //     setDocuments(response.data.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  interface Media {
    id: number;
    name: string;
    creator_id: number | null;
    media: {
      id: number;
      mime_type: string;
      name: string;
      original_url: string;
    }[];
  }

  interface DeleteDialogOptions {
    title: string;
    text: string;
  }

  const handleDelete = async (media: Media): Promise<void> => {
    SwalCustom.delete(
      async () => {
        try {
          await congesService.delete(`/v1/support-documents/${media.id}`);
          ToastCustom.validated("Document supprimé avec succès");
          fetchDocuments();
        } catch (err) {
          console.error(err);
        }
      },
      {
        title: t("areYouSureContinue"),
        text: t("deleteAreForever"),
      } as DeleteDialogOptions,
    );
  };

  // const handleDownload = async (media: any) => {
  //   try {
  //     const response = await congesService.get(
  //       `/v1/media/${media.id}/download`,
  //       {
  //         responseType: "blob",
  //       },
  //     );
  //     const newBlob = new Blob([response.data], { type: media.mime_type });
  //     const url = window.URL.createObjectURL(newBlob);
  //     const link = document.createElement("a");
  //     link.setAttribute("download", `${media.name}`);
  //     link.setAttribute("href", url);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     addToast({
  //       description: "Téléchargement réussi",
  //       color: "success",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     addToast({
  //       description: "`Une erreur s'est produite lors du téléchargement`",
  //       color: "danger",
  //     });
  //   }
  // };

  // const fetchData = async () => {
  //   await fetchDocuments();
  // };

  interface MediaWithMimeType {
    mime_type: string;
  }

  const getImageType = (media: MediaWithMimeType): string => {
    const mimeType = media.mime_type.split("/")[1];
    switch (mimeType) {
      case "pdf":
        return "/icons/pdf.svg";
      case "png":
        return "/icons/png.svg";
      case "jpeg":
      case "jpg":
        return "/icons/jpg.svg";
      default:
        return "/icons/png.svg";
    }
  };

  // useEffect(() => {
  //   fetchData().then(() => setIsLoading(false));
  // }, []);

  return (
    <PageContainer title={"Documentation"}>
      <div className="h-[700px] w-full rounded-md p-7">
        {!isLoading ? (
          <Spinner />
        ) : (
          <div className=" size-full">
            {isAdmin && (
              <DocumentationModal
                fetchDocuments={() => {}}
                trigger={
                  <button
                    className="flex cursor-pointer items-center justify-end text-sm text-blue-500 hover:text-blue-700"
                    style={{ marginLeft: "auto" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <IconPlus className="mr-2 size-5" />
                    Ajouter un document
                  </button>
                }
              />
            )}
            <div className="mt-5 flex flex-col space-y-5">
              {documents.length > 0 ? (
                documents.map((doc: any) => (
                  <div key={doc.id} className="flex w-full">
                    <Link
                      className="flex cursor-pointer"
                      href={doc.media[0].original_url}
                      target="_blank"
                    >
                      <Image
                        alt="Type icon"
                        className="size-9"
                        src={getImageType(doc.media[0])}
                        width={36}
                        height={36}
                      />
                      <div className="ml-2 flex items-center justify-center">
                        <span className=" text-sm font-normal">{doc.name}</span>
                      </div>
                    </Link>
                    <div className="ml-auto flex items-center space-x-2">
                      {isAdmin && doc.creator_id !== null && (
                        <IconTrack onClick={() => handleDelete(doc)} />
                      )}
                      <IconArrowDownToArc
                      // onClick={() => handleDownload(doc.media[0])}
                      />
                      <Link href={doc.media[0].original_url} target="_blank">
                        <IconArrowRight />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lottie
                    animationData={empty}
                    loop={true}
                    style={{ height: "200px", width: "200px" }}
                  />
                  <h4 className="mt-5 text-lg">Aucun document</h4>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Documentation;
