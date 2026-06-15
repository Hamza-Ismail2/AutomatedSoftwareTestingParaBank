import { test } from '@playwright/test';
import { logger } from '../utilities/logger.js';

export default class BasePage {
  constructor(page) {
    this.page = page;
  }

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

  async getPageTitle() {
    return this.page.title();
  }

  getCurrentUrl() {
    return this.page.url();
  }

  async clickAccountServiceLink(linkName) {
    logger.step(`Clicking account service link: ${linkName}`, this.constructor.name);
    await this.page.getByRole('link', { name: linkName, exact: true }).click();
  }

  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  getWelcomeMessage() {
    return this.page.locator('#leftPanel').getByText(/^Welcome\s+/);
  }

  getAccountServicesHeading() {
    return this.page.getByRole('heading', { name: 'Account Services', level: 2 });
  }

  async attachScreenshot(name) {
    await test.info().attach(name, {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    });
  }
}
