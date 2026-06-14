import { test, expect } from '@playwright/test';
import BasePage from './BasePage';
import { logger } from '../utilities/logger';

export default class LoginPage extends BasePage {
  customerLoginHeading;
  usernameInput;
  passwordInput;
  loginButton;
  registerLink;
  forgotLoginLink;
  errorMessage;

  constructor(page) {
    super(page);
    this.customerLoginHeading = page.getByRole('heading', { name: 'Customer Login', level: 2 });
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.forgotLoginLink = page.getByRole('link', { name: 'Forgot login info?' });
    this.errorMessage = page.locator('.error');
  }

  async open() {
    await test.step('Open ParaBank login page', async () => {
      await this.navigate('/');
      await expect(this.customerLoginHeading).toBeVisible();
      await this.attachScreenshot('01 - Login page opened');
    });
  }

  async login(credentials) {
    await test.step(`Login as user: ${credentials.username || '(empty)'}`, async () => {
      logger.step(`Entering credentials for: ${credentials.username}`, 'LoginPage');
      await this.usernameInput.fill(credentials.username);
      await this.attachScreenshot('02 - After entering username');
      await this.passwordInput.fill(credentials.password);
      await this.attachScreenshot('03 - After entering password');
      await this.loginButton.click();
      await this.attachScreenshot('04 - After clicking Log In');
    });
  }

  async verifyLoginFormVisible() {
    await test.step('Verify Customer Login form is visible', async () => {
      await expect(this.customerLoginHeading).toBeVisible();
      await expect(this.usernameInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      await expect(this.registerLink).toBeVisible();
      await expect(this.forgotLoginLink).toBeVisible();
    });
  }

  async navigateToRegister() {
    await test.step('Navigate to Register page', async () => {
      await this.registerLink.click();
      await expect(this.page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();
    });
  }

  async navigateToForgotLogin() {
    await test.step('Navigate to Forgot Login Info page', async () => {
      await this.forgotLoginLink.click();
      await expect(this.page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();
    });
  }

  async registerUser(profile, username, password) {
    await test.step(`Register new user: ${username}`, async () => {
      await this.fillRegistrationForm(profile, username, password);
      await this.page.getByRole('button', { name: 'Register' }).click();
    });
  }

  async fillRegistrationForm(profile, username, password) {
    await this.page.locator('#customer\\.firstName').fill(profile.firstName);
    await this.page.locator('#customer\\.lastName').fill(profile.lastName);
    await this.page.locator('#customer\\.address\\.street').fill(profile.address);
    await this.page.locator('#customer\\.address\\.city').fill(profile.city);
    await this.page.locator('#customer\\.address\\.state').fill(profile.state);
    await this.page.locator('#customer\\.address\\.zipCode').fill(profile.zipCode);
    await this.page.locator('#customer\\.phoneNumber').fill(profile.phone);
    await this.page.locator('#customer\\.ssn').fill(profile.ssn);
    await this.page.locator('#customer\\.username').fill(username);
    await this.page.locator('#customer\\.password').fill(password);
    await this.page.locator('#repeatedPassword').fill(password);
  }

  async submitCustomerLookup(profile) {
    await test.step('Submit customer lookup for credential recovery', async () => {
      await this.page.locator('#firstName').fill(profile.firstName);
      await this.page.locator('#lastName').fill(profile.lastName);
      await this.page.locator('#address\\.street').fill(profile.address);
      await this.page.locator('#address\\.city').fill(profile.city);
      await this.page.locator('#address\\.state').fill(profile.state);
      await this.page.locator('#address\\.zipCode').fill(profile.zipCode);
      await this.page.locator('#ssn').fill(profile.ssn);
      await this.page.getByRole('button', { name: 'Find My Login Info' }).click();
    });
  }

  async logout() {
    await test.step('Log out of ParaBank', async () => {
      await this.page.getByRole('link', { name: 'Log Out' }).click();
      await expect(this.customerLoginHeading).toBeVisible();
    });
  }

  getRegistrationSuccessMessage() {
    return this.page.locator('#rightPanel').getByText(/Your account was created successfully/i);
  }

  getLookupResultMessage() {
    return this.page.locator('#lookupResult, #rightPanel').filter({ hasText: /username/i });
  }
}