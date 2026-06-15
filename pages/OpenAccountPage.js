import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class OpenAccountPage extends BasePage {
  pageHeading;
  accountTypeSelect;
  fundFromAccountSelect;
  openAccountButton;
  resultMessage;

  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Open New Account', level: 1 });
    this.accountTypeSelect = page.locator('#type');
    this.fundFromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.resultMessage = page.locator('#openAccountResult');
  }

  async open() {
    await test.step('Open New Account page', async () => {
      await this.navigate('/openaccount.htm');
      await expect(this.pageHeading).toBeVisible();
    });
  }

  async openNewAccount(data) {
    await test.step(`Open new ${data.accountType} account funded from ${data.fundFromAccount}`, async () => {
      await this.accountTypeSelect.selectOption(data.accountType);
      await this.fundFromAccountSelect.selectOption(data.fundFromAccount);
      await this.openAccountButton.click();
    });
  }

  async verifyAccountOpenedSuccessfully() {
    return test.step('Verify new account opened successfully', async () => {
      await expect(this.page.getByRole('heading', { name: 'Account Opened!', level: 1 })).toBeVisible();
      const accountLink = this.page.locator('#openAccountResult a').first();
      await expect(accountLink).toBeVisible();
      const accountId = (await accountLink.textContent())?.trim() ?? '';
      expect(accountId).toMatch(/^\d+$/);
      return accountId;
    });
  }

  async verifyFormVisible() {
    await test.step('Verify Open Account form controls', async () => {
      await expect(this.pageHeading).toBeVisible();
      await expect(this.accountTypeSelect).toBeVisible();
      await expect(this.fundFromAccountSelect).toBeVisible();
      await expect(this.openAccountButton).toBeVisible();
    });
  }
}