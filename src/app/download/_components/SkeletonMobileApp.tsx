import { Card } from "x-react/card";
import { Skeleton } from "x-react/skeleton";

export const SkeletonMobileApp = () => {
  return (
    <section className="min-h-screen py-6 pl-16 pr-2">
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-[10vw]">
        {/* Phone with red accents */}
        <div className="relative">
          {/* Red arrow effects */}
          <div className="absolute -right-20 top-20 z-10 h-[100px] w-[140px] rotate-[20deg] bg-red-600/40 blur-lg"></div>
          <div className="absolute -left-10 bottom-20 z-10 h-[80px] w-[100px] rotate-[-20deg] bg-red-600/40 blur-lg"></div>

          {/* Phone device */}
          <Card className="relative z-20 min-w-[253px] overflow-hidden rounded-[32px] border-0 shadow-xl">
            <div className="relative h-[573px] w-[253px]">
              {/* Status Bar */}
              <div className="absolute inset-x-0 top-0 flex h-6 items-center justify-between bg-content1-200 px-4 py-1 dark:bg-background">
                <div className="w-12">
                  <Skeleton className="h-3 rounded" />
                </div>
                <div className="w-16">
                  <Skeleton className="h-3 rounded" />
                </div>
              </div>

              {/* App Content */}
              <div className="absolute inset-0 flex flex-col px-4 pt-10">
                {/* App Title */}
                <div className="mb-3 w-24">
                  <Skeleton className="h-6 rounded-lg" />
                </div>

                {/* Month Navigation */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="w-20">
                    <Skeleton className="h-5 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="size-4">
                      <Skeleton className="size-4 rounded-full" />
                    </div>
                    <div className="size-4">
                      <Skeleton className="size-4 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="mb-4">
                  <Skeleton className="h-28 rounded-lg" />
                </div>

                {/* Leave Items */}
                {[
                  { color: "#e20917", hasBadge: true },
                  { color: "#3b82f6", hasBadge: false },
                  { color: "#f59e0b", hasBadge: true },
                  { color: "#8b5cf6", hasBadge: true },
                ].map((item, i) => (
                  <div key={i} className="mb-3">
                    <Skeleton className="h-12 rounded-lg" />
                  </div>
                ))}

                {/* Counters Section */}
                <div className="mb-4 mt-auto">
                  <div className="mb-2">
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>

                  <div className="flex justify-around">
                    {/* First counter */}
                    <div className="flex flex-col items-center">
                      <Skeleton className="size-16 rounded-full" />
                      <div className="mt-1">
                        <Skeleton className="h-2 w-6 rounded" />
                      </div>
                    </div>

                    {/* Second counter */}
                    <div className="flex flex-col items-center">
                      <Skeleton className="size-16 rounded-full" />
                      <div className="mt-1">
                        <Skeleton className="h-2 w-6 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Download Information Card */}
        <Card className="w-full max-w-[700px] border-0 p-8 shadow-md">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="mx-auto w-[400px] text-center">
              <Skeleton className="h-9 rounded-lg" />
            </div>

            {/* Description paragraph - 2 lines */}
            <div className="text-center">
              <div className="mx-auto mb-2 w-[580px] max-w-full">
                <Skeleton className="h-7 rounded-lg" />
              </div>
              <div className="mx-auto w-[520px] max-w-full">
                <Skeleton className="h-7 rounded-lg" />
              </div>
            </div>

            {/* Note */}
            <div className="mb-4 text-center">
              <div className="mx-auto w-[450px] max-w-full">
                <Skeleton className="h-5 rounded-lg" />
              </div>
            </div>

            {/* QR Codes section */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-start gap-16">
                {/* Android */}
                <div className="flex flex-col items-center gap-4">
                  {/* Play Store badge */}
                  <div className="h-[40px] w-[135px] rounded-lg">
                    <Skeleton className="size-full rounded-lg" />
                  </div>

                  {/* QR Code */}
                  <div className="relative size-[135px]">
                    <Skeleton className="size-[135px] rounded-md" />
                  </div>
                </div>

                {/* Apple */}
                <div className="flex flex-col items-center gap-4">
                  {/* App Store badge */}
                  <div className="h-[40px] w-[135px] rounded-lg">
                    <Skeleton className="size-full rounded-lg" />
                  </div>

                  {/* QR Code */}
                  <div className="relative size-[135px]">
                    <Skeleton className="size-[135px] rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
