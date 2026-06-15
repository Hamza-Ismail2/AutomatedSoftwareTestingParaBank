import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class AccountActivityPage extends BasePage {
  activityHeading;
  transactionTable;

  constructor(page) {
    super(page);
    this.activityHeading = page.getByRole('heading', { name: 'Account Activity', level: 1 });
    this.transactionTable = page.locator('#transactionTable');
  }

  async openForAccount(accountId) {
    await test.step(`Open account activity for account ${accountId}`, async () => {
      await this.navigate(`/activity.htm?id=${accountId}`);
      await expect(this.activityHeading).toBeVisible();
      await this.transactionTable.waitFor({ state: 'visible' });
    });
  }

  async expectActivityTablePopulated() {
    await test.step('Verify account activity page displays the transaction table', async () => {
      await expect(this.activityHeading).toBeVisible();
      await expect(this.transactionTable).toBeVisible();
    });
  }
}
