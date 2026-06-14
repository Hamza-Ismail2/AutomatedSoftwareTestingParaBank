import { test, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class TransferFundsPage extends BasePage {
  pageHeading;
  amountInput;
  fromAccountSelect;
  toAccountSelect;
  transferButton;
  resultMessage;

  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Transfer Funds', level: 1 });
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.resultMessage = page.locator('#showResult');
  }

  async open() {
    await test.step('Open Transfer Funds page', async () => {
      await this.navigate('/transfer.htm');
      await expect(this.pageHeading).toBeVisible();
    });
  }

  async transferFunds(data) {
    await test.step(`Transfer $${data.amount} from ${data.fromAccount} to ${data.toAccount}`, async () => {
      await this.amountInput.fill(data.amount);
      await this.fromAccountSelect.selectOption(data.fromAccount);
      await this.toAccountSelect.selectOption(data.toAccount);
      await this.transferButton.click();
    });
  }

  async submitEmptyAmountTransfer(fromAccount, toAccount) {
    await test.step('Submit transfer with empty amount', async () => {
      await this.amountInput.clear();
      await this.fromAccountSelect.selectOption(fromAccount);
      await this.toAccountSelect.selectOption(toAccount);
      await this.transferButton.click();
    });
  }

  async verifyTransferSuccess() {
    await test.step('Verify transfer completed successfully', async () => {
      await expect(this.resultMessage).toBeVisible();
      await expect(this.resultMessage).toContainText('Transfer Complete!');
    });
  }

  async verifyFormVisible() {
    await test.step('Verify Transfer Funds form controls', async () => {
      await expect(this.pageHeading).toBeVisible();
      await expect(this.amountInput).toBeVisible();
      await expect(this.fromAccountSelect).toBeVisible();
      await expect(this.toAccountSelect).toBeVisible();
      await expect(this.transferButton).toBeVisible();
    });
  }
}