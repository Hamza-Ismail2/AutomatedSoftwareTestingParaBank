import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class SiteNavigationPage extends BasePage {
  tagline;
  sitemapRegisterLink;

  constructor(page) {
    super(page);
    this.tagline = page.locator('p.caption');
    this.sitemapRegisterLink = page.getByRole('link', { name: 'Register' });
  }

  async openNews() {
    await test.step('Open News page', async () => {
      await this.navigate('/news.htm');
    });
  }

  async openSiteMap() {
    await test.step('Open Site Map page', async () => {
      await this.navigate('/sitemap.htm');
    });
  }

  async followFooterHomeLink() {
    await test.step('Return to login page via footer Home link', async () => {
      await this.page.locator('#footerPanel').getByRole('link', { name: 'Home' }).click();
      await expect(this.page.getByRole('heading', { name: 'Customer Login', level: 2 })).toBeVisible();
    });
  }
}
