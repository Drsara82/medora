import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { PageMeta } from "./PageMeta";

describe("PageMeta", () => {
  it("keeps document, social, and canonical metadata in sync", async () => {
    render(
      <PageMeta
        title="Doctor profile | Medora"
        description="A fictional doctor profile for the Medora demo."
      />,
    );

    await waitFor(() => {
      expect(document.title).toBe("Doctor profile | Medora");
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        "content",
        "A fictional doctor profile for the Medora demo.",
      );
      expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
        "content",
        "Doctor profile | Medora",
      );
      expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
        "content",
        "Doctor profile | Medora",
      );
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${window.location.origin}${window.location.pathname}`,
      );
    });
  });
});
