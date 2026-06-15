import { test, expect } from '@playwright/test';
import BasePage from './BasePage.js';

export default class ContactPage extends BasePage {
  contactHeading;
  atmServicesSection;
  updateProfileHeading;
  requestLoanHeading;

  constructor(page) {
    super(page);
    this.contactHeading = page.getByRole('heading', { name: 'Customer Care', level: 1 });
    this.atmServicesSection = page.getByText('ATM Services');
    this.updateProfileHeading = page.getByRole('heading', { name: 'Update Profile', level: 1 });
    this.requestLoanHeading = page.getByRole('heading', { name: 'Loan Request', level: 1 });
  }

  async openContactPage() {
    await test.step('Open Contact Us page', async () => {
      await this.navigate('/contact.htm');
      await expect(this.contactHeading).toBeVisible();
    });
  }

  async openServicesPage() {
    await test.step('Open Services landing panel', async () => {
      await this.navigate('./index.htm');
      await expect(this.atmServicesSection).toBeVisible();
    });
  }

  async openUpdateProfilePage() {
    await test.step('Open Update Contact Info page', async () => {
      await this.navigate('/updateprofile.htm');
      await expect(this.updateProfileHeading).toBeVisible();
    });
  }

  async openRequestLoanPage() {
    await test.step('Open Request Loan page', async () => {
      await this.navigate('/requestloan.htm');
      await expect(this.requestLoanHeading).toBeVisible();
    });
  }

  async submitContactForm(name, email, phone, message) {
    await test.step('Submit Contact Us form', async () => {
      await this.page.locator('#name').fill(name);
      await this.page.locator('#email').fill(email);
      await this.page.locator('#phone').fill(phone);
      await this.page.locator('#message').fill(message);
      await this.page.getByRole('button', { name: 'Send to Customer Care' }).click();
    });
  }

  async updateContactInfo(profile) {
    await test.step('Update contact profile information', async () => {
      await this.page.locator('#customer\\.firstName').fill(profile.firstName);
      await this.page.locator('#customer\\.lastName').fill(profile.lastName);
      await this.page.locator('#customer\\.address\\.street').fill(profile.address);
      await this.page.locator('#customer\\.address\\.city').fill(profile.city);
      await this.page.locator('#customer\\.address\\.state').fill(profile.state);
      await this.page.locator('#customer\\.address\\.zipCode').fill(profile.zipCode);
      await this.page.locator('#customer\\.phoneNumber').fill(profile.phone);
      await this.page.getByRole('button', { name: 'Update Profile' }).click();
    });
  }

  async verifyServicesContent() {
    await test.step('Verify Services page content', async () => {
      await expect(this.atmServicesSection).toBeVisible();
      await expect(this.page.getByText('Online Services')).toBeVisible();
      await expect(this.page.getByRole('link', { name: 'Withdraw Funds' })).toBeVisible();
      await expect(this.page.getByRole('link', { name: 'Bill Pay', exact: true })).toBeVisible();
    });
  }

  async verifyProfileUpdated() {
    await test.step('Verify profile update confirmation', async () => {
      await expect(this.page.locator('#rightPanel')).toContainText('Profile Updated');
    });
  }

  async expectContactSubmissionConfirmation() {
    await test.step('Verify contact inquiry submission confirmation', async () => {
      await expect(this.page.locator('#rightPanel')).toContainText(/Thank you/i);
      await expect(this.page.locator('#rightPanel')).toContainText(/Customer Care Representative will be contacting you/i);
    });
  }

  async expectUpdateProfileFormReady() {
    await test.step('Verify update profile form fields are editable', async () => {
      await expect(this.page.locator('#customer\\.firstName')).toBeVisible();
      await expect(this.page.locator('#customer\\.lastName')).toBeVisible();
      await expect(this.page.locator('#customer\\.address\\.street')).toBeVisible();
      await expect(this.page.locator('#customer\\.phoneNumber')).toBeVisible();
      await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeVisible();
    });
  }
}