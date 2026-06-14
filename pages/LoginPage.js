import { test, expect } from '@playwright/test';
import BasePage from './BasePage';
import { logger } from '../utilities/logger';

/**
 * Page object encapsulating authentication, registration, and credential recovery flows.
 */
export default class LoginPage extends BasePage {
  customerLoginHeading;
  usernameInput;
  passwordInput;
  loginButton;
  registerLink;
  forgotLoginLink;
  errorMessage;

  /**
   * @param page - Active Playwright page instance.
   */
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

  /**
   * Opens the ParaBank landing / login page.
   */
  async open() {
    await test.step('Open ParaBank login page', async () => {
      await this.navigate('/');
      await expect(this.customerLoginHeading).toBeVisible();
      await this.attachScreenshot('01 - Login page opened');
    });
  }

  /**
   * Performs a login attempt with the supplied credentials.
   * @param credentials - Username and password pair.
   */
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

  /**
   * Verifies the login form is fully rendered and interactive.
   */
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

  /**
   * Navigates to the registration page via the Register link.
   */
  async navigateToRegister() {
    await test.step('Navigate to Register page', async () => {
      await this.registerLink.click();
      await expect(this.page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();
    });
  }

  /**
   * Navigates to the credential lookup / recovery page.
   */
  async navigateToForgotLogin() {
    await test.step('Navigate to Forgot Login Info page', async () => {
      await this.forgotLoginLink.click();
      await expect(this.page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();
    });
  }

  /**
   * Completes the full user registration form and submits.
   * @param profile - Personal and authentication details for the new user.
   * @param username - Desired username for the new account.
   * @param password - Desired password for the new account.
   */
  async registerUser(profile, username, password) {
    await test.step(`Register new user: ${username}`, async () => {
      await this.fillRegistrationForm(profile, username, password);
      await this.page.getByRole('button', { name: 'Register' }).click();
    });
  }

  /**
   * Fills all registration form fields without submitting.
   * @param profile - Personal details for registration.
   * @param username - Desired username.
   * @param password - Desired password (also used for confirmation).
   */
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

  /**
   * Submits the customer lookup form to recover login credentials.
   * Uses lookup-page-specific field IDs (distinct from the registration form).
   * @param profile - Personal details matching an existing customer record.
   */
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

  /**
   * Logs out the current authenticated session.
   */
  async logout() {
    await test.step('Log out of ParaBank', async () => {
      await this.page.getByRole('link', { name: 'Log Out' }).click();
      await expect(this.customerLoginHeading).toBeVisible();
    });
  }

  /**
   * Returns the registration success message locator.
   * @returns Locator for the post-registration confirmation banner.
   */
  getRegistrationSuccessMessage() {
    return this.page.locator('#rightPanel').getByText(/Your account was created successfully/i);
  }

  /**
   * Returns the lookup result message locator containing recovered username.
   * @returns Locator for the credential recovery result panel.
   */
  getLookupResultMessage() {
    return this.page.locator('#lookupResult, #rightPanel').filter({ hasText: /username/i });
  }
}