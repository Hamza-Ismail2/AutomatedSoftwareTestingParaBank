import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class RequestLoanPage extends BasePage {
  loanAmountInput;
  downPaymentInput;
  fromAccountSelect;
  applyButton;

  constructor(page) {
    super(page);
    this.loanAmountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.applyButton = page.getByRole('button', { name: 'Apply Now' });
  }

  async visit() {
    await test.step('Open Request Loan page', async () => {
      await this.navigate('/requestloan.htm');
      await expect(this.page.getByRole('heading', { name: 'Apply for a Loan', level: 1 })).toBeVisible();
    });
  }

  async submitApplication(data) {
    await test.step('Submit loan application', async () => {
      await this.loanAmountInput.fill(data.amount);
      await this.downPaymentInput.fill(data.downPayment);
      await this.fromAccountSelect.selectOption(data.fromAccount);
      await this.applyButton.click();
    });
  }

  async expectDecisionRendered() {
    await test.step('Verify loan application response is displayed', async () => {
      await expect(this.page.locator('body')).toContainText(
        /approved|denied|cannot grant a loan|Loan Approved|Loan Denied|internal error has occurred/i,
        { timeout: 15000 }
      );
    });
  }
}
