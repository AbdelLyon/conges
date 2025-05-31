import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MobileDownload from "./MobilDownload";

vi.mock("@/assets/android.inline.png", () => ({
  default: { src: "android.png" },
}));
vi.mock("@/assets/apple.inline.png", () => ({ default: { src: "apple.png" } }));
vi.mock("@/assets/xefiArrowLeft.png", () => ({ default: "arrow-left.png" }));
vi.mock("@/assets/xefiArrowRight.png", () => ({ default: "arrow-right.png" }));

vi.mock("next/image", () => ({
  default: (props: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} data-testid="next-image" />;
  },
}));

describe("MobileDownload", () => {
  const props = {
    links: {
      android: "https://play.google.com/store/apps/details?id=com.example.app",
      apple: "https://apps.apple.com/app/id123456789",
    },
    appPicture: "/mock-preview.png",
  };

  it("renders without crashing", () => {
    render(<MobileDownload {...props} />);
    expect(
      screen.getByText("Télécharger notre application"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Facilitez la prise de congés/i),
    ).toBeInTheDocument();
  });

  it("renders the app preview image", () => {
    render(<MobileDownload {...props} />);
    const images = screen.getAllByTestId("next-image");
    expect(
      images.some((img) => img.getAttribute("src") === "/mock-preview.png"),
    ).toBe(true);
  });

  it("displays Android and Apple logos", () => {
    render(<MobileDownload {...props} />);
    expect(screen.getByAltText("Google Play Store")).toBeInTheDocument();
    expect(screen.getByAltText("Apple App Store")).toBeInTheDocument();
  });

  it("renders QR codes with correct values", () => {
    render(<MobileDownload {...props} />);
    const qrCodes = screen.getAllByRole("img");
    expect(qrCodes.length).toBeGreaterThanOrEqual(2);
  });
});
