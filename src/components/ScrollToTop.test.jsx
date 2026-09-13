import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";

function NavigationHarness() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/second")}>Go</button>;
}

describe("ScrollToTop", () => {
  it("resets scroll on route changes", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <NavigationHarness />
        <Routes>
          <Route path="*" element={null} />
        </Routes>
      </MemoryRouter>,
    );

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    scrollTo.mockClear();
    fireEvent.click(getByRole("button", { name: "Go" }));

    await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(1));
    scrollTo.mockRestore();
  });
});
