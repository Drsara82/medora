import { test, expect } from "@playwright/test";

test.describe("booking flow", () => {
  test("a visitor can search, view a doctor, and complete a booking", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Find the right doctor",
    );

    // Search from the homepage
    await page
      .getByPlaceholder("Doctor, specialty, or clinic")
      .fill("Layla");
    await page.getByRole("button", { name: "Search doctors" }).click();
    await page.waitForURL(/\/doctors/);
    await expect(page.getByText("Dr. Layla Hassan")).toBeVisible();

    // Open the doctor profile
    await page.getByText("Dr. Layla Hassan").first().click();
    await page.waitForURL(/\/doctor\//);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Dr. Layla Hassan",
    );

    // Start booking
    await page.getByRole("link", { name: /Book sample appointment/i }).click();
    await page.waitForURL(/\/book\//);

    // Pick the first available day and time slot
    const enabledDay = page.locator(".days button:not(:disabled)").first();
    await enabledDay.waitFor();
    await enabledDay.click();
    const slot = page.locator(".slot-grid button").first();
    await slot.waitFor();
    await slot.click();

    await page.getByRole("button", { name: /Continue to patient details/i }).click();

    // Patient details come pre-filled with demo data for this portfolio app
    await expect(page.getByLabel(/Full name/i)).not.toHaveValue("");
    await page.getByRole("button", { name: /Review appointment/i }).click();
    await page.waitForURL(/\/booking\/review/);
    await expect(
      page.getByRole("heading", { name: /Review your appointment/i }),
    ).toBeVisible();

    // Confirm and land on the actual confirmation page (regression check:
    // this used to race back to /doctors instead — see Review.confirm.test.jsx)
    await page.getByRole("button", { name: /Confirm in demo/i }).click();
    await expect(
      page.getByRole("heading", { name: "Saved in this demo" }),
    ).toBeVisible();

    // The new appointment shows up as upcoming
    await page.getByRole("link", { name: /View sample appointments/i }).click();
    await page.waitForURL(/\/appointments/);
    await expect(page.getByText("Dr. Layla Hassan").first()).toBeVisible();
  });

  test("the app does not crash and shows no console errors during booking", async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("403")) {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    await page.goto("/doctor/omar-alharbi");
    await page.getByRole("link", { name: /Book sample appointment/i }).click();
    await page.waitForURL(/\/book\//);

    const enabledDay = page.locator(".days button:not(:disabled)").first();
    await enabledDay.waitFor();
    await enabledDay.click();
    const slot = page.locator(".slot-grid button").first();
    await slot.waitFor();
    await slot.click();

    await page.getByRole("button", { name: /Continue to patient details/i }).click();
    await page.getByRole("button", { name: /Review appointment/i }).click();
    await page.waitForURL(/\/booking\/review/);
    await page.getByRole("button", { name: /Confirm in demo/i }).click();
    await expect(
      page.getByRole("heading", { name: "Saved in this demo" }),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });
});

test.describe("dark mode and RTL", () => {
  test("toggling theme and language updates the document attributes", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Switch to Arabic" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });
});
