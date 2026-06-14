import { test } from '@playwright/test';
import { logger } from '../utilities/logger';

/**
 * Abstract base page exposing core browser initialization and shared navigation logic.
 * All feature-specific page objects extend this class.
 */
export default class BasePage {
  page;

  /**
   * @param page - Active Playwright page instance from the test fixture.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates the browser to the supplied URL and waits for DOM content to load.
   * Paths are resolved relative to Playwright baseURL (avoids origin-root 404s).
   * @param url - Relative path (e.g. `overview.htm`), `/`-prefixed path, or absolute URL.
   */
  async navigate(url) {
    const target =
      url.startsWith('http')
        ? url
        : url === '/'
          ? './'
          : url.startsWith('/')
            ? `.${url}`
            : url;
    logger.step(`Navigating to: ${target}`, this.constructor.name);
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Returns the current page title after ensuring the document is loaded.
   * @returns The browser tab title string.
   */
  async getPageTitle() {
    return this.page.title();
  }

  /**
   * Returns the current page URL.
   * @returns The active URL string.
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Clicks a sidebar or navigation link by its accessible name.
   * @param linkName - Visible link text to click.
   */
  async clickAccountServiceLink(linkName) {
    logger.step(`Clicking account service link: ${linkName}`, this.constructor.name);
    await this.page.getByRole('link', { name: linkName, exact: true }).click();
  }

  /**
   * Asserts visibility of a locator using web-first waiting semantics.
   * @param locator - Target Playwright locator.
   */
  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Returns the welcome banner text for authenticated sessions.
   * @returns Welcome message locator.
   */
  getWelcomeMessage() {
    return this.page.getByText(/^Welcome\s+/);
  }

  /**
   * Returns the Account Services sidebar heading locator.
   * @returns Heading locator for the sidebar panel.
   */
  getAccountServicesHeading() {
    return this.page.getByRole('heading', { name: 'Account Services', level: 2 });
  }

  /**
   * Attaches a PNG screenshot to the current test (visible in Allure report).
   * @param name - Display name shown in the report attachments panel.
   */
  async attachScreenshot(name) {
    await test.info().attach(name, {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    });
  }
}