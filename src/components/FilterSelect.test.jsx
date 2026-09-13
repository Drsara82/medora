import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterSelect } from "./FilterSelect";

describe("FilterSelect", () => {
  it("renders the label, an 'All' option, and the provided options", () => {
    render(
      <FilterSelect
        label="Specialty"
        value="all"
        set={() => {}}
        options={[
          ["spec-derm", "Dermatology"],
          ["spec-cardio", "Cardiology"],
        ]}
      />,
    );
    expect(screen.getByText("Specialty")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Dermatology" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Cardiology" }),
    ).toBeInTheDocument();
  });

  it("calls set with the newly chosen value", () => {
    const set = vi.fn();
    render(
      <FilterSelect
        label="Specialty"
        value="all"
        set={set}
        options={[["spec-derm", "Dermatology"]]}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "spec-derm" },
    });
    expect(set).toHaveBeenCalledWith("spec-derm");
  });

  it("omits the 'All' option when includeAll is false", () => {
    render(
      <FilterSelect
        label="Specialty"
        value="spec-derm"
        set={() => {}}
        options={[["spec-derm", "Dermatology"]]}
        includeAll={false}
      />,
    );
    expect(
      screen.queryByRole("option", { name: "All" }),
    ).not.toBeInTheDocument();
  });
});
