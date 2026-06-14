import { test, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class AboutPage extends BasePage {
  aboutHeading;

  constructor(page) {
    super(page);
    this.aboutHeading = page.getByRole('heading', { name: 'ParaSoft Demo Website', level: 1 });
  }

  async visit() {
    await test.step('Open About Us page', async () => {
      await this.navigate('/about.htm');
      await expect(this.aboutHeading).toBeVisible();
    });
  }
}
