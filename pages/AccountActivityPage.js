import { test, expect } from '@playwright/test';
import BasePage from './BasePage';

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
    await test.step('Verify account activity table has transaction rows', async () => {
      const rows = this.transactionTable.locator('tbody tr');
      await expect(rows.first()).toBeVisible({ timeout: 10000 });
      expect(await rows.count()).toBeGreaterThan(0);
    });
  }
}
