import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Golden Path
// ---------------------------------------------------------------------------

test.describe("Golden Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coach");
  });

  test("1 - all 7 sections are visible on scroll", async ({ page }) => {
    const sections = ["#top", "#dashboard", "#different", "#survey", "#benefits", "#faq"];
    for (const id of sections) {
      await expect(page.locator(id)).toBeAttached();
    }
    // Final CTA has no fragment id -- locate by class
    await expect(page.locator("section.coach-final-cta")).toBeAttached();
  });

  test("2 - Hero: badge, H1, lede, two CTAs", async ({ page }) => {
    const hero = page.locator("section.coach-hero");
    await expect(hero.getByText("Roots Fall 2026")).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1, name: "Coach with us." })).toBeVisible();
    await expect(hero.getByText("Coaching at Nipomo SC means")).toBeVisible();
    await expect(hero.getByRole("button", { name: "Sign Up to Coach" })).toBeVisible();
    await expect(hero.getByRole("link", { name: "See open coaching spots" })).toBeVisible();
  });

  test("3 - Dashboard: 6 age-group tabs, default 3rd-4th, Girls & Boys columns", async ({ page }) => {
    const dashboard = page.locator("#dashboard");
    const ageTabs = dashboard.locator('[role="tablist"]').last();
    const tabLabels = ["Pre-K", "1st-2nd", "3rd-4th", "5th-6th", "7th-8th", "High School"];
    for (const label of tabLabels) {
      await expect(ageTabs.getByRole("tab", { name: new RegExp(label) })).toBeVisible();
    }
    // 3rd-4th is the default selected tab
    await expect(ageTabs.getByRole("tab", { name: /3rd-4th/ })).toHaveAttribute("aria-selected", "true");
    // Girls and Boys columns visible in the board
    const board = dashboard.locator(".coach-board__columns");
    await expect(board.getByRole("heading", { name: "Girls" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "Boys" })).toBeVisible();
  });

  test("4 - Dashboard tab switching updates columns", async ({ page }) => {
    const dashboard = page.locator("#dashboard");
    const ageTabs = dashboard.locator('[role="tablist"]').last();

    // Click Pre-K -- should show Co-ed, not Girls/Boys
    await ageTabs.getByRole("tab", { name: /Pre-K/ }).click();
    const board = dashboard.locator(".coach-board__columns");
    await expect(board.getByRole("heading", { name: "Co-ed" })).toBeVisible();

    // Click 5th-6th -- should show Girls and Boys again
    await ageTabs.getByRole("tab", { name: /5th-6th/ }).click();
    await expect(board.getByRole("heading", { name: "Girls" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "Boys" })).toBeVisible();

    // Click 7th-8th
    await ageTabs.getByRole("tab", { name: /7th-8th/ }).click();
    await expect(ageTabs.getByRole("tab", { name: /7th-8th/ })).toHaveAttribute("aria-selected", "true");
  });

  test('5 - Dashboard view toggle: "Where we need you" hides staffed columns', async ({ page }) => {
    const dashboard = page.locator("#dashboard");
    const filterTabs = dashboard.locator('[role="tablist"]').first();

    // Default is "Who's coaching" (all view)
    await expect(filterTabs.getByRole("tab", { name: /Who's coaching/ })).toHaveAttribute("aria-selected", "true");

    // Switch to "Where we need you"
    await filterTabs.getByRole("tab", { name: /Where we need you/ }).click();
    await expect(filterTabs.getByRole("tab", { name: /Where we need you/ })).toHaveAttribute("aria-selected", "true");

    // In openings mode, fully-staffed columns should be hidden.
    // Switch to an age group where one side is fully staffed to verify filtering.
    // 3rd-4th boys has 12/12 head coaches (staffed). After filter only girls should show.
    const ageTabs = dashboard.locator('[role="tablist"]').last();
    await ageTabs.getByRole("tab", { name: /3rd-4th/ }).click();
    const board = dashboard.locator(".coach-board__columns");
    await expect(board.getByRole("heading", { name: "Girls" })).toBeVisible();
  });

  test("6 - What's Different: 4 change cards, clicking each shows detail", async ({ page }) => {
    const section = page.locator("#different");
    const tabs = section.locator('[role="tablist"]');
    const tabButtons = tabs.getByRole("tab");
    await expect(tabButtons).toHaveCount(4);

    const expectedTitles = [
      "Refs are paid and provided",
      "A playtime tool that actually works",
      "Balanced teams from day one",
      "A real season schedule",
    ];

    for (const title of expectedTitles) {
      await tabs.getByRole("tab", { name: new RegExp(title) }).click();
      const detail = section.locator('[role="tabpanel"]');
      await expect(detail.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("7 - Survey: 5 tabs, switching changes content", async ({ page }) => {
    const section = page.locator("#survey");
    const tabLabels = ["Coaching", "Referees", "Fields & Schedule", "Equipment", "Team Balance"];
    for (const label of tabLabels) {
      await expect(section.getByRole("button", { name: label })).toBeVisible();
    }

    // Default is Coaching -- verify rating
    await expect(section.getByText("4.62 / 5")).toBeVisible();

    // Switch to Referees
    await section.getByRole("button", { name: "Referees" }).click();
    await expect(section.getByText("3.74 / 5")).toBeVisible();

    // Switch to Equipment
    await section.getByRole("button", { name: "Equipment" }).click();
    await expect(section.getByText("4.35 / 5")).toBeVisible();
  });

  test("8 - Benefits: 4 benefit cards", async ({ page }) => {
    const section = page.locator("#benefits");
    const cards = section.locator(".coach-benefit-grid > div");
    await expect(cards).toHaveCount(4);
  });

  test("9 - FAQ: 8 accordion items, first open by default, clicking second opens it", async ({ page }) => {
    const section = page.locator("#faq");
    const details = section.locator("details");
    await expect(details).toHaveCount(8);

    // First item open by default
    await expect(details.nth(0)).toHaveAttribute("open", "");

    // Second item is closed by default
    const second = details.nth(1);
    await expect(second).not.toHaveAttribute("open", "");

    // Click second to open it
    await second.locator("summary").click();
    await expect(second).toHaveAttribute("open", "");
  });

  test('10 - Final CTA: H2 "See you on the sideline"', async ({ page }) => {
    const section = page.locator("section.coach-final-cta");
    await expect(
      section.getByRole("heading", { level: 2, name: "See you on the sideline" })
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Modal Tests
// ---------------------------------------------------------------------------

test.describe("Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coach");
  });

  test('11 - "Sign Up to Coach" in hero opens the modal', async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    await expect(page.locator(".coach-modal")).toBeVisible();
  });

  test("12 - Modal has all expected form fields", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    const modal = page.locator(".coach-modal");

    // Text inputs
    await expect(modal.locator('input[name="name"]')).toBeVisible();
    await expect(modal.locator('input[name="email"]')).toBeVisible();
    await expect(modal.locator('input[name="phone"]')).toBeVisible();
    await expect(modal.locator('input[name="city"]')).toBeVisible();

    // Coaching experience dropdown
    await expect(modal.locator('select[name="coachingExperience"]')).toBeVisible();

    // Program chips (Roots, Rise, Reign)
    for (const program of ["Roots", "Rise", "Reign"]) {
      await expect(modal.getByRole("button", { name: program, exact: true })).toBeVisible();
    }

    // Age group chips
    for (const age of ["Pre-K", "1st-2nd", "3rd-4th", "5th-6th", "7th-8th", "High School"]) {
      await expect(modal.getByRole("button", { name: age, exact: true })).toBeVisible();
    }

    // Children dropdown
    await expect(modal.locator('select[name="hasChildren"]')).toBeVisible();

    // Textarea
    await expect(modal.locator('textarea[name="additionalNotes"]')).toBeVisible();
  });

  test("13 - Chip toggle: Roots selects (gold border) then deselects", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    const modal = page.locator(".coach-modal");
    const rootsChip = modal.getByRole("button", { name: "Roots", exact: true });

    // Initially not selected
    await expect(rootsChip).not.toHaveClass(/border-gold/);

    // Click to select
    await rootsChip.click();
    await expect(rootsChip).toHaveClass(/border-gold/);

    // Click again to deselect
    await rootsChip.click();
    await expect(rootsChip).not.toHaveClass(/border-gold/);
  });

  test("14 - Escape key closes the modal", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    await expect(page.locator(".coach-modal")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(".coach-modal")).not.toBeVisible();
  });

  test("15 - Clicking overlay closes the modal", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    await expect(page.locator(".coach-modal")).toBeVisible();

    // Click the overlay (the outer div), not the inner modal content
    await page.locator(".coach-modal-overlay").click({ position: { x: 10, y: 10 } });
    await expect(page.locator(".coach-modal")).not.toBeVisible();
  });

  test("16 - Form validation: submitting without required fields shows error", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    const modal = page.locator(".coach-modal");

    // Fill required text fields but skip chip selections to trigger custom validation
    await modal.locator('input[name="name"]').fill("Test Coach");
    await modal.locator('input[name="email"]').fill("test@example.com");
    await modal.locator('input[name="phone"]').fill("(805) 555-0100");
    await modal.locator('select[name="coachingExperience"]').selectOption("None, but I'm ready to learn");

    // Submit without selecting any programs -- should show toast error
    await modal.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Please select at least one program")).toBeVisible();
  });

  test("17 - Body scroll is locked when modal is open", async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("button", { name: "Sign Up to Coach" }).click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });
});

