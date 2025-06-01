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
  <div className="flex flex-col items-center gap-3">
    <Image src={logoSrc} alt={altText} width={100} height={100} />

    <QRCodeSVG
      className="rounded-md border border-border/40 bg-white p-4 shadow-sm"
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
    <section
      className={`relative min-h-screen px-4 py-8 sm:py-12 sm:pl-16 sm:pr-2 ${className}`}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-[8vw]">
        {/* Phone Image with Decorative Arrows - ORIGINAL VERSION */}
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

        {/* Enhanced Download Information Card */}
        <Card>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 opacity-50" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="space-y-4">
              <h2 className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-center text-2xl font-bold sm:text-3xl">
                Télécharger notre application
              </h2>

              <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />

              <p className="text-center text-lg leading-relaxed sm:text-xl">
                Facilitez la prise de congés et le paiement des collaborateurs
                avec notre fonctionnalité d&apos;export dans les logiciels RH.
              </p>

              <p className="text-center text-sm opacity-70">
                Pour télécharger l&apos;application, scanner ce QR code avec
                votre téléphone
              </p>
            </div>

            {/* Enhanced QR Codes Section */}
            <div className="mt-3 flex justify-center">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
                <AppStoreQRCode
                  value={links.android}
                  logoSrc={androidQrCode.src}
                  altText="Google Play Store"
                />
                <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent sm:block" />
                <AppStoreQRCode
                  value={links.apple}
                  logoSrc={appleQrCode.src}
                  altText="Apple App Store"
                />
              </div>
            </div>

            {/* Call to action hint */}
            <div className="mt-4 text-center">
              <p className="text-xs opacity-70">
                ✨ Pointez votre appareil photo vers le QR code
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MobileDownload;
