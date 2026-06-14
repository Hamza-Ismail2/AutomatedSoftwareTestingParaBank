import { test, expect } from '@playwright/test';
import BasePage from './BasePage';

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
      await expect(this.page.getByRole('heading', { name: 'Loan Request', level: 1 })).toBeVisible();
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
    await test.step('Verify loan approval or denial is displayed', async () => {
      const resultPanel = this.page.locator('#requestLoanResult, #requestLoanError, #loanRequestDenied');
      await expect(resultPanel.first()).toBeVisible({ timeout: 10000 });
      await expect(this.page.locator('#rightPanel')).toContainText(/approved|denied|cannot grant a loan/i);
    });
  }
}
