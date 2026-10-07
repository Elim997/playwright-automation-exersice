const { chromium } = require("playwright");
const { expect } = require("chai");

const SITE_URL = "https://test.netlify.app/";

const FORM_DATA = {
  name: "Eli Manashirov",
  email: "eli.manashirov@gmail.com",
  phone: "0541234567",
  company: "Jones Software",
  website: "https://www.getjones.com",
  employees: "51-500",
};

/**
 * Try to find the field by the label the user sees on the screen.
 * If that does not work, use the input's name attribute as a fallback.
 */
function field(page, label, name) {
  return page
    .getByLabel(label, { exact: false })
    .or(page.locator(`input[name="${name}"], textarea[name="${name}"]`))
    .first();
}

describe("Landing form - request a call back", function () {
  this.timeout(60000);

  let browser;
  let page;

  before(async () => {
    /*
     * Headless is used by default.
     * Run with 'npm run test:headed' when you want to see the browser.
     */
    const isHeadless = process.env.HEADLESS !== "false";

    browser = await chromium.launch({
      headless: isHeadless,
      slowMo: isHeadless ? 0 : 300,
    });

    page = await browser.newPage();
  });

  after(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it("fills the form, switches employees, screenshots, submits and reaches the thank-you page", async () => {
    // 1. Open the landing page.
    await page.goto(SITE_URL, { waitUntil: "load" });

    // 2. Fill the text fields.
    await field(page, "Name", "name").fill(FORM_DATA.name);
    await field(page, "Email", "email").fill(FORM_DATA.email);
    await field(page, "Phone", "phone").fill(FORM_DATA.phone);
    await field(page, "Company", "company").fill(FORM_DATA.company);
    await field(page, "Website", "website").fill(FORM_DATA.website);

    // 3. Bonus: change "Number of Employees" from 1-10 to 51-500.
    const employees = page
      .getByLabel("Number of Employees", { exact: false })
      .or(page.locator("select"))
      .first();

    await employees.selectOption({ label: FORM_DATA.employees });

    const selectedEmployees = await employees
      .locator("option:checked")
      .textContent();

    expect(selectedEmployees.trim()).to.equal(FORM_DATA.employees);

    // 4. Screenshot the filled page before submitting.
    await page.screenshot({ path: "before-submit.png", fullPage: true });

    // 5. Click "Request a call back".
    const submit = page
      .getByRole("button", { name: "Request a call back" })
      .or(page.getByText("Request a call back"))
      .first();

    await submit.click();

    // 6. Confirm we reached the thank-you page and log it.
    await page.waitForURL(/thank-you\.html/, { timeout: 15000 });
    expect(page.url()).to.include("thank-you.html");

    console.log(`Reached the thank you page. URL: ${page.url()}`);
  });
});