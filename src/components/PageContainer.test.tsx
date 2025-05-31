import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { PageContainer } from "./PageContainer";

describe("PageContainer", () => {
  it("renders without crashing", () => {
    render(<PageContainer>Test content</PageContainer>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders string title inside h1 tag", () => {
    render(<PageContainer title="Page Title">Content</PageContainer>);
    const title = screen.getByText("Page Title");
    expect(title.tagName).toBe("H1");
    expect(title).toHaveClass("text-lg", "font-bold", "my-3");
  });

  it("renders JSX title inside div", () => {
    render(
      <PageContainer title={<span data-testid="jsx-title">Custom Title</span>}>
        Content
      </PageContainer>,
    );
    const title = screen.getByTestId("jsx-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBe("Custom Title");
    const wrapper = title.closest("div");
    expect(wrapper).toHaveClass("text-lg", "font-bold", "my-3");
  });

  it("applies custom base and title classNames", () => {
    render(
      <PageContainer
        title="Styled Title"
        classNames={{ base: "bg-red-500", title: "text-blue-500" }}
      >
        Content
      </PageContainer>,
    );

    const container = screen.getByTestId("page-container");
    const title = screen.getByText("Styled Title");

    expect(container).toHaveClass("bg-red-500");
    expect(title).toHaveClass("text-blue-500");
  });
});
