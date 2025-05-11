import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { Card } from "x-react/card";

import androidQrCode from "@/assets/android.inline.png";
import appleQrCode from "@/assets/apple.inline.png";
import xefiArrowLeft from "@/assets/xefiArrowLeft.png";
import xefiArrowRight from "@/assets/xefiArrowRight.png";

/**
 * Types for the MobileDownload component props
 */
interface AppLinks {
  android: string;
  apple: string;
}

interface MobileDownloadProps {
  /** URLs for the app stores */
  links: AppLinks;
  /** Source for the application preview image */
  appPicture: string;
  /** Optional custom class name for the container */
  className?: string;
}

/**
 * QR Code component with proper typing
 */
interface QRCodeProps {
  value: string;
  logoSrc: string;
  altText: string;
  color?: string;
}

const AppStoreQRCode: React.FC<QRCodeProps> = ({
  value,
  logoSrc,
  altText,
  color = "#E20917",
}) => (
  <div className="flex flex-col items-center gap-4">
    <Image
      src={logoSrc}
      alt={altText}
      className="h-auto w-[100px]"
      width={100}
      height={100}
    />

    <QRCodeSVG
      style={{
        height: "auto",
        maxWidth: "100%",
        width: "72%",
        borderRadius: "10px",
      }}
      value={value}
      fgColor={color}
    />
  </div>
);

/**
 * MobileDownload Component
 * Displays a section for downloading a mobile application with QR codes
 */
const MobileDownload: React.FC<MobileDownloadProps> = ({
  links,
  appPicture,
  className = "",
}) => {
  return (
    <section className={`min-h-screen py-6 pl-16 pr-2 ${className}`}>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-[10vw]">
        {/* Phone Image with Decorative Arrows */}
        <div className="relative w-64">
          <Image
            src={xefiArrowRight}
            alt=""
            width={140}
            height={50}
            className="absolute -right-20 top-20 z-20"
            aria-hidden="true"
          />
          <Image
            src={xefiArrowLeft}
            alt=""
            width={80}
            height={50}
            className="absolute -left-10 bottom-20 z-10"
            aria-hidden="true"
          />
          <Image
            src={appPicture}
            alt="Aperçu de l'application mobile"
            width={253}
            height={573}
            className="relative z-20 min-w-[200px]"
          />
        </div>

        {/* Download Information Card */}
        <Card className="w-full max-w-[700px] border border-border p-6">
          <div className="flex flex-col gap-[.7rem]">
            <h2 className="text-center text-2xl font-bold ">
              Télécharger notre application
            </h2>
            <p className="text-center text-xl ">
              Facilitez la prise de congés et le paiement des collaborateurs
              avec notre fonctionnalité d&apos;export dans les logiciels RH.
            </p>
            <p className="text-center text-sm text-[#8D8D8D]">
              Pour télécharger l&apos;application, scanner ce QR code avec votre
              téléphone
            </p>
          </div>

          {/* QR Codes */}
          <div className="mt-10 flex justify-center">
            <div className="flex items-start gap-8">
              <AppStoreQRCode
                value={links.android}
                logoSrc={androidQrCode.src}
                altText="Google Play Store"
              />
              <AppStoreQRCode
                value={links.apple}
                logoSrc={appleQrCode.src}
                altText="Apple App Store"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MobileDownload;