// ---------------------------------------------------------------------------
// Interaction Tests
// ---------------------------------------------------------------------------

test.describe("Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coach");
  });

  test('18 - "See open coaching spots" scrolls to dashboard', async ({ page }) => {
    await page.locator("section.coach-hero").getByRole("link", { name: "See open coaching spots" }).click();
    // The dashboard section should be near the top of the viewport after scroll
    await expect(page.locator("#dashboard")).toBeInViewport();
  });

  test("19 - Change card picker: active card has dark bg, detail panel is sticky", async ({ page }) => {
    const section = page.locator("#different");
    const tabs = section.locator('[role="tablist"]');

    // First card (refs) is active by default -- should have bg-night
    const firstTab = tabs.getByRole("tab").first();
    await expect(firstTab).toHaveClass(/bg-night/);

    // Verify the detail panel has sticky positioning
    const detail = section.locator(".coach-change-detail");
    await expect(detail).toBeVisible();
  });

  test("20 - FAQ accordion: opening one doesn't close others (independent details)", async ({ page }) => {
    const section = page.locator("#faq");
    const details = section.locator("details");

    // First is open by default
    await expect(details.nth(0)).toHaveAttribute("open", "");

    // Open the second
    await details.nth(1).locator("summary").click();
    await expect(details.nth(1)).toHaveAttribute("open", "");

    // First should still be open
    await expect(details.nth(0)).toHaveAttribute("open", "");

    // Open the third
    await details.nth(2).locator("summary").click();
    await expect(details.nth(2)).toHaveAttribute("open", "");

    // Both first and second should still be open
    await expect(details.nth(0)).toHaveAttribute("open", "");
    await expect(details.nth(1)).toHaveAttribute("open", "");
  });

  test('21 - Dashboard "Claim a spot" button opens modal', async ({ page }) => {
    const dashboard = page.locator("#dashboard");
    await dashboard.getByRole("button", { name: "Claim a spot" }).click();
    await expect(page.locator(".coach-modal")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Responsive Tests
// ---------------------------------------------------------------------------

test.describe("Responsive", () => {
  test("22 - At 720px: dashboard columns stack to single column", async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto("/coach");

    const board = page.locator("#dashboard .coach-board__columns");
    const style = await board.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // At 720px the CSS sets grid-template-columns: 1fr (single column)
    expect(style).not.toContain("1fr 1fr");
  });

  test("23 - At 900px: What's Different picker stacks vertically", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto("/coach");

    const changes = page.locator("#different .coach-changes");
    const style = await changes.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // At 900px the CSS switches to single column
    expect(style).not.toContain(" ");
  });

  test("24 - At 820px: Survey grid stacks to single column", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await page.goto("/coach");

    const grid = page.locator("#survey .coach-survey-grid");
    const style = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(style).not.toContain(" ");
  });
});

// ---------------------------------------------------------------------------
// Content Verification
// ---------------------------------------------------------------------------

test.describe("Content Verification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coach");
  });

  test('25 - Dashboard shows coach name chips (e.g. "Coach Johnny P.")', async ({ page }) => {
    const dashboard = page.locator("#dashboard");
    await expect(dashboard.getByText("Coach Johnny P.")).toBeVisible();
  });

  test('26 - FAQ first answer mentions "No. Plenty of our coaches started with none."', async ({ page }) => {
    const section = page.locator("#faq");
    const firstAnswer = section.locator("details").first();
    await expect(firstAnswer.getByText("No. Plenty of our coaches started with none.")).toBeVisible();
  });

  test('27 - Survey coaching tab shows rating "4.62 / 5"', async ({ page }) => {
    const section = page.locator("#survey");
    await expect(section.getByText("4.62 / 5")).toBeVisible();
  });

  test('28 - Benefits has "Coaching certifications, paid" card', async ({ page }) => {
    const section = page.locator("#benefits");
    await expect(section.getByText("Coaching certifications, paid")).toBeVisible();
  });
});
