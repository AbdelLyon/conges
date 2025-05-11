"use client";

import appPicture from "@/assets/phoneDownload.png";
import { PageContainer } from "@/components/PageContainer";

import MobileDownload from "./_components/MobilDownload";
const Download = () => {
  // const { t } = useTranslation();

  // const requestBody = {
  //   search: {
  //     filters: [
  //       {
  //         field: "id",
  //         operator: "=",
  //         value: process.env.GATSBY_APP_APP_UUID,
  //       },
  //     ],
  //   },
  // };

  // const fetchLinks = () => {
  //   setIsLoading(true);
  //   authProviderService
  //     .post("/applications/search", requestBody)
  //     .then((resp) => {
  //       const res = resp.data.data[0];
  //       setLinks({ android: res.android_link, apple: res.apple_link });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   fetchLinks();
  // }, []);

  // skeleton a impementer dans le fichier loading

  return (
    <PageContainer title="Application mobile">
      <MobileDownload
        appPicture={appPicture.src}
        links={{ android: "", apple: "" }}
      />
    </PageContainer>
  );
};

export default Download;
