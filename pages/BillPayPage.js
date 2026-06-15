import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class BillPayPage extends BasePage {
  pageHeading;
  payeeNameInput;
  addressInput;
  cityInput;
  stateInput;
  zipCodeInput;
  phoneInput;
  accountNumberInput;
  verifyAccountInput;
  amountInput;
  fromAccountSelect;
  sendPaymentButton;
  resultMessage;

  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Bill Payment Service', level: 1 });
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.resultMessage = page.locator('#billpayResult');
  }

  async open() {
    await test.step('Open Bill Pay page', async () => {
      await this.navigate('/billpay.htm');
      await expect(this.pageHeading).toBeVisible();
    });
  }

  async submitPayment(data) {
    await test.step(`Submit bill payment of $${data.amount} to ${data.payeeName}`, async () => {
      await this.payeeNameInput.fill(data.payeeName);
      await this.addressInput.fill(data.address);
      await this.cityInput.fill(data.city);
      await this.stateInput.fill(data.state);
      await this.zipCodeInput.fill(data.zipCode);
      await this.phoneInput.fill(data.phone);
      await this.accountNumberInput.fill(data.accountNumber);
      await this.verifyAccountInput.fill(data.accountNumber);
      await this.amountInput.fill(data.amount);
      await this.fromAccountSelect.selectOption(data.fromAccount);
      await this.sendPaymentButton.click();
    });
  }

  async verifyPaymentSuccess() {
    await test.step('Verify bill payment completed successfully', async () => {
      await expect(this.resultMessage).toBeVisible();
      await expect(this.resultMessage).toContainText('Bill Payment Complete');
    });
  }

  async verifyFormVisible() {
    await test.step('Verify Bill Pay form controls', async () => {
      await expect(this.pageHeading).toBeVisible();
      await expect(this.payeeNameInput).toBeVisible();
      await expect(this.addressInput).toBeVisible();
      await expect(this.amountInput).toBeVisible();
      await expect(this.sendPaymentButton).toBeVisible();
    });
  }
}